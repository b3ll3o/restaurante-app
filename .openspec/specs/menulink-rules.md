# MenuLink - Regras do Projeto

## Visão Geral

Este documento é a **fonte centralizada de todas as regras** do projeto MenuLink. Todas as implementações, decisões técnicas e processos derivam deste documento.

**Última Atualização**: 2026-04-17
**Versão**: 1.2

---

## Índice

1. [Regras de Negócio](#1-regras-de-negócio)
2. [Regras de Arquitetura](#2-regras-de-arquitetura)
3. [Regras de Qualidade](#3-regras-de-qualidade)
4. [Regras de Documentação](#4-regras-de-documentação)
5. [Regras de Mobile-First](#5-regras-de-mobile-first)
6. [Regras de Offline-First](#6-regras-de-offline-first)
7. [Regras de Testes](#7-regras-de-testes)
8. [Regras de Commits](#8-regras-de-commits)
 9. [Fluxos Procedimentais](#9-fluxos-procedimentais)
 10. [Regras de Reutilização de Código](#10-regras-de-reutilização-de-código)

---

## 1. Regras de Negócio

### 1.1 Gestão de Restaurante

| ID | Regra | Prioridade |
|----|-------|------------|
| REQ-001 | O sistema **DEVE** permitir que um usuário crie uma conta e registre seu restaurante | MUST |
| REQ-002 | O sistema **DEVE** gerar automaticamente um slug único baseado no nome do restaurante | MUST |
| REQ-003 | O restaurante **DEVE** possuir um número de WhatsApp válido para receber pedidos | MUST |
| REQ-004 | O dono **PODE** atualizar o nome e WhatsApp do seu restaurante | MAY |

### 1.2 Gestão de Categorias

| ID | Regra | Prioridade |
|----|-------|------------|
| REQ-010 | O sistema **DEVE** permitir que o owner crie categorias para seu restaurante | MUST |
| REQ-011 | Cada categoria **DEVE** pertencer a um único restaurante | MUST |
| REQ-012 | As categorias **DEVEM** ser ordenadas por `display_order` | MUST |
| REQ-013 | O owner **PODE** editar, reordenar e deletar categorias | MAY |

### 1.3 Gestão de Produtos

| ID | Regra | Prioridade |
|----|-------|------------|
| REQ-020 | O sistema **DEVE** permitir que o owner adicione produtos às categorias | MUST |
| REQ-021 | Cada produto **DEVE** pertencer a uma única categoria | MUST |
| REQ-022 | O produto **DEVE** possuir: nome (obrigatório), preço (obrigatório), descrição (opcional), imagem (opcional) | MUST |
| REQ-023 | O produto **PODE** estar disponível ou indisponível (`is_available`) | MAY |
| REQ-024 | Produtos indisponíveis **NÃO DEVEM** aparecer no cardápio público | MUST NOT |
| REQ-025 | Os produtos **DEVEM** ser ordenados por `display_order` | MUST |
| REQ-026 | O owner **PODE** fazer upload de imagens para produtos via Supabase Storage | MAY |

### 1.4 Cardápio Público

| ID | Regra | Prioridade |
|----|-------|------------|
| REQ-030 | O sistema **DEVE** exibir o cardápio público via `/menu/[slug]` | MUST |
| REQ-031 | O cardápio **DEVE** mostrar apenas produtos com `is_available = true` | MUST |
| REQ-032 | O cardápio **DEVE** agrupar produtos por categoria | MUST |
| REQ-033 | O customer **PODE** adicionar/remover produtos do carrinho | MAY |
| REQ-034 | O carrinho **DEVE** persistir durante a sessão (context React) | MUST |

### 1.5 Finalização de Pedido

| ID | Regra | Prioridade |
|----|-------|------------|
| REQ-040 | O customer **DEVE** informar nome e WhatsApp para fazer pedido | MUST |
| REQ-041 | O customer **DEVE** escolher forma de pagamento (PIX ou Dinheiro) | MUST |
| REQ-042 | O sistema **DEVE** criar o pedido no banco de dados com status "pending" | MUST |
| REQ-043 | O sistema **DEVE** criar os OrderItems associados ao pedido | MUST |
| REQ-044 | Após pedido confirmado, **DEVE** redirecionar customer para WhatsApp do restaurante | MUST |
| REQ-045 | O sistema **DEVE** enviar notificação via WhatsApp Business API para o owner (se configurado) | MUST |

### 1.6 Gestão de Pedidos (Admin)

| ID | Regra | Prioridade |
|----|-------|------------|
| REQ-050 | O owner **DEVE** visualizar todos os pedidos do seu restaurante | MUST |
| REQ-051 | O owner **PODE** ver os detalhes de cada pedido (itens, cliente, pagamento) | MAY |
| REQ-052 | O owner **PODE** confirmar um pedido (status: pending → confirmed) | MAY |
| REQ-053 | O owner **PODE** cancelar um pedido (status: pending → cancelled) | MAY |
| REQ-054 | O owner **DEVE** poder acessar WhatsApp do cliente diretamente | MUST |

### 1.7 Estados do Pedido

```
┌──────────────┐
│   pending    │ (inicial)
└──────┬───────┘
       │
   ┌───┴───┐
   │       │
   ▼       ▼
┌────────┐ ┌────────┐
│confirmed│ │cancelled│
└────────┘ └────────┘
```

- **pending**: Pedido recebido, aguardando confirmação do owner
- **confirmed**: Pedido confirmado pelo owner
- **cancelled**: Pedido cancelado

---

## 2. Regras de Arquitetura

### 2.1 Stack Tecnológica

| Componente | Tecnologia | Versão |
|-----------|------------|--------|
| Frontend | Next.js (App Router) | 16.2.3 |
| UI Library | React | 19.x |
| TypeScript | Strict Mode | - |
| Estilização | Tailwind CSS | 4 |
| Backend | Next.js API Routes | - |
| Banco de Dados | Supabase (PostgreSQL) | - |
| Autenticação | Supabase Auth | - |
| Storage | Supabase Storage | - |
| Notificações | WhatsApp Business API | Graph API v18.0 |

### 2.2 Arquitetura de Camadas

```
┌─────────────────────────────────────┐
│         interfaces/ (UI)            │
│  app/admin/*, app/menu/[slug]/*   │
├─────────────────────────────────────┤
│       application/ (Services)        │
│  API routes, business logic        │
├─────────────────────────────────────┤
│         domain/ (Entities)          │
│  types/, context/                   │
├─────────────────────────────────────┤
│      infrastructure/                │
│  lib/supabase/* (DB, Auth, Storage)│
└─────────────────────────────────────┘
```

### 2.3 Arquitetura Multi-Tenant

**Princípios:**
- Cada restaurante é um tenant distinto
- Todos os tenants compartilham o mesmo banco de dados
- Isolamento de dados por `restaurant_id`
- Escalabilidade horizontal

**Implementação:**
```sql
-- Todas as tabelas devem incluir restaurant_id
CREATE TABLE categories (
  id UUID PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),
  name TEXT NOT NULL,
  display_order INTEGER NOT NULL
);

-- Índices para performance multi-tenant
CREATE INDEX idx_categories_restaurant ON categories(restaurant_id);
```

**Regras de Acesso:**
- APIs devem validar `restaurant_id` do usuário autenticado
- Nenhum tenant pode acessar dados de outro tenant
- Queries sempre filtradas por `restaurant_id`

### 2.4 Restrições de Autenticação

| Rota | Autenticação | Descrição |
|------|-------------|-----------|
| `/menu/[slug]` | Nenhuma | Público |
| `/admin/*` | Supabase Auth | Protegido |
| `/api/orders` | Nenhuma | Público (POST) |

### 2.5 Variáveis de Ambiente

```bash
# Obrigatórias
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
WHATSAPP_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
```

### 2.6 Estrutura de Diretórios

```
app/
├── admin/              # Painel administrativo (protegido)
│   ├── auth/callback/ # Callback Supabase Auth
│   ├── categories/    # CRUD categorias
│   ├── dashboard/     # Dashboard principal
│   ├── login/         # Login
│   ├── orders/        # Gestão de pedidos
│   ├── products/      # CRUD produtos
│   ├── settings/      # Configurações
│   ├── signup/        # Cadastro
│   └── layout.tsx    # Layout admin (client-side auth)
├── api/
│   └── orders/        # Endpoint de pedidos
├── menu/
│   └── [slug]/       # Cardápio público dinâmico
├── layout.tsx        # Layout raiz (Server Component)
├── page.tsx          # Landing page
└── globals.css       # Estilos globais + Tailwind 4

components/
├── ui/               # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── input.tsx
│   └── ...
└── admin/            # Admin-specific components
    ├── header.tsx
    └── sidebar.tsx

context/
└── cart-context.tsx # Carrinho com localStorage

lib/
├── utils.ts          # Funções utilitárias
├── whatsapp.ts       # Integração WhatsApp
└── supabase/
    ├── client.ts     # Cliente browser
    └── server.ts     # Cliente server (SSR)

types/
├── index.ts         # Tipos compartilhados
├── cart/
├── category/
├── order/
└── product/

tests/
├── unit/            # Testes unitários (≥80% cobertura)
├── integration/    # Testes de integração
└── e2e/           # Testes E2E (Playwright)

supabase/
├── schema.sql      # Schema + RLS
└── migrations/     # Migrates

.openspec/
├── specs/          # Especificações (Source of Truth)
└── changes/        # Mudanças em andamento
```

---

## 3. Regras de Qualidade

### 3.1 Idioma

| Contexto | Idioma |
|---------|--------|
| Documentação | Português Brasileiro (pt-BR) |
| Interface UI | Português Brasileiro (pt-BR) |
| Código (comentários) | Português Brasileiro (pt-BR) |
| Nomes técnicos | Inglês |

### 3.2 Cobertura de Testes

| Tipo | Target | Obrigatoriedade |
|------|--------|----------------|
| Unitários | ≥ 80% | MUST |
| E2E (fluxos críticos) | 100% | MUST |
| Integração | Máximo possível | SHOULD |

### 3.3 Métricas de Cobertura

```bash
# Comando
npm run test:coverage

# Thresholds mínimos
- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%
```

### 3.4 Gates de Qualidade

| Gate | Critério | Ação |
|------|----------|------|
| Build | Passa sem erros | Bloqueia se falhar |
| Lint | 0 erros | Bloqueia se falhar |
| Type Check | Passa sem erros | Bloqueia se falhar |
| Cobertura | ≥ 80% | Bloqueia se < 80% |
| Tests | Todos passam | Bloqueia se falhar |

### 3.5 Dependências

**Regra**: `npm install` **DEVE** funcionar sem `--legacy-peer-deps`.

Conflitos de peer dependencies devem ser resolvidos atualizando ou removendo packages incompatíveis. **NUNCA** usar flags de bypass.

### 3.6 TypeScript

| Configuração | Valor |
|-------------|-------|
| strict | `true` |
| noImplicitAny | `true` |
| strictNullChecks | `true` |

### 3.7 Tailwind CSS

| Regra | Descrição |
|-------|-----------|
| Config | Via CSS custom properties em `app/globals.css` |
| Tema | `@theme inline {}` em `globals.css` |
| Proibido | NÃO criar `tailwind.config.js` |

### 3.8 Paradigmas de Desenvolvimento

| Paradigma | Quando | Fluxo |
|-----------|--------|-------|
| **TDD** | Lógica de negócio, utils, hooks | RED → GREEN → REFACTOR |
| **BDD** | Interação entre módulos, API | Given-When-Then (Gherkin) |
| **ATDD** | Fluxos críticos do usuário | Critérios de aceitação |
| **DDD** | Entidades, value objects, aggregates | Linguagem ubíqua |
| **SDD** | Mudanças significativas | proposal → spec → design → tasks → verify → archive |

---

## 4. Regras de Documentação

### 4.1 Obrigatoriedade

**TODO elemento da arquitetura DEVE ter AGENTS.md.**

A documentação é parte do desenvolvimento, não um item opcional.

**Elementos que DEVEM ser documentados:**
- Módulos: `app/`, `components/`, `lib/`, `context/`, `hooks/`, `types/`, `tests/`, `supabase/`, `.openspec/`
- Sub-módulos: `app/admin/`, `app/menu/`, `app/api/`, `components/ui/`, `components/admin/`, `lib/supabase/`
- Rotas: `app/admin/login/`, `app/admin/dashboard/`, `app/menu/[slug]/`, `app/api/orders/`
- Componentes: Todo componente em `components/ui/` ou `components/admin/`
- Hooks: Todo hook em `hooks/`
- Contextos: Todo contexto em `context/`
- Tipos: Entidades como `Restaurant`, `Category`, `Product`, `Order`
- Utilitários: Funções em `lib/utils.ts`, `lib/whatsapp.ts`

### 4.2 Princípio da Proximidade

**Os arquivos AGENTS.md DEVEM estar no nível mais próximo possível do elemento que documentam.**

```
# ✅ CORRETO
app/admin/login/page.tsx
app/admin/login/AGENTS.md          ← Mesma pasta

# ❌ INCORRETO
app/admin/AGENTS.md              ← Nível muito alto
app/admin/login/page.tsx
```

**Hierarquia de Proximidade:**
1. **Rota** (page.tsx, route.ts) → AGENTS.md na mesma pasta
2. **Componente** → AGENTS.md na mesma pasta
3. **Hook** → AGENTS.md na mesma pasta
4. **Tipo/Entidade** → AGENTS.md na pasta do tipo
5. **Módulo** → AGENTS.md no nível do módulo (visão geral)

### 4.3 Arquivos BDD

**Arquivos `.feature` DEVEM estar no nível mais próximo do módulo que documentam.**

```
# ✅ CORRETO
app/admin/orders/
├── page.tsx
├── AGENTS.md
└── orders.feature        ← Mesmo nível

# ❌ INCORRETO
tests/e2e/orders.feature  ← Longe do domínio
```

**Tag obrigatória**: TODO cenário BDD DEVE ter `@integration-test` apontando para o teste.

```gherkin
@integration-test="tests/integration/orders.test.ts"
Funcionalidade: Criação de Pedido
...
```

### 4.4 Template de AGENTS.md

```markdown
# [Nome do Elemento] - MenuLink

## Visão Geral
[Descrição breve e responsabilidade]

**Idioma**: Português Brasileiro (pt-BR)
**Stack**: [Stack tecnológica]

---

## Estrutura de Diretórios
[Árvore de arquivos]

---

## Funcionalidade
### Propósito
[O que este elemento faz]

### Fluxo de Usuário
[Passos do fluxo]

### Estados
[Tabela de estados]

---

## Interface Pública
[Props, métodos, eventos]

---

## Regras de Implementação
1. [Regra 1]
2. [Regra 2]

---

## Arquivos Relacionados
[Tabela de arquivos relacionados]

---

## Métricas de Qualidade
| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura | ≥80% | Alta |

---

**Versão**: 1.0
**Última Atualização**: [YYYY-MM-DD]
**Autor**: AI Agent
```

### 4.5 Checklist de Documentação

Ao criar/modificar código, verificar:
- [ ] AGENTS.md existe no nível mais próximo do elemento documentado?
- [ ] AGENTS.md do módulo/pai está atualizado?
- [ ] Nova API pública está documentada?
- [ ] Exemplos de uso estão corretos?
- [ ] Cenários BDD têm tag `@integration-test`?
- [ ] Props, estados, callbacks documentados?

### 4.6 Atualização de Documentação

**Documentação deve ser ATUALIZADA quando**:
- Nova funcionalidade é adicionada
- API pública muda
- Regras de negócio mudam
- Dependências são adicionadas/removidas
- Após conclusão de cada change OpenSpec

---

## 5. Regras de Mobile-First

### 5.1 Princípios Fundamentais

| Princípio | Descrição |
|-----------|-----------|
| Mobile First | Desenvolver para mobile primeiro, escalar para desktop |
| Touch-Friendly | Elementos com mínimo 44x44px de área de toque |
| Responsivo | Layout responsivo obrigatório em todas as páginas |
| Performance | Otimizado para conexões mobile (3G+) |
| Progressive Enhancement | Funcionalidade base em mobile, enhancements em desktop |

### 5.2 Arquitetura CSS Mobile-First

**Regras de Ouro:**

1. **Estilos base são mobile** - Mobile é o default, não usa media query
2. **Usar `min-width`** - Desktop é a exceção, não o contrário
3. **Combine Media Queries + Container Queries** - Macro layout vs componentes reutilizáveis

```css
/* ✅ CORRETO - Mobile first (base = mobile) */
.card {
  display: flex;
  flex-direction: column; /* Mobile (default) */
  padding: 1rem;
}

@media (min-width: 768px) {
  .card {
    flex-direction: row; /* Desktop enhancement */
    padding: 1.5rem;
  }
}

/* ❌ INCORRETO - Desktop first */
.card {
  flex-direction: row; /* Desktop (default) */
  padding: 2rem;
}

@media (max-width: 767px) {
  .card {
    flex-direction: column; /* Mobile - legacy! */
  }
}
```

### 5.3 Media Queries vs Container Queries

| Tipo | Uso | Quando Aplicar |
|------|-----|----------------|
| **Media Queries** | Layout de página, navegação, tipografia global | Page-level breakpoints |
| **Container Queries** | Componentes reutilizáveis (cards, widgets) | Componentes que aparecem em diferentes contextos |

```css
/* Media Query = responde ao viewport */
@media (min-width: 768px) {
  .card { flex-direction: row; }
}

/* Container Query = responde ao container pai */
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}
@container card (min-width: 400px) {
  .card { flex-direction: row; }
}
```

### 5.4 Breakpoints (Tailwind CSS 4)

| Dispositivo | Largura | Tailwind | Descrição |
|-------------|---------|----------|-----------|
| Mobile | < 640px | **base (default)** | Primeiro passo (NÃO usa prefixo) |
| Tablet | 640px - 767px | `sm:` | `min-width: 640px` |
| Tablet Grande | 768px - 1023px | `md:` | `min-width: 768px` |
| Desktop | 1024px - 1279px | `lg:` | `min-width: 1024px` |
| Large Desktop | ≥ 1280px | `xl:` | `min-width: 1280px` |

**⚠️ ATENÇÃO**: `sm:` NÃO significa "em mobile" - significa "a partir de 640px e acima".

### 5.5 Touch Targets (WCAG AAA)

| Princípio | Valor Mínimo | Recomendação |
|-----------|-------------|--------------|
| Área de toque | 24x24px (WCAG AA) | - |
| Área de toque | **44x44px** (WCAG AAA) | **Padrão do projeto** |
| Área de toque | 48x48px | Recomendado para ícones |
| Espaçamento entre elementos | 8px mínimo | Evita toques acidentais |

```tsx
/* ✅ CORRETO - Touch target adequado */
<button className="min-h-[44px] min-w-[44px] px-4 py-3">
  Ação
</button>

/* ✅ CORRETO - Ícone com touch target */
<button className="w-11 h-11"> {/* 44px = 11 * 4 (Tailwind unit) */}
  <Icon />
</button>

/* ❌ INCORRETO - Muito pequeno */
<button className="px-2 py-1 text-sm">Editar</button>
```

### 5.6 Tipografia Responsiva com `clamp()`

**Fluid Typography** - escala suave sem saltos em breakpoints:

```css
/* ✅ CORRETO - Tipografia fluid */
h1 {
  font-size: clamp(1.875rem, 1.5rem + 2vw, 3rem);
  /* min: 30px, preferred: 1.5rem + 2vw, max: 48px */
  line-height: 1.1;
}

h2 {
  font-size: clamp(1.5rem, 1.25rem + 1.5vw, 2.25rem);
  line-height: 1.2;
}

p, body {
  font-size: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  line-height: 1.6;
  max-width: 65ch; /* Comprimento ideal de linha */
}
```

**Regras de tipografia:**

| Regra | Valor | Razão |
|-------|-------|-------|
| Linha base (body) | 16px mínimo | Evita zoom iOS |
| Line-height body | 1.4 - 1.7 | Legibilidade |
| Line-height headings | 1.1 - 1.3 | Títulos mais compactos |
| Comprimento de linha | 45-75 chars | Previne fadiga visual |
| Unidades | `rem` | Respeita configurações de acesso |

### 5.7 Grid e Flexbox Responsivos

**Grid Patterns:**

```css
/* ✅ Grid automático responsivo (sem media queries!) */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* auto-fit vs auto-fill:
   - auto-fit: colapsa tracks vazios (itens esticam)
   - auto-fill: mantém tracks vazios (estrutura)
*/

/* ✅ Layout de página com áreas nomeadas */
.page {
  display: grid;
  grid-template-areas:
    "header"
    "main"
    "footer";
  grid-template-rows: auto 1fr auto;
}
@media (min-width: 768px) {
  .page {
    grid-template-areas:
      "header header"
      "sidebar main"
      "footer footer";
    grid-template-columns: 250px 1fr;
  }
}
```

**Flexbox Patterns:**

```css
/* ✅ Nav responsivo */
.nav {
  display: flex;
  flex-direction: column; /* Mobile */
  gap: 0.5rem;
}
@media (min-width: 768px) {
  .nav {
    flex-direction: row;
    justify-content: space-between;
  }
}

/* ✅ Flex children responsivos */
.flex-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.flex-item {
  flex: 1 1 280px; /* grow, shrink, basis */
}
```

### 5.8 Core Web Vitals (Performance)

| Métrica | Bom | Ruim | Prioridade |
|---------|-----|------|-----------|
| LCP (Largest Contentful Paint) | ≤2.5s | >4.0s | **Alta** |
| CLS (Cumulative Layout Shift) | <0.1 | >0.25 | **Alta** |
| INP (Interaction to Next Paint) | ≤200ms | >500ms | Média |
| FCP (First Contentful Paint) | <1.8s | >3.0s | Média |

**Otimização de CLS:**

```css
/* ✅ Sempre definir dimensões em imagens */
img {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9; /* Reserva espaço */
}

/* ✅ Reservar espaço para conteúdo dinâmico */
.ad-container {
  min-height: 250px;
}

/* ✅ Font-display swap */
@font-face {
  font-family: 'Inter';
  font-display: swap;
}
```

**Otimização de LCP:**

```tsx
/* ✅ Imagem LCP com priority */
<Image
  src="/hero.webp"
  width={1200}
  height={600}
  alt="Hero"
  priority /* ou fetchPriority="high" */
  sizes="100vw"
/>

/* ✅ Preload de recursos críticos */
<link rel="preload" href="/hero.webp" as="image">
```

### 5.9 Requisitos de Performance

| Métrica | Target | Condição |
|---------|--------|----------|
| First Contentful Paint (FCP) | < 1.8s | 3G |
| Largest Contentful Paint (LCP) | < 2.5s | 3G |
| Time to Interactive (TTI) | < 3.5s | 3G |
| Cumulative Layout Shift (CLS) | < 0.1 | Sempre |

### 5.10 Checklist Mobile-First

**Antes de cada commit CSS:**

- [ ] Estilos base são mobile (sem media query)?
- [ ] Touch targets ≥ 44x44px em botões?
- [ ] Inputs com font-size ≥ 16px (evita zoom iOS)?
- [ ] Grid usa `auto-fit` ou `auto-fill` quando possível?
- [ ] `clamp()` para tipografia fluid?
- [ ] Dimensões explícitas em imagens?
- [ ] CLS < 0.1 verificado?
- [ ] Testado em viewport 375px (iPhone SE)?

---

## 6. Regras de Offline-First

### 6.1 Princípios

| Princípio | Descrição |
|-----------|-----------|
| Funciona Offline | App **DEVE** funcionar offline com funcionalidades reduzidas |
| Sem Bloqueio | **NUNCA** bloquear usuário com mensagens de erro de rede |
| Background Sync | Sincronização em background quando conexão disponível |
| Estado Local | localStorage/IndexedDB como fonte primária |

### 6.2 Estratégia de Cache

| Recurso | Estratégia | Expiração |
|---------|------------|-----------|
| Cardápio (menu) | Cache-first | 24 horas |
| Imagens de produtos | Cache-first (SW) | 7 dias |
| Dados do restaurante | Network-first | 1 hora |
| Carrinho (local) | localStorage | Persistente |

### 6.3 Implementação do Carrinho Offline

```typescript
// ✅ CORRETO - Carrinho persiste offline
const CART_STORAGE_KEY = 'menulink_cart';

interface StoredCart {
  items: CartItem[];
  restaurantId: string | null;
  updatedAt: number;
}

export function useCart() {
  // Carregar do localStorage
  const loadFromStorage = (): StoredCart => {
    if (typeof window === 'undefined') {
      return { items: [], restaurantId: null, updatedAt: Date.now() };
    }
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : { items: [], restaurantId: null, updatedAt: Date.now() };
  };

  // Salvar no localStorage (a cada mudança)
  const saveToStorage = (cart: StoredCart) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  };
}

// ✅ CORRETO - Fetch com fallback offline
async function fetchMenu() {
  try {
    const response = await fetch('/api/menu');
    const data = await response.json();
    // Salvar para offline
    localStorage.setItem('menulink_menu', JSON.stringify(data));
    return data;
  } catch (error) {
    // Fallback para cache local
    const cached = localStorage.getItem('menulink_menu');
    if (cached) {
      return JSON.parse(cached);
    }
    // Se não há cache, retornar vazio (não bloquear)
    return { categories: [], products: [] };
  }
}
```

### 6.4 Service Worker

**Arquivo**: `public/sw.js`

```javascript
const CACHE_NAME = 'menulink-v1';

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/offline.html');
      })
    );
  }
});
```

### 6.5 Indicadores de Status

| Situação | Comportamento |
|----------|---------------|
| Offline | Mostrar ícone na header (ex: WiFi-off) |
| Reconectando | Toast suave "Conexão restaurada" |
| Erro de rede | Não bloquear UI, usar cache |

### 6.6 Testes Offline

- Testes E2E DEVEM incluir cenários offline
- Simular `navigator.onLine = false` nos testes
- Verificar que carrinho funciona offline
- Verificar sincronização após reconexão

---

## 7. Regras de Testes

### 7.1 Estrutura de Testes

```
tests/
├── unit/              # Testes unitários
│   ├── domain/        # Lógica de domínio
│   ├── utils/         # Funções utilitárias
│   └── context/       # Contexts e hooks
├── integration/       # Testes de integração
│   ├── api/           # API routes
│   └── database/      # Integração com banco
└── e2e/              # Testes E2E (Playwright)
    ├── admin/         # Fluxos admin
    ├── public/        # Fluxos públicos
    └── checkout/      # Fluxo de checkout
```

### 7.2 Ferramentas

| Tipo | Ferramenta | Uso |
|------|------------|-----|
| Unitários | Vitest | Testes rápidos e isolados |
| Integração | Vitest + MSW | Mock de APIs externas |
| Componentes | Testing Library | Testes de componentes React |
| E2E | Playwright | Automação de browser |
| Cobertura | Vitest Coverage | Istanbul/v8 |

### 7.3 Scripts de Teste

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest --run tests/unit",
    "test:integration": "vitest --run tests/integration",
    "test:e2e": "playwright test",
    "test:coverage": "vitest --run --coverage",
    "test:watch": "vitest --watch",
    "test:ui": "vitest --ui"
  }
}
```

### 7.4 Fluxo para Novas Funcionalidades

1. Atualizar especificação em `.openspec/specs/`
2. Escrever testes de aceitação (ATDD)
3. Escrever testes unitários que falham (TDD)
4. Implementar código mínimo para passar testes
5. Refatorar mantendo testes verdes
6. Verificar cobertura (≥80%)
7. Criar testes E2E para fluxos críticos

### 7.5 Fluxo para Correções de Bugs

1. Reproduzir bug com teste que falha
2. Corrigir bug
3. Verificar que teste passa
4. Adicionar testes para casos edge relacionados

---

## 8. Regras de Commits

### 8.1 Formato

```
<tipo>(<módulo>): <descrição>

[corpo opcional]

[rodapé opcional]
```

### 8.2 Tipos

| Tipo | Descrição |
|------|-----------|
| feat | Nova funcionalidade |
| fix | Correção de bug |
| docs | Documentação |
| style | Formatação (sem mudança de código) |
| refactor | Refatoração |
| test | Adição/correção de testes |
| chore | Tarefas de manutenção |

### 8.3 Módulos

| Módulo | Descrição |
|--------|-----------|
| app | Rotas e páginas |
| admin | Painel administrativo |
| menu | Cardápio público |
| api | API routes |
| components | Componentes UI |
| context | Contextos React |
| lib | Biblioteca/utilitários |
| types | Tipos TypeScript |
| tests | Testes |
| supabase | Schema e migrations |
| openspec | Especificações |

### 8.4 Exemplos

```bash
# Boa prática
feat(menu): adicionar filtro de produtos por categoria
fix(cart): corrigir cálculo de total com decimais
docs(api): documentar endpoint de pedidos
test(unit): adicionar testes para whatsapp service
refactor(components): extrair lógica do header

# Má prática
update stuff
fix bug
changes
WIP
```

### 8.5 Regras Adicionais

- Mensagens em português (pt-BR)
- Referenciar requisitos: `refs: REQ-XXX`
- Descrição com no máximo 72 caracteres
- Usar imperativo: "adicionar" não "adicionado"

---

## A. Glossário

| Termo | Definição |
|-------|-----------|
| **Tenant** | Instância isolada de restaurante |
| **Multi-tenant** | Arquitetura com múltiplos tenants |
| **RLS** | Row Level Security (Segurança por linha) |
| **SSR** | Server Side Rendering |
| **RSC** | React Server Components |
| **Slug** | Identificador URL único |
| **Cart** | Lista temporária de produtos |
| **Order** | Pedido realizado |

---

## B. Referências

> **PRINCIPAL**: `.openspec/specs/menulink-rules.md` — Este é o documento **centralizado** com todas as regras.

| Referência | Descrição |
|------------|-----------|
| **menulink-rules.md** | **FONTE CENTRALIZADA** de todas as regras |
| menulink-specification.md | Requisitos de negócio (REQ-XXX) |
| menulink-technical-plan.md | Arquitetura e modelos de dados |
| menulink-quality-rules.md | Regras de qualidade (legacy - migrar para rules.md) |
| menulink-unit-tests-checklist.md | Checklist de testes unitários |

---

## C. Versionamento

| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 1.0 | 2026-04-17 | AI Agent | Versão inicial centralizada |
| 1.1 | 2026-04-17 | AI Agent | Adicionados fluxos procedimentais (Seção 9) |

---

**NOTA**: Este documento é a fonte centralizada de regras. Todas as outras documentações devem referenciá-lo. Em caso de conflito, este documento prevalece.

---

## 9. Fluxos Procedimentais

Os fluxos abaixo são **regras procedimentais obrigatórias**. Cada etapa deve ser implementada conforme descrito.

### 9.1 Fluxo de Checkout (Customer)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FLUXO DE CHECKOUT                               │
└─────────────────────────────────────────────────────────────────────┘

Customer acessa /menu/[slug]
         │
         ▼
Visualiza categorias e produtos (apenas is_available=true)
         │
         ▼
Adiciona produtos ao carrinho
         │
         ▼
Abre carrinho (Sheet/Drawer)
         │
         ▼
Clica "Continuar" → Checkout
         │
         ▼
Preenche formulário:
  ├── Nome (obrigatório)
  ├── WhatsApp (obrigatório, formato internacional)
  └── Pagamento: PIX ou Dinheiro
         │
         ▼
Clica "Confirmar e Enviar"
         │
         ▼
POST /api/orders
         │
         ├── Sucesso (201):
         │   ├── Limpar carrinho
         │   ├── Mostrar confirmação
         │   └── Redirecionar para WhatsApp
         │
         └── Erro (400/500):
             └── Mostrar mensagem de erro (não bloquear)
```

**Regras do Checkout:**
1. O formulário **DEVE** validar nome e WhatsApp antes do envio
2. WhatsApp **DEVE** ser formatado para padrão internacional (+55...)
3. Em caso de erro de rede, **NÃO BLOQUEAR** - mostrar cache se disponível
4. Carrinho **DEVE** ser limpo após sucesso

### 9.2 Fluxo de Autenticação Admin

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FLUXO DE AUTENTICAÇÃO ADMIN                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────┐    GET /admin/login     ┌─────────────┐
│   Admin    │ ───────────────────────▶│  Next.js   │
└─────────────┘                         └─────────────┘
         │                                     │
         │◀── Renderiza página login ──────────│
         │                                     │
         │ Preenche credenciais                │
         │ Email + Senha                       │
         │                                     │
         │──POST /admin/login ───────────────▶│
         │                                     │
         │                         ┌─────────────┐
         │                         │ Supabase    │
         │                         │   Auth      │
         │                         └─────────────┘
         │◀── Cookie de sessão ────────────────│
         │                                     │
         │──GET /admin/dashboard ─────────────▶│
         │                                     │
         │◀── Verifica sessão ─────────────────│
         │    (Client-side check no layout)
         │                                     │
         │ Se válido: Renderiza dashboard       │
         │ Se inválido: Redirect para login    │
```

**Regras de Autenticação:**
1. Admin layout **DEVE** verificar sessão client-side
2. Sessão armazenada em cookies (via `@supabase/ssr`)
3. Callback em `/admin/auth/callback` **DEVE** trocar code por sessão
4. Logout **DEVE** limpar sessão e redirecionar para login

### 9.3 Fluxo de Dados (Checkout → WhatsApp)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FLUXO DE DADOS CHECKOUT                         │
└─────────────────────────────────────────────────────────────────────┘

Client                    Next.js              Supabase           WhatsApp API
  │                          │                     │                    │
  │──POST /api/orders───────►│                     │                    │
  │  {                       │                     │                    │
  │    customerName,         │                     │                    │
  │    customerWhatsapp,     │                     │                    │
  │    paymentMethod,        │                     │                    │
  │    items[],             │                     │                    │
  │    total                │                     │                    │
  │  }                      │                     │                    │
  │                          │──INSERT order──────►│                    │
  │                          │                     │                    │
  │                          │──INSERT items──────►│                    │
  │                          │                     │                    │
  │                          │◀─order_id───────────│                    │
  │                          │                     │                    │
  │                          │─────────────────────│──POST message─────►│
  │                          │                     │  (WhatsApp Business)│
  │                          │                     │                    │
  │                          │                     │                    │
  │◀─201 { success }────────│                     │                    │
  │  { orderId }            │                     │                    │
  │                          │                     │                    │
  │──window.open(wa_url)────►│ Redireciona WhatsApp                    │
```

**Regras do Fluxo de Dados:**
1. API **DEVE** criar Order antes de OrderItems
2. Order total **DEVE** ser calculado server-side (não confiar no client)
3. WhatsApp API **DEVE** enviar mensagem formatada
4. Se `WHATSAPP_TOKEN` não configurado: fallback para redirecionamento direto

### 9.4 Fluxo de Cache Offline

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FLUXO DE CACHE OFFLINE                          │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────┐
│ Navigator.onLine │
└─────────────┘
       │
       ├── true ──► Fetch normal
       │               │
       │               ▼
       │         Salvar em localStorage
       │               │
       │               ▼
       │         Atualizar UI
       │
       └── false ──► Tentar localStorage
                        │
                        ▼
                  Dados existem?
                        │
                        ├── Sim ──► Usar cache, mostrar indicador offline
                        │
                        └── Não ──► Mostrar estado vazio
                                         (não bloquear)

─────────────────────────────────────────────────────────

Quando conexão restaurada:
       │
       ▼
Fetch +Merge com cache local
       │
       ▼
Atualizar localStorage
       │
       ▼
Notificar UI (toast suave)
```

**Regras de Cache:**
1. **SEMPRE** salvar resposta bem-sucedida em localStorage
2. **SEMPRE** verificar localStorage antes de mostrar erro
3. **NUNCA** bloquear UI por falta de conexão
4. **NUNCA** mostrar erro de rede para o usuário

### 9.5 Fluxo de Multi-Tenant

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FLUXO DE ACESSO MULTI-TENANT                    │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────┐    Query com restaurant_id    ┌─────────────┐
│   Request  │ ─────────────────────────────►│  Supabase   │
└─────────────┘                               └─────────────┘
                                                  │
                                                  ▼
                                           RLS Policy
                                                  │
                                      ┌────────────┴────────────┐
                                      │                           │
                               restaurant_id         restaurant_id
                                do usuário          do proprietário
                                      │                           │
                                      ▼                           ▼
                                 GRANT (acesso)           GRANT (acesso)
                                      │                           │
                                      ▼                           ▼
                                  Dados do               Todos os dados
                                 restaurante              do restaurante
```

**Regras Multi-Tenant:**
1. **TODAS** as queries **DEVEM** incluir `restaurant_id`
2. RLS **DEVE** filtrar por `restaurant_id` do usuário autenticado
3. Admin **SÓ** vê dados do seu próprio restaurante
4. Cardápio público **SÓ** mostra produtos do restaurante específico

### 9.6 Fluxo de SDD (Specification-Driven Development)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FLUXO SDD (OBRIGATÓRIO)                         │
└─────────────────────────────────────────────────────────────────────┘

PRD.md
   │
   ▼
Análise (viabilidade técnica)
   │
   ▼
proposal.md
   ├── Scope definido
   ├── Riscos identificados
   └── Rollback plan
   │
   ▼
spec.md (RFC 2119)
   ├── REQ-XXX em linguagem formal
   ├── Cenários Given/When/Then
   └── Critérios de aceitação
   │
   ▼
design.md
   ├── Decisões de arquitetura
   ├── TDD/BDD/ATDD/DDD
   └── File changes
   │
   ▼
tasks.md
   ├── Fases (Infra, Domínio, App, Interface, Docs)
   └── Checkboxes
   │
   ▼
implementation
   ├── Código
   ├── Testes
   └── Documentação
   │
   ▼
verification
   ├── Código: build, lint, tests, coverage
   ├── Docs: AGENTS.md, BDD, proximity
   └── Compliance report
   │
   ▼
post-archive-review
   ├── Build passa
   ├── Tests passam
   ├── Docs atualizadas
   └── Cobertura de rotas
   │
   ▼
archive
   └── Move para .openspec/changes/archive/

─────────────────────────────────────────────────────────

Gates de Aprovação:

| Fase | Gate | Responsável |
|------|------|-------------|
| proposal | Scope, riscos | Tech Lead |
| spec | RFC 2119 | Oracle |
| design | Arquitetura | Oracle |
| tasks | Completude | Orchestrator |
| verification | Compliance | Deep Agent |
| archive | Consolidado | Tech Lead |
| post-archive | Build + Tests + Docs | Orchestrator |
```

**Regras SDD:**
1. **TODO** mudança significativa **DEVE** seguir este fluxo
2. **NUNCA** pular fases
3. **NUNCA** implementar sem spec aprovada
4. **verification = código + documentação** (não é só código)
5. **POST-ARCHIVE-REVIEW é obrigatório** após cada archive

---

8. [Regras de Commits](#8-regras-de-commits)
9. [Fluxos Procedimentais](#9-fluxos-procedimentais)
10. [Regras de Reutilização de Código](#10-regras-de-reutilização-de-código)
11. [Regras de Segurança de Dados](#11-regras-de-segurança-de-dados)

---

## 10. Regras de Reutilização de Código

O princípio fundamental é: **quanto menos código, menos manutenção**. Cada linha de código é uma liability. Antes de escrever código novo, verificar se já existe solução no codebase.

### 10.1 Princípios Fundamentais

| Princípio | Descrição | Aplicação |
|-----------|-----------|-----------|
| **DRY** | Don't Repeat Yourself | Qualquer lógica duplicada deve ser extraída |
| **YAGNI** | You Aren't Gonna Need It | Não implementar funcionalidades "por via das dúvidas" |
| **KISS** | Keep It Simple, Stupid | Preferir soluções simples às complexas |
| **Single Source of Truth** | Cada conceito existe em um único lugar | Types, constants, utils |

### 10.2 Hierarquia de Componentes

**Ordem de prioridade (do mais reutilizável ao mais específico):**

```
1. shadcn/ui primitives     (button, input, dialog, table)
        │
        ▼
2. components/ui/            (offline-indicator, custom components)
        │
        ▼
3. lib/utils.ts             (formatPrice, generateSlug, isValidWhatsApp)
        │
        ▼
4. lib/constants.ts         (ORDER_STATUS, STATUS_LABELS, LOCALE)
        │
        ▼
5. hooks/                   (useOnlineStatus - browser APIs)
        │
        ▼
6. context/                 (CartContext - estado complexo)
        │
        ▼
7. components/{module}/     (admin/*, landing/* - específicos)
```

### 10.3 Regras de Reutilização

#### 10.3.1 Antes de Criar Componente

**Verificar SE existe:**

| Recurso | Onde Procurar |
|---------|---------------|
| Componente UI | `components/ui/` |
| Utilidade | `lib/utils.ts` |
| Hook | `hooks/` |
| Type | `types/` |
| Constant | `lib/constants.ts` |
| Feature | `components/landing/`, `components/admin/` |

**Se existir, USAR. Se não existir, verificar se deve ser criado.**

#### 10.3.2 Ao Criar Componente Novo

1. **É realmente novo?** Ou é variação de algo existente?
2. **Pode ser genérico?** Evitar código específico se pode ser reutilizado
3. **Tem apenas uma responsabilidade?** Single Responsibility Principle
4. **Pode ser compuesto?** Preferir composição a herança

#### 10.3.3 Ao Duplicar Código

**ANTES de copiar código, considerar:**

```
┌─────────────────────────────────────────────────────────────┐
│  QUERO COPIAR ESTE CÓDIGO                                 │
│                                                             │
│  ❌ 1. Copiar e colar                                     │
│  ❌ 2. Fazer similar                                       │
│                                                             │
│  ✅ 3. Extrair para função/utils                            │
│  ✅ 4. Criar componente genérico                           │
│  ✅ 5. Usar composição (children, slots)                   │
│  ✅ 6. Mover para camada compartilhada (lib/, hooks/)      │
└─────────────────────────────────────────────────────────────┘
```

### 10.4 Padrões de Reutilização

#### 10.4.1 Componentes Genéricos

```tsx
// ❌ RUIM: Componente específico demais
function PizzaOrderCard() {
  return (
    <div className="pizza-card">
      <h3>{pizza.name}</h3>
      <span className="pizza-price">R$ {pizza.price}</span>
    </div>
  );
}

// ✅ BOM: Componente genérico reutilizável
function ProductCard({ product, formatPrice }: ProductCardProps) {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <span className="product-price">{formatPrice(product.price)}</span>
    </div>
  );
}
```

#### 10.4.2 Props como Extensão

```tsx
// ❌ RUIM: Props fixos
function ButtonSubmit() {
  return <button className="btn btn-primary">Enviar</button>;
}

// ✅ BOM: Props reutilizáveis com defaults
function Button({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn('btn', `btn-${variant}`, `btn-${size}`, className)}
      {...props}
    >
      {children}
    </button>
  );
}
```

#### 10.4.3 Custom Hooks para Lógica Reutilizável

```tsx
// ❌ RUIM: Lógica dentro do componente
function MenuPage() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  // ... resto do componente
}

// ✅ BOM: Hook reutilizável
function MenuPage() {
  const isOnline = useOnlineStatus();
  // ... resto do componente
}
```

### 10.5 Critérios de Avaliação

| Pergunta | Se SIM | Se NÃO |
|----------|--------|--------|
| Já existe algo similar? | Usar existente | Continuar avaliação |
| Pode ser genérico? | Criar genérico | Criar específico |
| É complexidade necessária? | Manter | Simplificar |
| Há duplicação? | Extrair | Manter |

### 10.6 Checklist de Reutilização

**Antes de criar novo código:**

- [ ] Procurei em `components/ui/`?
- [ ] Procurei em `lib/utils.ts`?
- [ ] Procurei em `lib/constants.ts`?
- [ ] Procurei em `hooks/`?
- [ ] Procurei em `types/`?
- [ ] O código pode ser genérico?
- [ ] Posso usar composição ao invés de duplicação?
- [ ] Existe prop/interface que já uso e posso estender?

**Se respondeu SIM a qualquer "procurei", USAR o existente.**

### 10.7 Exceptions

**Quando NÃO aplicar reutilização:**

| Situação | Exemplo | Motivo |
|----------|---------|--------|
| Performance crítica | Loop emero em 100k items | Overhead de abstração |
| Código temporário | Quick fix | Técnico debt aceito |
| Contexto muito específico | Landing page única | Não compensa abstrair |
| Abração adiciona complexidade | 2 linhas duplicadas | KISS |

---

## 11. Regras de Segurança de Dados

A proteção de dados sensíveis é **OBRIGATÓRIA** conforme LGPD. Todo desenvolvedor deve seguir estas regras.

### 11.1 Classificação de Dados

| Dado | Classificação | Proteção Obrigatória |
|------|--------------|---------------------|
| `customer_whatsapp` | **Sensível** | Mascarar em logs/URLs, owner vê completo |
| `customer_name` | **Pessoal** | Mascarar em logs públicos |
| `password` | **Crítico** | Nunca logar, hash seguro |
| `payment_key` (PIX) | **Crítico** | Nunca logar, mascarar |
| `email` | **Pessoal** | Mascarar parcialmente |

### 11.2 Regras de Sanitização

#### 11.2.1 Logs

**REGRA**: TODO `console.log` que contenha dados de users/customers **DEVE** usar sanitização.

```typescript
// ❌ PROIBIDO - dados sensíveis em log
console.log('Order:', order);

// ✅ OBRIGATÓRIO - usar sanitizeForLog
import { sanitizeForLog } from '@/lib/sanitize';
console.log('Order:', sanitizeForLog(order));
```

#### 11.2.2 Funções de Sanitização

```typescript
// lib/sanitize.ts - Mínimo requerido
export function maskWhatsApp(whatsapp: string): string {
  if (!whatsapp || whatsapp.length < 4) return '****';
  return '****' + whatsapp.slice(-4);
}

export function maskName(name: string): string {
  if (!name || name.length < 2) return '****';
  return name[0] + '****';
}

export function sanitizeForLog<T extends Record<string, unknown>>(
  obj: T,
  fieldsToRemove: string[] = ['whatsapp', 'customer_whatsapp', 'password']
): Partial<T> {
  const sanitized = { ...obj };
  fieldsToRemove.forEach(field => delete sanitized[field]);
  return sanitized;
}
```

#### 11.2.3 URLs

**REGRA**: URLs públicas **NÃO DEVEM** conter query params com dados sensíveis.

```typescript
// ❌ PROIBIDO - WhatsApp em query param
const url = `/checkout?whatsapp=5511999999999`;

// ✅ CORRETO - WhatsApp não aparece na URL
const url = `/checkout/${orderId}`;
```

### 11.3 Supabase RLS (Row Level Security)

#### 11.3.1 Policies Obrigatórias

```sql
-- Orders: customers veem apenas seus próprios pedidos
CREATE POLICY "customers_see_own_orders"
ON orders FOR SELECT
USING (customer_whatsapp = current_user_whatsapp());

-- Orders: apenas owner do restaurante gerencia pedidos
CREATE POLICY "owner_manages_restaurant_orders"
ON orders FOR ALL
USING (restaurant_id = current_user_restaurant_id());
```

#### 11.3.2 Validações

| Tabela | Policy | Validação |
|--------|--------|-----------|
| `orders` | SELECT | customer_whatsapp ou owner |
| `orders` | INSERT |anyone (público) |
| `orders` | UPDATE | owner only |
| `order_items` | SELECT | via order |
| `restaurants` | ALL | owner only |

### 11.4 Regras de Erro

**REGRA**: Stack traces e erros **NÃO DEVEM** conter dados sensíveis.

```typescript
// ❌ PROIBIDO - erro expõe dados
catch (error) {
  console.error('User data:', userData);
  throw error;
}

// ✅ CORRETO - erro genérico
catch (error) {
  console.error('Order creation failed:', error.message);
  throw new Error('Falha ao processar pedido');
}
```

### 11.5 Checklist de Segurança

**Antes de cada commit:**

- [ ] Dados sensíveis não aparecem em `console.log`
- [ ] URLs não contêm query params com dados pessoais
- [ ] Errors não expõem stack traces com dados
- [ ] Sanitização usada em todos os logs
- [ ] RLS policies verificadas

### 11.6 LGPD Compliance Checklist

| Requisito LGPD | Implementação |
|----------------|---------------|
| Art. 6 - Finalidade | Dados usados apenas para pedido |
| Art. 7 - Base legal | Execução de contrato |
| Art. 10 - Segurança | RLS + sanitização |
| Art. 48 - Notificação | Erros não expõem dados |

---

## D. Checklist de Verificação de Regras

### Antes de Commit

- [ ] Build passa
- [ ] Lint passa
- [ ] Type check passa
- [ ] Tests passam
- [ ] AGENTS.md atualizado (se aplicável)
- [ ] Commit no formato correto

### Antes de Nova Change

- [ ] Change anterior arquivada
- [ ] post-archive-review executado
- [ ] Build, lint, tests passando
- [ ] Spec principal atualizada

### Antes de Merge/PR

- [ ] Todos os gates de qualidade verdes
- [ ] Cobertura ≥ 80%
- [ ] E2E fluxos críticos passando
- [ ] Documentação atualizada
- [ ] Proximidade de documentação respeitada

---

## 11. Fluxo de Tratamento de Erros

### 11.1 Visão Geral

Este seção define o **workflow obrigatório** para tratamento de erros no projeto MenuLink. Todo erro reportado **DEVE** passar por este processo.

**Objetivo**: Garantir que erros sejam:
1. Documentados com RCA completo
2. Classificados por severidade
3. Corrigidos com testes que validam a correção
4. Analisados para prevenção futura

---

### 11.2 Entidades do Domínio

#### ErrorReport (Entidade)

| Atributo | Tipo | Descrição |
|----------|------|-----------|
| id | UUID | Identificador único |
| description | string | Descrição do erro |
| severity | Critical \| High \| Medium \| Low | Impacto do erro |
| reportedAt | DateTime | Data/hora do reporte |
| status | open \| in_analysis \| fixed \| closed | Estado do RCA |

#### RootCauseAnalysis (Entidade)

| Atributo | Tipo | Descrição |
|----------|------|-----------|
| id | RCA-YYYY-MM-DD-NNN | Identificador do RCA |
| errorReportId | UUID | Referência ao ErrorReport |
| immediateCause | string | Causa imediata do erro |
| rootCause | string | Causa raiz (5 Porquês) |
| category | Code \| Config \| Infra \| Process \| Design \| Test \| Docs | Categoria da causa |
| testsCreated | TestEvidence[] | Evidência de testes criados |
| lessonsLearned | string[] | Lições aprendidas |
| preventiveActions | string[] | Ações preventivas |

#### SeverityTable (Value Object)

| Severidade | Unitários | Integração | BDD |
|------------|-----------|------------|-----|
| **Critical** | 3 | 2 | 1 |
| **High** | 2 | 1 | 1 |
| **Medium** | 1 | 1 | 0 |
| **Low** | 1 | 0 | 0 |

---

### 11.3 Workflow Obrigatório

```
┌─────────────────────────────────────────────────────────────────────┐
│              FLUXO DE TRATAMENTO DE ERROS (OBRIGATÓRIO)            │
└─────────────────────────────────────────────────────────────────────┘

Erro Reportado
       │
       ▼
┌──────────────────────┐
│ Criar RCA no template│ ──► .openspec/root-causes/RCA-YYYY-MM-DD-NNN.md
│ (10 seções)          │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│ Classificar severidade│ ──► Critical / High / Medium / Low
│ (tabela de testes)   │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│ Criar testes OBRIGATÓRIOS│ ──► unit/ / integration/ / e2e/
│ ANTES do fix        │
└──────────────────────┘
       │
       ├──► Testes falham (reproduzem erro)
       │
       ▼
┌──────────────────────┐
│ Aplicar fix          │
└──────────────────────┘
       │
       ├──► Testes passam
       ├──► Regression tests OK
       │
       ▼
┌──────────────────────┐
│ Verification          │ ──► Compliance report
│ (código + docs)      │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│ Archive               │ ──► .openspec/root-causes/RCA-YYYY-MM-DD-NNN.md
└──────────────────────┘
```

---

### 11.4 Requisitos (REQ-ERR)

#### REQ-ERR-001: RCA Obrigatório

**Todo erro reportado DEVE ter RCA completo criado** antes de qualquer tentativa de correção.

**Critério**: Erro sem RCA não pode ser considerado "resolvido".

#### REQ-ERR-002: Template RCA com 10 Seções

**O RCA DEVE conter todas as 10 seções obrigatórias**:
1. Descrição do Erro
2. Impacto (usuários, funcionalidade, receita)
3. Linha do Tempo
4. Causa Imediata
5. Causa Raiz (5 Porquês)
6. Categoria da Causa Raiz
7. Testes Criados (unitários, integração, BDD)
8. Correção Aplicada
9. Lições Aprendidas
10. Ação Preventiva

#### REQ-ERR-003: Testes Obrigatórios por Severidade

**Antes de aplicar qualquer fix, DEVEM ser criados testes** conforme a tabela de severidade:

| Severidade | Unitários | Integração | BDD |
|------------|-----------|------------|-----|
| Critical | 3 | 2 | 1 |
| High | 2 | 1 | 1 |
| Medium | 1 | 1 | 0 |
| Low | 1 | 0 | 0 |

**Regra**: Testes devem falhar ANTES do fix e passar DEPOIS do fix.

#### REQ-ERR-004: Validação de Correção

**Todos os testes DEVEM passar** após a correção ser aplicada.

**Critério**: Se qualquer teste falhar, a correção não está completa.

#### REQ-ERR-005: Armazenamento e Recuperação de RCA

**RCA deve ser armazenado** em `.openspec/root-causes/RCA-YYYY-MM-DD-NNN.md`

**Formato do ID**: `RCA-YYYY-MM-DD-NNN` onde:
- YYYY-MM-DD = Data do reporte
- NNN = Número sequencial (3 dígitos, resetado por dia)

#### REQ-ERR-006: Integração com Fluxo SDD

**Se o erro requer mudança significativa**, o fluxo SDD completo DEVE ser seguido:
1. Criar entrada em `.openspec/backlog/prds/` (PRD implícito no RCA)
2. Se mudança de código: proposal → spec → design → tasks → verification → archive

---

### 11.5 Categorias de Causa Raiz

| Código | Categoria | Quando Usar |
|--------|-----------|-------------|
| CODE | Código | Bug em código fonte, lógica incorreta |
| CONFIG | Configuração | Erro em variáveis de ambiente, settings |
| INFRA | Infraestrutura | Problemas de servidor, rede, cloud |
| PROC | Processo | Falta de processo definido, processo inadequado |
| DSGN | Design | Decisão arquitetural incorreta |
| TEST | Testes | Cobertura insuficiente, testes ausentes |
| DOCS | Documentação | Documentação ausente ou incorreta |

---

### 11.6 Critérios de Aceitação (CA-ERR)

| ID | Critério | Evidência |
|----|----------|-----------|
| CA-ERR-001 | Template RCA existe com 10 seções | `.openspec/templates/rca-template.md` |
| CA-ERR-002 | Diretório root-causes existe com README.md | `.openspec/root-causes/README.md` |
| CA-ERR-003 | menulink-rules.md contém REQ-ERR-001 a REQ-ERR-006 | Seção 11 atualizada |
| CA-ERR-004 | AGENTS.md root documenta fluxo de erros | Seção de Fluxo de Tratamento de Erros |
| CA-ERR-005 | Métrica 100% RCA compliance documentada | Este documento |

---

### 11.7 Métricas de Compliance

| Métrica | Target | Descrição |
|---------|--------|-----------|
| **RCA Coverage** | 100% | Todos os erros reportados devem ter RCA |
| **Testes por Severidade** | Conforme tabela | Testes criados ANTES do fix |
| **5 Porquês** | Mínimo 3 | Análise de causa raiz deve ser profunda |

---

### 11.8 Linguagem Ubíqua (pt-BR)

| Termo | Definição |
|-------|-----------|
| Erro | Falha não planejada no sistema |
| RCA | Root Cause Analysis - Análise de Causa Raiz |
| 5 Whys | Técnica de análise: perguntar "por quê?" 5 vezes |
| Severidade | Impacto do erro (Critical/High/Medium/Low) |
| Testes de Reprodução | Testes que falham antes do fix e passam depois |
| Compliance | Conformidade com o workflow obrigatório |

---

### 11.9 Referências

| Artefato | Caminho |
|----------|---------|
| Template RCA | `.openspec/templates/rca-template.md` |
| Diretório RCAs | `.openspec/root-causes/` |
| README RCAs | `.openspec/root-causes/README.md` |
| Fluxo SDD | Seção 9.6 deste documento |

---

### 11.10 Versionamento

| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 1.0 | 2026-04-17 | AI Agent | Versão inicial (Seção 10 adicionada) |

---
