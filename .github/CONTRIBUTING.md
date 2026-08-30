# Diretrizes de Contribuição e Padrão de Engenharia

## 🚨 Regra Absoluta para Agentes de IA e Desenvolvedores
1. **Nenhuma tarefa é iniciada sem uma Issue.** Toda correção, melhoria ou nova funcionalidade deve ter uma Issue aberta no GitHub.
2. **Trabalho via Branches e PRs.** Nunca faça commit direto na `main` ou `develop`. Crie uma branch com o formato `feat/nome-da-feature` ou `fix/nome-do-bug`.
3. **Descrição do PR.** Todo Pull Request deve mencionar a Issue correspondente (ex: "Closes #12") e descrever as alterações técnicas.
4. **Testes em Staging.** O deploy e validação devem ocorrer primeiro na branch `develop` (ambiente de staging). O merge para `main` (produção) só ocorre após validação explícita.

## 🛠️ Stack de Qualidade
- **Lint/Format:** Biome (substituindo ESLint/Prettier).
- **Observabilidade:** Sentry para rastreamento de erros em produção.
- **Testes:** Jest (Unit/Integration) e Playwright (E2E).

## 🎨 Motion Principles (Frontend)
- Utilizar `framer-motion` para transições de entrada/saída.
- Implementar Skeletons durante estados de `loading`.
- Garantir lazy loading de rotas e componentes pesados.