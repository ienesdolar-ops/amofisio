// Coleta diária de TODOS os eventos da conta Sympla para o painel (/painel).
// Gera painel/data.json. Eventos encerrados há mais de 30 dias reaproveitam a
// contagem do data.json anterior (não mudam mais), poupando o limite da API.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outFile = path.join(root, 'painel', 'data.json');
const token = process.env.SYMPLA_TOKEN;
if (!token) { console.error('SYMPLA_TOKEN ausente'); process.exit(1); }

const API = 'https://api.sympla.com.br/public/v3';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const DAY = 86400000;

async function get(p, tries = 4) {
  for (let i = 0; i < tries; i++) {
    const res = await fetch(API + p, { headers: { s_token: token, 'User-Agent': 'Painel-Sympla/1.0' } });
    if (res.status === 429) { console.warn(`429 em ${p}, aguardando 70s`); await sleep(70000); continue; }
    if (!res.ok) throw new Error(`${res.status} ${p}`);
    return res.json();
  }
  throw new Error(`429 persistente ${p}`);
}

const prev = (() => { try { return JSON.parse(fs.readFileSync(outFile, 'utf8')); } catch { return { events: [] }; } })();
const prevById = new Map(prev.events.map(e => [String(e.id), e]));

// "YYYY-MM-DD HH:mm:ss" (horário de Brasília) -> ISO
const iso = s => { const m = String(s || '').match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})/); return m ? new Date(`${m[1]}T${m[2]}:00-03:00`).toISOString() : null; };

function tipo(name) {
  const n = name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  if (/amo\s*fisio/.test(n)) return 'AmoFisio';
  if (/pos[- ]?gradua|\bpos\b|especializa/.test(n)) return 'Pós-graduação';
  if (/simposio|congresso|jornada|encontro|semana/.test(n)) return 'Evento científico';
  if (/workshop|curso|formacao|imersao|aula|masterclass|treinamento/.test(n)) return 'Curso';
  if (/black|aulao|palestra|live|webinar/.test(n)) return 'Palestra / ação';
  return 'Outros';
}

function unidade(ev) {
  const a = ev.address || {};
  const city = (a.city || '').trim();
  if (!city || /online/i.test(a.name || '') || ev.type === 'online') return { unidade: 'Online', uf: '' };
  const pretty = city.toLowerCase().replace(/(^|\s)\S/g, c => c.toUpperCase()).replace(/\b(De|Do|Da|Dos|Das)\b/g, w => w.toLowerCase());
  return { unidade: pretty, uf: (a.state || '').toUpperCase() };
}

async function run() {
  const list = [];
  for (let page = 1; ; page++) {
    const j = await get(`/events?page_size=200&page=${page}&field_sort=start_date&sort=DESC`);
    list.push(...(j.data || []));
    if (!j.pagination?.has_next) break;
    await sleep(1500);
  }
  console.log(`${list.length} eventos na conta`);

  const now = Date.now();
  const events = [];
  let fetched = 0, cached = 0, failed = 0;
  for (const ev of list) {
    const start = iso(ev.start_date), end = iso(ev.end_date) || start;
    const old = prevById.get(String(ev.id));
    const frozen = end && new Date(end).getTime() < now - 30 * DAY;
    let inscritos = old?.inscritos ?? null;
    if (!(frozen && old && old.inscritos != null) && !ev.cancelled) {
      try {
        const j = await get(`/events/${ev.id}/participants?page_size=1`);
        inscritos = j.pagination?.quantity ?? 0; fetched++;
      } catch (e) { console.warn(`falha ${ev.id}: ${e.message}`); failed++; }
      await sleep(1200);
    } else cached++;
    events.push({
      id: ev.id, nome: (ev.name || '').trim(), url: ev.url, inicio: start, fim: end,
      ...unidade(ev), local: ev.address?.name || '', tipo: tipo(ev.name || ''),
      publicado: !!ev.published, cancelado: !!ev.cancelled, inscritos,
    });
  }
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify({ atualizadoEm: new Date().toISOString(), events }, null, 1));
  console.log(`ok: ${fetched} consultados, ${cached} do cache, ${failed} falhas`);
}
run().catch(e => { console.error(e); process.exit(1); });
