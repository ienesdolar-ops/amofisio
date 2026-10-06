import fs from 'fs';

let app = fs.readFileSync('app.js', 'utf8');

// 1. Extrair o trecho de recentLogic que foi inserido dentro de closeAdminDashboard
const startMarker = '// =========================================================================\n  // GESTÃO DE ÚLTIMAS INSCRIÇÕES REALIZADAS (ADMIN FEED & MODAL PÚBLICO)';
const endMarker = 'if (publicRecentSearch) {\n    publicRecentSearch.addEventListener(\'input\', (e) => {\n      renderPublicRecentList(e.target.value);\n    });\n  }';

const startIdx = app.indexOf(startMarker);
const endIdx = app.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('Marcadores não encontrados');
  process.exit(1);
}

const fullEndIdx = endIdx + endMarker.length;
const extractedLogic = app.substring(startIdx, fullEndIdx);

// Remover o bloco extraído de dentro de closeAdminDashboard e fechar a função corretamente
const beforeBlock = app.substring(0, startIdx);
const afterBlock = app.substring(fullEndIdx);

// O beforeBlock termina em:
// function closeAdminDashboard() {
//   if (adminDashboardModal) {
//     adminDashboardModal.style.display = 'none';
//     document.body.style.overflow = '';
//     \n  
// E o afterBlock começa com:
// \n  if (window.location.hash === '#admin') {\n        history.replaceState(null, null, window.location.pathname + window.location.search);\n      }\n    }\n  }\n\n  function logoutAdmin() ...

// Montar o trecho limpo de closeAdminDashboard:
const cleanCloseAdminDashboard = `function closeAdminDashboard() {
    if (adminDashboardModal) {
      adminDashboardModal.style.display = 'none';
      document.body.style.overflow = '';
      if (window.location.hash === '#admin') {
        history.replaceState(null, null, window.location.pathname + window.location.search);
      }
    }
  }`;

// Substituir na primeira metade
const cutStart = beforeBlock.indexOf('function closeAdminDashboard() {');
const cutEnd = afterBlock.indexOf('function logoutAdmin() {');

let cleanApp = beforeBlock.substring(0, cutStart) + cleanCloseAdminDashboard + '\n\n  ' + afterBlock.substring(cutEnd);

// Agora, inserir extractedLogic antes do bloco final de verificação de hash
const bottomAnchor = '// Verificar se acessou diretamente com hash #admin';
const bottomIdx = cleanApp.lastIndexOf(bottomAnchor);
if (bottomIdx === -1) {
  console.error('Âncora inferior não encontrada');
  process.exit(1);
}

cleanApp = cleanApp.substring(0, bottomIdx) + extractedLogic + '\n\n  ' + cleanApp.substring(bottomIdx);

fs.writeFileSync('app.js', cleanApp, 'utf8');
if (fs.existsSync('../app.js')) {
  fs.writeFileSync('../app.js', cleanApp, 'utf8');
}

console.log('Estrutura de app.js corrigida perfeitamente!');
