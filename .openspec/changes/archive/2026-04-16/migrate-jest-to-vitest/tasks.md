# Tasks: Migrar de Jest para Vitest

## Pré-condições
- [x] Spec aprovada
- [x] Design aprovado

## Tarefas

### Fase 1: Instalação e Remoção de Dependências
- [x] Task 1.1: Remover Jest (`npm uninstall jest ts-jest jest-environment-jsdom @types/jest`)
- [x] Task 1.2: Instalar Vitest (`npm install --save-dev vitest @vitest/ui @vitest/coverage-v8`)
- [x] Task 1.3: Verificar package.json (remover scripts Jest, adicionar scripts Vitest)

### Fase 2: Configuração
- [x] Task 2.1: Criar `vitest.config.ts`
- [x] Task 2.2: Atualizar `tests/setup.ts` (vi.fn, @vitest/jest-dom)
- [x] Task 2.3: Remover `jest.config.js`

### Fase 3: Atualização de Testes Unitários
- [x] Task 3.1: Atualizar `tests/unit/lib/utils.test.ts`
- [x] Task 3.2: Atualizar `tests/unit/lib/whatsapp.test.ts`
- [x] Task 3.3: Atualizar `tests/unit/context/cart-context.test.tsx`

### Fase 4: Documentação
- [x] Task 4.1: Atualizar `tests/AGENTS.md` (já tinha sido feito)
- [x] Task 4.2: Atualizar `lib/AGENTS.md` (não tinha referências a Jest)
- [x] Task 4.3: Atualizar `.openspec/specs/menulink-quality-rules.md` (Jest → Vitest)
- [x] Task 4.4: Atualizar `.openspec/specs/menulink-unit-tests-checklist.md` (jest.fn → vi.fn, scripts atualizados)
- [x] Task 4.5: Atualizar `.openspec/specs/menulink-technical-plan.md` (não tinha referências a Jest)
- [x] Task 4.6: Atualizar `README.md` (não tinha referências a Jest)

### Fase 5: Verificação
- [x] Task 5.1: Executar `npm run test:unit` - verificar que passa ✅ (29 testes)
- [x] Task 5.2: Executar `npm run test:coverage` - verificar coverage ≥80% ✅ (93.65%)
- [x] Task 5.3: Executar `npm run lint` - verificar que passa ✅ (0 errors)
- [x] Task 5.4: Executar `npm run build` - verificar que passa ✅

## Resumo das Mudanças

### Removido
- `jest`
- `ts-jest`
- `jest-environment-jsdom`
- `@types/jest`

### Adicionado
- `vitest` ^4.1.4
- `@vitest/ui` ^4.1.4
- `@vitest/coverage-v8` ^4.1.4

### Atualizado
- `tests/setup.ts` - jest-dom → @vitest/jest-dom, jest.fn → vi.fn
- `tests/unit/*.test.ts` - imports e sintaxe atualizados
- `vitest.config.ts` criado
- `jest.config.js` removido
- `package.json` scripts atualizados

### Documentação Atualizada
- `tests/AGENTS.md` - referências a Vitest
- `.openspec/specs/menulink-quality-rules.md` - Jest → Vitest
- `.openspec/specs/menulink-unit-tests-checklist.md` - jest.fn → vi.fn, scripts atualizados

## Progresso

██████████ 100%

## Status

Concluído

## Notas

- Playwright E2E não é afetado (@playwright/test é separado)
- Manter mesma funcionalidade de testes
- Coverage deve permanecer ≥80% ✅ (93.65%)