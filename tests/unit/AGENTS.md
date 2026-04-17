# Testes Unitários - MenuLink

## Visão Geral

Módulo de testes unitários do projeto MenuLink. Responsável por garantir que cada unidade de código (funções, hooks, utilitários, componentes) funcione corretamente de forma isolada.

**Framework**: Vitest
**Padrão de linguagem**: BDD (describe/it/expect)
**Meta de cobertura**: ≥ 80%

---

## Estrutura de Diretórios

```
tests/unit/
├── AGENTS.md          # Este arquivo
├── utils.test.ts      # Testes para lib/utils.ts
├── context/           # Testes de contexto (ex: CartContext)
│   └── cart-context.test.tsx
└── lib/               # Testes de utilitários e serviços
    └── whatsapp.test.ts
```

---

## Padrões de Teste

### Estrutura describe/it

```typescript
describe('NomeDoModulo', () => {
  describe('quando [condição]', () => {
    it('então [comportamento esperado]', () => {
      expect(resultado).toBe(esperado)
    })
  })
})
```

### Exemplo Real

```typescript
import { describe, it, expect } from 'vitest'
import { formatarPreco } from '@/lib/utils'

describe('formatarPreco', () => {
  describe('quando recebe um número válido', () => {
    it('então deve formatar como BRL', () => {
      expect(formatarPreco(29.90)).toBe('R$ 29,90')
    })
  })
})
```

---

## Estratégia de Mock/Stub

### Mock de Funções

```typescript
import { vi } from 'vitest'

it('deve chamar mock quando ação ocorre', () => {
  const mockCallback = vi.fn()
  // ...
  expect(mockCallback).toHaveBeenCalledWith('argumento')
})
```

### Stub de Módulos

```typescript
vi.mock('@/lib/supabase/client', () => ({
  createBrowserClient: vi.fn(() => mockClient)
}))
```

---

## Cobertura Mínima

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura de linhas | ≥ 80% | Alta |
| Cobertura de branches | ≥ 70% | Alta |
| Funções testadas | 100% públicas | Média |

### Comandos

```bash
npm run test:unit              # Executar testes unitários
npm run test:unit -- --coverage # Com cobertura
npm run test:watch             # Modo watch
```

---

## Uso

```bash
# Executar todos os testes unitários
npm run test:unit

# Executar com coverage
npm run test:coverage

# Modo watch durante desenvolvimento
npm run test:watch
```

---

## Métricas de Qualidade

| Métrica | Target | Atual |
|---------|--------|-------|
| Cobertura | ≥ 80% | - |
| Testes passando | 100% | - |
| Tempo de execução | < 30s | - |

---

**Versão**: 1.0
**Última Atualização**: 2026-04-17