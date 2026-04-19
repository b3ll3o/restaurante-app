# PediAi

## Visão Geral

SaaS multi-tenant para restaurantes com cardápio digital e pedidos via WhatsApp.

**Idioma**: Português Brasileiro (pt-BR)
**Versão**: 5.0
**Última Atualização**: 2026-04-19

---

## Stack

| Tecnologia | Versão |
|------------|--------|
| Next.js | 16.2.3 |
| React | 19 |
| TypeScript | strict |
| Tailwind CSS | 4 |
| Supabase | - |

---

## Arquitetura

- **Multi-tenant**: isolado por `restaurant_id`
- **Mobile-first**: otimizado para dispositivos móveis
- **Offline-first**: carrinho persiste em localStorage

---

## Estrutura de Diretórios

```
app/                    # Rotas (App Router)
├── admin/             # Painel administrativo
│   ├── auth/callback/ # Callback OAuth Supabase
│   ├── login/         # Login do admin
│   ├── signup/        # Cadastro de restaurante
│   ├── dashboard/     # Dashboard principal
│   ├── categories/    # CRUD de categorias
│   ├── products/      # CRUD de produtos
│   ├── orders/        # Gestão de pedidos
│   └── settings/      # Configurações do restaurante
├── menu/[slug]/       # Cardápio público dinâmico
│   └── checkout/      # Checkout do pedido
├── landing/           # Landing pages segmentadas
│   ├── pizzaria/
│   ├── hamburgueria/
│   ├── bar/
│   └── restaurante/
└── api/               # API Routes
    └── orders/        # Endpoint POST /api/orders
components/            # Componentes React
├── ui/               # shadcn/ui components
├── admin/            # Header, Sidebar, RestaurantSwitcher
├── landing/          # HeroSection, PillarsSection, etc.
└── offline-provider/ # Service Worker + Toaster
lib/                  # Utils, Supabase, WhatsApp, Analytics
├── supabase/         # Clientes (client/server)
├── schemas/          # Zod schemas para validação
├── whatsapp.ts       # Integração WhatsApp
├── analytics.ts     # Tracking de page views
├── utils.ts         # Funções utilitárias
├── result.ts        # Tipo Result/Either
└── sanitize.ts      # Sanitização de inputs
context/              # Contextos React
├── cart-context.tsx # Gerenciamento do carrinho
└── RestaurantContext.tsx # Contexto do restaurante
hooks/                # Custom hooks
├── useOnlineStatus.ts # Hook de status online/offline
types/                # Definições TypeScript
tests/                # Testes automatizados
├── unit/            # Testes unitários (Vitest)
├── integration/     # Testes de integração
└── e2e/            # Testes E2E (Playwright)
supabase/            # Schema SQL
public/              # Arquivos públicos
├── sw.js            # Service Worker
└── manifest.json    # PWA manifest
scripts/             # Scripts utilitários
docs/                # ADRs (Architecture Decision Records)
```

---

## Sub-módulos e AGENTS.md

Cada diretório possui seu próprio AGENTS.md com documentação detalhada:

| Módulo | Descrição |
|--------|-----------|
| `app/` | Rotas e App Router |
| `app/admin/` | Painel administrativo |
| `app/admin/login/` | Login do admin |
| `app/admin/signup/` | Cadastro |
| `app/admin/dashboard/` | Dashboard |
| `app/admin/categories/` | CRUD categorias |
| `app/admin/products/` | CRUD produtos |
| `app/admin/orders/` | Gestão pedidos |
| `app/admin/settings/` | Configurações |
| `app/api/` | API Routes |
| `app/api/orders/` | Endpoint pedidos |
| `app/menu/[slug]/` | Cardápio público |
| `app/landing/` | Landing pages |
| `components/` | Componentes |
| `components/ui/` | shadcn/ui |
| `components/admin/` | Admin components |
| `components/landing/` | Landing components |
| `components/offline-provider/` | Offline support |
| `context/` | Contextos React |
| `hooks/` | Custom hooks |
| `lib/` | Biblioteca utilitária |
| `tests/` | Infraestrutura de testes |
| `tests/unit/` | Testes unitários |
| `tests/integration/` | Testes de integração |
| `tests/e2e/` | Testes E2E |
| `supabase/` | Schema e config |
| `types/` | Definições TypeScript |

---

## Arquitetura Detalhada

### Server vs Client Components

- **Server Components** (default): Para busca de dados e renderização estática
- **Client Components** (`'use client'`): Para interatividade (forms, estados, eventos)

### Autenticação

- **Admin**: Rotas protegidas com verificação via Supabase Auth (client-side check no layout)
- **Menu público**: Aberto, sem autenticação

### Multi-tenant

- Cada restaurante é um tenant isolado por `restaurant_id`
- RLS (Row Level Security) do Supabase garante isolamento
- Dados filtrados automaticamente conforme o usuário autenticado

---

## Glossário

| Termo | Definição |
|-------|-----------|
| **Tenant** | Restaurante individual no sistema multi-tenant |
| **Slug** | Identificador único do restaurante na URL |
| **Order** | Pedido com itens, cliente e status |
| **RLS** | Row Level Security - segurança em nível de linha |
| **CartItem** | Item no carrinho com produto e quantidade |
| **OrderItem** | Item individual de um pedido |
| **WhatsApp API** | Integração com WhatsApp Business API |

---

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Servidor de desenvolvimento
npm run build            # Build de produção
npm run start            # Servidor de produção

# Qualidade de código
npm run lint             # Verifica ESLint
npm run lint:fix         # Corrige problemas de lint

# Testes
npm test                 # Testes unitários
npm run test:unit        # Testes unitários
npm run test:integration # Testes de integração
npm run test:e2e         # Testes E2E (Playwright)
npm run test:coverage    # Cobertura de código

# Geração de relatórios
npm run test:coverage:e2e # Relatório de cobertura E2E
```

---

## Dependências Principais

| Dependência | Versão | Uso |
|-------------|--------|-----|
| @supabase/supabase-js | ^2.103.0 | Banco de dados |
| @supabase/ssr | ^0.10.2 | SSR auth |
| lucide-react | ^1.8.0 | Ícones |
| @radix-ui/* | ^1.1.x | Primitives de UI |
| zod | ^4.3.6 | Validação runtime |
| vitest | ^4.1.4 | Test runner |
| @playwright/test | ^1.59.1 | Testes E2E |

---

## Regras de Qualidade

### Gates de Qualidade (Bloqueantes)

Antes de fazer commit, os seguintes comandos DEVEM passar:
- `npm run lint` (0 errors, 0 warnings)
- `npm run build` (Build passa)
- `npm run test:unit` (100% passando)
- `npx tsc --noEmit` (0 TypeScript errors)

### Cobertura de Testes

| Tipo | Target | Prioridade |
|------|--------|------------|
| Unitários | ≥80% | Alta |
| Integração | 100% cenários BDD | Alta |
| E2E | 100% fluxos críticos | Crítica |

### Responsividade

| Requisito | Descrição |
|-----------|-----------|
| Touch targets | Mínimo 44x44px |
| Overflow | Nenhum horizontal |
| Font-size | Mínimo 16px base |

---

**Versão**: 5.0
**Última Atualização**: 2026-04-19
**Autor**: AI Agent
