import fs from 'fs';
import { parseCSV } from './parse-briefing.mjs';

// 1. Carregar Briefing CSV
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

  // Regras manuais / refinamentos explícitos dos briefings
  if (cleanT.includes('lideranca nao espera cargo')) return 10;
  if (cleanU.includes('campo grande')) return 20; // Fisioterapia Além da Clínica - Home Care
  if (cleanT.includes('quiropraxia') && cleanU.includes('londrina')) return 8; // Briefing row 1
  if (cleanT.includes('manipulacao das fascias') || cleanT.includes('fascias')) return 8; // Briefing row 34
  if (cleanU.includes('vitoria')) return 7; // demais cursos de Vitória são min 7
  if (cleanT.includes('manipulativa') && cleanU.includes('campinas')) return 12; // Briefing row 69
  if (cleanU.includes('campinas')) return 15; // Briefing rows 70, 71
  if (cleanU.includes('belo horizonte')) return 15; // Briefing row 59
  if (cleanU.includes('fortaleza')) return 15; // Briefing row 60
  if (cleanU.includes('goiania')) return 50; // Briefing row 56
  if (cleanU.includes('porto velho')) return 20; // Briefing rows 61, 62, 63, 67
  if (cleanU.includes('sao jose dos campos')) return 10; // Briefing rows 24, 25

  // Filtrar briefings da unidade
  const unitBriefings = briefings.filter(b => {
    const bU = cleanStr(b.unit);
    return bU.includes(cleanU) || cleanU.includes(bU.split(' ')[0]);
  });

  if (unitBriefings.length === 1) {
    return unitBriefings[0].min;
  }

  let bestMatch = null;
  let maxScore = 0;
  for (const b of unitBriefings) {
    const bT = cleanStr(b.theme);
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
    return bestMatch.min;
  }

  return 10;
}

// 2. Carregar capacities.json
const capacities = JSON.parse(fs.readFileSync('capacities.json', 'utf8'));

// 3. Carregar data.js
let code = fs.readFileSync('data.js', 'utf8').replace('const AMO_FISIO_DATA =', 'global.AMO_FISIO_DATA =');
eval(code);
const appData = global.AMO_FISIO_DATA;

// 4. Adicionar / atualizar São José dos Campos em data.js
const sjcUnit = {
  id: "sao-jose-dos-campos",
  name: "São José dos Campos",
  state: "SP",
  fullName: "Faculdade Inspirar São José dos Campos",
  address: "São José dos Campos - SP",
  featured: false,
  cancelledByFranchisee: true,
  courses: [
    {
      id: "pelvica-promissora-sjc",
      title: "Fisioterapia Pélvica é uma área promissora. Entenda o porquê!",
      category: "Fisioterapia Pélvica & Carreira",
      badge: "Cancelado pelo franqueado",
      priceInfo: "",
      symplaUrl: "https://www.sympla.com.br/evento/amofisio-fisioterapia-pelvica-e-uma-area-promissora-entenda-o-porque/3553362",
      status: "cancelled",
      description: "Panorama de mercado, diferenciais de atuação e oportunidades clínicas da fisioterapia pélvica.",
      registered: 0,
      capacity: 30,
      minParticipants: 10,
      cancelledByFranchisee: true
    },
    {
      id: "atm-repercussoes-sjc",
      title: "Disfunções na ATM e suas repercussões no corpo humano",
      category: "Terapia Manual & DTM",
      badge: "Cancelado pelo franqueado",
      priceInfo: "",
      symplaUrl: "https://www.sympla.com.br/evento/amofisio-disfuncoes-na-atm-e-suas-repercussoes-no-corpo-humano/3553401",
      status: "cancelled",
      description: "Conexões biomecânicas entre a Articulação Temporomandibular, coluna cervical e postura corporal.",
      registered: 0,
      capacity: 30,
      minParticipants: 10,
      cancelledByFranchisee: true
    }
  ]
};

// Se SJC já existe, remove primeiro
appData.units = appData.units.filter(u => u.id !== 'sao-jose-dos-campos');
// Adiciona SJC
appData.units.push(sjcUnit);

// 5. Atualizar minParticipants em todas as turmas
appData.units.forEach(u => {
  u.courses.forEach(c => {
    const minVal = findMinForCourse(u.name, c.title);
    c.minParticipants = minVal;

    // Atualizar também em capacities.json se houver symplaUrl correspondente
    const match = (c.symplaUrl || '').match(/\/(\d{6,8})/);
    if (match) {
      const eventId = match[1];
      if (!capacities.courses[eventId]) {
        capacities.courses[eventId] = {
          name: c.title,
          city: u.name,
          capacity: c.capacity || 40
        };
      }
      capacities.courses[eventId].minParticipants = minVal;
      if (c.cancelledByFranchisee) {
        capacities.courses[eventId].cancelledByFranchisee = true;
      }
    }
  });
});

// Adicionar eventos de SJC em capacities.json
capacities.courses["3553362"] = {
  name: "Fisioterapia Pélvica é uma área promissora. Entenda o porquê!",
  city: "São José dos Campos",
  capacity: 30,
  minParticipants: 10,
  cancelledByFranchisee: true
};
capacities.courses["3553401"] = {
  name: "Disfunções na ATM e suas repercussões no corpo humano",
  city: "São José dos Campos",
  capacity: 30,
  minParticipants: 10,
  cancelledByFranchisee: true
};

// 6. Ordenação A-Z estrita
appData.units.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }));

// 7. Salvar data.js
const dataContent = `/**
 * BASE DE DADOS DO EVENTO AMO FISIO - FACULDADE INSPIRAR
 * Todas as unidades, cursos e links oficiais do Sympla.
 * 
 * ⚠️ REGRA OBRIGATÓRIA:
 * Todas as unidades (cidades) DEVEM estar sempre cadastradas e mantidas em ORDEM ALFABÉTICA (A-Z) pelo campo 'name'.
 */

const AMO_FISIO_DATA = ${JSON.stringify(appData, null, 2)};
`;

fs.writeFileSync('data.js', dataContent, 'utf8');
fs.writeFileSync('../data.js', dataContent, 'utf8');

// 8. Salvar capacities.json
fs.writeFileSync('capacities.json', JSON.stringify(capacities, null, 2), 'utf8');
fs.writeFileSync('../capacities.json', JSON.stringify(capacities, null, 2), 'utf8');

console.log('APLICADO_COM_SUCESSO');
console.log(`Total de unidades agora: ${appData.units.length}`);
console.log('Cidades:', appData.units.map(u => `${u.name}${u.cancelledByFranchisee ? ' [CANCELADO]' : ''}`));
