import fs from 'fs';

// 1. Ler index.html
const html = fs.readFileSync('index.html', 'utf8');

// 2. Verificar card promocional no hero
if (!html.includes('hero-event-info-card')) {
  console.error('ERRO: Card informativo hero-event-info-card não encontrado em index.html');
  process.exit(1);
}

if (!html.includes('hero-info-number') || !html.includes('21')) {
  console.error('ERRO: Número "21" em destaque não encontrado no card');
  process.exit(1);
}

if (!html.includes('hero-info-watermark') || !html.includes('>3<')) {
  console.error('ERRO: Marca d\'água "3" não encontrada no card');
  process.exit(1);
}

if (!html.includes('cidades com <strong>AmoFisio</strong> presencial') || !html.includes('23 a 31/10')) {
  console.error('ERRO: Texto descritivo exato "cidades com AmoFisio presencial, de 23 a 31/10" ausente no card');
  process.exit(1);
}

// 3. Garantir que não há elementos de ticker/inscrições públicas em tempo real no HTML público
if (html.includes('btn-public-recent')) {
  console.error('ERRO: Botão público btn-public-recent ainda presente no index.html');
  process.exit(1);
}

if (html.includes('modal-recent-registrations')) {
  console.error('ERRO: Modal público modal-recent-registrations ainda presente no index.html');
  process.exit(1);
}

// 4. Ler style.css e verificar declarações visuais do card
const css = fs.readFileSync('style.css', 'utf8');

const requiredCss = [
  '.hero-event-info-card',
  '.hero-info-watermark',
  '.hero-info-number',
  '.hero-info-text'
];

for (const rule of requiredCss) {
  if (!css.includes(rule)) {
    console.error(`ERRO: Estilo CSS ausente para o card hero: ${rule}`);
    process.exit(1);
  }
}

console.log('Sucesso: Card hero verificado fielmente ao print e área pública protegida contra exibição de inscrições.');
console.log('VERIFICACAO_PUBLIC_HERO_CARD_OK');
