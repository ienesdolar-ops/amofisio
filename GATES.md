# Gates: Card Informativo no Hero e Remoção de Inscrições em Tempo Real da Área Pública

OWNS: index.html, style.css, app.js, GATES.md

Scope: Adicionar card informativo fiel ao print (21 cidades com AmoFisio presencial, de 23 a 31/10 com número 21 em destaque cyan) na área de hero/menu do site; remover permanentemente o botão de "Inscrições em Tempo Real" e modal público da página pública para os alunos; manter a aba de últimas inscrições exclusiva no painel administrativo com dados reais; sincronizar com o GitHub.

- [x] G1: Validar presença do card informativo de cidades e datas no hero e remoção do banner/modal público de inscrições em index.html
  CHECK: node scripts/verify-public-hero-card.mjs
  EXPECT: VERIFICACAO_PUBLIC_HERO_CARD_OK
  EVIDENCE: VERIFICACAO_PUBLIC_HERO_CARD_OK (Card .hero-event-info-card renderizado com "21", "cidades com AmoFisio presencial, de 23 a 31/10" e marca d'água "3"; btn-public-recent e modal-recent-registrations removidos)

- [x] G2: Validar estilos do card informativo e classes exclusivas no painel admin em style.css
  CHECK: node scripts/verify-recent-ui.mjs
  EXPECT: VERIFICACAO_RECENT_UI_OK
  EVIDENCE: VERIFICACAO_RECENT_UI_OK (Estilos do card hero e classes da aba admin verificados com sucesso)

- [x] G3: Validar que app.js não referencia gatilhos do modal público removido e preserva integridade do feed admin
  CHECK: node scripts/verify-recent-logic.mjs
  EXPECT: VERIFICACAO_RECENT_LOGIC_OK
  EVIDENCE: VERIFICACAO_RECENT_LOGIC_OK (App.js sem referências órfãs do modal público; filtros e renderização do feed admin operando normalmente)

- [x] G4: Validar integridade geral do linktree, ordenação A-Z, capacidades e cancelamento SJC
  CHECK: node scripts/verify-integrity.mjs
  EXPECT: TODOS_TESTES_INTEGRIDADE_OK
  EVIDENCE: TODOS_TESTES_INTEGRIDADE_OK (21 unidades ativas em A-Z, SJC cancelada pelo franqueado, barras e metas preservadas)

- [x] G5: Confirmar envio das atualizações para o repositório remoto no GitHub
  CHECK: node scripts/verify-git.mjs
  EXPECT: VERIFICACAO_GIT_OK
  EVIDENCE: VERIFICACAO_GIT_OK (Commit 0b504b2 enviado para origin/main)
