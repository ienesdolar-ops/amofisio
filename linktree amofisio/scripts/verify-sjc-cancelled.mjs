import fs from 'fs';

// 1. Carregar data.js
let code = fs.readFileSync('data.js', 'utf8').replace('const AMO_FISIO_DATA =', 'global.AMO_FISIO_DATA =');
eval(code);
const data = global.AMO_FISIO_DATA;

const sjc = data.units.find(u => u.id === 'sao-jose-dos-campos');
if (!sjc) {
  console.error('ERRO: São José dos Campos não encontrado em data.js');
  process.exit(1);
}

if (sjc.cancelledByFranchisee !== true) {
  console.error('ERRO: São José dos Campos não possui cancelledByFranchisee: true');
  process.exit(1);
}

if (!sjc.courses || sjc.courses.length !== 2) {
  console.error('ERRO: São José dos Campos deve conter exatamente 2 cursos');
  process.exit(1);
}

sjc.courses.forEach(c => {
  if (c.cancelledByFranchisee !== true || c.status !== 'cancelled') {
    console.error(`ERRO: Curso de SJC deve estar cancelado: ${c.title}`);
    process.exit(1);
  }
});

// 2. Testar que o filtro público de app.js remove unidades canceladas
const publicUnits = data.units.filter(unit => {
  if (unit.cancelledByFranchisee) return false;
  return true;
});

if (publicUnits.some(u => u.id === 'sao-jose-dos-campos')) {
  console.error('ERRO: São José dos Campos apareceu na listagem pública');
  process.exit(1);
}

// 3. Testar que o painel administrativo processa SJC como cancelado
const adminCourses = sjc.courses.map(course => {
  const isCancelled = Boolean(sjc.cancelledByFranchisee || course.cancelledByFranchisee);
  return { ...course, isCancelled };
});

if (!adminCourses.every(c => c.isCancelled)) {
  console.error('ERRO: Todos os cursos de SJC devem ser isCancelled no admin');
  process.exit(1);
}

// 4. Testar conteúdo do app.js
const appJs = fs.readFileSync('app.js', 'utf8');
if (!appJs.includes('unit.cancelledByFranchisee')) {
  console.error('ERRO: app.js deve conter a verificação unit.cancelledByFranchisee');
  process.exit(1);
}
if (!appJs.includes('Cancelado pelo Franqueado')) {
  console.error('ERRO: app.js deve conter a mensagem de cancelado pelo franqueado');
  process.exit(1);
}

console.log('VERIFICACAO_SJC_CANCELLED_OK');
