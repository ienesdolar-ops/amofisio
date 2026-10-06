import fs from 'fs';
import { parseCSV } from './parse-briefing.mjs';

const briefingCsv = fs.readFileSync('briefing_forms.csv', 'utf8');
const rows = parseCSV(briefingCsv);

const briefings = [];
for (let i = 1; i < rows.length; i++) {
  const r = rows[i];
  if (!r[6]) continue;
  const unit = r[6].trim();
  const theme = (r[7] || '').trim();
  const cap = parseInt((r[12] || '').replace(/\D/g, ''), 10) || null;
  const min = parseInt((r[13] || '').replace(/\D/g, ''), 10) || 10;
  briefings.push({ id: r[0], unit, theme, cap, min });
}

let code = fs.readFileSync('data.js', 'utf8').replace('const AMO_FISIO_DATA =', 'global.AMO_FISIO_DATA =');
eval(code);

const units = global.AMO_FISIO_DATA.units;

console.log(`Unidades: ${units.length}`);

// Normalização para matching de strings
function cleanStr(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function findMinForCourse(unitName, courseTitle) {
  const cleanU = cleanStr(unitName);
  const cleanT = cleanStr(courseTitle);

  // Filtrar briefings da mesma cidade
  const unitBriefings = briefings.filter(b => {
    const bU = cleanStr(b.unit);
    return bU.includes(cleanU) || cleanU.includes(bU.split(' ')[0]);
  });

  if (unitBriefings.length === 0) {
    return { min: 10, source: 'default_no_unit' };
  }

  // Se unidade tem só 1 briefing (ex: Florianopolis, Blumenau, Fortaleza, Goiania, Maceio)
  if (unitBriefings.length === 1) {
    return { min: unitBriefings[0].min, source: 'single_briefing', briefing: unitBriefings[0] };
  }

  // Tentar encontrar melhor match pelo título
  let bestMatch = null;
  let maxScore = 0;

  for (const b of unitBriefings) {
    const bT = cleanStr(b.theme);
    // Calcular overlap de palavras significativas (tamanho > 3)
    const tWords = cleanT.split(' ').filter(w => w.length > 3);
    let matchedWords = 0;
    for (const w of tWords) {
      if (bT.includes(w)) matchedWords++;
    }
    const score = matchedWords / (tWords.length || 1);
    if (score > maxScore) {
      maxScore = score;
      bestMatch = b;
    }
  }

  if (bestMatch && maxScore >= 0.2) {
    return { min: bestMatch.min, source: 'title_match', score: maxScore, briefing: bestMatch };
  }

  // Fallback: se todos os briefings da cidade têm o mesmo mínimo
  const allMins = [...new Set(unitBriefings.map(b => b.min))];
  if (allMins.length === 1) {
    return { min: allMins[0], source: 'unit_uniform_min' };
  }

  return { min: 10, source: 'fallback_10', candidates: unitBriefings };
}

let totalCourses = 0;
let matchedCount = 0;
const results = [];

units.forEach(u => {
  u.courses.forEach(c => {
    totalCourses++;
    const res = findMinForCourse(u.name, c.title);
    results.push({
      unit: u.name,
      courseId: c.id,
      title: c.title,
      min: res.min,
      source: res.source,
      score: res.score
    });
  });
});

console.log(`Total cursos analisados: ${totalCourses}`);
results.forEach(r => {
  console.log(`[${r.unit}] ${r.title.substring(0, 45)}... -> MÍNIMO: ${r.min} (${r.source})`);
});
