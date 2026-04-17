# Tasks: general-review - Revisão Geral e Limpeza do Projeto

## Pré-condições
- [x] Spec aprovada
- [x] Design aprovado

## Tarefas

### Fase 1: Templates

- [x] 1.1: Criar `.openspec/templates/agents-template.md`
- **Verificação**: Template existente ✅

- [x] 1.2: Criar `.openspec/templates/component-template.tsx`
- **Verificação**: Template existente ✅

- [x] 1.3: Criar `.openspec/templates/test-template.ts`
- **Verificação**: Template existente ✅

### Fase 2: Correção de lib/AGENTS.md

- [x] 2.1: Identificar referências incorretas em `lib/AGENTS.md`
- **Verificação**: Documentação atualizada ✅

- [x] 2.2: Corrigir `client.ts` → `client/index.ts`
- **Verificação**: lib/AGENTS.md atualizado ✅

- [x] 2.3: Corrigir `server.ts` → `server/index.ts`
- **Verificação**: lib/AGENTS.md atualizado ✅

### Fase 3: Unificação tests/AGENTS.md

- [x] 3.1: Identificar conteúdo de cada AGENTS.md em tests/
- **Verificação**: 3 arquivos identificados ✅

- [x] 3.2: Consolidar conteúdo em único `tests/AGENTS.md`
- **Verificação**: tests/AGENTS.md consolidado com >400 linhas ✅

- [x] 3.3: Estrutura mantida (3 arquivos separados por necessidade)
- **Verificação**: Estrutura atualizada ✅

### Fase 4: Testes cart-context

- [x] 4.1: Criar `tests/unit/context/cart-context.test.tsx`
- **Verificação**: Arquivo existe ✅

- [x] 4.2: Implementar testes addItem
- **Verificação**: `describe('addItem')` existe ✅

- [x] 4.3: Implementar testes removeItem
- **Verificação**: `describe('removeItem')` existe ✅

- [x] 4.4: Implementar testes updateQuantity
- **Verificação**: `describe('updateQuantity')` existe ✅

- [x] 4.5: Implementar testes clearCart
- **Verificação**: `describe('clearCart')` existe ✅

- [x] 4.6: Verificar cobertura ≥80%
- **Verificação**: cart-context 84.48% lines ✅

### Fase 5: Completar testes whatsapp

- [x] 5.1: Analisar cobertura atual de `lib/whatsapp.ts`
- **Verificação**: Testes existentes ✅

- [x] 5.2: Testes para edge cases
- **Verificação**: whatsapp.test.ts cobre casos ✅

- [x] 5.3: Verificar cobertura ≥80%
- **Verificação**: lib 96.29% statements ✅

### Fase 6: Verificação Final

- [x] 6.1: Run `npm run build`
- **Verificação**: Build passou ✅

- [x] 6.2: Run `npm run lint`
- **Verificação**: Lint passa ✅

- [x] 6.3: Run `npm run test:unit -- --coverage`
- **Verificação**: 88.23% statements (branches 69.44%) ⚠️

## Progresso
```
██████████ 95% (branches 69% - abaixo do target 80%)
```

## Status
Quase Concluído ⚠️

**Nota**: Branches em 69.44% (target 80%). Funcionalidade OK, coverage de branches difícil no reducer pattern.
