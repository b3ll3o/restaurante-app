# Types/Order - PediAi

## Visão Geral

O módulo **Order** contém as definições TypeScript das entidades `Order` e `OrderItem`, que representam respectivamente um pedido realizado por um cliente e os itens individuais desse pedido.

**Idioma**: Português Brasileiro (pt-BR)  
**Stack**: TypeScript (strict mode)  
**Módulo Pai**: `types/AGENTS.md`

---

## Estrutura de Diretórios

```
types/
├── index.ts          # Definições centrais (Order, OrderItem)
└── order/
    └── AGENTS.md     # Documentação detalhada (este arquivo)
```

---

## Interfaces e Types

### Order

Representa um pedido realizado por um cliente.

```typescript
interface Order {
  id: string;
  restaurant_id: string;
  customer_name: string;
  customer_whatsapp: string;
  total: number;
  status: "pending" | "confirmed" | "cancelled";
  payment_method: "pix" | "cash" | null;
  created_at: string;
}
```

#### Campos

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `string` | Identificador único do pedido (UUID) |
| `restaurant_id` | `string` | ID do restaurante dono do pedido |
| `customer_name` | `string` | Nome do cliente que fez o pedido |
| `customer_whatsapp` | `string` | Número WhatsApp do cliente |
| `total` | `number` | Valor total do pedido (soma dos itens) |
| `status` | `OrderStatus` | Status atual do pedido |
| `payment_method` | `PaymentMethod \| null` | Método de pagamento chosen |
| `created_at` | `string` | Data/hora de criação (ISO 8601) |

---

### OrderItem

Representa um item individual dentro de um pedido.

```typescript
interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  total_price: number;
}
```

#### Campos

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `string` | Identificador único do item (UUID) |
| `order_id` | `string` | ID do pedido ao qual este item pertence |
| `product_id` | `string` | ID do produto original (para referência) |
| `product_name` | `string` | Nome do produto no momento da compra |
| `unit_price` | `number` | Preço unitário no momento da compra |
| `quantity` | `number` | Quantidade solicitada |
| `total_price` | `number` | `unit_price * quantity` |

---

## Status do Pedido

| Status | Descrição | Transições válidas |
|--------|-----------|-------------------|
| `pending` | Pedido aguarda confirmação | → `confirmed`, → `cancelled` |
| `confirmed` | Pedido confirmado pelo restaurante | → `cancelled` |
| `cancelled` | Pedido cancelado | Estado final |

### Máquina de Estados

```
  pending
  ┌──────┐    ┌──────────┐
  │      │───▶│ confirmed│
  │      │    └──────────┘
  │      │
  │      │    ┌──────────┐
  └──┬───┴───▶│ cancelled│
     │         └──────────┘
     │
     └─────────────▶ (sem transição de volta)
```

---

## Uso

### Exemplo: Criar um pedido

```typescript
import type { Order, OrderItem } from '@/types';

const novoPedido: Order = {
  id: crypto.randomUUID(),
  restaurant_id: 'rest_123',
  customer_name: 'Maria Silva',
  customer_whatsapp: '5511999999999',
  total: 45.90,
  status: 'pending',
  payment_method: 'pix',
  created_at: new Date().toISOString(),
};

const itemPedido: OrderItem = {
  id: crypto.randomUUID(),
  order_id: novoPedido.id,
  product_id: 'prod_456',
  product_name: 'X-Burger',
  unit_price: 25.90,
  quantity: 1,
  total_price: 25.90,
};
```

### Exemplo: Calcular total do pedido

```typescript
function calcularTotalPedido(itens: OrderItem[]): number {
  return itens.reduce((soma, item) => soma + item.total_price, 0);
}
```

### Exemplo: Atualizar status do pedido

```typescript
type OrderStatus = 'pending' | 'confirmed' | 'cancelled';

function podeTransicionarStatus(
  statusAtual: OrderStatus,
  novoStatus: OrderStatus
): boolean {
  const transicoes: Record<OrderStatus, OrderStatus[]> = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['cancelled'],
    cancelled: [],
  };
  
  return transicoes[statusAtual].includes(novoStatus);
}
```

---

## Regras de Implementação

1. **REQ-040**: Um pedido PERTENCE a um restaurante (`restaurant_id` obrigatório)
2. **REQ-041**: Um pedido PODE TER zero ou mais itens (`OrderItem`)
3. **REQ-042**: O `total` do pedido DEVE ser a soma dos `total_price` dos itens
4. **REQ-043**: `product_name` e `unit_price` DEVEM ser armazenados no momento da compra (não referenciar Product dinamicamente)
5. **REQ-044**: Status segue máquina de estados: `pending` → `confirmed` / `cancelled`; `confirmed` → `cancelled`
6. **REQ-045**: Pedidos cancelados NÃO podem ter status alterado

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura de tipos | 100% | Crítica |
| Uso de `any` | 0 ocorrências | Crítica |
| Documentação AGENTS.md | Criado | Alta |

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| typescript | ^5 | Linguagem |

---

## Referências

- [TypeScript Handbook - Interfaces](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [TypeScript Handbook - Types](https://www.typescriptlang.org/docs/handbook/2/typescript-types-101.html)
- `opencode/openspec/specs/pediai-specification.md` - Requisitos REQ-040 a REQ-045

---

**Versão**: 1.0  
**Última Atualização**: 2026-04-17  
**Autor**: AI Agent