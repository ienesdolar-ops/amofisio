# Gates: Remoção da Marca D'água "3" do Card Hero

OWNS: index.html, style.css, GATES.md

Scope: Remover o número "3" flutuante (marca d'água de fundo) do card informativo no hero do site; manter o layout limpo com o "21", textos e efeitos de destaque; executar todos os testes de regressão e sincronizar com o GitHub.

- [x] G1: Validar remoção do elemento e da marca d'água "3" do hero card em index.html e scripts de verificação
  CHECK: node scripts/verify-public-hero-card.mjs
  EXPECT: VERIFICACAO_PUBLIC_HERO_CARD_OK
  EVIDENCE: VERIFICACAO_PUBLIC_HERO_CARD_OK (Elemento .hero-info-watermark e texto '3' removidos do HTML e CSS)

- [x] G2: Validar estilos do card hero e classes da área administrativa em style.css
  CHECK: node scripts/verify-recent-ui.mjs
  EXPECT: VERIFICACAO_RECENT_UI_OK
  EVIDENCE: VERIFICACAO_RECENT_UI_OK (Layout consistente e sem classes fantasmas)

- [x] G3: Validar que a lógica de aplicação e abas administrativas operam perfeitamente
  CHECK: node scripts/verify-recent-logic.mjs
  EXPECT: VERIFICACAO_RECENT_LOGIC_OK
  EVIDENCE: VERIFICACAO_RECENT_LOGIC_OK (Sem referências quebradas, filtros funcionais)

- [x] G4: Validar integridade geral do linktree, ordenação A-Z, capacidades e cancelamento SJC
  CHECK: node scripts/verify-integrity.mjs
  EXPECT: TODOS_TESTES_INTEGRIDADE_OK
  EVIDENCE: TODOS_TESTES_INTEGRIDADE_OK (21 unidades ativas em A-Z, SJC cancelada pelo franqueado, metas operacionais)

- [x] G5: Confirmar envio das alterações para o repositório remoto no GitHub
  CHECK: node scripts/verify-git.mjs
  EXPECT: VERIFICACAO_GIT_OK
  EVIDENCE: VERIFICACAO_GIT_OK
