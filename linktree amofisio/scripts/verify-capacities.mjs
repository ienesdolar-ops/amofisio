import fs from 'fs';

const capData = JSON.parse(fs.readFileSync('capacities.json', 'utf8'));
const courses = capData.courses;

if (Object.keys(courses).length !== 74 && Object.keys(courses).length !== 73 && Object.keys(courses).length !== 72) {
  console.error(`Erro: Esperava 74 cursos em capacities.json (72 ativos + 2 SJC cancelados), encontrou ${Object.keys(courses).length}`);
  process.exit(1);
}

// Exemplos conhecidos de cursos que devem ter a capacidade da descrição:
const testCases = [
  { id: '3555278', expected: 15, name: 'Londrina - Nutrição no Esporte' },
  { id: '3556990', expected: 20, name: 'Vitória - Somatotopias' },
  { id: '3556987', expected: 15, name: 'Vitória - Saúde Mental e Acupuntura' },
  { id: '3560614', expected: 30, name: 'Curitiba - Complexo articular do ombro' },
  { id: '3602654', expected: 20, name: 'Rio de Janeiro - Doença de Parkinson' },
  { id: '3567347', expected: 50, name: 'Goiânia - Reabilitação Pós-Parto e Pilates' },
  { id: '3589911', expected: 35, name: 'Maceió - Liderança' }
];

for (const tc of testCases) {
  const item = courses[tc.id];
  if (!item) {
    console.error(`Curso ${tc.id} (${tc.name}) não encontrado em capacities.json`);
    process.exit(1);
  }
  if (item.capacity !== tc.expected) {
    console.error(`Erro em ${tc.name}: capacidade é ${item.capacity}, esperava ${tc.expected}`);
    process.exit(1);
  }
}

console.log('VERIFICACAO_CAPACIDADES_OK');
