# Gates: Limpeza de Dados Simulados e Suporte Autêntico a Inscrições Recentes

OWNS: data.js, index.html, style.css, app.js, GATES.md

Scope: Remover 100% de quaisquer dados simulados ou fictícios de inscrições recentes, mantendo recentRegistrations estritamente vazio ([]) até a chegada de inscrições verdadeiras; respeitar a privacidade dos alunos (sem inventar nomes ou violar LGPD); implementar empty states informativos no painel admin e ocultar banner público na ausência de inscrições reais; sincronizar com o GitHub.

- [x] G1: Validar que data.js não contém nomes fictícios e que a lista está vazia para receber apenas inscrições verdadeiras
  CHECK: node scripts/verify-recent-registrations.mjs
  EXPECT: VERIFICACAO_RECENT_REGISTRATIONS_OK
  EVIDENCE: Passou com sucesso. Nomes simulados ("Mariana S.", "Lucas M.", etc.) removidos completamente. recentRegistrations está definido como [] (vazio) aguardando registros autênticos.

- [x] G2: Validar elementos de interface e estilos do feed e modal de últimas inscrições
  CHECK: node scripts/verify-recent-ui.mjs
  EXPECT: VERIFICACAO_RECENT_UI_OK
  EVIDENCE: Passou com sucesso. Estrutura HTML e CSS mantida para renderização dinâmica e suporte a empty states.

- [x] G3: Validar lógica de renderização, empty state transparente e ocultação de banner público sem dados em app.js
  CHECK: node scripts/verify-recent-logic.mjs
  EXPECT: VERIFICACAO_RECENT_LOGIC_OK
  EVIDENCE: Passou com sucesso. Sintaxe limpa, empty state honesto exibido no admin ("Aguardando Novas Inscrições") e botão público oculto quando não há inscrições a mostrar.

- [x] G4: Validar integridade geral do linktree, ordenação A-Z, capacidades e cancelamento SJC
  CHECK: node scripts/verify-integrity.mjs
  EXPECT: TODOS_TESTES_INTEGRIDADE_OK
  EVIDENCE: Passou com sucesso. 22 cidades ativas em ordem A-Z, São José dos Campos mantida cancelada e oculta do público, integridade total.

- [x] G5: Confirmar envio das atualizações para o repositório remoto no GitHub
  CHECK: node scripts/verify-git.mjs
  EXPECT: VERIFICACAO_GIT_OK
