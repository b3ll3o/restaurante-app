# Proposta: Migrar de Jest para Vitest

## Problema

O projeto MenuLink atualmente utiliza **Jest** como test runner, porém:

1. **Performance**: Vitest é 10-20x mais rápido que Jest em projetos TypeScript/ESM
2. **Compatibilidade**: Vitest tem suporte nativo a ESM e TypeScript sem configuração adicional
3. **Compatibilidade com Next.js 16**: Jest requer workarounds para Next.js 16 (ts-jest, jest-environment-jsdom)
4. **Modernidade**: Vitest é mais moderno e mantémpar com a stack (Next.js 16.2.3, React 19)
5. **PRD.md recomenda**: O documento PRD.md já especifica Vitest como stack recomendada

## Solução Proposta

Migrar toda a infraestrutura de testes de Jest para Vitest:

1. Substituir `jest.config.js` por `vitest.config.ts`
2. Substituir `@testing-library/jest-dom` por matchers nativos do Vitest
3. Atualizar scripts npm (test, test:unit, test:integration, test:coverage)
4. Atualizar `tests/setup.ts` para configuração Vitest
5. Atualizar toda documentação que referencia Jest → Vitest
6. Manter compatibilidade com Playwright E2E (não afetado)

## Impacto

- [ ] Breaking changes? **Sim** - muda runtime de testes
- [ ] Migração necessária? **Sim** - arquivos de configuração e setup
- [ ] Novos dependencies? **Sim** - vitest, @vitest/ui, @vitest/coverage-v8
- [ ] Remoção de dependencies? **Sim** - jest, ts-jest, jest-environment-jsdom

## Alternativas Consideradas

1. **Manter Jest** - Decisão anterior foi baseada em "já está configurado", mas o PRD.md recomenda Vitest
2. **Migrar para Jest + Jest 30** - Ainda não existe, Jest está estagnado

## Urgência

- [ ] Crítica
- [x] Alta - PRD.md já especifica Vitest como stack
- [ ] Média
- [ ] Baixa

## Status

Proposta