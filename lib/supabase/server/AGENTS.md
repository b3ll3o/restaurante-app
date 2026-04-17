# Supabase Server - MenuLink

## Visão Geral

**Módulo**: `lib/supabase/server`
**Responsabilidade**: Cliente Supabase configurado para Server Components e API Routes com suporte a cookies de autenticação via `createServerClient` do `@supabase/ssr`.
**Idioma**: Português Brasileiro (pt-BR)
**Stack**: Next.js 16.2.3 + React 19 + TypeScript + Supabase + @supabase/ssr

---

## Estrutura de Diretórios

```
lib/supabase/server/
├── index.ts # createServerClient com cookies
└── AGENTS.md # Esta documentação
```

---

## Responsabilidade

Cria e exporta o cliente Supabase configurado para uso em Server Components e API Routes. Gerencia cookies de forma assíncrona para autenticação SSR.

### Interface Pública

```typescript
import { createClient } from '@/lib/supabase/server';

const supabase = await createClient();
// supabase.auth, supabase.from, supabase.storage, etc.
```

---

## Função `createServerClient`

### Assinatura

```typescript
export async function createClient(): Promise<SupabaseClient>
```

### Parâmetros

**Cookie Options** (via `createServerClient`):

| Opção | Tipo | Descrição |
|-------|------|-----------|
| `cookies.getAll()` | `() => Cookie[]` | Retorna todos os cookies do request |
| `cookies.setAll(cookiesToSet)` | `(cookies: Cookie[]) => void` | Define múltiplos cookies no response |

**Cookie Object Structure**:

```typescript
interface Cookie {
  name: string;           // Nome do cookie
  value: string;          // Valor do cookie
  options?: {             // Opções opcionais
    maxAge?: number;      // Tempo de vida em segundos
    path?: string;        // Caminho (default: '/')
    domain?: string;      // Domínio do cookie
    secure?: boolean;     // HTTPS only
    httpOnly?: boolean;   // Não acessível via JS
    sameSite?: 'lax' | 'strict' | 'none';  // CSRF protection
  }
}
```

---

## Arquitetura

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
            // O método setAll foi chamado de um Server Component.
            // Pode ser ignorado se middleware está renovando sessões.
          }
        },
      },
    }
  );
}
```

### Fluxo de Autenticação

```
Request → Middleware (renova sessão) → Server Component/API Route
                                        ↓
                              createClient() → cookieStore.getAll()
                                        ↓
                              Supabase Client (com sessão)
                                        ↓
                              Operações autenticadas
```

---

## Uso

### Em Server Components

```typescript
// app/menu/[slug]/page.tsx
import { createClient } from "@/lib/supabase/server";

export default async function MenuPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!restaurant) notFound();

  return <MenuLayout restaurant={restaurant} />;
}
```

### Em API Routes

```typescript
// app/api/orders/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { data, error } = await supabase
    .from("orders")
    .insert({ ...body, owner_id: user.id })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
```

### Em Auth Callback

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

## Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Sim | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sim | Chave anônima pública do Supabase |

**Importante**: Estas variáveis são públicas (`NEXT_PUBLIC_`) porque o `createServerClient` precisa delas no build.

---

## Regras de Implementação

### 1. Sempre Use `await`

```typescript
// ✅ Correto
const supabase = await createClient();

// ❌ Incorreto - Promise não resolvida
const supabase = createClient();
```

### 2. Try-Catch em `setAll`

O bloco `try-catch` no `setAll` é necessário porque Server Components podem chamar `setAll` em contextos onde cookies não podem ser modificados.

```typescript
setAll(cookiesToSet) {
  try {
    cookiesToSet.forEach(({ name, value, options }) =>
      cookieStore.set(name, value, options)
    );
  } catch {
    // Ignorar em Server Components se middleware renova sessões
  }
}
```

### 3. Middleware para Renovação de Sessão

O `createServerClient` requer middleware para renovação automática de sessões:

```typescript
// middleware.ts
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

### 4. Sempre Verifique `error`

```typescript
// ✅ Correto
const { data, error } = await supabase.from("orders").select();
if (error) {
  console.error("Erro ao buscar pedidos:", error.message);
  return;
}

// ❌ Incorreto
const { data } = await supabase.from("orders").select();
// data pode ser null se erro ocorreu
```

### 5. Não Use em Client Components

```typescript
// ❌ ERRADO - server.ts não deve ser importado em Client Components
"use client";
import { createClient } from "@/lib/supabase/server"; // NÃO FAÇA ISSO

// ✅ Correto - Use client.ts em Client Components
"use client";
import { createClient } from "@/lib/supabase/client";
```

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura unitária | ≥80% | Alta |
| Tempo de resposta API | <200ms | Média |
| Erros de autenticação | 0% | Crítica |

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| @supabase/ssr | ^0.10.2 | createServerClient com cookies |
| @supabase/supabase-js | ^2.103.0 | SupabaseClient |

---

## Arquivos Relacionados

| Arquivo | Relação |
|---------|---------|
| `lib/supabase/client/index.ts` | Cliente browser (Client Components) |
| `lib/supabase/client/AGENTS.md` | Documentação cliente browser |
| `lib/supabase/middleware.ts` | Renovação de sessão (se existir) |
| `middleware.ts` | Middleware raiz para auth |

---

## Referências

- [Supabase SSR Auth](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [@supabase/ssr](https://www.npmjs.com/package/@supabase/ssr)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)

---

**Versão**: 1.1
**Última Atualização**: 2026-04-17
**Autor**: AI Agent