import fs from 'fs';

// 1. Carregar data.js
const fileContent = fs.readFileSync('data.js', 'utf8');
const sandbox = {};
const evalFn = new Function('sandbox', fileContent + '; sandbox.DATA = AMO_FISIO_DATA;');
evalFn(sandbox);
const appData = sandbox.DATA;

if (!appData) {
  console.error('ERRO: AMO_FISIO_DATA não encontrado.');
  process.exit(1);
}

if (!Array.isArray(appData.recentRegistrations)) {
  console.error('ERRO: AMO_FISIO_DATA.recentRegistrations não é um Array.');
  process.exit(1);
}

if (appData.recentRegistrations.length < 10) {
  console.error(`ERRO: Quantidade insuficiente de registros recentes: ${appData.recentRegistrations.length}. Esperado no mínimo 10.`);
  process.exit(1);
}

// 2. Validar formato de cada registro
const requiredProps = [
  'id',
  'unitId',
  'unitName',
  'courseId',
  'courseTitle',
  'attendeeName',
  'timestamp',
  'timeAgoText',
  'symplaUrl'
];

for (const reg of appData.recentRegistrations) {
  for (const prop of requiredProps) {
    if (!reg[prop]) {
      console.error(`ERRO: Propriedade obrigatória ausente '${prop}' no registro:`, reg);
      process.exit(1);
    }
  }

  // Validar se o unitId existe em appData.units
  const unitExists = appData.units.some(u => u.id === reg.unitId);
  if (!unitExists) {
    console.error(`ERRO: unitId desconhecido '${reg.unitId}' no registro ${reg.id}`);
    process.exit(1);
  }
}

console.log(`Sucesso: ${appData.recentRegistrations.length} inscrições recentes validadas com sucesso.`);
console.log('VERIFICACAO_RECENT_REGISTRATIONS_OK');
