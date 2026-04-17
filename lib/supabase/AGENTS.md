# Supabase Clients - MenuLink

## Visão Geral

O módulo **Supabase Clients** (`lib/supabase/`) contém os clientes configurados do Supabase para diferentes ambientes de execução. O Supabase é usado para autenticação e banco de dados.

**Idioma**: Português Brasileiro (pt-BR)
**Stack**: TypeScript (strict) + @supabase/ssr

---

## Estrutura de Diretórios

```
lib/supabase/
├── client/     # Cliente browser (Client Components)
│   ├── index.ts
│   └── AGENTS.md
└── server/     # Cliente server (Server Components + API Routes)
    ├── index.ts
    └── AGENTS.md
```

---

## Clientes

| Cliente | Diretório | Uso | Autenticação |
|---------|-----------|-----|--------------|
| Browser | `client/` | Client Components | `createBrowserClient` |
| Server | `server/` | Server Components, API Routes | `createServerClient` com cookies |

---

## Interface Pública

| Função | Escopo | Descrição |
|--------|--------|-----------|
| `createClient()` | Browser | Cria cliente Supabase (não async) |
| `createClient()` | Server | Cria cliente Supabase (async, com cookies) |

---

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima do Supabase |

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| @supabase/ssr | ^0.10.2 | Cliente SSR |
| @supabase/supabase-js | ^2.103.0 | Cliente DB |

---

## Documentação Detalhada

Para implementação e exemplos, consulte:

- `lib/supabase/client/AGENTS.md` - Cliente browser
- `lib/supabase/server/AGENTS.md` - Cliente server

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura de testes | ≥90% | Crítica |

---

## Referências

- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Database](https://supabase.com/docs/guides/database)
- [@supabase/ssr](https://supabase.com/docs/guides/auth/server-side/nextjs)

---

**Versão**: 2.0
**Última Atualização**: 2026-04-17
**Autor**: AI Agent