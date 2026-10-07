import fs from 'fs';
let a = fs.readFileSync('app.js', 'utf8');
a = a.split('${item.timeAgoText}').join('${recentTimeAgo(item)}');
a = a.replace('Nova vaga garantida por <strong>${item.attendeeName}</strong>', 'Nova vaga garantida');
if (!a.includes('function recentTimeAgo')) {
  const helper = `  // Tempo relativo calculado a partir do horário real do pedido
  function recentTimeAgo(item) {
    if (!item.timestamp) return item.timeAgoText || '';
    const d = new Date(item.timestamp);
    const min = Math.floor((Date.now() - d.getTime()) / 60000);
    const hh = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    if (min < 1) return 'Agora mesmo';
    if (min < 60) return 'Há ' + min + ' min';
    const today = new Date(); const y = new Date(); y.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return 'Hoje às ' + hh;
    if (d.toDateString() === y.toDateString()) return 'Ontem às ' + hh;
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' às ' + hh;
  }

`;
  a = a.replace('  // Inicializar opções de unidades no filtro', helper + '  // Inicializar opções de unidades no filtro');
}
fs.writeFileSync('app.js', a);
fs.writeFileSync('../app.js', a);
console.log('recentTimeAgo uses:', (a.match(/recentTimeAgo\(/g) || []).length);
