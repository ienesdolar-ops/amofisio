// Contagem ao vivo do Sympla (Vercel Serverless Function).
// O site consulta /api/vagas a cada 60s; a CDN da Vercel guarda a resposta por 60s,
// então o Sympla é consultado no máximo ~1x por minuto, independente do número de visitantes.
// O token fica APENAS na variável de ambiente SYMPLA_TOKEN da Vercel.
import fs from 'fs';
import path from 'path';

const CONCURRENCY = 8;

function loadData() {
  const txt = fs.readFileSync(path.join(process.cwd(), 'data.js'), 'utf8');
  return new Function(txt + '; return AMO_FISIO_DATA;')();
}

function loadCapacities() {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'capacities.json'), 'utf8'));
  } catch {
    return { courses: {} };
  }
}

async function symplaGet(token, p) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(`https://api.sympla.com.br/public/v3${p}`, {
      headers: { s_token: token, 'User-Agent': 'AmoFisio-Live/1.0' },
      signal: ctrl.signal
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

async function pool(items, fn) {
  let i = 0;
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (i < items.length) await fn(items[i++]);
  });
  await Promise.all(workers);
}

// Sympla retorna "YYYY-MM-DD HH:mm:ss" no horário de Brasília
function toIsoBR(s) {
  const m = String(s || '').match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})/);
  if (!m) return null;
  const d = new Date(`${m[1]}T${m[2]}-03:00`);
  return isNaN(d) ? null : d.toISOString();
}

// Mesmas regras de selo do scripts/sync-sympla.mjs
function applyStatus(unit, course, registered, capInfo) {
  const capacity = capInfo ? capInfo.capacity : 40;
  course.registered = registered;
  course.capacity = capacity;
  course.minParticipants = (capInfo && capInfo.minParticipants) || course.minParticipants || 10;
  if (course.cancelledByFranchisee || unit.cancelledByFranchisee) {
    course.badge = 'Cancelado pelo franqueado';
    course.status = 'cancelled';
    return;
  }
  const remaining = capacity - registered;
  if (remaining <= 0) {
    course.badge = 'Esgotado';
    course.status = 'sold_out';
  } else if (remaining === 1) {
    course.badge = 'Última vaga';
    course.status = 'last_spots';
  } else if (remaining <= 5) {
    course.badge = 'Últimas vagas';
    course.status = 'last_spots';
  } else if (course.status === 'sold_out' || course.status === 'last_spots') {
    course.status = 'available';
    course.badge = unit.id === 'campo-grande' ? 'Combo R$ 30 (4 Cursos)' : 'Presencial';
  }
}

export default async function handler(req, res) {
  const token = process.env.SYMPLA_TOKEN;
  if (!token) {
    res.status(503).json({ error: 'SYMPLA_TOKEN não configurado' });
    return;
  }

  const data = loadData();
  const caps = loadCapacities();
  const all = [];
  data.units.forEach(unit => unit.courses.forEach(course => {
    const m = (course.symplaUrl || '').match(/\/(\d{6,8})/);
    if (m) all.push({ unit, course, eventId: m[1] });
  }));

  let ok = 0;
  const recent = [];
  await pool(all, async ({ unit, course, eventId }) => {
    const [parts, orders] = await Promise.all([
      symplaGet(token, `/events/${eventId}/participants?page_size=1`),
      unit.cancelledByFranchisee || course.cancelledByFranchisee
        ? null
        : symplaGet(token, `/events/${eventId}/orders?page_size=20&field_sort=order_date&sort=DESC`)
    ]);
    if (parts && parts.pagination) {
      ok++;
      applyStatus(unit, course, parts.pagination.quantity ?? 0, caps.courses[eventId]);
    }
    const list = orders && Array.isArray(orders.data) ? orders.data : [];
    list.forEach(o => {
      if (o.order_status && o.order_status !== 'A') return; // apenas aprovados
      const iso = toIsoBR(o.order_date);
      if (!iso) return;
      const first = (o.buyer_first_name || '').trim().split(/\s+/)[0] || '';
      const lastInitial = (o.buyer_last_name || '').trim().charAt(0);
      recent.push({ o, iso, first, lastInitial, unit, course });
    });
  });

  // Nenhuma consulta funcionou: não sobrescreve o que o site já tem
  if (ok === 0) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(502).json({ error: 'Sympla indisponível' });
    return;
  }

  const recentRegistrations = recent
    .sort((a, b) => b.iso.localeCompare(a.iso))
    .slice(0, 60)
    .map(({ o, iso, first, lastInitial, unit, course }) => ({
      id: `ord-${o.id}`,
      unitId: unit.id,
      unitName: unit.name,
      state: unit.state,
      courseId: course.id,
      courseTitle: course.title,
      instructor: course.instructor || '',
      attendeeName: first ? `${first}${lastInitial ? ' ' + lastInitial.toUpperCase() + '.' : ''}` : 'Participante',
      registeredCount: course.registered,
      capacity: course.capacity,
      minParticipants: course.minParticipants,
      isConfirmed: course.registered >= (course.minParticipants || 10),
      isSoldOut: course.status === 'sold_out',
      isUrgent: course.status === 'last_spots',
      statusBadge: course.status === 'sold_out' ? 'Turma Esgotada' : (course.badge || 'Confirmado'),
      timestamp: iso,
      timeAgoText: '',
      symplaUrl: course.symplaUrl
    }));

  const units = data.units.map(u => ({
    id: u.id,
    courses: u.courses.map(c => ({
      id: c.id,
      registered: c.registered,
      capacity: c.capacity,
      minParticipants: c.minParticipants,
      status: c.status,
      badge: c.badge
    }))
  }));

  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=240');
  res.status(200).json({ updatedAt: new Date().toISOString(), checked: ok, units, recentRegistrations });
}
