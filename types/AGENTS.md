# Types - MenuLink

## Visão Geral

O módulo **Types** contém todas as definições de tipos TypeScript do domínio da aplicação MenuLink. Este módulo é fundamental para a type safety em toda a aplicação.

**Idioma**: Português Brasileiro (pt-BR)  
**Stack**: TypeScript (strict mode)

---

## Estrutura de Diretórios

```
types/
├── AGENTS.md          # Visão geral dos tipos (este arquivo)
└── index.ts           # Definições de tipos do domínio
```

---

## Entidades de Domínio

Cada entidade do domínio possui seu próprio arquivo de documentação detalhada.

| Entidade | Descrição | Tipo | Documentação |
|----------|-----------|------|--------------|
| **Restaurant** | Restaurante no sistema | Interface | `types/restaurant/AGENTS.md` (quando existir) |
| **Category** | Categoria de produtos | Interface | `types/category/AGENTS.md` (quando existir) |
| **Product** | Produto/item vendido | Interface | `types/product/AGENTS.md` (quando existir) |
| **Order** | Pedido realizado | Interface | `types/order/AGENTS.md` (quando existir) |
| **OrderItem** | Item individual de pedido | Interface | `types/order-item/AGENTS.md` (quando existir) |
| **CartItem** | Item no carrinho (client-side) | Interface | `types/cart-item/AGENTS.md` (quando existir) |

### Resumo dos Tipos

```typescript
// Restaurant
interface Restaurant {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  owner_whatsapp: string;
  created_at: string;
  updated_at: string;
}

// Category
interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Product
interface Product {
  id: string;
  category_id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Order
type OrderStatus = 'pending' | 'confirmed' | 'cancelled';
type PaymentMethod = 'pix' | 'dinheiro' | 'cartao';

interface Order {
  id: string;
  restaurant_id: string;
  customer_name: string;
  customer_whatsapp: string;
  total: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  created_at: string;
  updated_at: string;
}

// OrderItem
interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  created_at: string;
}

// CartItem
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}
```

---

## Tipos de API (DTOs)

| Tipo | Descrição |
|------|-----------|
| `CreateOrderDTO` | Payload para criar pedido |
| `CreateProductDTO` | Payload para criar produto |
| `UpdateProductDTO` | Payload para atualizar produto |

---

## Tipos de Resposta

| Tipo | Descrição |
|------|-----------|
| `ApiResponse<T>` | Resposta padrão da API |
| `ValidationResult` | Resultado de validação |

---

## Tipos de Autenticação (Supabase)

| Tipo | Descrição |
|------|-----------|
| `User` | Usuário do Supabase Auth |
| `Session` | Sessão autenticada |

---

## Regras de Implementação

1. Cada entidade de domínio individual DEVE ter seu próprio `AGENTS.md` para documentação detalhada
2. Os tipos listados neste arquivo são visões resumidas; documentação completa está nos AGENTS.md específicos
3. TODO novo tipo adicionado DEVE ser documentado aqui e em seu AGENTS.md específico

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura de tipos | 100% | Crítica |
| Uso de `any` | 0 ocorrências | Crítica |
| AGENTS.md por entidade | 100% | Alta |

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| typescript | ^5 | Linguagem |
| @supabase/supabase-js | ^2.103.0 | Tipos do Supabase |

---

## Referências

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [React + TypeScript](https://react.dev/learn/typescript)

---

**Versão**: 1.1
**Última Atualização**: 2026-04-17
**Autor**: AI Agent