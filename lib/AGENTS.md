# Library (lib/) - MenuLink

## Visão Geral

O módulo **Library** (`lib/`) contém utilitários, serviços e clientes de infraestrutura reutilizáveis em toda a aplicação.

**Idioma**: Português Brasileiro (pt-BR)
**Stack**: TypeScript (strict) + Supabase + WhatsApp API

---

## Estrutura de Diretórios

```
lib/
├── utils.ts # Funções utilitárias (formatação, validação, slugs)
├── whatsapp.ts # Serviço de integração WhatsApp API
└── supabase/ # Clientes Supabase (browser + server)
├── client/     # Cliente browser (Client Components)
└── server/     # Cliente server (Server Components + API Routes)
```
lib/
├── utils.ts          # Funções utilitárias (formatação, validação, slugs)
├── whatsapp.ts       # Serviço de integração WhatsApp API
└── supabase/         # Clientes Supabase (browser + server)
    ├── client.ts     # Cliente browser (Client Components)
    └── server.ts     # Cliente server (Server Components + API Routes)
```

---

## Sub-módulos

| Sub-módulo | Arquivo | Responsabilidade |
|------------|---------|------------------|
| **Utils** | `lib/utils.ts` | Funções utilitárias puras |
| **WhatsApp** | `lib/whatsapp.ts` | Integração WhatsApp API |
| **Supabase** | `lib/supabase/` | Clientes database/auth (client + server) |

### Documentação Detalhada

Cada sub-módulo possui seu próprio `AGENTS.md`:

- `lib/utils/AGENTS.md`
- `lib/whatsapp/AGENTS.md`
- `lib/supabase/AGENTS.md` - Visão geral
  - `lib/supabase/client/AGENTS.md` - Cliente browser
  - `lib/supabase/server/AGENTS.md` - Cliente server

---

## Dependências Globais

| Dependência | Versão | Uso |
|-------------|--------|-----|
| @supabase/ssr | ^0.10.2 | SSR auth |
| @supabase/supabase-js | ^2.103.0 | Cliente DB |
| clsx | ^2.1.1 | Concatenação classes |
| tailwind-merge | ^3.5.0 | Merge classes |

---

**Versão**: 1.2
**Última Atualização**: 2026-04-17
**Autor**: AI Agent