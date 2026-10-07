import fs from 'fs';

// 1. Validar index.html
const html = fs.readFileSync('index.html', 'utf8');

const requiredHtmlElements = [
  'admin-tab-units',
  'admin-tab-recent',
  'admin-recent-feed-view',
  'admin-recent-list'
];

for (const el of requiredHtmlElements) {
  if (!html.includes(el)) {
    console.error(`ERRO: Elemento HTML ausente em index.html: ${el}`);
    process.exit(1);
  }
}

// 2. Validar que elementos públicos foram devidamente removidos
const removedElements = ['btn-public-recent', 'modal-recent-registrations'];
for (const el of removedElements) {
  if (html.includes(el)) {
    console.error(`ERRO: Elemento público não deveria estar em index.html: ${el}`);
    process.exit(1);
  }
}

// 3. Validar style.css
const css = fs.readFileSync('style.css', 'utf8');

const requiredCssClasses = [
  'admin-tabs-nav',
  'admin-tab-btn',
  'admin-recent-feed-view',
  'admin-recent-list',
  'admin-recent-card',
  'hero-event-info-card'
];

for (const cls of requiredCssClasses) {
  if (!css.includes(cls)) {
    console.error(`ERRO: Classe CSS ausente em style.css: ${cls}`);
    process.exit(1);
  }
}

console.log('Sucesso: Interface admin e isolamento público validados.');
console.log('VERIFICACAO_RECENT_UI_OK');
