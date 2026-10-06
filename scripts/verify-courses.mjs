import fs from 'fs';
import path from 'path';

// Carregar data.js
const dataFile = path.resolve('data.js');
const content = fs.readFileSync(dataFile, 'utf8');

// Executar em sandbox seguro extraindo AMO_FISIO_DATA
const sandbox = {};
const fn = new Function('sandbox', content + '; sandbox.DATA = AMO_FISIO_DATA;');
fn(sandbox);
const data = sandbox.DATA;

if (!data || !data.units) {
  console.error('Falha ao carregar AMO_FISIO_DATA');
  process.exit(1);
}

function findCourse(unitId, courseId) {
  const unit = data.units.find(u => u.id === unitId);
  if (!unit) throw new Error(`Unidade ${unitId} não encontrada`);
  const course = unit.courses.find(c => c.id === courseId);
  if (!course) throw new Error(`Curso ${courseId} não encontrado na unidade ${unitId}`);
  return course;
}

// 1. Rio de Janeiro: LCA
const lca = findCourse('rio-de-janeiro', 'criterios-alta-reconstrucao-lca-rio');
if (lca.badge.toLowerCase() !== 'última vaga' && lca.badge.toLowerCase() !== 'ultima vaga') {
  console.error(`Erro: LCA RJ deveria ter badge 'Última vaga', mas tem '${lca.badge}'`);
  process.exit(1);
}
if (lca.status === 'sold_out') {
  console.error(`Erro: LCA RJ não deveria ter status 'sold_out'`);
  process.exit(1);
}

// 2. Campo Grande: Home Care
const homecare = findCourse('campo-grande', 'home-care-campo-grande');
if (!homecare.badge.toLowerCase().includes('últimas vagas') && !homecare.badge.toLowerCase().includes('ultimas vagas')) {
  console.error(`Erro: Home Care Campo Grande deveria ter badge 'Últimas vagas', mas tem '${homecare.badge}'`);
  process.exit(1);
}

// 3. Bauru: Neuropediatria CIF
const neuro = findCourse('bauru', 'neuropediatria-cif-bauru');
if (!neuro.badge.toLowerCase().includes('últimas vagas') && !neuro.badge.toLowerCase().includes('ultimas vagas')) {
  console.error(`Erro: Neuropediatria Bauru deveria ter badge 'Últimas vagas', mas tem '${neuro.badge}'`);
  process.exit(1);
}

// 4. Cuiabá: Biomecânica
const biomec = findCourse('cuiaba', 'biomecanica-cinesioterapia-cuiaba');
if (biomec.status === 'sold_out' || biomec.badge.toLowerCase().includes('esgotad')) {
  console.error(`Erro: Biomecânica Cuiabá não deve estar esgotado`);
  process.exit(1);
}

// 5. Campinas: Fisioterapia Manipulativa
const manip = findCourse('campinas', 'fisioterapia-manipulativa-campinas');
if (manip.status !== 'sold_out' || !manip.badge.toLowerCase().includes('esgotad')) {
  console.error(`Erro: Fisioterapia Manipulativa Campinas deve ser 'sold_out' e 'Esgotado'`);
  process.exit(1);
}

// 6. Guarulhos: Microagulhamento
const micro = findCourse('guarulhos', 'microagulhamento-guarulhos');
if (micro.badge.toLowerCase() !== 'última vaga' && micro.badge.toLowerCase() !== 'ultima vaga') {
  console.error(`Erro: Microagulhamento Guarulhos deveria ter badge 'Última vaga', mas tem '${micro.badge}'`);
  process.exit(1);
}

// 7. Guarulhos: 3 esgotados
const resp = findCourse('guarulhos', 'respiratoria-guarulhos');
const urg = findCourse('guarulhos', 'urgencia-emergencia-guarulhos');
const traum = findCourse('guarulhos', 'traumato-esportiva-quiro-guarulhos');
if (resp.status !== 'sold_out' || urg.status !== 'sold_out' || traum.status !== 'sold_out') {
  console.error(`Erro: Cursos esgotados de Guarulhos devem manter status sold_out`);
  process.exit(1);
}

console.log('VERIFICACAO_CURSOS_OK');
