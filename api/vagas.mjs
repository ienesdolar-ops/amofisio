// Contagem ao vivo do Sympla (Vercel Serverless Function).
// O site consulta /api/vagas a cada 60s; a CDN da Vercel guarda a resposta por 60s,
// então o Sympla é consultado no máximo ~1x por minuto, independente do número de visitantes.
// O token fica APENAS na variável de ambiente SYMPLA_TOKEN da Vercel.
import fs from 'fs';
import path from 'path';

const CONCURRENCY = 3;
// Últimas contagens boas por evento (sobrevive entre chamadas enquanto a função está aquecida)
const lastGood = {};
// Teto de tempo por chamada: devolve o que conseguiu antes do limite da Vercel
const BUDGET_MS = 20000;
let deadline = 0;
// Ao primeiro 429, pausa as consultas por 60s (insistir só prolonga o bloqueio)
let blockedUntil = 0;
// Pedidos recentes por evento: { at, items } — renovados aos poucos para não estourar o limite
const ordersCache = {};
// O limite do Sympla é baixo: cada chamada consulta poucas turmas, em rodízio (as mais antigas primeiro).
// Com a CDN segurando 60s, são no máximo ~14 requisições/min.
const PARTS_PER_RUN = 10;
const ORDERS_PER_RUN = 4;
const ORDERS_MAX_AGE = 20 * 60 * 1000;
const countAt = {};
const failures = {};
const fail = k => { failures[k] = (failures[k] || 0) + 1; };

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

// O Sympla limita requisições (429) e não informa o limite nos cabeçalhos
async function symplaGet(token, p) {
  if (Date.now() < blockedUntil || Date.now() > deadline) { fail('pausado'); return null; }
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(`https://api.sympla.com.br/public/v3${p}`, {
      headers: { s_token: token, 'User-Agent': 'AmoFisio-Live/1.0' },
      signal: ctrl.signal
    });
    if (res.status === 429) blockedUntil = Date.now() + 60000;
    if (!res.ok) { fail(res.status); return null; }
    return await res.json();
  } catch (e) {
    fail(e.name || 'erro');
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

  for (const k in failures) delete failures[k];
  deadline = Date.now() + BUDGET_MS;
  const data = loadData();
  const caps = loadCapacities();
  const all = [];
  data.units.forEach(unit => unit.courses.forEach(course => {
    const m = (course.symplaUrl || '').match(/\/(\d{6,8})/);
    if (m) all.push({ unit, course, eventId: m[1] });
  }));

  let ok = 0;
  const recent = [];
  const dueParts = [...all]
    .sort((a, b) => (countAt[a.eventId] || 0) - (countAt[b.eventId] || 0))
    .slice(0, PARTS_PER_RUN);
  await pool(dueParts, async ({ course, eventId }) => {
    const before = lastGood[eventId] ?? course.registered ?? 0;
    const parts = await symplaGet(token, `/events/${eventId}/participants?page_size=1`);
    if (!parts || !parts.pagination) return;
    ok++;
    const count = parts.pagination.quantity ?? 0;
    lastGood[eventId] = count;
    countAt[eventId] = Date.now();
    if (count !== before) {
      // Entrou (ou saiu) inscrição: pedidos desse evento precisam ser renovados primeiro
      if (ordersCache[eventId]) ordersCache[eventId].at = 0;
      else ordersCache[eventId] = { at: 0, items: [] };
    }
  });

  // Turmas com número confirmado (agora ou em chamadas anteriores desta instância)
  all.forEach(({ unit, course, eventId }) => {
    const count = lastGood[eventId];
    if (count !== undefined) {
      course.live = true;
      applyStatus(unit, course, count, caps.courses[eventId]);
    }
  });

  // Ordem: 1º turmas com inscrição nova (at = 0), 2º nunca buscadas, 3º as mais antigas
  const ordersRank = id => !ordersCache[id] ? 1 : ordersCache[id].at === 0 ? 0 : ordersCache[id].at;

  // Fase 2: renovar pedidos — prioridade para os que mudaram, depois os mais antigos
  const due = all
    .filter(({ unit, course, eventId }) => !(unit.cancelledByFranchisee || course.cancelledByFranchisee)
      && (!ordersCache[eventId] || Date.now() - ordersCache[eventId].at > ORDERS_MAX_AGE))
    .sort((a, b) => ordersRank(a.eventId) - ordersRank(b.eventId))
    .slice(0, ORDERS_PER_RUN);
  await pool(due, async ({ eventId }) => {
    if (Date.now() > deadline) return;
    const orders = await symplaGet(token, `/events/${eventId}/orders?page_size=20&field_sort=order_date&sort=DESC`);
    if (orders && Array.isArray(orders.data)) ordersCache[eventId] = { at: Date.now(), items: orders.data };
  });

  all.forEach(({ unit, course, eventId }) => {
    const orders = ordersCache[eventId] ? { data: ordersCache[eventId].items } : null;
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

  // Nada confirmado (nem agora nem em chamadas anteriores): não sobrescreve o que o site já tem
  if (!all.some(x => x.course.live)) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(502).json({ error: 'Sympla indisponível', failures });
    return;
  }

  const fresh = recent.map(({ o, iso, first, lastInitial, unit, course }) => ({
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
      isConfirmed: course.registered >= (course.minParticipants || 10) || Boolean(course.confirmedByFranchisee),
      isSoldOut: course.status === 'sold_out',
      isUrgent: course.status === 'last_spots',
      statusBadge: course.status === 'sold_out' ? 'Turma Esgotada' : (course.badge || 'Confirmado'),
      timestamp: iso,
      timeAgoText: '',
      symplaUrl: course.symplaUrl
    }));
  const seen = new Set();
  const recentRegistrations = [...fresh, ...(data.recentRegistrations || [])]
    .filter(r => !seen.has(r.id) && seen.add(r.id))
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 60);

  const units = data.units.map(u => ({
    id: u.id,
    // Só turmas com número confirmado agora: as que falharam não sobrescrevem o site
    courses: u.courses.filter(c => c.live).map(c => ({
      id: c.id,
      registered: c.registered,
      capacity: c.capacity,
      minParticipants: c.minParticipants,
      status: c.status,
      badge: c.badge
    }))
  }));

  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=240');
  res.status(200).json({ updatedAt: new Date().toISOString(), checked: ok, failures, units, recentRegistrations });
}
