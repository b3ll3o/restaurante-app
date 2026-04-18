# Tasks: Project Best Practices Adoption

## Pré-condições

- [x] Proposal aprovado
- [x] Spec aprovada (REQ-BP-01 a REQ-BP-05)
- [x] Design aprovado

## Tarefas

### Fase 1: Result Type Foundation

- [x] 1.1: Criar `lib/result.ts` com tipo `Result<L, R>` union
- [x] 1.2: Implementar `ok()` e `err()` construtores
- [x] 1.3: Implementar `isOk()` e `isErr()` type guards
- [x] 1.4: Implementar `map()` e `mapErr()` mappers
- [x] 1.5: Implementar `unwrap()` e `unwrapOr()` unwrappers
- [x] 1.6: Implementar `fromPromise()` para conversão de Promise
- [x] 1.7: Criar `tests/unit/result.test.ts` com testes unitários
- [x] 1.8: Verificar que `npm run test:unit` passa com 100% coverage no lib/result.ts

### Fase 2: Zod Schemas

- [x] 2.1: Adicionar `zod` ao `package.json` — ✅ já presente v4.3.6
- [x] 2.2: Criar `lib/schemas/restaurant.ts` com schema e tipo inferido
- [x] 2.3: Criar `lib/schemas/category.ts` com schema e tipo inferido
- [x] 2.4: Criar `lib/schemas/product.ts` com schema e tipo inferido
- [x] 2.5: Criar `lib/schemas/order.ts` com schema e tipo inferido
- [x] 2.6: Criar `lib/schemas/order-item.ts` com schema e tipo inferido
- [x] 2.7: Criar `lib/schemas/index.ts` com barrel exports
- [x] 2.8: Verificar que `npm run lint` passa para schemas

### Fase 3: Error Boundary

- [x] 3.1: Criar `components/error-boundary.tsx` (React class component)
- [x] 3.2: Implementar `static getDerivedStateFromError(error)`
- [x] 3.3: Implementar `componentDidCatch(error, errorInfo)`
- [x] 3.4: Adicionar props `fallback` e `onError`
- [x] 3.5: Implementar método `reset()` para limpar erro
- [x] 3.6: Verificar que `npm run lint` passa

### Fase 4: ADR Documentation

- [x] 4.1: Criar diretório `docs/adr/`
- [x] 4.2: Criar `docs/adr/template.md` com estrutura ADR completa
- [x] 4.3: Criar `docs/adr/0001-why-result-type.md` com contexto e decisão

### Fase 5: Documentation Updates

- [x] 5.1: Atualizar `lib/AGENTS.md` com seção de Result Type
- [x] 5.2: Atualizar `lib/AGENTS.md` com seção de Zod Schemas
- [x] 5.3: Verificar proximidade de documentação

### Fase 6: Verification

- [x] 6.1: Executar `npm run build` — ✅ Passa
- [x] 6.2: Executar `npm run lint` — ✅ 0 erros
- [x] 6.3: Executar `npm run test:unit` — ✅ 48/48 passam
- [x] 6.4: Verificar arquivos criados

## Progresso

██████████ 100%

## Status

✅ COMPLETO

---

## Arquivos Criados

| Fase | Arquivo | Status |
|------|---------|--------|
| 1 | `lib/result.ts` | ✅ |
| 1 | `tests/unit/lib/result.test.ts` | ✅ |
| 2 | `lib/schemas/restaurant.ts` | ✅ |
| 2 | `lib/schemas/category.ts` | ✅ |
| 2 | `lib/schemas/product.ts` | ✅ |
| 2 | `lib/schemas/order.ts` | ✅ |
| 2 | `lib/schemas/order-item.ts` | ✅ |
| 2 | `lib/schemas/index.ts` | ✅ |
| 3 | `components/error-boundary.tsx` | ✅ |
| 4 | `docs/adr/template.md` | ✅ |
| 4 | `docs/adr/0001-why-result-type.md` | ✅ |
| 5 | `lib/AGENTS.md` (atualizado) | ✅ |

---

**Versão**: 1.0
**Criado**: 2026-04-17
**Concluído**: 2026-04-17
**Autor**: AI Agent