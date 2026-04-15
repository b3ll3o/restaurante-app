# Types - MenuLink

## Visão Geral

O módulo **Types** contém todas as definições de tipos TypeScript do domínio da aplicação MenuLink. Este módulo é fundamental para a type safety em toda a aplicação.

**Idioma**: Português Brasileiro (pt-BR)  
**Stack**: TypeScript (strict mode)

---

## Estrutura de Diretórios

```
types/
└── index.ts              # Definições de tipos do domínio
```

---

## Tipos de Domínio

### Restaurant

**Descrição**: Representa um restaurante no sistema.

```typescript
interface Restaurant {
  id: string;                    // UUID único
  name: string;                  // Nome do restaurante
  slug: string;                  // Identificador URL único
  owner_id: string;              // ID do usuário dono (Supabase Auth)
  owner_whatsapp: string;        // WhatsApp do dono para receber pedidos
  created_at: string;            // Timestamp de criação
  updated_at: string;            // Timestamp de atualização
}
```

**Uso**:
```typescript
const restaurant: Restaurant = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'Bar do João',
  slug: 'bar-do-joao',
  owner_id: 'user_123',
  owner_whatsapp: '5511999999999',
  created_at: '2026-04-15T10:00:00Z',
  updated_at: '2026-04-15T10:00:00Z',
};
```

### Category

**Descrição**: Categoria de produtos dentro de um restaurante.

```typescript
interface Category {
  id: string;                    // UUID único
  restaurant_id: string;         // FK para Restaurant
  name: string;                  // Nome da categoria
  display_order: number;         // Ordem de exibição
  created_at: string;            // Timestamp de criação
  updated_at: string;            // Timestamp de atualização
}
```

**Uso**:
```typescript
const category: Category = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  restaurant_id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'Bebidas',
  display_order: 1,
  created_at: '2026-04-15T10:00:00Z',
  updated_at: '2026-04-15T10:00:00Z',
};
```

### Product

**Descrição**: Produto/item vendido pelo restaurante.

```typescript
interface Product {
  id: string;                    // UUID único
  category_id: string;           // FK para Category
  restaurant_id: string;         // FK para Restaurant (denormalizado)
  name: string;                  // Nome do produto
  description: string | null;    // Descrição opcional
  price: number;                 // Preço em reais
  image_url: string | null;      // URL da imagem opcional
  is_available: boolean;         // Se está disponível para venda
  display_order: number;         // Ordem de exibição
  created_at: string;            // Timestamp de criação
  updated_at: string;            // Timestamp de atualização
}
```

**Uso**:
```typescript
const product: Product = {
  id: '550e8400-e29b-41d4-a716-446655440002',
  category_id: '550e8400-e29b-41d4-a716-446655440001',
  restaurant_id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'Coca-Cola 600ml',
  description: 'Refrigerante gelado',
  price: 8.90,
  image_url: 'https://storage.com/coca-cola.jpg',
  is_available: true,
  display_order: 1,
  created_at: '2026-04-15T10:00:00Z',
  updated_at: '2026-04-15T10:00:00Z',
};
```

### Order

**Descrição**: Pedido realizado por um cliente.

```typescript
type OrderStatus = 'pending' | 'confirmed' | 'cancelled';
type PaymentMethod = 'pix' | 'dinheiro' | 'cartao';

interface Order {
  id: string;                    // UUID único
  restaurant_id: string;         // FK para Restaurant
  customer_name: string;         // Nome do cliente
  customer_whatsapp: string;     // WhatsApp do cliente
  total: number;                 // Valor total do pedido
  status: OrderStatus;           // Status atual
  payment_method: PaymentMethod; // Forma de pagamento
  created_at: string;            // Timestamp de criação
  updated_at: string;            // Timestamp de atualização
}
```

**Uso**:
```typescript
const order: Order = {
  id: '550e8400-e29b-41d4-a716-446655440003',
  restaurant_id: '550e8400-e29b-41d4-a716-446655440000',
  customer_name: 'Maria Silva',
  customer_whatsapp: '5511888888888',
  total: 53.90,
  status: 'pending',
  payment_method: 'pix',
  created_at: '2026-04-15T10:00:00Z',
  updated_at: '2026-04-15T10:00:00Z',
};
```

### OrderItem

**Descrição**: Item individual dentro de um pedido.

```typescript
interface OrderItem {
  id: string;                    // UUID único
  order_id: string;              // FK para Order
  product_id: string;            // FK para Product (pode não existir mais)
  product_name: string;          // Nome no momento do pedido (histórico)
  unit_price: number;            // Preço unitário no momento do pedido
  quantity: number;              // Quantidade solicitada
  total_price: number;           // Preço total (unit_price * quantity)
  created_at: string;            // Timestamp de criação
}
```

**Uso**:
```typescript
const orderItem: OrderItem = {
  id: '550e8400-e29b-41d4-a716-446655440004',
  order_id: '550e8400-e29b-41d4-a716-446655440003',
  product_id: '550e8400-e29b-41d4-a716-446655440002',
  product_name: 'Coca-Cola 600ml',
  unit_price: 8.90,
  quantity: 2,
  total_price: 17.80,
  created_at: '2026-04-15T10:00:00Z',
};
```

### CartItem

**Descrição**: Item no carrinho de compras (client-side).

```typescript
interface CartItem {
  id: string;                    // ID do produto
  name: string;                  // Nome do produto
  price: number;                 // Preço unitário
  quantity: number;              // Quantidade no carrinho
  imageUrl?: string;             // URL da imagem (opcional)
}
```

**Uso**:
```typescript
const cartItem: CartItem = {
  id: '550e8400-e29b-41d4-a716-446655440002',
  name: 'Coca-Cola 600ml',
  price: 8.90,
  quantity: 2,
  imageUrl: 'https://storage.com/coca-cola.jpg',
};
```

---

## Tipos de API

### CreateOrderDTO

**Descrição**: Payload para criar um novo pedido.

```typescript
interface CreateOrderDTO {
  restaurantId: string;
  customerName: string;
  customerWhatsapp: string;
  paymentMethod: PaymentMethod;
  items: {
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
  }[];
}
```

**Uso**:
```typescript
const orderData: CreateOrderDTO = {
  restaurantId: '550e8400-e29b-41d4-a716-446655440000',
  customerName: 'Maria Silva',
  customerWhatsapp: '5511888888888',
  paymentMethod: 'pix',
  items: [
    {
      productId: '550e8400-e29b-41d4-a716-446655440002',
      productName: 'Coca-Cola 600ml',
      unitPrice: 8.90,
      quantity: 2,
    },
  ],
};
```

### CreateProductDTO

**Descrição**: Payload para criar um novo produto.

```typescript
interface CreateProductDTO {
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable?: boolean;
  displayOrder?: number;
}
```

### UpdateProductDTO

**Descrição**: Payload para atualizar um produto.

```typescript
type UpdateProductDTO = Partial<Omit<Product, 'id' | 'restaurant_id' | 'created_at' | 'updated_at'>>;
```

---

## Tipos de Resposta

### ApiResponse

**Descrição**: Resposta padrão da API.

```typescript
interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
```

**Uso**:
```typescript
// Sucesso
const successResponse: ApiResponse<Order> = {
  data: order,
  message: 'Pedido criado com sucesso',
};

// Erro
const errorResponse: ApiResponse<never> = {
  error: 'Nome é obrigatório',
};
```

### ValidationResult

**Descrição**: Resultado de validação.

```typescript
interface ValidationResult {
  valid: boolean;
  errors: string[];
}
```

---

## Tipos de Autenticação

### User (Supabase)

**Descrição**: Usuário do Supabase Auth.

```typescript
interface User {
  id: string;
  email: string;
  role?: string;
  created_at: string;
  updated_at: string;
  // ... outros campos do Supabase
}
```

### Session (Supabase)

**Descrição**: Sessão autenticada.

```typescript
interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number;
  token_type: string;
  user: User;
}
```

---

## Tipos de UI

### ButtonProps

**Descrição**: Props do componente Button.

```typescript
import { ButtonHTMLAttributes } from 'react';
import { VariantProps } from 'class-variance-authority';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
```

### InputProps

**Descrição**: Props do componente Input.

```typescript
import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}
```

---

## Tipos Utilitários

### Partial

```typescript
// Torna todas as propriedades opcionais
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

### Required

```typescript
// Torna todas as propriedades obrigatórias
type Required<T> = {
  [P in keyof T]-?: T[P];
};
```

### Pick

```typescript
// Seleciona apenas algumas propriedades
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

### Omit

```typescript
// Remove algumas propriedades
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
```

---

## Type Guards

### isRestaurant

```typescript
function isRestaurant(obj: unknown): obj is Restaurant {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'slug' in obj
  );
}
```

### isOrder

```typescript
function isOrder(obj: unknown): obj is Order {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'status' in obj &&
    ['pending', 'confirmed', 'cancelled'].includes((obj as Order).status)
  );
}
```

---

## Union Types

### OrderStatus

```typescript
type OrderStatus = 'pending' | 'confirmed' | 'cancelled';

// Validação
function isValidStatus(status: string): status is OrderStatus {
  return ['pending', 'confirmed', 'cancelled'].includes(status);
}
```

### PaymentMethod

```typescript
type PaymentMethod = 'pix' | 'dinheiro' | 'cartao';

// Validação
function isValidPaymentMethod(method: string): method is PaymentMethod {
  return ['pix', 'dinheiro', 'cartao'].includes(method);
}
```

---

## Regras de TypeScript

### 1. Strict Mode

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### 2. Evitar `any`

```typescript
// ✅ Bom: Tipo específico
function processOrder(order: Order) { }

// ❌ Ruim: any
function processOrder(order: any) { }
```

### 3. Usar Union Types

```typescript
// ✅ Bom: Union type
type Status = 'pending' | 'confirmed' | 'cancelled';

// ❌ Ruim: String genérico
type Status = string;
```

### 4. Tipar Retornos

```typescript
// ✅ Bom: Retorno tipado
function getOrder(id: string): Promise<Order | null> {
  return supabase.from('orders').select().eq('id', id).single();
}

// ❌ Ruim: Retorno implícito
function getOrder(id: string) {
  return supabase.from('orders').select().eq('id', id).single();
}
```

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura de tipos | 100% | Crítica |
| Uso de `any` | 0 ocorrências | Crítica |
| Documentação JSDoc | 100% | Alta |

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

**Versão**: 1.0  
**Última Atualização**: 2026-04-15  
**Autor**: AI Agent