import fs from 'fs';

const capData = JSON.parse(fs.readFileSync('capacities.json', 'utf8'));
const courses = capData.courses;

const userOverrides = [
  { id: '3568083', expected: 40, name: 'LCA Puglia RJ' },
  { id: '3555189', expected: 50, name: 'Home Care Campo Grande' },
  { id: '3552294', expected: 30, name: 'Neuropediatria Bauru' },
  { id: '3552076', expected: 50, name: 'Biomecânica Cuiabá' },
  { id: '3589937', expected: 50, name: 'Manipulativa Campinas' },
  { id: '3552207', expected: 40, name: 'Microagulhamento Guarulhos' },
  { id: '3552221', expected: 40, name: 'Traumato Guarulhos' },
  { id: '3552255', expected: 50, name: 'Respiratória Guarulhos' },
  { id: '3552251', expected: 40, name: 'Urgência Guarulhos' }
];

for (const uo of userOverrides) {
  const item = courses[uo.id];
  if (!item) {
    console.error(`Curso ${uo.id} (${uo.name}) não encontrado`);
    process.exit(1);
  }
  if (item.capacity !== uo.expected) {
    console.error(`Erro: ${uo.name} deveria ter ${uo.expected} vagas, mas tem ${item.capacity}`);
    process.exit(1);
  }
}

console.log('VERIFICACAO_OVERRIDES_OK');
