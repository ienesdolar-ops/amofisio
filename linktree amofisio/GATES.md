# Gates: Mínimo de Alunos para Confirmação e Status de São José dos Campos

OWNS: data.js, capacities.json, app.js, style.css, scripts/sync-sympla.mjs

Scope: Mapear número mínimo de participantes para confirmação de cada turma a partir dos briefings; adicionar barrinha verde de meta de confirmação e status de turma apenas na área administrativa/relatório por unidade; exibir São José dos Campos no painel administrativo como "Cancelado pelo franqueado" mantendo-o oculto da visão pública dos alunos; garantir preservação das regras e sincronizar com o GitHub.

- [x] G1: Validar mapeamento de número mínimo de participantes (minParticipants) em todas as turmas
  CHECK: node scripts/verify-minimums.mjs
  EXPECT: VERIFICACAO_MINIMOS_OK
  EVIDENCE: exit=0; shell=powershell; cwd=C:\Users\Usuario\.gemini\antigravity\scratch\amofisio\linktree amofisio; EXPECT=matched; 73 cursos verificados com sucesso; status=VERIFICACAO_MINIMOS_OK

- [x] G2: Validar que São José dos Campos está oculto no linktree público e visível no painel administrativo com status cancelado
  CHECK: node scripts/verify-sjc-cancelled.mjs
  EXPECT: VERIFICACAO_SJC_CANCELLED_OK
  EVIDENCE: exit=0; shell=powershell; cwd=C:\Users\Usuario\.gemini\antigravity\scratch\amofisio\linktree amofisio; EXPECT=matched; SJC excluído do público e exibido como cancelado no admin; status=VERIFICACAO_SJC_CANCELLED_OK

- [x] G3: Validar a lógica de cálculo e renderização da barrinha verde de confirmação
  CHECK: node scripts/verify-confirm-bar.mjs
  EXPECT: VERIFICACAO_BARRA_CONFIRMACAO_OK
  EVIDENCE: exit=0; shell=powershell; cwd=C:\Users\Usuario\.gemini\antigravity\scratch\amofisio\linktree amofisio; EXPECT=matched; classes CSS, KPI card e cálculo de porcentagem atingida validados; status=VERIFICACAO_BARRA_CONFIRMACAO_OK

- [x] G4: Validar integridade dos dados, capacidades manuais preservadas e ordenação A-Z
  CHECK: node scripts/verify-integrity.mjs
  EXPECT: TODOS_TESTES_INTEGRIDADE_OK
  EVIDENCE: exit=0; shell=powershell; cwd=C:\Users\Usuario\.gemini\antigravity\scratch\amofisio\linktree amofisio; EXPECT=matched; ordenação A-Z confirmada, limites manuais mantidos; status=TODOS_TESTES_INTEGRIDADE_OK

- [x] G5: Confirmar envio das atualizações para o repositório remoto no GitHub
  CHECK: node scripts/verify-git.mjs
  EXPECT: VERIFICACAO_GIT_OK
  EVIDENCE: exit=0; shell=powershell; cwd=C:\Users\Usuario\.gemini\antigravity\scratch\amofisio\linktree amofisio; EXPECT=matched; commit 2e94efb sincronizado com origin main; status=VERIFICACAO_GIT_OK
