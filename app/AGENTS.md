# App Router - MenuLink

## Visão Geral

O módulo **App Router** é o núcleo da aplicação Next.js 16.2.3, utilizando o novo App Router com React Server Components (RSC). Este módulo é responsável por todas as rotas da aplicação, incluindo o painel administrativo e o cardápio público.

**Idioma**: Português Brasileiro (pt-BR)  
**Stack**: Next.js 16.2.3 + React 19 + TypeScript (strict)

---

## Estrutura de Diretórios

```
app/
├── admin/                    # Painel administrativo (protegido)
│   ├── auth/
│   │   └── callback/        # Callback de autenticação Supabase
│   ├── categories/          # Gestão de categorias
│   ├── dashboard/           # Dashboard principal
│   ├── login/               # Página de login
│   ├── orders/              # Gestão de pedidos
│   ├── products/            # Gestão de produtos
│   ├── settings/            # Configurações do restaurante
│   ├── signup/              # Página de cadastro
│   └── layout.tsx           # Layout do admin (client-side auth)
├── api/                     # API Routes
│   └── orders/
│       └── route.ts         # Endpoint de criação de pedidos
├── menu/                    # Cardápio público
│   └── [slug]/
│       └── page.tsx         # Cardápio dinâmico por restaurante
├── layout.tsx               # Layout raiz (Server Component)
├── page.tsx                 # Página inicial
└── globals.css              # Estilos globais + Tailwind 4
```

---

## Sub-módulo: Admin (`app/admin/`)

### Responsabilidade

Painel administrativo completo para donos de restaurantes gerenciarem seus cardápios e pedidos.

### Rotas do Admin

| Rota | Arquivo | Descrição | Autenticação |
|------|---------|-----------|--------------|
| `/admin/login` | `login/page.tsx` | Login do proprietário | Não |
| `/admin/signup` | `signup/page.tsx` | Cadastro de novo restaurante | Não |
| `/admin/dashboard` | `dashboard/page.tsx` | Dashboard principal | Sim |
| `/admin/categories` | `categories/page.tsx` | CRUD de categorias | Sim |
| `/admin/products` | `products/page.tsx` | CRUD de produtos | Sim |
| `/admin/orders` | `orders/page.tsx` | Lista e gestão de pedidos | Sim |
| `/admin/settings` | `settings/page.tsx` | Configurações do restaurante | Sim |

### Arquitetura do Admin

```typescript
// app/admin/layout.tsx - Client-side auth check
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminLayout({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica autenticação via Supabase
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) return <div>Carregando...</div>;
  return <>{children}</>;
}
```

### Regras do Admin

1. **Proteção de Rotas**: Todas as rotas exceto `/login` e `/signup` requerem autenticação
2. **Client Components**: O layout usa `'use client'` para verificação de autenticação
3. **Multi-tenant**: Dados filtrados por `restaurant_id` do usuário autenticado
4. **UI**: shadcn/ui components + Tailwind CSS 4

---

## Sub-módulo: API Routes (`app/api/`)

### Responsabilidade

Endpoints da API para integração com clientes e serviços externos.

### Endpoint: POST /api/orders

**Arquivo**: `app/api/orders/route.ts`

**Responsabilidade**: Criar novos pedidos e enviar notificação via WhatsApp.

```typescript
// Estrutura do endpoint
POST /api/orders
Content-Type: application/json

Body:
{
  "restaurantId": "uuid",
  "customerName": "string",
  "customerWhatsapp": "string",
  "paymentMethod": "pix" | "dinheiro" | "cartao",
  "items": [
    {
      "productId": "uuid",
      "productName": "string",
      "unitPrice": number,
      "quantity": number
    }
  ]
}

Response (201):
{
  "id": "uuid",
  "total": number,
  "status": "pending",
  "whatsappUrl": "string"
}

Response (400):
{
  "error": "string" // "Nome é obrigatório", etc.
}

Response (404):
{
  "error": "Restaurante não encontrado"
}
```

### Lógica de Negócio

1. **Validação de Input**:
   - `customerName`: obrigatório, mínimo 2 caracteres
   - `customerWhatsapp`: obrigatório, formato brasileiro válido
   - `paymentMethod`: obrigatório, um de `pix`, `dinheiro`, `cartao`
   - `items`: obrigatório, pelo menos 1 item
   - `restaurantId`: obrigatório, deve existir

2. **Cálculo de Total**:
   ```typescript
   total = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
   ```

3. **Criação de OrderItems**:
   - Dados denormalizados (product_name, unit_price) para histórico
   - Cálculo de `total_price` por item

4. **Notificação WhatsApp**:
   - Formatada com detalhes do pedido
   - URL gerada com wa.me
   - Falha não bloqueia criação do pedido

### Classes/Funções Importantes

```typescript
// Validação
function validateOrderRequest(body: CreateOrderDTO): ValidationResult {
  // Retorna { valid: boolean, errors: string[] }
}

// Cálculo
function calculateTotal(items: OrderItemDTO[]): number {
  return items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
}

// WhatsApp
function formatOrderMessage(order: Order, items: OrderItem[]): string {
  // Formata mensagem completa do pedido
}

function generateWhatsAppUrl(whatsapp: string, message: string): string {
  // Gera URL wa.me com mensagem codificada
}
```

---

## Sub-módulo: Cardápio Público (`app/menu/[slug]/`)

### Responsabilidade

Exibir o cardápio público de um restaurante específico baseado em seu slug.

### Rota: `/menu/[slug]`

**Arquivo**: `app/menu/[slug]/page.tsx`

**Parâmetros**:
- `slug`: Identificador único do restaurante na URL

### Arquitetura

```typescript
// Server Component que busca dados do restaurante
export default async function MenuPage({ params }: { params: { slug: string } }) {
  // 1. Busca restaurante pelo slug
  const restaurant = await supabase
    .from('restaurants')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!restaurant) {
    notFound(); // 404
  }

  // 2. Busca categorias ordenadas
  const categories = await supabase
    .from('categories')
    .select('*')
    .eq('restaurant_id', restaurant.id)
    .order('display_order');

  // 3. Busca produtos com categorias
  const products = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('restaurant_id', restaurant.id)
    .eq('is_available', true)
    .order('display_order');

  // 4. Renderiza com CartProvider
  return (
    <CartProvider>
      <MenuClient restaurant={restaurant} categories={categories} products={products} />
    </CartProvider>
  );
}
```

### Componentes do Cardápio

1. **Header**: Nome e informações do restaurante
2. **CategoryList**: Lista de categorias (tabs ou menu lateral)
3. **ProductList**: Grid de produtos por categoria
4. **Cart**: Carrinho flutuante com contador e total
5. **CheckoutModal**: Modal de finalização do pedido

### Regras de Negócio

1. **Slug Único**: Cada restaurante tem um slug único usado na URL
2. **Produtos Disponíveis**: Apenas `is_available = true` são exibidos
3. **Ordenação**: Categorias e produtos ordenados por `display_order`
4. **Carrinho**: Persistido em localStorage via CartContext
5. **Sem Autenticação**: Cardápio público, qualquer pessoa pode acessar

---

## Sub-módulo: Layout Raiz (`app/layout.tsx`)

### Responsabilidade

Layout raiz da aplicação com providers globais e configurações.

```typescript
// app/layout.tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

export const metadata: Metadata = {
  title: 'MenuLink - Cardápio Digital',
  description: 'Cardápio digital para restaurantes com pedidos via WhatsApp',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${geist.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
```

### Configurações

- **Fontes**: Geist + Geist_Mono (Google Fonts)
- **Idioma**: `lang="pt-BR"`
- **CSS Global**: `globals.css` com Tailwind 4

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| next | 16.2.3 | Framework |
| react | 19.2.4 | UI Library |
| @supabase/supabase-js | ^2.103.0 | Banco de dados |
| @supabase/ssr | ^0.10.2 | SSR auth |
| lucide-react | ^1.8.0 | Ícones |
| tailwindcss | ^4 | Estilização |

---

## Regras de Implementação

### 1. Server vs Client Components

- **Server Components** (default): Para busca de dados e renderização estática
- **Client Components** (`'use client'`): Para interatividade (forms, estados, eventos)

### 2. Autenticação

```typescript
// Verificação de autenticação no admin
const supabase = createClient();
const { data: { session } } = await supabase.auth.getSession();
if (!session) redirect('/admin/login');
```

### 3. Multi-tenant

```typescript
// Sempre filtrar por restaurant_id
supabase
  .from('products')
  .select('*')
  .eq('restaurant_id', restaurantId); // Do usuário autenticado
```

### 4. Error Handling

```typescript
// Tratamento de erros em API routes
try {
  const order = await createOrder(data);
  return NextResponse.json(order, { status: 201 });
} catch (error) {
  if (error instanceof ValidationError) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
}
```

### 5. Validação de Input

- Usar TypeScript strict mode
- Validar todos os inputs em API routes
- Sanitizar dados antes de inserir no banco

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura de testes | ≥70% | Alta |
| Complexidade ciclomática | ≤15 | Média |
| Linhas por arquivo | ≤500 | Baixa |
| Dependências por módulo | ≤10 | Média |

---

## Testes

### Testes Unitários
- Validação de inputs
- Cálculo de totais
- Formatação de mensagens

### Testes de Integração
- CRUD de categorias
- CRUD de produtos
- Criação de pedidos

### Testes E2E
- Fluxo de login/cadastro
- CRUD completo no admin
- Visualização de cardápio público
- Checkout e criação de pedido

---

## Referências

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [menulink-specification.md](../.openspec/specs/menulink-specification.md)
- [menulink-technical-plan.md](../.openspec/specs/menulink-technical-plan.md)

---

**Versão**: 1.0  
**Última Atualização**: 2026-04-15  
**Autor**: AI Agent