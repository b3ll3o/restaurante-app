# App Router - MenuLink

## Visão Geral

O módulo **App Router** é o núcleo da aplicação Next.js 16.2.3, utilizando o novo App Router com React Server Components (RSC). Este módulo é responsável por todas as rotas da aplicação.

**Idioma**: Português Brasileiro (pt-BR)
**Stack**: Next.js 16.2.3 + React 19 + TypeScript (strict)

---

## Estrutura de Diretórios

```app/
├── admin/              # Painel administrativo (protegido)
│   ├── auth/callback/  # Callback de autenticação Supabase
│   ├── categories/     # Gestão de categorias
│   ├── dashboard/      # Dashboard principal
│   ├── login/          # Página de login
│   ├── orders/         # Gestão de pedidos
│   ├── products/       # Gestão de produtos
│   ├── settings/       # Configurações do restaurante
│   ├── signup/         # Página de cadastro
│   └── layout.tsx      # Layout do admin (client-side auth)
├── api/                # API Routes
│   └── orders/         # Endpoint de criação de pedidos
├── menu/               # Cardápio público
│   └── [slug]/         # Cardápio dinâmico por restaurante
├── layout.tsx          # Layout raiz (Server Component)
├── page.tsx            # Página inicial
└── globals.css         # Estilos globais + Tailwind 4
```

---

## Arquitetura Geral

### Server vs Client Components

- **Server Components** (default): Para busca de dados e renderização estática
- **Client Components** (`'use client'`): Para interatividade (forms, estados, eventos)

### Autenticação

- **Admin**: Rotas protegidas com verificação via Supabase Auth (client-side check no layout)
- **Menu público**: Aberto, sem autenticação

### Multi-tenant

- Cada restaurante é um tenant isolado por `restaurant_id`
- Dados filtrados automaticamente conforme o usuário autenticado

---

## Sub-módulos e AGENTS.md

Cada sub-módulo possui seu próprio AGENTS.md com documentação detalhada:

| Sub-módulo | AGENTS.md | Descrição |
|------------|-----------|-----------|
| `app/admin/login/` | `admin/login/AGENTS.md` | Login do painel admin |
| `app/admin/signup/` | `admin/signup/AGENTS.md` | Cadastro de restaurante |
| `app/admin/dashboard/` | `admin/dashboard/AGENTS.md` | Dashboard principal |
| `app/admin/categories/` | `admin/categories/AGENTS.md` | CRUD de categorias |
| `app/admin/products/` | `admin/products/AGENTS.md` | CRUD de produtos |
| `app/admin/orders/` | `admin/orders/AGENTS.md` | Gestão de pedidos |
| `app/admin/settings/` | `admin/settings/AGENTS.md` | Configurações |
| `app/api/orders/` | `api/orders/AGENTS.md` | Endpoint de pedidos |
| `app/menu/[slug]/` | `menu/[slug]/AGENTS.md` | Cardápio público |

---

## Regras de Implementação

1. **Server Components**: Usar para busca de dados e renderização estática
2. **Client Components**: Usar `'use client'` apenas quando necessário (interatividade)
3. **Autenticação**: Verificar via Supabase em todas as rotas admin
4. **Multi-tenant**: Sempre filtrar queries por `restaurant_id`
5. **Validação**: Validar inputs em API routes antes de processar
6. **Responsividade**: Seguir mobile-first com breakpoints Tailwind

---

## Design Responsivo

### Breakpoints

O projeto utiliza os breakpoints padrão do Tailwind CSS:

| Breakpoint | Largura | Tailwind Prefix | Uso |
|------------|---------|-----------------|-----|
| Mobile | < 768px | Default (mobile-first) | Layouts compactos |
| Tablet | 768px - 1023px | `md:` | Tablets e telas médias |
| Desktop | ≥ 1024px | `lg:` | Desktop e telas grandes |

### Mobile-First

O projeto segue a metodologia **mobile-first**:
1. Estilos base são definidos para mobile
2. breakpoints maiores (`md:`, `lg:`) adicionam estilos para telas maiores

```tsx
// ✅ Mobile-first
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

// ❌ Desktop-first (evitar)
<div className="grid grid-cols-4 md:grid-cols-2 grid-cols-1">
```

### Touch Targets

Todos os elementos interativos **DEVEM** ter touch target mínimo de 44x44px:

```css
/* app/globals.css */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}
```

| Requisito | Descrição | Ref |
|-----------|-----------|-----|
| REQ-RESP-08 | Touch targets mínimo 44x44px | spec.md |
| REQ-RESP-11 | Touch targets em todos breakpoints | spec.md |

### Overflow Horizontal

O projeto **NÃO DEVE** ter overflow horizontal em nenhum breakpoint:

```css
/* app/globals.css */
body {
  overflow-x: hidden;
}
```

| Requisito | Descrição | Ref |
|-----------|-----------|-----|
| REQ-RESP-09 | Nenhum overflow horizontal | spec.md |
| REQ-RESP-12 | Overflow-x: hidden em todos breakpoints | spec.md |

### Tipografia Responsiva

| Elemento | Tamanho Mínimo | Ref |
|----------|----------------|-----|
| Corpo de texto | 16px | REQ-RESP-10, REQ-RESP-13 |
| Linha altura | 1.5 | REQ-RESP-10 |
| Contraste | 4.5:1 (normal), 3:1 (grande) | REQ-RESP-14 |

### Sidebar Responsiva

| Breakpoint | Comportamento | Implementação |
|------------|---------------|---------------|
| Mobile (<1024px) | Drawer (Sheet) | `<Sheet>` com `side="left"` |
| Desktop (≥1024px) | Sidebar fixa | `<aside className="w-64">` |

### Layouts Adaptativos Comuns

**Table → Cards (Admin)**:
```tsx
<Table className="hidden lg:block" />
<div className="grid gap-4 lg:hidden">
  {/* Cards */}
</div>
```

**Grid 1→2 colunas (Products)**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
```

**FAB Cart (Mobile)**:
```tsx
<Button className="fixed bottom-6 right-6 pb-24">
  <ShoppingCart />
</Button>
```

---

## Dependências

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

## Referências

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [menulink-specification.md](../.openspec/specs/menulink-specification.md)
- [menulink-technical-plan.md](../.openspec/specs/menulink-technical-plan.md)

---

**Versão**: 1.1
**Última Atualização**: 2026-04-17
**Autor**: AI Agent