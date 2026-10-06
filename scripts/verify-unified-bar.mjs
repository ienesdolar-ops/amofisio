import fs from 'fs';

// 1. Validar CSS em style.css
const css = fs.readFileSync('style.css', 'utf8');
const requiredCssClasses = [
  'admin-unified-bar-container',
  'admin-unified-bar-track',
  'admin-unified-bar-fill',
  'admin-unified-bar-meta-marker',
  'meta-line',
  'meta-flag',
  'admin-bar-fill-text',
  'admin-bar-cap-text',
  'admin-unified-bar-legend',
  'bar-confirmed',
  'bar-pending',
  'bar-track-cancelled',
  'legend-confirmed',
  'legend-pending'
];

for (const cls of requiredCssClasses) {
  if (!css.includes(cls)) {
    console.error(`ERRO: Classe CSS ausente: ${cls}`);
    process.exit(1);
  }
}

// 2. Validar altura da barra (maior visibilidade: >= 24px)
if (!css.includes('height: 28px') && !css.includes('height: 26px') && !css.includes('height: 24px')) {
  console.error('ERRO: Altura da barra track não encontrada com tamanho destacado (>=24px)');
  process.exit(1);
}

// 3. Validar app.js
const appJs = fs.readFileSync('app.js', 'utf8');
const requiredAppSnippets = [
  'admin-unified-bar-container',
  'admin-unified-bar-track',
  'admin-unified-bar-fill',
  'admin-unified-bar-meta-marker',
  'meta-line',
  'meta-flag',
  'admin-bar-cap-text',
  'admin-unified-bar-legend',
  'c.min / c.cap',
  'c.reg / c.cap'
];

for (const snip of requiredAppSnippets) {
  if (!appJs.includes(snip)) {
    console.error(`ERRO: Trecho ausente em app.js: ${snip}`);
    process.exit(1);
  }
}

// 4. Validar lógica matemática do modelo de barra única com meta interna
function computeUnifiedBar(reg, min, cap, isCancelled) {
  if (isCancelled) {
    return {
      fillPct: 0,
      metaPct: 0,
      isConfirmed: false,
      barFillClass: 'bar-cancelled',
      trackClass: 'bar-track-cancelled'
    };
  }

  const isConfirmed = reg >= min;
  const metaPct = cap > 0 ? Math.min(100, Math.round((min / cap) * 100)) : 50;
  const fillPct = cap > 0 ? Math.min(100, Math.round((reg / cap) * 100)) : 0;
  const barFillClass = isConfirmed ? 'bar-confirmed' : 'bar-pending';

  return { fillPct, metaPct, isConfirmed, barFillClass };
}

// Teste 1: Turma que atingiu/superou a meta (ex: 39 inscritos, min 10, cap 40)
// Meta em 25%, fill em 98%. Deve estar confirmada com bar-confirmed.
const t1 = computeUnifiedBar(39, 10, 40, false);
if (!t1.isConfirmed || t1.metaPct !== 25 || t1.fillPct !== 98 || t1.barFillClass !== 'bar-confirmed') {
  console.error('ERRO: Teste 1 falhou:', t1);
  process.exit(1);
}

// Teste 2: Turma abaixo da meta (ex: 4 inscritos, min 10, cap 40)
// Meta em 25%, fill em 10%. Deve estar pendente com bar-pending.
const t2 = computeUnifiedBar(4, 10, 40, false);
if (t2.isConfirmed || t2.metaPct !== 25 || t2.fillPct !== 10 || t2.barFillClass !== 'bar-pending') {
  console.error('ERRO: Teste 2 falhou:', t2);
  process.exit(1);
}

// Teste 3: Turma exatamente na meta (ex: 15 inscritos, min 15, cap 50)
// Meta em 30%, fill em 30%. Deve estar confirmada com bar-confirmed.
const t3 = computeUnifiedBar(15, 15, 50, false);
if (!t3.isConfirmed || t3.metaPct !== 30 || t3.fillPct !== 30 || t3.barFillClass !== 'bar-confirmed') {
  console.error('ERRO: Teste 3 falhou:', t3);
  process.exit(1);
}

// Teste 4: Turma cancelada
const t4 = computeUnifiedBar(0, 10, 40, true);
if (t4.isConfirmed || t4.trackClass !== 'bar-track-cancelled') {
  console.error('ERRO: Teste 4 falhou:', t4);
  process.exit(1);
}

console.log('VERIFICACAO_BARRA_UNIFICADA_OK');
