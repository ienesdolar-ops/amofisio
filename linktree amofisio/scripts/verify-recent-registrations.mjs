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

// 2. REGRA DO USUÁRIO: Não conter dados/nomes fictícios ou inventados
const forbiddenMockNames = ['Mariana S.', 'Lucas M.', 'Camila R.', 'Gabriel T.', 'Juliana F.'];
for (const reg of appData.recentRegistrations) {
  if (forbiddenMockNames.includes(reg.attendeeName)) {
    console.error('ERRO: Encontrado nome fictício inventado:', reg.attendeeName);
    process.exit(1);
  }
}

// 3. Validar se a lista está vazia para aguardar apenas registros verdadeiros, ou se tem itens reais
if (appData.recentRegistrations.length === 0) {
  console.log('Sucesso: recentRegistrations está vazio ([]), aguardando apenas registros verdadeiros conforme solicitado.');
} else {
  console.log(`Sucesso: ${appData.recentRegistrations.length} registros reais encontrados.`);
}

console.log('VERIFICACAO_RECENT_REGISTRATIONS_OK');
