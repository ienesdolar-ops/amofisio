import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Obter Token do Sympla
const token = process.env.SYMPLA_TOKEN;
if (!token) {
  console.error('ERRO: Variável de ambiente SYMPLA_TOKEN não fornecida.');
  process.exit(1);
}

// 2. Carregar capacities.json
const rootDir = path.resolve(__dirname, '..');
let capacitiesPath = path.join(rootDir, 'capacities.json');
if (!fs.existsSync(capacitiesPath)) {
  capacitiesPath = path.join(__dirname, 'capacities.json');
}
if (!fs.existsSync(capacitiesPath)) {
  capacitiesPath = path.resolve('capacities.json');
}

let capacitiesConfig = { courses: {}, rules: { urgentThreshold: 5, lastSpotThreshold: 1 } };
if (fs.existsSync(capacitiesPath)) {
  try {
    capacitiesConfig = JSON.parse(fs.readFileSync(capacitiesPath, 'utf8'));
    console.log(`Configuração carregada de ${capacitiesPath}`);
  } catch (e) {
    console.warn(`Aviso: Falha ao ler capacities.json: ${e.message}`);
  }
}

// 3. Localizar arquivos data.js
const targetFiles = [
  path.join(rootDir, 'data.js'),
  path.join(rootDir, 'linktree amofisio', 'data.js'),
  path.resolve('data.js')
].filter(f => fs.existsSync(f));

// Remove duplicatas de caminho
const uniqueTargetFiles = [...new Set(targetFiles.map(f => path.normalize(f)))];
if (uniqueTargetFiles.length === 0) {
  console.error('ERRO: Nenhum arquivo data.js encontrado.');
  process.exit(1);
}

console.log(`Arquivos data.js a sincronizar: ${uniqueTargetFiles.join(', ')}`);

// Carregar AMO_FISIO_DATA
const mainDataFile = uniqueTargetFiles[0];
const fileContent = fs.readFileSync(mainDataFile, 'utf8');

const sandbox = {};
const evalFn = new Function('sandbox', fileContent + '; sandbox.DATA = AMO_FISIO_DATA;');
evalFn(sandbox);
const appData = sandbox.DATA;

if (!appData || !appData.units) {
  console.error('ERRO: Estrutura inválida em data.js.');
  process.exit(1);
}

// 4. Função auxiliar para consultar participantes na API do Sympla
function getParticipantsCount(eventId) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.sympla.com.br',
      path: `/public/v3/events/${eventId}/participants?page_size=1`,
      method: 'GET',
      headers: {
        's_token': token,
        'User-Agent': 'AmoFisio-Sync/1.0'
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const json = JSON.parse(body);
            const count = json.pagination ? (json.pagination.quantity ?? json.pagination.total_page ?? 0) : 0;
            resolve({ success: true, count });
          } else {
            resolve({ success: false, status: res.statusCode });
          }
        } catch (err) {
          resolve({ success: false, error: err.message });
        }
      });
    });

    req.on('error', (err) => resolve({ success: false, error: err.message }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });
    req.end();
  });
}

// 4b. Pedidos mais recentes de um evento (datas reais de inscrição)
function getRecentOrders(eventId) {
  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.sympla.com.br',
      path: `/public/v3/events/${eventId}/orders?page_size=20&field_sort=order_date&sort=DESC`,
      method: 'GET',
      headers: { 's_token': token, 'User-Agent': 'AmoFisio-Sync/1.0' },
      timeout: 10000
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            console.warn(`[AVISO] orders ${eventId}: status ${res.statusCode}`);
            return resolve([]);
          }
          const json = JSON.parse(body);
          resolve(Array.isArray(json.data) ? json.data : []);
        } catch { resolve([]); }
      });
    });
    req.on('error', () => resolve([]));
    req.on('timeout', () => { req.destroy(); resolve([]); });
    req.end();
  });
}

// Sympla retorna "YYYY-MM-DD HH:mm:ss" no horário de Brasília
function toIsoBR(s) {
  if (!s) return null;
  const m = String(s).match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})/);
  if (!m) return null;
  const d = new Date(`${m[1]}T${m[2]}-03:00`);
  return isNaN(d) ? null : d.toISOString();
}

// 5. Executar consultas com controle de taxa (concorrência limitada)
async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  console.log('\n--- INICIANDO VERIFICAÇÃO AUTOMÁTICA SYMPLA ---');
  let totalChecked = 0;
  let totalUpdated = 0;
  const changes = [];

  // Mapear todos os cursos
  const allCourses = [];
  appData.units.forEach(unit => {
    unit.courses.forEach(course => {
      const match = (course.symplaUrl || '').match(/\/(\d{6,8})/);
      if (match) {
        allCourses.push({
          unit,
          course,
          eventId: match[1]
        });
      }
    });
  });

  console.log(`Total de cursos a verificar: ${allCourses.length}`);

  // Processar em lotes de 4 requisições por vez
  const BATCH_SIZE = 4;
  for (let i = 0; i < allCourses.length; i += BATCH_SIZE) {
    const batch = allCourses.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(async ({ unit, course, eventId }) => {
      totalChecked++;
      const res = await getParticipantsCount(eventId);
      
      if (!res.success) {
        console.warn(`[AVISO] Falha ao consultar ${unit.name} - ${course.title} (ID: ${eventId}): status=${res.status || res.error}`);
        return;
      }

      const registered = res.count;
      const capacityInfo = capacitiesConfig.courses[eventId];
      const maxCapacity = capacityInfo ? capacityInfo.capacity : 40;
      const remaining = maxCapacity - registered;

      // Se o curso ou unidade foi cancelado pelo franqueado, preserva o status
      if (course.cancelledByFranchisee || unit.cancelledByFranchisee) {
        course.badge = 'Cancelado pelo franqueado';
        course.status = 'cancelled';
        course.registered = registered;
        course.capacity = maxCapacity;
        course.minParticipants = (capacityInfo && capacityInfo.minParticipants) || course.minParticipants || 10;
        return;
      }

      course.registered = registered;
      course.capacity = maxCapacity;
      course.minParticipants = (capacityInfo && capacityInfo.minParticipants) || course.minParticipants || 10;

      const oldBadge = course.badge;
      const oldStatus = course.status;

      // Regras de negócio solicitadas:
      // - 0 ou menos vagas restantes -> Esgotado
      // - 1 vaga restante -> Última vaga
      // - 2 a 5 vagas restantes -> Últimas vagas
      // - Mais de 5 vagas -> Disponível
      if (remaining <= 0) {
        course.badge = 'Esgotado';
        course.status = 'sold_out';
      } else if (remaining === 1) {
        course.badge = 'Última vaga';
        course.status = 'last_spots';
      } else if (remaining <= 5) {
        course.badge = 'Últimas vagas';
        course.status = 'last_spots';
      } else {
        if (course.status === 'sold_out' || course.status === 'last_spots') {
          course.status = 'available';
          course.badge = (unit.id === 'campo-grande') ? 'Combo R$ 30 (4 Cursos)' : 'Presencial';
        }
      }

      if (oldBadge !== course.badge || oldStatus !== course.status) {
        totalUpdated++;
        changes.push(`- [${unit.name}] ${course.title}: ${registered}/${maxCapacity} inscritos -> Selo alterado de "${oldBadge}" para "${course.badge}"`);
      }
    }));

    await sleep(150); // intervalo amigável para a API
  }

  // 5b. ÚLTIMAS INSCRIÇÕES REAIS (pedidos aprovados no Sympla)
  try {
    const recent = [];
    for (let i = 0; i < allCourses.length; i += BATCH_SIZE) {
      const batch = allCourses.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(async ({ unit, course, eventId }) => {
        if (unit.cancelledByFranchisee || course.cancelledByFranchisee) return;
        const orders = await getRecentOrders(eventId);
        orders.forEach(o => {
          if (o.order_status && o.order_status !== 'A') return; // apenas aprovados
          const iso = toIsoBR(o.order_date);
          if (!iso) return;
          const first = (o.buyer_first_name || '').trim().split(/\s+/)[0] || '';
          const lastInitial = (o.buyer_last_name || '').trim().charAt(0);
          recent.push({
            id: `ord-${o.id}`,
            unitId: unit.id,
            unitName: unit.name,
            state: unit.state,
            courseId: course.id,
            courseTitle: course.title,
            instructor: course.instructor || '',
            attendeeName: first ? `${first}${lastInitial ? ' ' + lastInitial.toUpperCase() + '.' : ''}` : 'Participante',
            registeredCount: course.registered,
            capacity: course.capacity,
            minParticipants: course.minParticipants,
            isConfirmed: course.registered >= (course.minParticipants || 10),
            isSoldOut: course.status === 'sold_out',
            isUrgent: course.status === 'last_spots',
            statusBadge: course.status === 'sold_out' ? 'Turma Esgotada' : (course.badge || 'Confirmado'),
            timestamp: iso,
            timeAgoText: '',
            symplaUrl: course.symplaUrl
          });
        });
      }));
      await sleep(150);
    }
    recent.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    appData.recentRegistrations = recent.slice(0, 60);
    console.log(`Últimas inscrições reais coletadas: ${appData.recentRegistrations.length}`);
  } catch (e) {
    console.warn('[AVISO] Falha ao coletar últimas inscrições:', e.message);
  }

  // 6. Regra de UX: Cursos esgotados vão para o final de cada unidade
  appData.units.forEach(unit => {
    unit.courses.sort((a, b) => {
      const aSold = a.status === 'sold_out' ? 1 : 0;
      const bSold = b.status === 'sold_out' ? 1 : 0;
      return aSold - bSold;
    });
  });

  // 7. Regra obrigatória: Ordenação alfabética estrita A-Z das cidades
  appData.units.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }));

  // 8. Salvar arquivos data.js atualizados
  const newFileContent = `/**
 * BASE DE DADOS DO EVENTO AMO FISIO - FACULDADE INSPIRAR
 * Todas as unidades, cursos e links oficiais do Sympla.
 * 
 * ⚠️ REGRA OBRIGATÓRIA:
 * Todas as unidades (cidades) DEVEM estar sempre cadastradas e mantidas em ORDEM ALFABÉTICA (A-Z) pelo campo 'name'.
 */

const AMO_FISIO_DATA = ${JSON.stringify(appData, null, 2)};
`;

  uniqueTargetFiles.forEach(targetPath => {
    fs.writeFileSync(targetPath, newFileContent, 'utf8');
    console.log(`Arquivo salvo: ${targetPath}`);
  });

  console.log('\n--- SINCRONIZAÇÃO CONCLUÍDA ---');
  console.log(`Cursos verificados: ${totalChecked}`);
  console.log(`Alterações detectadas: ${totalUpdated}`);
  if (changes.length > 0) {
    console.log('\nMudanças aplicadas:');
    changes.forEach(c => console.log(c));
  } else {
    console.log('Todos os selos e status já estavam perfeitamente alinhados com o Sympla.');
  }
}

run().catch(err => {
  console.error('Erro fatal durante a sincronização:', err);
  process.exit(1);
});
