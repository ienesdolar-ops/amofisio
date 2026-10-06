# Gates: Barrinha Única Unificada com Meta Interna no Relatório

OWNS: app.js, style.css, GATES.md

Scope: Substituir as barras fragmentadas por uma barra única, ampla e ultra-visível por curso, com a linha/marcador de meta mínima de confirmação desenhada DENTRO da barra; preenchimento verde vibrante ao atingir/ultrapassar a meta; manter status cancelado de São José dos Campos; sincronizar com o GitHub.

- [x] G1: Validar a estrutura da barra única unificada com meta interna nos scripts de teste
  CHECK: node scripts/verify-unified-bar.mjs
  EXPECT: VERIFICACAO_BARRA_UNIFICADA_OK
  EVIDENCE: Concluído com êxito (classes CSS validadas, altura de 28px, renderização de meta interna calculada em relação à capacidade total e gradiente verde vibrante confirmados).

- [x] G2: Validar persistência do status de cancelamento de São José dos Campos no painel administrativo e ocultação pública
  CHECK: node scripts/verify-sjc-cancelled.mjs
  EXPECT: VERIFICACAO_SJC_CANCELLED_OK
  EVIDENCE: Concluído com êxito (SJC oculto no linktree público e exibido como cancelado pelo franqueado no painel admin).

- [x] G3: Validar integridade geral dos dados, limites manuais e ordenação A-Z
  CHECK: node scripts/verify-integrity.mjs
  EXPECT: TODOS_TESTES_INTEGRIDADE_OK
  EVIDENCE: Concluído com êxito (ordenação alfabética A-Z, capacidades e limites manuais preservados).

- [x] G4: Confirmar envio das atualizações para o repositório remoto no GitHub
  CHECK: node scripts/verify-git.mjs
  EXPECT: VERIFICACAO_GIT_OK
