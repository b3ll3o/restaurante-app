# Supabase Client - MenuLink

## Visão Geral

**Módulo**: `lib/supabase/client`
**Responsabilidade**: Cliente Supabase para uso em navegadores (Client Components)
**Idioma**: Português Brasileiro (pt-BR)
**Stack**: Next.js 16.2.3 + React 19 + TypeScript + Supabase

---

## Estrutura de Diretórios

```
lib/supabase/client/
├── index.ts # createBrowserClient
└── AGENTS.md # Esta documentação
```
lib/supabase/client/
├── client.ts          # createBrowserClient
└── AGENTS.md          # Esta documentação
```

---

## Responsabilidade

Cria e exporta o cliente Supabase configurado para uso em navegadores. Utiliza `@supabase/ssr` para integração com Next.js App Router.

### Interface Pública

```typescript
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
// supabase.auth, supabase.from, etc.
```

---

## Arquitetura

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

---

## Uso

### Em Client Components

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
    // ...
  };

  return (/* ... */);
}
```

### Em Contextos (CartContext, etc.)

```typescript
// context/cart-context/CartContext.tsx
"use client";

import { createClient } from "@/lib/supabase/client";

export function CartProvider({ children }) {
  const supabase = createClient();
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
| `lib/supabase/server/index.ts` | Cliente server-side |
| `lib/supabase/server/AGENTS.md` | Documentação server |

---

**Versão**: 1.0
**Última Atualização**: 2026-04-16
**Autor**: AI Agent