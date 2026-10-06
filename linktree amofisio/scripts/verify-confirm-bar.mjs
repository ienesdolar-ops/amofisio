import fs from 'fs';

// 1. Validar CSS
const css = fs.readFileSync('style.css', 'utf8');
const requiredClasses = [
  'admin-confirm-block',
  'admin-confirm-header',
  'admin-confirm-label',
  'admin-confirm-badge',
  'admin-confirm-bar-wrap',
  'admin-confirm-bar-fill',
  'bar-confirmed',
  'bar-pending',
  'status-confirmed',
  'status-pending',
  'status-cancelled'
];

for (const cls of requiredClasses) {
  if (!css.includes(cls)) {
    console.error(`ERRO: Classe CSS ausente: ${cls}`);
    process.exit(1);
  }
}

// 2. Validar index.html
const html = fs.readFileSync('index.html', 'utf8');
if (!html.includes('admin-kpi-confirmed')) {
  console.error('ERRO: index.html não possui o KPI admin-kpi-confirmed');
  process.exit(1);
}
if (!html.includes('data-filter="confirmed"') || !html.includes('data-filter="pending"')) {
  console.error('ERRO: index.html não possui as pílulas de filtro de confirmação');
  process.exit(1);
}

// 3. Validar lógica matemática do cálculo da barra
function calcConfirm(reg, min, isCancelled) {
  if (isCancelled) return { isConfirmed: false, confirmPct: 0, label: 'Cancelado pelo franqueado', bar: 'bar-cancelled' };
  const isConfirmed = reg >= min;
  const confirmPct = isConfirmed ? 100 : Math.min(100, Math.round((reg / min) * 100));
  const label = isConfirmed ? '✓ Confirmado' : `Faltam ${min - reg}`;
  const bar = isConfirmed ? 'bar-confirmed' : 'bar-pending';
  return { isConfirmed, confirmPct, label, bar };
}

// Teste caso 1: atingiu a meta (ex: 15 inscritos, mínimo 10)
const test1 = calcConfirm(15, 10, false);
if (!test1.isConfirmed || test1.confirmPct !== 100 || test1.bar !== 'bar-confirmed') {
  console.error('ERRO: Teste de turma confirmada falhou', test1);
  process.exit(1);
}

// Teste caso 2: abaixo da meta (ex: 6 inscritos, mínimo 10)
const test2 = calcConfirm(6, 10, false);
if (test2.isConfirmed || test2.confirmPct !== 60 || test2.label !== 'Faltam 4' || test2.bar !== 'bar-pending') {
  console.error('ERRO: Teste de turma pendente falhou', test2);
  process.exit(1);
}

// Teste caso 3: turma cancelada
const test3 = calcConfirm(0, 10, true);
if (test3.isConfirmed || test3.bar !== 'bar-cancelled') {
  console.error('ERRO: Teste de turma cancelada falhou', test3);
  process.exit(1);
}

console.log('VERIFICACAO_BARRA_CONFIRMACAO_OK');
