# Spec: Migrar de Jest para Vitest

## Fonte da Verdade

Este documento é parte das especificações do MenuLink, derivado do PRD.md.

## Requisitos

### REQ-VITEST-001: Instalação de Dependências

O sistema **DEVE** instalar as seguintes dependências:
- `vitest` ^2.0.0
- `@vitest/ui` ^2.0.0
- `@vitest/coverage-v8` ^2.0.0

### REQ-VITEST-002: Remoção de Dependências Jest

O sistema **DEVE** remover as seguintes dependências:
- `jest`
- `ts-jest`
- `jest-environment-jsdom`
- `@types/jest`

### REQ-VITEST-003: Configuração Vitest

O sistema **DEVE** criar `vitest.config.ts` com:
- Plugin React para Vite
- Ambiente jsdom
- Setup files (`tests/setup.ts`)
- Cobertura com v8 (threshold 80%)
- Mapeamento de módulos (@/)

### REQ-VITEST-004: Atualização de Setup

O sistema **DEVE** atualizar `tests/setup.ts`:
- Importar `@vitest/jest-dom` em vez de `@testing-library/jest-dom`
- Manter mocks existentes (Next.js router, Supabase, localStorage)
- Usar `vi` em vez de `jest` para mocks

### REQ-VITEST-005: Atualização de Scripts npm

O sistema **DEVE** atualizar `package.json` scripts:
- `test`: `vitest`
- `test:unit`: `vitest --run --testPathPattern=unit`
- `test:integration`: `vitest --run --testPathPattern=integration`
- `test:coverage`: `vitest --run --coverage`
- `test:watch`: `vitest --watch`

### REQ-VITEST-006: Atualização de Testes

O sistema **DEVE** atualizar todos os arquivos de teste:
- Substituir `import { describe, it, expect } from '@jest/globals'` por `import { describe, it, expect } from 'vitest'`
- Substituir `jest.fn()` por `vi.fn()`
- Substituir `jest.spyOn` por `vi.spyOn`
- Substituir `afterEach(() => { jest.clearAllMocks() })` por `afterEach(() => { vi.clearAllMocks() })`

### REQ-VITEST-007: Documentação Atualizada

O sistema **DEVE** atualizar toda documentação que referencia Jest:
- `tests/AGENTS.md`
- `lib/AGENTS.md` (seção de testes)
- `.openspec/specs/menulink-quality-rules.md`
- `.openspec/specs/menulink-unit-tests-checklist.md`
- `README.md` (seção de testes)

### REQ-VITEST-008: Verificação de Funcionamento

O sistema **DEVE** verificar:
- `npm run test:unit` executa com sucesso
- `npm run test:coverage` gera relatório
- `npm run test:watch` funciona em modo watch
- Cobertura ≥80%

## Critérios de Aceitação

### CA-VITEST-001: Dependências

- [ ] Vitest instalado (vitest, @vitest/ui, @vitest/coverage-v8)
- [ ] Jest desinstalado (jest, ts-jest, jest-environment-jsdom, @types/jest)
- [ ] package.json não contém "jest" em scripts ou dependências

### CA-VITEST-002: Configuração

- [ ] `vitest.config.ts` existe e está correto
- [ ] `tests/setup.ts` usa importações do Vitest
- [ ] Scripts npm atualizados

### CA-VITEST-003: Testes

- [ ] `tests/unit/lib/utils.test.ts` - atualizado
- [ ] `tests/unit/lib/whatsapp.test.ts` - atualizado
- [ ] `tests/unit/context/cart-context.test.tsx` - atualizado
- [ ] Todos os testes passam

### CA-VITEST-004: Documentação

- [ ] `tests/AGENTS.md` - Jest substituído por Vitest
- [ ] `.openspec/specs/menulink-quality-rules.md` - atualizado
- [ ] `.openspec/specs/menulink-unit-tests-checklist.md` - atualizado

### CA-VITEST-005: Cobertura

- [ ] Coverage ≥80%
- [ ] Relatório de coverage gerado

## Dependências

- PRD.md (especifica Vitest como stack)
- menulink-quality-rules.md (cobertura ≥80%)

## Restrições

- Playwright E2E **NÃO DEVE** ser afetado (usa @playwright/test, não Jest)
- Funcionalidade existente **DEVE** ser mantida

## Status

Especificação