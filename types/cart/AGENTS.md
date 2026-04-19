# Types/Cart - PediAi

## Visão Geral

O módulo **Types/Cart** contém as definições de tipos relacionados ao carrinho de compras do PediAi. Este módulo é responsável por tipar as entidades `CartItem` e a estrutura de estado do `Cart` utilizada no gerenciamento de estado do carrinho.

**Idioma**: Português Brasileiro (pt-BR)
**Stack**: TypeScript (strict mode)

---

## Estrutura de Diretórios

```
types/
├── index.ts           # Definições centrais (contém CartItem)
├── cart/
│   └── AGENTS.md      # Documentação do módulo Cart (este arquivo)
context/
└── cart-context.tsx   # Implementação do CartContext (CartState e CartContextType)
```

---

## Entidades

### CartItem

Representa um item individual no carrinho de compras.

**Definição** (`types/index.ts:50-53`):

```typescript
export interface CartItem {
  product: Product;
  quantity: number;
}
```

**Propriedades**:

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `product` | `Product` | Produto adicionado ao carrinho |
| `quantity` | `number` | Quantidade units do produto |

---

### Cart (via CartContext)

O `Cart` não existe como tipo standalone. O estado do carrinho é gerenciado pelo `CartContext` que define:

**CartState** (`context/cart-context.tsx:11-14`):

```typescript
interface CartState {
  items: CartItem[];
  restaurantId: string | null;
}
```

**CartContextType** (`context/cart-context.tsx:22-31`):

```typescript
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

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `items` | `CartItem[]` | Lista de itens no carrinho |
| `restaurantId` | `string \| null` | ID do restaurante dono do carrinho (isolamento multi-tenant) |
| `addItem` | `(product: Product, restaurantId: string) => void` | Adiciona produto ao carrinho |
| `removeItem` | `(productId: string) => void` | Remove produto do carrinho |
| `updateQuantity` | `(productId: string, quantity: number) => void` | Atualiza quantidade de um item |
| `clearCart` | `() => void` | Limpa todos os itens do carrinho |
| `totalItems` | `number` | Soma total de todos os itens (quantidades) |
| `totalPrice` | `number` | Soma total dos preços (price * quantity) |

---

## Uso

### Usando o hook useCart

```typescript
"use client";

import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";

function CarrinhoPage() {
  const { items, totalItems, totalPrice, addItem, removeItem, clearCart } = useCart();

  return (
    <div>
      <h1>Carrinho ({totalItems} itens)</h1>
      <p>Total: R$ {totalPrice.toFixed(2)}</p>

      {items.map((item) => (
        <div key={item.product.id}>
          <span>{item.product.name}</span>
          <span>Qtd: {item.quantity}</span>
          <span>R$ {(item.product.price * item.quantity).toFixed(2)}</span>
          <button onClick={() => removeItem(item.product.id)}>Remover</button>
        </div>
      ))}

      <button onClick={clearCart}>Limpar Carrinho</button>
    </div>
  );
}
```

### Adicionando item ao carrinho

```typescript
const { addItem } = useCart();
const product = await supabase.from("products").select("*").eq("id", productId).single();

addItem(product, restaurantId);
```

---

## Regras de Implementação

1. **CartItem DEVE conter `product` e `quantity`** — O tipo é a base do carrinho
2. **Cart NUNCA persiste no servidor** — É estado client-side com localStorage (via CartProvider)
3. **restaurantId DEVE ser definido ao adicionar primeiro item** — Garantia de isolamento multi-tenant
4. **totalItems e totalPrice são computados** — Derivados de `items.reduce()`, não armazenados
5. **Remoção automática ao reduzir quantidade para <= 0** — comportamento do reducer em `UPDATE_QUANTITY`
6. **Quantidade mínima é 1** — Após REMOVE_ITEM ou UPDATE_QUANTITY com qtd <= 0, item é removido

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura de tipos | 100% | Crítica |
| Uso de `any` | 0 ocorrências | Crítica |
| CartItem com Product válido | 100% | Crítica |
| Isolamento por restaurantId | 100% | Crítica |

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| typescript | ^5 | Linguagem |
| react | 19.2.4 | Framework |
| @/types | - | Importação de Product |

---

## Referências

- [React Context](https://react.dev/learn/passing-data-deeply-with-context)
- [useReducer](https://react.dev/reference/react/useReducer)
- [`types/index.ts`](file:///home/leo/projetos/restaurante/types/index.ts)
- [`context/cart-context.tsx`](file:///home/leo/projetos/restaurante/context/cart-context.tsx)

---

**Versão**: 1.0
**Última Atualização**: 2026-04-17
**Autor**: AI Agent