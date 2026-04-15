# MenuLink - Technical Plan (SDD)

## 1. Visão Geral da Arquitetura

**Stack:**
- Frontend: Next.js 16.2.3 (App Router) + React 19
- Estilização: Tailwind CSS 4 (CSS-based config)
- Backend: Next.js API Routes
- Banco de Dados: Supabase (PostgreSQL)
- Autenticação: Supabase Auth
- Storage: Supabase Storage
- Notificações: WhatsApp Business API (Graph API v18.0)

**Arquitetura de Camadas:**
```
┌─────────────────────────────────────┐
│         interfaces/ (UI)            │
│  app/admin/*, app/menu/[slug]/*     │
├─────────────────────────────────────┤
│       application/ (Services)       │
│  API routes, business logic         │
├─────────────────────────────────────┤
│         domain/ (Entities)          │
│  types/, context/                   │
├─────────────────────────────────────┤
│      infrastructure/                │
│  lib/supabase/* (DB, Auth, Storage) │
└─────────────────────────────────────┘
```

---

## 2. Modelos de Dados

### 2.1 Restaurant
```typescript
interface Restaurant {
  id: UUID;           // PK, auto-generated
  slug: string;       // unique, URL-friendly identifier
  name: string;       // required
  owner_whatsapp: string; // required, formato internacional
  owner_id: UUID;     // FK to auth.users
  created_at: timestamptz;
}
```

### 2.2 Category
```typescript
interface Category {
  id: UUID;
  restaurant_id: UUID; // FK to restaurants
  name: string;        // required
  display_order: int;  // default 0
  created_at: timestamptz;
}
```

### 2.3 Product
```typescript
interface Product {
  id: UUID;
  category_id: UUID;   // FK to categories
  name: string;        // required
  description: text;   // optional
  price: decimal(10,2);// required
  image_url: text;     // optional, Supabase Storage URL
  is_available: bool;  // default true
  display_order: int;  // default 0
  created_at: timestamptz;
}
```

### 2.4 Order
```typescript
interface Order {
  id: UUID;
  restaurant_id: UUID; // FK to restaurants
  customer_name: string;
  customer_whatsapp: string;
  total: decimal(10,2);
  status: enum('pending', 'confirmed', 'cancelled');
  payment_method: enum('pix', 'cash');
  created_at: timestamptz;
}
```

### 2.5 OrderItem
```typescript
interface OrderItem {
  id: UUID;
  order_id: UUID;      // FK to orders
  product_id: UUID;    // FK to products
  product_name: string; // denormalized for history
  unit_price: decimal(10,2);
  quantity: int;
  total_price: decimal(10,2);
}
```

---

## 3. API Design

### 3.1 API Routes

#### `POST /api/orders`
Cria um novo pedido (público, sem autenticação)

**Request:**
```json
{
  "customerName": "string",
  "customerWhatsapp": "string",
  "paymentMethod": "pix" | "cash",
  "items": [
    {
      "product": { "id": "uuid", "name": "string", "price": number },
      "quantity": number
    }
  ],
  "total": number,
  "restaurantId": "uuid"
}
```

**Response (201):**
```json
{
  "success": true,
  "order": { ... }
}
```

**Errors:**
- 400: Missing required fields
- 404: Restaurant not found
- 500: Internal server error

#### `GET /api/orders` (futuro)
Lista pedidos do restaurante (requer auth)

### 3.2 Autenticação

- **Método:** Supabase Auth (email/password)
- **Sessão:** cookies via `@supabase/ssr`
- **Proteção de rotas:** admin/* requerem verificação de sessão

### 3.3 Webhooks/Callbacks

#### `GET /admin/auth/callback`
- Rota de callback do Supabase Auth após login/signup
- Extrai código de autorização e troca por sessão

---

## 4. Diagrama de Relacionamentos

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  Restaurant │───────│  Category   │───────│   Product   │
└─────────────┘  1:N  └─────────────┘  1:N  └─────────────┘
     │                                       │
     │ 1:N                                   │
     ▼                                       │
┌─────────────┐       ┌─────────────┐       │
│    Order    │───────│  OrderItem  │◄──────┘
└─────────────┘  1:N  └─────────────┘   N:1
```

---

## 5. Restrições Técnicas

### 5.1 Segurança
- RLS (Row Level Security) habilitado em todas as tabelas
- Policies baseadas em `auth.uid()` para operações do owner
- Público (sem auth): leitura de restaurants/categories/products, criação de orders
- Admin: CRUD completo via Supabase Auth

### 5.2 Storage
- Bucket `product-images` com acesso público
- Policy: qualquer pessoa pode fazer upload/ler imagens

### 5.3 WhatsApp Business API
- Endpoint: `https://graph.facebook.com/v18.0/{phoneNumberId}/messages`
- Autenticação: Bearer token
- Fallback: se token não configurado, apenas redireciona WhatsApp direto

---

## 6. Estrutura de Diretórios

```
app/
├── admin/
│   ├── layout.tsx           # Layout com sidebar + auth check
│   ├── login/page.tsx       # Login via Supabase Auth
│   ├── signup/page.tsx      # Cadastro + criação restaurant
│   ├── dashboard/page.tsx   # Estatísticas
│   ├── categories/page.tsx  # CRUD categorias
│   ├── products/page.tsx    # CRUD produtos + upload
│   ├── orders/page.tsx      # Gestão de pedidos
│   ├── settings/page.tsx    # Config restaurant
│   └── auth/callback/route.ts # Callback auth
├── api/
│   └── orders/route.ts      # POST: criar pedido
├── menu/[slug]/
│   └── page.tsx             # Cardápio público
└── page.tsx                 # Landing page

components/
├── ui/                      # shadcn/ui components
│   └── [shadcn components]
└── admin/                   # Admin-specific components
    ├── sidebar.tsx
    └── header.tsx

context/
└── cart-context.tsx         # Cart state management

lib/
├── utils.ts                 # cn() helper
└── supabase/
    ├── client.ts            # createBrowserClient
    └── server.ts            # createServerClient (SSR)

types/
└── index.ts                 # TypeScript interfaces

supabase/
└── schema.sql               # Database schema + RLS
```

---

## 7. Environment Variables

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave pública do Supabase | `eyJ...` |
| `WHATSAPP_TOKEN` | Token da WhatsApp Business API | `EAAJ...` |
| `WHATSAPP_PHONE_NUMBER_ID` | Phone Number ID do WhatsApp | `123456789` |

---

## 8. Fluxo de Dados

### 8.1 Checkout Flow
```
Client                    Next.js              Supabase           WhatsApp API
  │                          │                     │                    │
  │──POST /api/orders───────►│                     │                    │
  │                          │──insert order──────►│                    │
  │                          │                     │                    │
  │                          │──insert items──────►│                    │
  │                          │                     │                    │
  │                          │─────────────────────│──send message─────►│
  │                          │                     │                    │
  │◄─201 { success }─────────│                     │                    │
  │                          │                     │                    │
  │──redirect WhatsApp──────►│                     │                    │
```

### 8.2 Admin Auth Flow
```
Admin              Next.js              Supabase Auth
  │                    │                      │
  │──GET /admin/login──►│                      │
  │◄──render form───────│                      │
  │                    │                      │
  │──POST /auth────────►│──verify────────────►│
  │                    │                      │
  │                    │◄──set cookie─────────│
  │◄──redirect dashboard│                      │
```

---

## 9. Versionamento

| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 1.0 | 2026-04-15 | AI Agent | Versão inicial |