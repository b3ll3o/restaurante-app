# CartContext - MenuLink

## Visão Geral

**Contexto**: `context/cart-context/CartContext`
**Responsabilidade**: Gerenciamento de estado do carrinho de compras com persistência em localStorage
**Idioma**: Português Brasileiro (pt-BR)
**Stack**: Next.js 16.2.3 + React 19 + TypeScript

---

## Estrutura de Diretórios

```
context/cart-context/
├── CartContext.tsx    # Provider e contexto
└── AGENTS.md          # Esta documentação
```

---

## Responsabilidade

Gerencia o estado do carrinho de compras do cliente. Mantém persistência em localStorage para que o carrinho não seja perdido ao recarregar a página.

### Interface Pública

```typescript
interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Omit<CartItem, 'id' | 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  itemCount: number;
}
```

### Provider

```typescript
<CartProvider>
  {children}
</CartProvider>
```

---

## Arquitetura

```typescript
// context/cart-context/CartContext.tsx
"use client";

import { createContext, useContext, useReducer, useEffect } from "react";

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM":
      const existing = state.items.find(item => item.productId === action.payload.productId);
      if (existing) {
        return {
          items: state.items.map(item =>
            item.productId === action.payload.productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { items: [...state.items, action.payload] };
    case "REMOVE_ITEM":
      return { items: state.items.filter(item => item.id !== action.payload) };
    case "UPDATE_QUANTITY":
      return {
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case "CLEAR_CART":
      return { items: [] };
    case "LOAD_CART":
      return { items: action.payload };
    default:
      return state;
  }
};
```

---

## Persistência

O carrinho é persistido em `localStorage` com a chave `menulink-cart`:

```typescript
useEffect(() => {
  const saved = localStorage.getItem("menulink-cart");
  if (saved) {
    dispatch({ type: "LOAD_CART", payload: JSON.parse(saved) });
  }
}, []);

useEffect(() => {
  localStorage.setItem("menulink-cart", JSON.stringify(state.items));
}, [state.items]);
```

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura unitária | ≥80% | Alta |

---

## Arquivos Relacionados

| Arquivo | Relação |
|---------|---------|
| `app/menu/[slug]/page.tsx` | Usa CartProvider |
| `lib/utils.ts` | Função cn() |

---

**Versão**: 1.0
**Última Atualização**: 2026-04-16
**Autor**: AI Agent