# CartContext - PediAi

## Visão Geral

**Contexto**: `context/cart-context.tsx`
**Responsabilidade**: Gerenciamento de estado do carrinho de compras com suporte a multi-tenant (restaurantId)
**Idioma**: Português Brasileiro (pt-BR)
**Stack**: Next.js 16.2.3 + React 19 + TypeScript

---

## Estrutura de Diretórios

```
context/
├── cart-context.tsx # Provider e contexto
└── AGENTS.md # Esta documentação
```

---

## Responsabilidade

Gerencia o estado do carrinho de compras do cliente com suporte a restaurantId para isolamento por restaurante.

### Interface Pública

```typescript
interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  restaurantId: string | null;
  addItem: (product: Product, restaurantId: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}
```

### Provider

```typescript
<CartProvider>
  {children}
</CartProvider>
```

### Hook

```typescript
const {
  items,
  restaurantId,
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  totalItems,
  totalPrice,
} = useCart();
```

---

## Arquitetura

### Estado

```typescript
interface CartState {
  items: CartItem[];
  restaurantId: string | null;
}
```

### Ações do Reducer

| Ação | Payload | Comportamento |
|------|---------|---------------|
| ADD_ITEM | `{ product: Product, restaurantId: string }` | Adiciona produto ou incrementa quantidade |
| REMOVE_ITEM | `{ productId: string }` | Remove item do carrinho |
| UPDATE_QUANTITY | `{ productId: string, quantity: number }` | Atualiza quantidade (se ≤0, remove) |
| CLEAR_CART | - | Limpa todos os itens e restaurantId |

### Regras de Negócio

- Ao adicionar item de outro restaurante, o carrinho é limpo antes (isolamento por tenant)
- UPDATE_QUANTITY com quantity ≤ 0 remove o item automaticamente
- totalItems: soma das quantidades de todos os itens
- totalPrice: soma de (preço × quantidade) de todos os itens

---

## Exemplos de Uso

### Adicionar item ao carrinho

```typescript
const { addItem } = useCart();

const handleAdd = (product: Product) => {
  addItem(product, restaurantId);
};
```

### Atualizar quantidade

```typescript
const { updateQuantity } = useCart();

const handleIncrease = (productId: string, currentQty: number) => {
  updateQuantity(productId, currentQty + 1);
};

const handleDecrease = (productId: string, currentQty: number) => {
  updateQuantity(productId, currentQty - 1);
};
```

### Remover item

```typescript
const { removeItem } = useCart();

const handleRemove = (productId: string) => {
  removeItem(productId);
};
```

### Limpar carrinho

```typescript
const { clearCart } = useCart();

const handleCheckout = async () => {
  // ...lógica de checkout
  clearCart();
};
```

### Exibir total

```typescript
const { totalItems, totalPrice } = useCart();

console.log(`${totalItems} itens - R$ ${totalPrice.toFixed(2)}`);
```

---

## Arquivos Relacionados

| Arquivo | Relação |
|---------|---------|
| `app/menu/[slug]/page.tsx` | Usa CartProvider |
| `types/index.ts` | Define tipo `Product` |
| `tests/unit/context/cart-context.test.tsx` | Testes unitários |

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura unitária | ≥80% | Alta |
| Re-renders desnecessários | 0 | Alta |

---

**Versão**: 2.0
**Última Atualização**: 2026-04-17
**Autor**: AI Agent