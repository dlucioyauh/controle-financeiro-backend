## 📋 Descrição

<!-- Descreva brevemente o que este PR faz e por que é necessário -->



## 🎯 Tipo de Mudança

- [ ] 🐛 Bug fix (mudança que corrige um problema)
- [ ] ✨ Nova feature (mudança que adiciona funcionalidade)
- [ ] 💥 Breaking change (mudança que pode quebrar funcionalidades existentes)
- [ ] 📝 Documentação
- [ ] ♻️ Refatoração
- [ ] 🔒 Segurança

## 🔍 Checklist de Qualidade

### Código
- [ ] O código segue o padrão do projeto (lint passa sem erros)
- [ ] TypeScript strict mode respeitado (zero `any`)
- [ ] Nenhum `console.log` deixado no código (usar Logger do NestJS)
- [ ] Funções com responsabilidade única (< 50 linhas quando possível)

### Banco de Dados
- [ ] Migration criada (se houver alteração de schema)
- [ ] Migration possui `up` e `down`
- [ ] Compatível com dados existentes (não destrutiva)
- [ ] `synchronize: false` em produção
- [ ] Índices adicionados quando necessário

### Segurança
- [ ] Autenticação validada (JWT)
- [ ] Autorização validada (usuário só acessa seus próprios dados)
- [ ] DTOs com `class-validator` (whitelist: true)
- [ ] Rate limiting em endpoints sensíveis
- [ ] Nenhum secret em código ou logs
- [ ] Proteção contra SQL injection, IDOR, mass assignment

### Valores Monetários
- [ ] Usando `NUMERIC(15,2)` no banco (não float)
- [ ] Arredondamento explícito e determinístico
- [ ] Testes com casos de borda (0, 0.01, valores grandes)

### API
- [ ] Contratos de API preservados (sem breaking changes silenciosos)
- [ ] Códigos HTTP corretos (200, 201, 400, 401, 403, 404, 500)
- [ ] Validação de entrada no backend (nunca confiar no frontend)
- [ ] Tratamento de erros padronizado

### Testes
- [ ] Testes unitários para regras de negócio
- [ ] Testes de integração para endpoints críticos
- [ ] Casos de teste para valores monetários
- [ ] Testado manualmente no ambiente de Staging

## 📊 Impacto

- **Módulos afetados:** 
- **Breaking Change:** SIM / NÃO
- **Risco:** BAIXO / MÉDIO / ALTO / CRÍTICO
- **Migration necessária:** SIM / NÃO
- **Env vars novas:** SIM / NÃO (listar abaixo se SIM)

## 🧪 Como Testar

<!-- Descreva os passos para validar esta mudança -->

1. 
2. 
3. 

## ⚠️ Riscos e Mitigações

<!-- Liste possíveis riscos e como foram mitigados -->

- **Risco:** 
  - **Mitigação:** 

## ✅ Production Readiness

- [ ] Security: PASS / FAIL
- [ ] Database: PASS / FAIL / N/A
- [ ] Migration: PASS / FAIL / N/A
- [ ] Tests: PASS / FAIL
- [ ] Lint: PASS / FAIL
- [ ] Typecheck: PASS / FAIL
- [ ] Build: PASS / FAIL
- [ ] Observability: PASS / FAIL / N/A

**Aprovado para merge:** SIM / NÃO
