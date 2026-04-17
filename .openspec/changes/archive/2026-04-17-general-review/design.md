# Design: general-review - Revisão Geral e Limpeza do Projeto

## Decisões de Arquitetura

### 1. Templates Padrão

**Decisão**: Criar templates centralizados em `.openspec/templates/`

**Rationale**: Facilita consistência entre módulos, permite reutilização.

**Opções consideradas**:
- Templates inline nos AGENTS.md - Rejeitado (não reutilizável)
- Templates em wiki/externa - Rejeitado (difícil acesso)
- Templates em `.openspec/templates/` - Escolhido (junto da spec)

### 2. Estrutura de AGENTS.md

**Decisão**: Manter AGENTS.md no nível mais próximo do código (REGRA EXISTENTE)

**Rationale**: Já estabelecido no projeto, seguir o princípio.

### 3. Cobertura de Testes

**Decisão**: Foco em cart-context e whatsapp para atingir 80%

**Rationale**: Estes módulos têm maior risco de regressão e 0% de cobertura atual.

---

## Arquitetura

### Estrutura de Templates

```
.openspec/templates/
├── prd-template.md              # Template PRD (existente)
├── backlog-prd-template.md      # Template PRD de backlog (existente)
├── agents-template.md          # Template AGENTS.md (NOVO)
├── component-template.tsx      # Template componente React (NOVO)
└── test-template.ts           # Template teste (NOVO)
```

### Estrutura de Documentação Consolidada

```
tests/
├── AGENTS.md                   # ÚNICO, consolidado
├── unit/
│   ├── AGENTS.md
│   ├── utils.test.ts
│   ├── context/
│   │   └── cart-context.test.tsx  # NOVO
│   └── lib/
│       └── whatsapp.test.ts
├── integration/
│   └── AGENTS.md
└── e2e/
    └── AGENTS.md
```

---

## Arquivos a Modificar

### Criar

| Arquivo | Descrição |
|---------|-----------|
| `.openspec/templates/agents-template.md` | Template padrão AGENTS.md |
| `.openspec/templates/component-template.tsx` | Template componente React |
| `.openspec/templates/test-template.ts` | Template teste |
| `tests/unit/context/cart-context.test.tsx` | Testes cart-context |
| `tests/unit/lib/whatsapp.test.ts` | Completar testes whatsapp |

### Modificar

| Arquivo | Mudança |
|---------|---------|
| `lib/AGENTS.md` | Corrigir client.ts → client/index.ts |
| `tests/AGENTS.md` | Unificar 3_AGENTS.md em 1 |
| `lib/supabase/client/AGENTS.md` | Atualizar estrutura |
| `lib/supabase/server/AGENTS.md` | Atualizar estrutura |

### Deletar

| Arquivo | Razão |
|---------|-------|
| `tests/unit/AGENTS.md` | Duplicado, consolidado |
| `tests/integration/AGENTS.md` | Duplicado, consolidado |
| `tests/e2e/AGENTS.md` | Duplicado, consolidado |

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| vitest | ^4.1.4 | Test runner |
| @testing-library/react | ^15.0.7 | Testes React |
| @testing-library/user-event | ^14.6.1 | Simular usuário |

---

## Riscos e Mitigações

| Risco | Mitigação |
|-------|-----------|
| Breaking de imports durante correção | Verificar todos os imports antes de mudar |
| Perda de informação durante consolidação | Backup git antes de modificar |
| Testes quebrando | Commits incrementais |

---

## TDD/BDD/ATDD

### TDD (Testes Unitários)

**Foco**: cart-context e whatsapp

```typescript
// Testes a criar para cart-context
describe('CartContext', () => {
  describe('addItem', () => {
    it('should add item to empty cart')
    it('should increment quantity for existing item')
    it('should clear cart when adding from different restaurant')
  })

  describe('removeItem', () => {
    it('should remove one quantity')
    it('should remove item when quantity is 1')
  })

  describe('clearCart', () => {
    it('should remove all items')
    it('should reset restaurantId')
  })
})
```

### BDD (Testes de Integração)

**Foco**: Verificar que AGENTS.md unificado não quebra integração

### ATDD (Testes E2E)

**Foco**: Garantir que mudanças não quebram fluxos críticos

---

## Status

Design
