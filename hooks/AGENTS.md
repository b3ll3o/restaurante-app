# Hooks - MenuLink

## Visão Geral

O módulo **Hooks** contém custom hooks React reutilizáveis que encapsulam lógica de negócio e estado. Este módulo está em desenvolvimento inicial, com hooks futuros planejados.

**Idioma**: Português Brasileiro (pt-BR)  
**Stack**: React 19 + TypeScript (strict)

---

## Estrutura de Diretórios

```
hooks/
└── README.md              # Este arquivo (visão geral dos hooks)
```

---

## Hooks Futuros Planejados

### 1. useAuth

**Responsabilidade**: Gerenciar estado de autenticação em toda a aplicação.

**Status**: Planejado  
**Dependências**: Supabase Auth

**Interface Planejada**:
```typescript
interface UseAuthReturn {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, metadata?: UserMetadata) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

// Uso esperado
function LoginForm() {
  const { signIn, loading, error } = useAuth();

  const handleSubmit = async (email: string, password: string) => {
    await signIn(email, password);
  };

  // ...
}
```

### 2. useRestaurant

**Responsabilidade**: Gerenciar dados do restaurante autenticado.

**Status**: Planejado  
**Dependências**: Supabase, useAuth

**Interface Planejada**:
```typescript
interface UseRestaurantReturn {
  restaurant: Restaurant | null;
  loading: boolean;
  error: Error | null;
  updateRestaurant: (data: Partial<Restaurant>) => Promise<void>;
  refreshRestaurant: () => Promise<void>;
}

// Uso esperado
function RestaurantSettings() {
  const { restaurant, updateRestaurant } = useRestaurant();

  const handleUpdate = async (name: string, whatsapp: string) => {
    await updateRestaurant({ name, owner_whatsapp: whatsapp });
  };

  // ...
}
```

### 3. useCategories

**Responsabilidade**: CRUD de categorias do restaurante.

**Status**: Planejado  
**Dependências**: Supabase, useRestaurant

**Interface Planejada**:
```typescript
interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: Error | null;
  createCategory: (name: string, displayOrder?: number) => Promise<Category>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  reorderCategories: (categories: { id: string; displayOrder: number }[]) => Promise<void>;
}

// Uso esperado
function CategoriesManager() {
  const { categories, createCategory, deleteCategory } = useCategories();

  const handleCreate = async (name: string) => {
    await createCategory(name);
  };

  // ...
}
```

### 4. useProducts

**Responsabilidade**: CRUD de produtos do restaurante.

**Status**: Planejado  
**Dependências**: Supabase, useRestaurant

**Interface Planejada**:
```typescript
interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: Error | null;
  createProduct: (data: CreateProductDTO) => Promise<Product>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleAvailability: (id: string) => Promise<void>;
}

// Uso esperado
function ProductsManager() {
  const { products, createProduct, toggleAvailability } = useProducts();

  // ...
}
```

### 5. useOrders

**Responsabilidade**: Gestão de pedidos do restaurante.

**Status**: Planejado  
**Dependências**: Supabase, useRestaurant

**Interface Planejada**:
```typescript
interface UseOrdersReturn {
  orders: Order[];
  loading: boolean;
  error: Error | null;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  getOrderItems: (orderId: string) => Promise<OrderItem[]>;
}

// Uso esperado
function OrdersList() {
  const { orders, updateOrderStatus } = useOrders();

  const handleConfirm = async (orderId: string) => {
    await updateOrderStatus(orderId, 'confirmed');
  };

  // ...
}
```

---

## Estrutura Base para Custom Hooks

### Template de Hook

```typescript
// hooks/useExample.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

interface UseExampleOptions {
  enabled?: boolean;
}

interface UseExampleReturn {
  data: ExampleData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useExample(options: UseExampleOptions = {}): UseExampleReturn {
  const { enabled = true } = options;

  const [data, setData] = useState<ExampleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: result, error: supabaseError } = await supabase
        .from('examples')
        .select('*')
        .single();

      if (supabaseError) throw supabaseError;
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
```

---

## Boas Práticas para Hooks

### 1. Client Components

```typescript
// ✅ Bom: 'use client' para hooks que usam browser APIs
'use client';
export function useLocalStorage(key: string, initialValue: any) {
  // ...
}

// ❌ Ruim: Sem 'use client' para browser APIs
export function useLocalStorage(key: string, initialValue: any) {
  // localStorage não existe no server
}
```

### 2. Nomenclatura

```typescript
// ✅ Bom: use + nome descritivo
export function useCart() { }
export function useAuth() { }
export function useRestaurant() { }

// ❌ Ruim: Nomes vagos
export function useData() { }
export function useStuff() { }
```

### 3. Retorno Tipado

```typescript
// ✅ Bom: Interface explícita
interface UseAuthReturn {
  user: User | null;
  loading: boolean;
}

export function useAuth(): UseAuthReturn {
  // ...
}

// ❌ Ruim: Retorno implícito
export function useAuth() {
  // Retorna qualquer coisa
}
```

### 4. Tratamento de Erros

```typescript
// ✅ Bom: Estado de erro estruturado
const [error, setError] = useState<Error | null>(null);

// ❌ Ruim: Erro não tratado
const [error, setError] = useState<string | null>(null);
```

### 5. Cleanup em useEffect

```typescript
// ✅ Bom: Cleanup adequado
useEffect(() => {
  const subscription = subscribe(handleData);
  return () => subscription.unsubscribe();
}, [handleData]);

// ❌ Ruim: Sem cleanup
useEffect(() => {
  subscribe(handleData);
  // Memory leak possível
}, [handleData]);
```

### 6. Evitar Dependencies Circulares

```typescript
// ✅ Bom: Dependencies estáveis
const handleSubmit = useCallback(async () => {
  await submitForm(data);
}, [data]);

// ❌ Ruim: Dependency circular
const handleSubmit = async () => {
  await submitForm(data);
  // data muda, causa re-criação
};
```

---

## Padrões de Hooks

### 1. Hook com Opções

```typescript
interface UseDataOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

export function useData(options: UseDataOptions = {}) {
  const { enabled = true, refetchInterval } = options;
  // ...
}
```

### 2. Hook com Selector

```typescript
export function useCart<T>(selector: (state: CartState) => T): T {
  const state = useContext(CartContext);
  return selector(state);
}

// Uso
const total = useCart(state => state.total);
```

### 3. Hook com Actions

```typescript
export function useCart() {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const actions = {
    addItem: useCallback((item: CartItem) => {
      dispatch({ type: 'ADD_ITEM', payload: item });
    }, []),

    removeItem: useCallback((id: string) => {
      dispatch({ type: 'REMOVE_ITEM', payload: { id } });
    }, []),
  };

  return { ...state, ...actions };
}
```

---

## Testes de Hooks

### Exemplo com Testing Library

```typescript
// tests/unit/hooks/useCart.test.ts
import { renderHook, act } from '@testing-library/react';
import { useCart, CartProvider } from '@/context/cart-context';

describe('useCart', () => {
  it('should add item to cart', async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
    });

    act(() => {
      result.current.addItem({ id: '1', name: 'Pizza', price: 45.90 });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.total).toBe(45.90);
  });
});
```

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura de testes | ≥85% | Alta |
| Tipagem completa | 100% | Crítica |
| JSDoc comments | 100% | Média |

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| react | 19.2.4 | Framework |
| @supabase/supabase-js | ^2.103.0 | Banco de dados |

---

## Referências

- [React Hooks](https://react.dev/reference/react)
- [Writing Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [Testing Library - Hooks](https://testing-library.com/docs/react-hooks-testing-library)

---

**Versão**: 1.0  
**Última Atualização**: 2026-04-15  
**Autor**: AI Agent