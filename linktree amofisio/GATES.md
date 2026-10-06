# Gates: Barrinha Única Unificada com Meta Interna no Relatório

OWNS: app.js, style.css, GATES.md

Scope: Substituir as barras fragmentadas por uma barra única, ampla e ultra-visível por curso, com a linha/marcador de meta mínima de confirmação desenhada DENTRO da barra; preenchimento verde vibrante ao atingir/ultrapassar a meta; manter status cancelado de São José dos Campos; sincronizar com o GitHub.

- [x] G1: Validar a estrutura da barra única unificada com meta interna nos scripts de teste
  CHECK: node scripts/verify-unified-bar.mjs
  EXPECT: VERIFICACAO_BARRA_UNIFICADA_OK
  EVIDENCE: Passou com sucesso. Barra única com altura de 28px, gradiente verde esmeralda vibrante (#059669 -> #10B981 -> #34D399), marcador interno com agulha e flag "Meta: X" posicionado em (min/cap)*100%.

- [x] G2: Validar persistência do status de cancelamento de São José dos Campos no painel administrativo e ocultação pública
  CHECK: node scripts/verify-sjc-cancelled.mjs
  EXPECT: VERIFICACAO_SJC_CANCELLED_OK
  EVIDENCE: Passou com sucesso. São José dos Campos permanece 100% oculto do Linktree público e marcado com badge e banner de cancelado pelo franqueado no painel administrativo.

- [x] G3: Validar integridade geral dos dados, limites manuais e ordenação A-Z
  CHECK: node scripts/verify-integrity.mjs
  EXPECT: TODOS_TESTES_INTEGRIDADE_OK
  EVIDENCE: Passou com sucesso. Cursos ordenados alfabeticamente A-Z em cada unidade, contagens de inscritos e capacidades manuais do usuário preservadas com precisão.

- [x] G4: Confirmar envio das atualizações para o repositório remoto no GitHub
  CHECK: node scripts/verify-git.mjs
  EXPECT: VERIFICACAO_GIT_OK
  EVIDENCE: Commit 461c40f enviado com sucesso para a branch main do GitHub (https://github.com/ienesdolar-ops/amofisio.git).
