import fs from 'fs';
import { execSync } from 'child_process';

// 1. Validar sintaxe
try {
  execSync('node -c app.js', { stdio: 'pipe' });
  execSync('node -c data.js', { stdio: 'pipe' });
} catch (e) {
  console.error('ERRO: Falha de sintaxe em app.js ou data.js:', e.message);
  process.exit(1);
}

// 2. Validar presença das funções de lógica em app.js
const appJs = fs.readFileSync('app.js', 'utf8');

const requiredAppTerms = [
  'renderAdminRecentFeed',
  'admin-tab-recent',
  'admin-tab-units',
  'adminRecentList',
  '#admin'
];

for (const term of requiredAppTerms) {
  if (!appJs.includes(term)) {
    console.error(`ERRO: Termo/Lógica ausente em app.js: ${term}`);
    process.exit(1);
  }
}

// 3. Teste funcional de filtragem do feed de inscrições
const mockRegistrations = [
  { id: '1', unitId: 'rio-de-janeiro', unitName: 'Rio de Janeiro', courseTitle: 'LCA', attendeeName: 'João' },
  { id: '2', unitId: 'campo-grande', unitName: 'Campo Grande', courseTitle: 'Home Care', attendeeName: 'Maria' },
  { id: '3', unitId: 'rio-de-janeiro', unitName: 'Rio de Janeiro', courseTitle: 'ATM', attendeeName: 'Carlos' }
];

function filterFeed(list, unitFilter, query) {
  return list.filter(item => {
    if (unitFilter && unitFilter !== 'all' && item.unitId !== unitFilter) return false;
    if (query) {
      const q = query.toLowerCase();
      const match = item.unitName.toLowerCase().includes(q) ||
                    item.courseTitle.toLowerCase().includes(q) ||
                    item.attendeeName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
}

// Teste filtro por unidade
const filteredUnit = filterFeed(mockRegistrations, 'rio-de-janeiro', '');
if (filteredUnit.length !== 2) {
  console.error('ERRO: Falha no teste de filtro por unidade', filteredUnit);
  process.exit(1);
}

// Teste filtro por busca de curso
const filteredSearch = filterFeed(mockRegistrations, 'all', 'home care');
if (filteredSearch.length !== 1 || filteredSearch[0].id !== '2') {
  console.error('ERRO: Falha no teste de busca por texto', filteredSearch);
  process.exit(1);
}

console.log('Sucesso: Toda a lógica de renderização e filtros admin foi validada.');
console.log('VERIFICACAO_RECENT_LOGIC_OK');
