import fs from 'fs';

const content = fs.readFileSync('data.js', 'utf8');
const sandbox = {};
const fn = new Function('sandbox', content + '; sandbox.DATA = AMO_FISIO_DATA;');
fn(sandbox);
const data = sandbox.DATA;

// Coletar cursos que possuem inscritos
const candidates = [];
data.units.forEach(u => {
  // Ignorar unidades canceladas
  if (u.cancelledByFranchisee) return;
  u.courses.forEach(c => {
    if (c.registered > 0) {
      candidates.push({
        unitId: u.id,
        unitName: u.name,
        state: u.state,
        courseId: c.id,
        courseTitle: c.title,
        instructor: c.instructor || '',
        registered: c.registered,
        capacity: c.capacity,
        minParticipants: c.minParticipants,
        status: c.status,
        badge: c.badge,
        symplaUrl: c.symplaUrl
      });
    }
  });
});

// Ordenar priorizando cursos com maior taxa de ocupação ou últimas vagas
candidates.sort((a, b) => {
  const pA = a.registered / a.capacity;
  const pB = b.registered / a.capacity;
  return pB - pA;
});

// Nomes amigáveis e anonimizados de participantes
const studentNames = [
  'Mariana S.', 'Lucas M.', 'Camila R.', 'Gabriel T.', 'Juliana F.',
  'Rodrigo B.', 'Fernanda P.', 'Matheus C.', 'Larissa A.', 'Felipe N.',
  'Beatriz O.', 'Thiago V.', 'Aline D.', 'Gustavo H.', 'Natália K.',
  'Bruno E.', 'Amanda L.', 'Rafael G.', 'Carolina M.', 'Vinícius R.',
  'Isabela T.', 'Leonardo S.', 'Patrícia N.', 'Diego F.', 'Renata B.'
];

// Gerar uma lista cronológica de inscrições recentes (do mais recente para trás)
const timeOffsets = [
  { minAgo: 4, text: 'Há 4 minutos' },
  { minAgo: 12, text: 'Há 12 minutos' },
  { minAgo: 25, text: 'Há 25 minutos' },
  { minAgo: 42, text: 'Há 42 minutos' },
  { minAgo: 58, text: 'Há 58 minutos' },
  { minAgo: 75, text: 'Há 1 hora' },
  { minAgo: 110, text: 'Há 1 hora e meia' },
  { minAgo: 140, text: 'Há 2 horas' },
  { minAgo: 190, text: 'Há 3 horas' },
  { minAgo: 240, text: 'Hoje às 12:45' },
  { minAgo: 280, text: 'Hoje às 11:20' },
  { minAgo: 320, text: 'Hoje às 10:35' },
  { minAgo: 370, text: 'Hoje às 09:15' },
  { minAgo: 410, text: 'Hoje às 08:40' },
  { minAgo: 500, text: 'Ontem às 21:10' },
  { minAgo: 560, text: 'Ontem às 20:25' },
  { minAgo: 620, text: 'Ontem às 19:40' },
  { minAgo: 700, text: 'Ontem às 18:15' },
  { minAgo: 780, text: 'Ontem às 17:05' },
  { minAgo: 850, text: 'Ontem às 16:30' },
  { minAgo: 920, text: 'Ontem às 15:45' },
  { minAgo: 980, text: 'Ontem às 14:10' },
  { minAgo: 1050, text: 'Ontem às 11:50' },
  { minAgo: 1120, text: 'Ontem às 10:20' },
  { minAgo: 1200, text: 'Ontem às 09:05' }
];

const now = new Date('2026-10-06T15:30:00-03:00').getTime();

const recentRegistrations = [];

// Garantir que os cursos mais expressivos estão no topo das inscrições recentes:
// 1. Rio de Janeiro - LCA Márcio Puglia (39/40 - última vaga)
// 2. Campo Grande - Home Care (46/50)
// 3. Cuiabá - Biomecânica (32/50)
// 4. Bauru - Neuropediatria CIF (25/30)
// 5. Guarulhos - Respiratória (50/50)
// 6. Campinas - Fisioterapia Manipulativa (35/35)
// 7. e outros candidatos
const topCandidates = [
  candidates.find(c => c.courseId.includes('lca')),
  candidates.find(c => c.courseId.includes('home-care')),
  candidates.find(c => c.courseId.includes('biomecanica')),
  candidates.find(c => c.courseId.includes('neuropediatria')),
  candidates.find(c => c.unitId === 'guarulhos' && c.courseId.includes('respiratoria')),
  candidates.find(c => c.unitId === 'campinas' && c.courseId.includes('manipulativa')),
  ...candidates
].filter(Boolean);

// Remover duplicatas imediatas preservando ordem
const uniqueOrdered = [];
const seen = new Set();
topCandidates.forEach(c => {
  if (!seen.has(c.courseId)) {
    seen.add(c.courseId);
    uniqueOrdered.push(c);
  }
});

for (let i = 0; i < timeOffsets.length; i++) {
  const c = uniqueOrdered[i % uniqueOrdered.length];
  const t = timeOffsets[i];
  const dateIso = new Date(now - t.minAgo * 60 * 1000).toISOString();
  const attendee = studentNames[i % studentNames.length];
  const isConfirmed = c.registered >= (c.minParticipants || 10);
  const isSoldOut = c.registered >= c.capacity;
  const isUrgent = (c.capacity - c.registered) <= 5 && !isSoldOut;

  let badgeStatus = 'Confirmado';
  if (isSoldOut) badgeStatus = 'Turma Esgotada';
  else if (isUrgent) badgeStatus = (c.capacity - c.registered) === 1 ? 'Última vaga' : 'Últimas vagas';

  recentRegistrations.push({
    id: `reg-${String(i + 1).padStart(3, '0')}`,
    unitId: c.unitId,
    unitName: c.unitName,
    state: c.state,
    courseId: c.courseId,
    courseTitle: c.courseTitle,
    instructor: c.instructor,
    attendeeName: attendee,
    registeredCount: c.registered,
    capacity: c.capacity,
    minParticipants: c.minParticipants,
    isConfirmed,
    isSoldOut,
    isUrgent,
    statusBadge: badgeStatus,
    timestamp: dateIso,
    timeAgoText: t.text,
    symplaUrl: c.symplaUrl
  });
}

console.log(`Geradas ${recentRegistrations.length} inscrições recentes.`);

// Inserir no data.js mantendo formatação impecável
data.recentRegistrations = recentRegistrations;

const newJs = `/**
 * BASE DE DADOS DO EVENTO AMO FISIO - FACULDADE INSPIRAR
 * Todas as unidades, cursos e links oficiais do Sympla.
 * 
 * ⚠️ REGRA OBRIGATÓRIA:
 * Todas as unidades (cidades) DEVEM estar sempre cadastradas e mantidas em ORDEM ALFABÉTICA (A-Z) pelo campo 'name'.
 */

const AMO_FISIO_DATA = ${JSON.stringify(data, null, 2)};
`;

fs.writeFileSync('data.js', newJs, 'utf8');
if (fs.existsSync('../data.js')) {
  fs.writeFileSync('../data.js', newJs, 'utf8');
}

console.log('data.js atualizado com sucesso com AMO_FISIO_DATA.recentRegistrations!');
