# Supabase Clients - MenuLink

## Visão Geral

O módulo **Supabase Clients** (`lib/supabase/`) contém os clientes configurados do Supabase para diferentes ambientes de execução. O Supabase é usado para autenticação e banco de dados.

**Idioma**: Português Brasileiro (pt-BR)
**Stack**: TypeScript (strict) + @supabase/ssr

---

## Estrutura de Diretórios

```
lib/supabase/
├── client.ts    # Cliente para browser (Client Components)
└── server.ts    # Cliente para server (Server Components + API Routes)
```

---

## Cliente Browser (`client.ts`)

### Responsabilidade

Cliente Supabase configurado para uso em **Client Components** (browser). Usa `createBrowserClient` do `@supabase/ssr`.

### Quando Usar

- Componentes com `"use client"`
- Páginas do admin
- Handlers de eventos
- Qualquer código que executa no browser

### Implementação

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### Uso

```typescript
// app/admin/login/page.tsx
"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();

  const handleLogin = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(error.message);
      return;
    }

    // Login bem sucedido
    console.log("User:", data.user);
  };

  return <button onClick={() => handleLogin("email", "pass")}>Login</button>;
}
```

---

## Cliente Server (`server.ts`)

### Responsabilidade

Cliente Supabase configurado para uso em **Server Components** e **API Routes**. Usa `createServerClient` do `@supabase/ssr` com suporte a cookies.

### Quando Usar

- Server Components (App Router)
- API Routes (`app/api/`)
- Server Actions
- Qualquer código que executa no servidor

### Implementação

```typescript
// lib/supabase/server.ts
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

### Uso

```typescript
// app/api/orders/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  // Buscar sessão do usuário (se necessário)
  const { data: { user } } = await supabase.auth.getUser();

  // Operações no banco...
  const { data, error } = await supabase
    .from("orders")
    .insert({ ... })
    .select()
    .single();

  return NextResponse.json({ data }, { status: 201 });
}
```

```typescript
// app/admin/dashboard/page.tsx (Server Component)
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("owner_id", session.user.id)
    .single();

  return <div>{restaurant?.name}</div>;
}
```

---

## Operações Comuns

### Autenticação

```typescript
const supabase = createClient(); // ou await createClient()

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
    data: {
      restaurant_name: "Meu Restaurante",
    },
  },
});

// Logout
await supabase.auth.signOut();

// Session atual
const { data: { session } } = await supabase.auth.getSession();

// Usuário atual
const { data: { user } } = await supabase.auth.getUser();

// Listener de auth state
const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_OUT") {
    // Usuário deslogou
  }
});

// Cleanup
subscription.unsubscribe();
```

### CRUD Genérico

```typescript
// Create
const { data, error } = await supabase
  .from("products")
  .insert([{ name: "Pizza", price: 45.90, category_id: "uuid" }])
  .select()
  .single();

// Read
const { data, error } = await supabase
  .from("products")
  .select("*, category:categories(name)")
  .eq("restaurant_id", restaurantId)
  .order("display_order")
  .limit(10);

// Update
const { data, error } = await supabase
  .from("products")
  .update({ is_available: false })
  .eq("id", productId)
  .select()
  .single();

// Delete
const { error } = await supabase
  .from("products")
  .delete()
  .eq("id", productId);
```

### Queries Avançadas

```typescript
// Join com select
const { data } = await supabase
  .from("products")
  .select(`
    *,
    category:categories(id, name)
  `)
  .eq("is_available", true);

// Contagem
const { count } = await supabase
  .from("orders")
  .select("id", { count: "exact" })
  .eq("status", "pending");

// Filtros compostos
const { data } = await supabase
  .from("products")
  .select("*")
  .eq("category_id", categoryId)
  .eq("is_available", true)
  .gte("price", minPrice)
  .lte("price", maxPrice)
  .order("price", { ascending: true });
```

---

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima do Supabase |

**Importante**: Estas variáveis devem começar com `NEXT_PUBLIC_` porque são usadas em Client Components.

---

## Regras de Implementação

### 1. Escolha Correta do Cliente

```typescript
// ✅ Correto: Server Component usa createClient do server
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient();

// ✅ Correto: Client Component usa createClient do client
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

// ❌ Incorreto: API Route usando cliente de browser
import { createClient } from "@/lib/supabase/client"; // ERRADO!
```

### 2. Sempre Aguarde createClient em Server

```typescript
// ✅ Correto: await em server
const supabase = await createClient();

// ❌ Incorreto: sem await
const supabase = createClient(); // Promise não resolvida!
```

### 3. Error Handling

```typescript
// ✅ Correto: verificar error
const { data, error } = await supabase.from("products").select();
if (error) {
  console.error("Erro ao buscar produtos:", error.message);
  return;
}

// ❌ Incorreto: ignorar error
const { data } = await supabase.from("products").select();
// data pode ser null se erro ocorreu
```

### 4. Cleanup de Subscriptions

```typescript
// ✅ Correto: cleanup em useEffect
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(...);
  return () => subscription.unsubscribe();
}, [supabase.auth]);

// ❌ Incorreto: sem cleanup
useEffect(() => {
  supabase.auth.onAuthStateChange(...);
  // Memory leak!
}, []);
```

---

## Autenticação Callback

O callback de autenticação OAuth usa o cliente server:

```typescript
// app/admin/auth/callback/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}/admin/dashboard`);
    }
  }

  return NextResponse.redirect(`${origin}/admin/login?error=auth_callback_failed`);
}
```

---

## Storage (Supabase Storage)

O Supabase Storage é usado para upload de imagens de produtos:

```typescript
// Upload de imagem
const { error: uploadError } = await supabase.storage
  .from("product-images")
  .upload(filePath, file);

if (uploadError) {
  return null;
}

// Obter URL pública
const { data } = supabase.storage
  .from("product-images")
  .getPublicUrl(filePath);

return data.publicUrl;
```

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura de testes | ≥90% | Crítica |
| Tempo de resposta | <200ms | Média |

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| @supabase/ssr | ^0.10.2 | Cliente SSR |
| @supabase/supabase-js | ^2.103.0 | Cliente DB |

---

## Referências

- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Database](https://supabase.com/docs/guides/database)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [@supabase/ssr](https://supabase.com/docs/guides/auth/server-side/nextjs)

---

**Versão**: 1.0
**Última Atualização**: 2026-04-16
**Autor**: AI Agent