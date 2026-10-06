import fs from 'fs';

// 1. Carregar data.js
let code = fs.readFileSync('data.js', 'utf8').replace('const AMO_FISIO_DATA =', 'global.AMO_FISIO_DATA =');
eval(code);
const data = global.AMO_FISIO_DATA;

if (!data || !data.units || data.units.length === 0) {
  console.error('ERRO: data.js inválido');
  process.exit(1);
}

// 2. Carregar capacities.json
const capacities = JSON.parse(fs.readFileSync('capacities.json', 'utf8'));

// Validar todas as turmas em data.js
let totalCourses = 0;
data.units.forEach(u => {
  u.courses.forEach(c => {
    totalCourses++;
    if (typeof c.minParticipants !== 'number' || c.minParticipants <= 0) {
      console.error(`ERRO: Curso sem minParticipants válido: [${u.name}] ${c.title} -> ${c.minParticipants}`);
      process.exit(1);
    }
  });
});

// Validar verificações específicas dos briefings
const checkExpectation = (unitName, titleSnippet, expectedMin) => {
  const unit = data.units.find(u => u.name.toLowerCase().includes(unitName.toLowerCase()));
  if (!unit) {
    console.error(`ERRO: Unidade ${unitName} não encontrada.`);
    process.exit(1);
  }
  const course = unit.courses.find(c => c.title.toLowerCase().includes(titleSnippet.toLowerCase()));
  if (!course) {
    console.error(`ERRO: Curso ${titleSnippet} não encontrado em ${unitName}.`);
    process.exit(1);
  }
  if (course.minParticipants !== expectedMin) {
    console.error(`ERRO: Mínimo incorreto para [${unit.name}] ${course.title}: esperado ${expectedMin}, obteve ${course.minParticipants}`);
    process.exit(1);
  }
};

checkExpectation('Londrina', 'Quiropraxia', 8);
checkExpectation('Vitória', 'Fáscias', 8);
checkExpectation('Vitória', 'Tuiná', 7);
checkExpectation('Vitória', 'Limpeza', 7);
checkExpectation('Campinas', 'Manipulativa', 12);
checkExpectation('Campinas', 'Colágeno', 15);
checkExpectation('Belo Horizonte', 'Mobilização Articular MMSS', 15);
checkExpectation('Fortaleza', 'Fraturas', 15);
checkExpectation('Goiânia', 'Pilates', 50);
checkExpectation('Porto Velho', 'Escolha 2 aulas', 20);

// Validar que capacities.json também contém minParticipants
let capacitiesChecked = 0;
for (const [id, c] of Object.entries(capacities.courses)) {
  if (typeof c.minParticipants !== 'number' || c.minParticipants <= 0) {
    console.error(`ERRO: Curso em capacities.json sem minParticipants: ${id} - ${c.name}`);
    process.exit(1);
  }
  capacitiesChecked++;
}

console.log(`Verificados com sucesso: ${totalCourses} cursos em data.js e ${capacitiesChecked} em capacities.json.`);
console.log('VERIFICACAO_MINIMOS_OK');
