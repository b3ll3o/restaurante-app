# Supabase Server - MenuLink

## Visão Geral

**Módulo**: `lib/supabase/server`
**Responsabilidade**: Cliente Supabase para uso em Server Components e API Routes
**Idioma**: Português Brasileiro (pt-BR)
**Stack**: Next.js 16.2.3 + React 19 + TypeScript + Supabase

---

## Estrutura de Diretórios

```
lib/supabase/server/
├── server.ts          # createServerClient
└── AGENTS.md          # Esta documentação
```

---

## Responsabilidade

Cria e exporta o cliente Supabase configurado para uso em Server Components e API Routes. Gerencia cookies de forma assíncrona para autenticação SSR.

### Interface Pública

```typescript
import { createClient } from '@/lib/supabase/server';

const supabase = await createClient();
// supabase.auth, supabase.from, etc.
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
            // Server Component - ignora
          }
        },
      },
    }
  );
}
```

---

## Uso

### Em Server Components

```typescript
// app/menu/[slug]/page.tsx
import { createClient } from "@/lib/supabase/server";

export default async function MenuPage({ params }) {
  const supabase = await createClient();

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", params.slug)
    .single();

  // ...
}
```

### Em API Routes

```typescript
// app/api/orders/route.ts
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  // ...
}
```

---

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima do Supabase |

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura unitária | ≥80% | Alta |

---

## Arquivos Relacionados

| Arquivo | Relação |
|---------|---------|
| `lib/supabase/client.ts` | Cliente client-side |
| `lib/supabase/client/AGENTS.md` | Documentação client |

---

**Versão**: 1.0
**Última Atualização**: 2026-04-16
**Autor**: AI Agent