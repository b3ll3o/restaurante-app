# Admin - PediAi

## Visão Geral

O módulo **Admin** (`app/admin/`) é o painel administrativo completo para donos de restaurantes gerenciarem seus cardápios, produtos e pedidos. O módulo é protegido por autenticação Supabase e segue uma arquitetura multi-tenant onde cada restaurante é um tenant isolado.

**Idioma**: Português Brasileiro (pt-BR)
**Stack**: Next.js 16.2.3 + React 19 + TypeScript (strict) + Supabase + Tailwind CSS 4
**Autenticação**: Supabase Auth (email/password)

---

## Estrutura de Diretórios

```
app/admin/
├── layout.tsx          # Layout principal com auth check (client-side)
├── auth/
│   └── callback/
│       └── route.ts    # Callback OAuth do Supabase
├── login/              # [AGENTS.md] Login do painel admin
├── signup/             # [AGENTS.md] Cadastro de restaurante
├── dashboard/          # [AGENTS.md] Dashboard principal
├── categories/         # [AGENTS.md] CRUD de categorias
├── products/           # [AGENTS.md] CRUD de produtos
├── orders/             # [AGENTS.md] Gestão de pedidos
└── settings/           # [AGENTS.md] Configurações do restaurante
```

---

## Arquitetura

### Autenticação

O admin utiliza **client-side auth check** através do `layout.tsx`. Todas as rotas exceto `/login` e `/signup` requerem autenticação.

O fluxo de autenticação:
1. Usuário não autenticado é redirecionado para `/admin/login`
2. Login via Supabase `signInWithPassword`
3. Callback OAuth em `/admin/auth/callback` troca código por sessão
4. Sessão persistida via cookies HTTP-only

### Multi-Tenant

Cada restaurante é um tenant isolado. O `restaurant_id` é obtido através do `owner_id` do usuário autenticado:

```typescript
const { data: { user } } = await supabase.auth.getUser();
const { data: restaurant } = await supabase
  .from("restaurants")
  .select("*")
  .eq("owner_id", user.id)
  .single();
```

---

## Sub-módulos

Cada rota do admin possui seu próprio AGENTS.md no nível de proximidade:

| Rota | AGENTS.md | Descrição |
|------|-----------|-----------|
| `app/admin/login/` | `login/AGENTS.md` | Autenticação do administrador |
| `app/admin/signup/` | `signup/AGENTS.md` | Cadastro de novo restaurante |
| `app/admin/dashboard/` | `dashboard/AGENTS.md` | Visão geral com estatísticas |
| `app/admin/categories/` | `categories/AGENTS.md` | CRUD de categorias do cardápio |
| `app/admin/products/` | `products/AGENTS.md` | CRUD de produtos com imagens |
| `app/admin/orders/` | `orders/AGENTS.md` | Gestão de pedidos |
| `app/admin/settings/` | `settings/AGENTS.md` | Informações do restaurante |
| `app/admin/auth/callback/` | `auth/callback/AGENTS.md` | Callback OAuth |

---

## Componentes

### Header (`components/admin/header.tsx`)

Cabeçalho do painel com email do usuário e botão de logout.

### Sidebar (`components/admin/sidebar.tsx`)

Menu lateral de navegação com links para todas as rotas do admin.

---

## Regras de Implementação

1. **Client Components**: Todas as páginas usam `'use client'` por dependerem de estado e efeitos
2. **Proteção de Rotas**: Verificação de autenticação em todas as rotas exceto login/signup
3. **Filtragem por Restaurant**: Queries filtradas por `restaurant_id` do usuário autenticado
4. **Feedback Visual**: Loading states, mensagens de sucesso/erro, botões disabled durante operações

---

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima do Supabase |
| `WHATSAPP_TOKEN` | Token da API WhatsApp Business |
| `WHATSAPP_PHONE_NUMBER_ID` | ID do número de telefone |

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| @supabase/ssr | ^0.10.2 | Cliente Supabase com SSR |
| @supabase/supabase-js | ^2.103.0 | Cliente banco de dados |
| lucide-react | ^1.8.0 | Ícones |
| tailwindcss | ^4 | Estilização |

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura de testes | ≥80% | Alta |
| Tempo de carregamento | <2s | Média |
| Complexidade ciclomática | ≤10 | Média |

---

## Referências

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Spec: pediai-specification.md](../../opencode/openspec/specs/pediai-specification.md)
- [Spec: pediai-technical-plan.md](../../opencode/openspec/specs/pediai-technical-plan.md)

---

**Versão**: 1.0
**Última Atualização**: 2026-04-17
**Autor**: AI Agent