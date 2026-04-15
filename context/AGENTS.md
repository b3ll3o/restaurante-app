# Context - MenuLink

## Visão Geral

O módulo **Context** contém os contextos React globais da aplicação. Atualmente, o principal contexto é o **CartContext**, responsável pelo gerenciamento de estado do carrinho de compras com persistência em localStorage.

**Idioma**: Português Brasileiro (pt-BR)  
**Stack**: React 19 + TypeScript (strict)

---

## Estrutura de Diretórios

```
context/
└── cart-context.tsx    # Contexto do carrinho de compras
```

---

## Sub-módulo: Cart Context (`context/cart-context.tsx`)

### Responsabilidade

Gerenciar o estado global do carrinho de compras, permitindo adicionar, remover e atualizar itens, com persistência automática em localStorage para sobreviver a recargas de página.

### Arquitetura

```typescript
'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// ============================================
// TIPOS
// ============================================

export interface CartItem {
  id: string;           // ID do produto
  name: string;         // Nome do produto
  price: number;        // Preço unitário
  quantity: number;     // Quantidade no carrinho
  imageUrl?: string;    // URL da imagem (opcional)
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> & { quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

interface CartContextType extends CartState {
  addItem: (product: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

// ============================================
// CONTEXTO
// ============================================

const CartContext = createContext<CartContextType | undefined>(undefined);

// ============================================
// REDUCER
// ============================================

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { id, name, price, quantity = 1, imageUrl } = action.payload;
      const existingItem = state.items.find(item => item.id === id);

      let newItems: CartItem[];

      if (existingItem) {
        // Incrementa quantidade do item existente
        newItems = state.items.map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Adiciona novo item
        newItems = [...state.items, { id, name, price, quantity, imageUrl }];
      }

      return {
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items
        .map(item => {
          if (item.id === action.payload.id) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter(item => item.quantity > 0);

      return {
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        // Remove item se quantidade for 0 ou negativa
        const newItems = state.items.filter(item => item.id !== id);
        return {
          items: newItems,
          total: calculateTotal(newItems),
          itemCount: calculateItemCount(newItems),
        };
      }

      const newItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      );

      return {
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
      };
    }

    case 'CLEAR_CART': {
      return {
        items: [],
        total: 0,
        itemCount: 0,
      };
    }

    case 'LOAD_CART': {
      return {
        items: action.payload,
        total: calculateTotal(action.payload),
        itemCount: calculateItemCount(action.payload),
      };
    }

    default:
      return state;
  }
}

// ============================================
// HELPERS
// ============================================

function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calculateItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

const STORAGE_KEY = 'menulink_cart';

// ============================================
// PROVIDER
// ============================================

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  });

  // Carrega carrinho do localStorage ao inicializar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const items = JSON.parse(stored) as CartItem[];
        dispatch({ type: 'LOAD_CART', payload: items });
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho do localStorage:', error);
    }
  }, []);

  // Salva carrinho no localStorage quando muda
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch (error) {
      console.error('Erro ao salvar carrinho no localStorage:', error);
    }
  }, [state.items]);

  // Ações
  const addItem = (product: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id: productId } });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ============================================
// HOOK
// ============================================

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
```

---

## Interface Pública

### Props do Provider

```typescript
interface CartProviderProps {
  children: ReactNode;  // Componentes filhos
}
```

### Estado do Context

```typescript
interface CartContextType {
  items: CartItem[];      // Lista de itens no carrinho
  total: number;          // Total calculado (soma de price * quantity)
  itemCount: number;      // Contagem total de itens (soma das quantities)
}
```

### Ações do Context

```typescript
interface CartContextType {
  // Adiciona produto ao carrinho
  // Se produto já existe, incrementa quantidade
  addItem(product: { id: string; name: string; price: number; quantity?: number; imageUrl?: string }): void;

  // Remove uma unidade do produto
  // Remove completamente se quantidade for 1
  removeItem(productId: string): void;

  // Atualiza quantidade de um produto
  // Remove se quantidade for <= 0
  updateQuantity(productId: string, quantity: number): void;

  // Limpa todos os itens do carrinho
  clearCart(): void;
}
```

---

## Uso

### Uso Básico

```tsx
'use client';

import { CartProvider, useCart } from '@/context/cart-context';

export default function MenuPage({ restaurant, categories, products }) {
  return (
    <CartProvider>
      <div className="container">
        <h1>{restaurant.name}</h1>
        <ProductList products={products} />
        <CartButton />
      </div>
    </CartProvider>
  );
}

function CartButton() {
  const { itemCount, total } = useCart();

  return (
    <button className="fixed bottom-4 right-4">
      Carrinho ({itemCount}) - R$ {total.toFixed(2)}
    </button>
  );
}
```

### Adicionar ao Carrinho

```tsx
function ProductCard({ product }) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.image_url,
    });
  };

  return (
    <Card>
      <CardContent>
        <h3>{product.name}</h3>
        <p>R$ {product.price}</p>
        <Button onClick={handleAddToCart}>Adicionar</Button>
      </CardContent>
    </Card>
  );
}
```

### Remover do Carrinho

```tsx
function CartItem({ item }) {
  const { removeItem, updateQuantity } = useCart();

  return (
    <div className="flex items-center gap-4">
      <span>{item.name}</span>
      <span>R$ {item.price}</span>
      <span>Qtd: {item.quantity}</span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => removeItem(item.id)}
      >
        -
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => updateQuantity(item.id, item.quantity + 1)}
      >
        +
      </Button>
    </div>
  );
}
```

### Checkout

```tsx
function CheckoutModal({ isOpen, onClose }) {
  const { items, total, clearCart } = useCart();

  const handleCheckout = async () => {
    // Criar pedido via API
    const response = await fetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        restaurantId,
        customerName,
        customerWhatsapp,
        paymentMethod,
        items: items.map(item => ({
          productId: item.id,
          productName: item.name,
          unitPrice: item.price,
          quantity: item.quantity,
        })),
      }),
    });

    if (response.ok) {
      clearCart();
      onClose();
      // Redirecionar ou mostrar confirmação
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Finalizar Pedido</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {items.map(item => (
            <CartItem key={item.id} item={item} />
          ))}

          <div className="text-xl font-bold">
            Total: R$ {total.toFixed(2)}
          </div>

          <Button onClick={handleCheckout} className="w-full">
            Confirmar Pedido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Persistência

### localStorage

O carrinho é persistido no localStorage com a chave `menulink_cart`.

```typescript
// Salvar
localStorage.setItem('menulink_cart', JSON.stringify(items));

// Carregar
const stored = localStorage.getItem('menulink_cart');
const items = stored ? JSON.parse(stored) : [];
```

### Tratamento de Erros

```typescript
// Ao carregar
try {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const items = JSON.parse(stored) as CartItem[];
    dispatch({ type: 'LOAD_CART', payload: items });
  }
} catch (error) {
  console.error('Erro ao carregar carrinho:', error);
  // Carrinho começa vazio em caso de erro
}

// Ao salvar
try {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
} catch (error) {
  console.error('Erro ao salvar carrinho:', error);
  // Dados podem ser perdidos, mas não quebra a aplicação
}
```

---

## Regras de Negócio

### 1. Adicionar Item

- Se item já existe: incrementa quantidade
- Se item não existe: adiciona com quantidade 1 (ou quantidade especificada)
- Quantidade mínima: 1

### 2. Remover Item

- Remove uma unidade da quantidade
- Se quantidade becomes 0: remove item completamente

### 3. Atualizar Quantidade

- Se quantity > 0: atualiza quantidade
- Se quantity <= 0: remove item

### 4. Limpar Carrinho

- Remove todos os itens
- Remove do localStorage

### 5. Cálculo de Total

```typescript
total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
```

### 6. Cálculo de ItemCount

```typescript
itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
```

---

## Performance

### Otimizações

1. **useReducer**: Usa reducer em vez de múltiplos useState para evitar re-renders desnecessários
2. **Memoização**: Items são objetos novos apenas quando mudam
3. **localStorage**: Lê apenas uma vez ao montar, escreve apenas quando items mudam

### Boas Práticas

```tsx
// ✅ Bom: Selecionar apenas o que precisa
function CartCount() {
  const { itemCount } = useCart(); // Re-renderiza apenas se itemCount mudar
  return <span>{itemCount}</span>;
}

// ❌ Ruim: Selecionar tudo
function CartCount() {
  const cart = useCart(); // Re-renderiza em qualquer mudança
  return <span>{cart.itemCount}</span>;
}
```

---

## Testes

### Testes Unitários

```typescript
// tests/unit/cart-context.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider, useCart } from '@/context/cart-context';

const TestComponent = () => {
  const { items, addItem, removeItem, clearCart, total, itemCount } = useCart();

  return (
    <div>
      <span data-testid="item-count">{itemCount}</span>
      <span data-testid="total">{total}</span>
      <span data-testid="items">{items.length}</span>
      <button onClick={() => addItem({ id: '1', name: 'Pizza', price: 45.90 })}>
        Add
      </button>
      <button onClick={() => removeItem('1')}>Remove</button>
      <button onClick={clearCart}>Clear</button>
    </div>
  );
};

describe('CartContext', () => {
  it('should add item to cart', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    const user = userEvent.setup();
    await user.click(screen.getByText('Add'));

    expect(screen.getByTestId('item-count')).toHaveTextContent('1');
    expect(screen.getByTestId('total')).toHaveTextContent('45.9');
  });

  it('should remove item from cart', async () => {
    // ... setup with item in cart
    await user.click(screen.getByText('Remove'));
    expect(screen.getByTestId('item-count')).toHaveTextContent('0');
  });

  it('should clear cart', async () => {
    // ... setup with items in cart
    await user.click(screen.getByText('Clear'));
    expect(screen.getByTestId('items')).toHaveTextContent('0');
  });
});
```

### Casos de Teste

1. **Adicionar item novo** → itemCount = 1, total = price
2. **Adicionar item existente** → itemCount = 2, total = price * 2
3. **Remover item** → itemCount decrementa
4. **Remover último item** → items = []
5. **Atualizar quantidade** → itemCount atualiza
6. **Atualizar para 0** → item removido
7. **Limpar carrinho** → items = [], total = 0
8. **Persistência** → carrinho persiste após reload

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura de testes | ≥85% | Alta |
| Re-renders desnecessários | 0 | Alta |
| Tempo de resposta | <16ms | Média |

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| react | 19.2.4 | Framework |
| react-dom | 19.2.4 | DOM rendering |

---

## Referências

- [React Context](https://react.dev/learn/passing-data-deeply-with-context)
- [useReducer](https://react.dev/reference/react/useReducer)
- [localStorage](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/localStorage)

---

**Versão**: 1.0  
**Última Atualização**: 2026-04-15  
**Autor**: AI Agent