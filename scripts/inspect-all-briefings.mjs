import fs from 'fs';
import { parseCSV } from './parse-briefing.mjs';

const csvData = fs.readFileSync('briefing_forms.csv', 'utf8');
const rows = parseCSV(csvData);
const headers = rows[0].map(h => h.trim());

const unitCol = headers.findIndex(h => h.startsWith('Unidade:'));
const themeCol = headers.findIndex(h => h.startsWith('Tema da palestra'));
const capCol = headers.findIndex(h => h.startsWith('Número de vagas:'));
const minCol = headers.findIndex(h => h.includes('mínimo de participantes'));

console.log(`Linhas totais: ${rows.length - 1}`);

const briefings = [];
for (let i = 1; i < rows.length; i++) {
  const r = rows[i];
  if (!r[unitCol]) continue;
  const rawMin = r[minCol] || '';
  const parsedMin = parseInt(rawMin.replace(/\D/g, ''), 10) || 10;
  briefings.push({
    id: r[0],
    unit: r[unitCol].trim(),
    theme: (r[themeCol] || '').trim(),
    capacity: parseInt((r[capCol] || '').replace(/\D/g, ''), 10) || null,
    minParticipants: parsedMin
  });
}

console.log(`Briefings válidos: ${briefings.length}`);

// Carregar data.js
let code = fs.readFileSync('data.js', 'utf8').replace('const AMO_FISIO_DATA =', 'global.AMO_FISIO_DATA =');
eval(code);

const dataUnits = global.AMO_FISIO_DATA.units;
console.log(`Unidades em data.js: ${dataUnits.length}`);

dataUnits.forEach(u => {
  console.log(`\n=== Unidade: ${u.name} (${u.courses.length} cursos) ===`);
  u.courses.forEach(c => {
    // Tentar encontrar matching briefing
    const matched = briefings.filter(b => {
      const uMatch = b.unit.toLowerCase().includes(u.name.toLowerCase()) || 
                     u.name.toLowerCase().includes(b.unit.toLowerCase().split('/')[0].split('-')[0].trim());
      return uMatch;
    });

    console.log(`  - [${c.id}] "${c.title}"`);
  });
});
