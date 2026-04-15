# Library (lib/) - MenuLink

## Visão Geral

O módulo **Library** (`lib/`) contém utilitários, serviços e clientes de infraestrutura reutilizáveis em toda a aplicação. Este módulo é o coração da lógica de negócio e integrações externas.

**Idioma**: Português Brasileiro (pt-BR)  
**Stack**: TypeScript (strict) + Supabase + WhatsApp API

---

## Estrutura de Diretórios

```
lib/
├── utils.ts                  # Funções utilitárias
├── whatsapp.ts              # Serviço de integração WhatsApp
└── supabase/
    ├── client.ts            # Cliente Supabase para browser
    └── server.ts            # Cliente Supabase para server-side
```

---

## Sub-módulo: Utils (`lib/utils.ts`)

### Responsabilidade

Funções utilitárias puras e helpers para formatação, validação e transformação de dados.

### Funções Exportadas

#### `cn(...inputs: ClassValue[]): string`

**Descrição**: Merge de classes CSS do Tailwind, tratando valores falsy e duplicatas.

**Implementação**:
```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Uso**:
```typescript
cn('px-2 py-1 bg-red hover:bg-dark-red', 'p-4', ['p-2', 'bg-blue']);
// → 'hover:bg-dark-red p-4 bg-blue'
cn('px-2 py-1', false && 'bg-red', 'px-3');
// → 'px-3 py-1'
```

#### `formatPrice(price: number): string`

**Descrição**: Formata um número como preço em Real Brasileiro (BRL).

**Implementação**:
```typescript
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}
```

**Uso**:
```typescript
formatPrice(10);        // → 'R$ 10,00'
formatPrice(10.5);      // → 'R$ 10,50'
formatPrice(1000);      // → 'R$ 1.000,00'
formatPrice(1234.56);   // → 'R$ 1.234,56'
formatPrice(0);         // → 'R$ 0,00'
```

#### `generateSlug(text: string): string`

**Descrição**: Converte um texto em um slug URL-friendly.

**Implementação**:
```typescript
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '')    // Remove caracteres especiais
    .replace(/\s+/g, '-')            // Substitui espaços por hífens
    .replace(/-+/g, '-')             // Remove múltiplos hífens
    .replace(/^-+|-+$/g, '');        // Remove hífens do início/fim
}
```

**Uso**:
```typescript
generateSlug('Bar do João');           // → 'bar-do-joao'
generateSlug('Restaurante São Paulo'); // → 'restaurante-sao-paulo'
generateSlug('Pizza & Pasta');         // → 'pizza-pasta'
generateSlug('Café com Açúcar');       // → 'cafe-com-acucar'
generateSlug('  Bar   do   João  ');   // → 'bar-do-joao'
generateSlug('---test---');            // → 'test'
```

#### `isValidWhatsApp(phone: string): boolean`

**Descrição**: Valida se um número de WhatsApp está no formato brasileiro.

**Implementação**:
```typescript
export function isValidWhatsApp(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 13;
}
```

**Uso**:
```typescript
isValidWhatsApp('5511999999999');  // → true (com DDI)
isValidWhatsApp('11999999999');    // → true (sem DDI)
isValidWhatsApp('999999999');      // → false (muito curto)
isValidWhatsApp('abc');            // → false (não numérico)
isValidWhatsApp('');               // → false (vazio)
```

#### `isValidPrice(price: number): boolean`

**Descrição**: Valida se um preço é válido (maior que zero).

**Implementação**:
```typescript
export function isValidPrice(price: number): boolean {
  return price > 0;
}
```

**Uso**:
```typescript
isValidPrice(10.00);   // → true
isValidPrice(0.01);    // → true
isValidPrice(0);       // → false
isValidPrice(-5);      // → false
isValidPrice(1000000); // → true
```

#### `isValidName(name: string): boolean`

**Descrição**: Valida se um nome é válido (mínimo 2 caracteres após trim).

**Implementação**:
```typescript
export function isValidName(name: string): boolean {
  return name.trim().length >= 2;
}
```

**Uso**:
```typescript
isValidName('João');     // → true
isValidName('Jo');       // → true (2 caracteres)
isValidName('J');        // → false (1 caractere)
isValidName('');         // → false (vazio)
isValidName('  ');       // → false (apenas espaços)
isValidName('  João  '); // → true (com espaços)
```

---

## Sub-módulo: Supabase (`lib/supabase/`)

### Responsabilidade

Clientes Supabase configurados para diferentes ambientes (browser e server-side).

### Cliente Browser (`lib/supabase/client.ts`)

**Descrição**: Cliente Supabase para uso no browser (Client Components).

**Implementação**:
```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**Uso**:
```typescript
'use client';
import { createClient } from '@/lib/supabase/client';

export function MyComponent() {
  const supabase = createClient();

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'user@example.com',
      password: 'password',
    });
  };

  return <button onClick={handleLogin}>Login</button>;
}
```

### Cliente Server (`lib/supabase/server.ts`)

**Descrição**: Cliente Supabase para uso em Server Components e API Routes com suporte a cookies.

**Implementação**:
```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Handle error in Server Components
          }
        },
      },
    }
  );
}
```

**Uso**:
```typescript
// Server Component
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/admin/login');
  }

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('*')
    .eq('owner_id', session.user.id)
    .single();

  return <div>{restaurant?.name}</div>;
}
```

### Operações Comuns

#### Autenticação

```typescript
// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

// Cadastro
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: { restaurant_name: 'Meu Restaurante' }
  }
});

// Logout
await supabase.auth.signOut();

// Session atual
const { data: { session } } = await supabase.auth.getSession();

// Usuário atual
const { data: { user } } = await supabase.auth.getUser();
```

#### CRUD Genérico

```typescript
// Create
const { data, error } = await supabase
  .from('products')
  .insert([{ name: 'Pizza', price: 45.90, category_id: 'uuid' }])
  .select()
  .single();

// Read
const { data, error } = await supabase
  .from('products')
  .select('*, category:categories(name)')
  .eq('restaurant_id', restaurantId)
  .order('display_order')
  .limit(10);

// Update
const { data, error } = await supabase
  .from('products')
  .update({ is_available: false })
  .eq('id', productId)
  .select()
  .single();

// Delete
const { error } = await supabase
  .from('products')
  .delete()
  .eq('id', productId);
```

---

## Sub-módulo: WhatsApp (`lib/whatsapp.ts`)

### Responsabilidade

Serviço de integração com a API do WhatsApp Business para envio de notificações de pedidos.

### Funções Exportadas

#### `formatOrderMessage(order: Order, items: OrderItem[]): string`

**Descrição**: Formata uma mensagem de pedido completa para envio via WhatsApp.

**Implementação**:
```typescript
export function formatOrderMessage(order: Order, items: OrderItem[]): string {
  const itemsList = items
    .map(item => `• ${item.quantity}x ${item.product_name} - R$ ${item.total_price.toFixed(2)}`)
    .join('\n');

  return `🍔 *Novo Pedido #${order.id.slice(0, 8)}*

👤 *Cliente:* ${order.customer_name}
📱 *WhatsApp:* ${order.customer_whatsapp}
💳 *Pagamento:* ${formatPaymentMethod(order.payment_method)}

*Itens:*
${itemsList}

💰 *Total:* R$ ${order.total.toFixed(2)}

*Status:* ${formatStatus(order.status)}`;
}

function formatPaymentMethod(method: string): string {
  const methods: Record<string, string> = {
    pix: 'PIX',
    dinheiro: 'Dinheiro',
    cartao: 'Cartão',
  };
  return methods[method] || method;
}

function formatStatus(status: string): string {
  const statuses: Record<string, string> = {
    pending: '⏳ Pendente',
    confirmed: '✅ Confirmado',
    cancelled: '❌ Cancelado',
  };
  return statuses[status] || status;
}
```

**Uso**:
```typescript
const message = formatOrderMessage(order, items);
// Retorna string formatada com emoji e formatação WhatsApp
```

#### `generateWhatsAppUrl(whatsapp: string, message: string): string`

**Descrição**: Gera URL para abrir WhatsApp com mensagem pré-preenchida.

**Implementação**:
```typescript
export function generateWhatsAppUrl(whatsapp: string, message: string): string {
  // Remove tudo que não é número
  const cleaned = whatsapp.replace(/\D/g, '');

  // Codifica a mensagem para URL
  const encodedMessage = encodeURIComponent(message);

  // Gera URL wa.me
  return `https://wa.me/${cleaned}?text=${encodedMessage}`;
}
```

**Uso**:
```typescript
const url = generateWhatsAppUrl('5511999999999', 'Olá! Pedido confirmado.');
// → 'https://wa.me/5511999999999?text=Ol%C3%A1!%20Pedido%20confirmado.'
```

#### `sendWhatsAppMessage(phoneNumberId: string, token: string, to: string, message: string): Promise<WhatsAppResponse>`

**Descrição**: Envia mensagem via API Graph do WhatsApp.

**Implementação**:
```typescript
interface WhatsAppResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendWhatsAppMessage(
  phoneNumberId: string,
  token: string,
  to: string,
  message: string
): Promise<WhatsAppResponse> {
  // Se não tiver token, retorna erro
  if (!token || !phoneNumberId) {
    return { success: false, error: 'WhatsApp não configurado' };
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to.replace(/\D/g, ''), // Apenas números
          type: 'text',
          text: { body: message },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error?.message || 'Erro desconhecido' };
    }

    const data = await response.json();
    return { success: true, messageId: data.messages[0].id };
  } catch (error) {
    return { success: false, error: 'Falha ao enviar mensagem' };
  }
}
```

**Uso**:
```typescript
const result = await sendWhatsAppMessage(
  process.env.WHATSAPP_PHONE_NUMBER_ID!,
  process.env.WHATSAPP_TOKEN!,
  '5511999999999',
  'Seu pedido foi confirmado!'
);

if (result.success) {
  console.log('Mensagem enviada:', result.messageId);
} else {
  console.error('Erro:', result.error);
}
```

---

## Validações de Domínio

### Validação de Pedido

```typescript
interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateOrderRequest(body: CreateOrderDTO): ValidationResult {
  const errors: string[] = [];

  // Nome do cliente
  if (!body.customerName || !isValidName(body.customerName)) {
    errors.push('Nome é obrigatório (mínimo 2 caracteres)');
  }

  // WhatsApp
  if (!body.customerWhatsapp || !isValidWhatsApp(body.customerWhatsapp)) {
    errors.push('WhatsApp é obrigatório (formato brasileiro)');
  }

  // Forma de pagamento
  if (!body.paymentMethod || !['pix', 'dinheiro', 'cartao'].includes(body.paymentMethod)) {
    errors.push('Forma de pagamento é obrigatória');
  }

  // Items
  if (!body.items || body.items.length === 0) {
    errors.push('Pedido deve ter pelo menos 1 item');
  }

  // Validação de cada item
  body.items?.forEach((item, index) => {
    if (!item.productId) {
      errors.push(`Item ${index + 1}: produto é obrigatório`);
    }
    if (!item.productName) {
      errors.push(`Item ${index + 1}: nome do produto é obrigatório`);
    }
    if (!isValidPrice(item.unitPrice)) {
      errors.push(`Item ${index + 1}: preço deve ser maior que zero`);
    }
    if (!item.quantity || item.quantity < 1) {
      errors.push(`Item ${index + 1}: quantidade deve ser pelo menos 1`);
    }
  });

  return { valid: errors.length === 0, errors };
}
```

### Máquina de Estados de Pedido

```typescript
type OrderStatus = 'pending' | 'confirmed' | 'cancelled';

const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: [], // Não pode sair de confirmed
  cancelled: [], // Não pode sair de cancelled
};

export function canTransitionTo(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
  return validTransitions[currentStatus].includes(newStatus);
}

export function validateStatusTransition(
  currentStatus: OrderStatus,
  newStatus: OrderStatus
): ValidationResult {
  if (!canTransitionTo(currentStatus, newStatus)) {
    return {
      valid: false,
      errors: [`Não é possível alterar status de ${currentStatus} para ${newStatus}`],
    };
  }
  return { valid: true, errors: [] };
}
```

---

## Regras de Implementação

### 1. Funções Puras

```typescript
// ✅ Bom: Função pura, sem side effects
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
}

// ❌ Ruim: Efeitos colaterais
export function formatPrice(price: number): string {
  console.log('Formatting price:', price); // Side effect
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
}
```

### 2. Tratamento de Erros

```typescript
// ✅ Bom: Try-catch com retorno estruturado
export async function sendWhatsAppMessage(...): Promise<WhatsAppResponse> {
  try {
    const response = await fetch(...);
    return { success: true, messageId: ... };
  } catch (error) {
    return { success: false, error: 'Falha ao enviar' };
  }
}

// ❌ Ruim: Throw em serviço
export async function sendWhatsAppMessage(...) {
  const response = await fetch(...);
  if (!response.ok) throw new Error('Failed'); // Não tratar
}
```

### 3. Type Safety

```typescript
// ✅ Bom: Tipos explícitos
interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// ❌ Ruim: Any
function validate(data: any): any {
  return { valid: true, errors: [] };
}
```

### 4. Validações no Domínio

```typescript
// ✅ Bom: Validação no domínio
export function isValidWhatsApp(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 13;
}

// ❌ Ruim: Validação na UI apenas
// isValidWhatsApp deveria estar em lib/, não no componente
```

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| @supabase/ssr | ^0.10.2 | SSR auth |
| @supabase/supabase-js | ^2.103.0 | Cliente DB |
| clsx | ^2.1.1 | Concatenação classes |
| tailwind-merge | ^3.5.0 | Merge classes |

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura de testes | ≥90% | Crítica |
| Complexidade ciclomática | ≤5 | Alta |
| Linhas por função | ≤30 | Média |
| Dependências externas | ≤3 | Média |

---

## Testes

### Testes Unitários (Obrigatórios)

```typescript
// tests/unit/utils.test.ts
describe('Utils', () => {
  describe('formatPrice', () => {
    it('should format price in BRL', () => {
      expect(formatPrice(10)).toBe('R$ 10,00');
    });
  });

  describe('generateSlug', () => {
    it('should convert text to slug', () => {
      expect(generateSlug('Bar do João')).toBe('bar-do-joao');
    });
  });
});
```

### Testes de Integração

```typescript
// tests/integration/whatsapp.test.ts
describe('WhatsApp Service', () => {
  it('should send message successfully', async () => {
    const result = await sendWhatsAppMessage(
      PHONE_ID, TOKEN, '5511999999999', 'Test message'
    );
    expect(result.success).toBe(true);
  });
});
```

---

## Referências

- [Supabase Documentation](https://supabase.com/docs)
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)
- [Intl.NumberFormat](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)

---

**Versão**: 1.0  
**Última Atualização**: 2026-04-15  
**Autor**: AI Agent