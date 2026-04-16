# Tasks: Estratégia de Automação de Testes Full-Stack

## Pré-condições

- [x] Spec aprovada
- [x] Design aprovado

## Tarefas

### Fase 1: Infraestrutura (Parcialmente Completo)

- [x] Task 1.1: Jest configurado ✅ (jest.config.js existe)
- [x] Task 1.2: tests/setup.ts existe ✅
- [x] Task 1.3: tests/unit/utils.test.ts existe ✅
- [ ] Task 1.4: Criar playwright.config.ts
- [ ] Task 1.5: Scripts npm verificados ✅ (package.json tem test, test:unit, etc.)

### Fase 2: Testes Unitários

- [x] Task 2.1: tests/unit/lib/utils.test.ts ✅ (existe)
- [x] Task 2.2: tests/unit/lib/whatsapp.test.ts ✅ (criado)
- [x] Task 2.3: tests/unit/context/cart-context.test.tsx ✅ (criado)
- [x] Task 2.4: Executar `npm run test:unit` e verificar cobertura ≥80% ✅ (29 testes, 94.73% coverage)

### Fase 3: Testes de Integração

- [ ] Task 3.1: Criar tests/integration/api/orders.test.ts
- [ ] Task 3.2: Executar `npm run test:integration`

### Fase 4: Testes E2E

- [x] Task 4.1: Criar playwright.config.ts ✅
- [x] Task 4.2: Criar tests/e2e/support/page-objects/ ✅
- [x] Task 4.3: Criar tests/e2e/admin/login.spec.ts ✅
- [x] Task 4.4: Criar tests/e2e/public/checkout.spec.ts ✅
- [ ] Task 4.5: Executar `npm run test:e2e` (requer ambiente configurado)

### Fase 5: CI/CD

- [x] Task 5.1: Criar .github/workflows/test.yml ✅
- [ ] Task 5.2: Testar pipeline (requer GitHub Actions)

### Fase 6: Documentação

- [ ] Task 6.1: Atualizar PROGRESS.md
- [ ] Task 6.2: Atualizar menulink-unit-tests-checklist.md

## Progresso

██░░░░░░░░ 15%

## Status

Em andamento

## Notas

- **Decisão**: Manter Jest (já configurado) em vez de Vitest
- Infraestrutura básica já existe (jest.config.js, setup.ts, utils.test.ts)
- Foco agora: criar mais testes e configurar Playwright E2E

## Como testar manualmente

```bash
# Testes unitários (já devem passar)
npm run test:unit

# Testes com coverage
npm run test:coverage

# Testes E2E (requer playwright.config.ts)
npm run test:e2e

# Todos os testes
npm test
```