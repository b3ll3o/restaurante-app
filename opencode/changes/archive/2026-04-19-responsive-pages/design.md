# Design: responsive-pages

## Technical Approach

### Mobile-First CSS Strategy

Implementar design responsivo utilizando Tailwind CSS 4 com metodologia mobile-first:

1. **Estilos base** (< 768px): aplicados por padrão, otimizados para mobile
2. **Tablet** (768px - 1023px): via breakpoint `md:`
3. **Desktop** (≥ 1024px): via breakpoint `lg:`

### Híbrido Media Queries + Container Queries

- **Media Queries**: layout de página (grid/flex page-level), sidebar, header
- **Container Queries** (`@container`): apenas para componentes críticos reutilizáveis (cards de produto, modal de edição)

### Breakpoints Tailwind CSS 4

| Breakpoint | Largura | Prefixo Tailwind | Uso |
|------------|---------|------------------|-----|
| Mobile | < 768px | (default) | Estilos base |
| Tablet | 768px - 1023px | `md:` | Tablet e sidebar colapsável |
| Desktop | ≥ 1024px | `lg:` | Desktop com sidebar expandida |

### Componentes shadcn/ui Base

Os componentes base em `components/ui/` já possuem classes responsivas nativas. O foco é:
- Adicionar `min-h-[44px] min-w-[44px]` para touch targets
- Aplicar classes responsivas nas páginas (não nos componentes base)

---

## Architecture Decisions

### Decision 1: Overflow Handling Global

**Choice**: Adicionar `overflow-x-hidden` no `body` e `max-width` nos containers principais

**Alternatives considered**:
- Aplicar `overflow-x-hidden` em cada página individualmente
- Usar `overflow: clip` em vez de `overflow: hidden`

**Rationale**: Previne overflow horizontal em todas as páginas de forma centralizada, mantendo consistência. `overflow-x-hidden` no body é seguro pois não afecta scroll vertical.

### Decision 2: Sidebar Colapsável (Dashboard)

**Choice**: Sidebar como drawer/menu lateral em mobile/tablet (< 1024px), expandida em desktop

**Alternatives considered**:
- Sidebar fixa no topo em mobile
- Sidebar como overlay com trigger no header

**Rationale**: Drawer lateral é padrão UX mobile (Material Design, iOS) e mantém consistência com pattern do carrinho (Sheet) já utilizado no menu público.

### Decision 3: Table → Cards Adaptativo (Categories/Products/Orders)

**Choice**: Tabela em desktop (≥ 1024px), Cards em mobile/tablet (< 1024px)

**Alternatives considered**:
- Tabela com scroll horizontal em todos breakpoints
- Cards em todos breakpoints

**Rationale**: Tabelas são difíceis de usar em mobile. Cards oferecem melhor UX touch. Desktop mantém tabela para densidade de informação.

### Decision 4: Touch Targets Globais

**Choice**: `min-height: 44px` e `min-width: 44px` como classe utilitária `touch-target` em `globals.css`

**Alternatives considered**:
- Adicionar em cada botão individualmente
- Modificar componente Button base

**Rationale**: Classe utilitária reutilizável permite aplicação consistente e rápida. Não modifica o componente base, mantendo flexibilidade.

### Decision 5: Dialog em Tela Cheia em Mobile

**Choice**: Modal/Dialog abre em tela cheia (`w-full h-full`) em mobile (< 768px)

**Alternatives considered**:
- Dialog pequeno com scroll interno
- Bottom sheet para mobile

**Rationale**: Tela cheia em mobile maximiza área de toque e facilita preenchimento de formulários complexos (Products). Bottom sheet seria alternativa futura para simplificações.

---

## Data Flow

### Responsivo não altera fluxo de dados

O design responsivo é puramente visual/CSS:
- Queries Supabase: inalteradas
- Estado local React: inalterado
- Context (Cart): inalterado

### Componentes Afetados

```
pages/ (CSS/classes)
    │
    ├── login/page.tsx
    ├── signup/page.tsx
    ├── dashboard/page.tsx
    ├── categories/page.tsx
    ├── products/page.tsx
    ├── orders/page.tsx
    └── menu/[slug]/page.tsx

components/
    │
    ├── admin/sidebar.tsx (Drawer behavior)
    └── admin/header.tsx (Menu trigger mobile)

globals.css (novas regras CSS)
```

---

## File Changes

### 1. `app/globals.css`

**Modificações**:
```css
/* Touch target utility */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* Overflow prevention */
body {
  overflow-x: hidden;
}

/* Base typography (16px minimum) */
body {
  font-size: 16px;
  line-height: 1.5;
}
```

### 2. `app/admin/layout.tsx`

**Modificações**:
- Sidebar vira `Sheet` (drawer) em < 1024px
- Header ganha menu hamburger para mobile
- Estrutura: `flex-col` em mobile, `flex-row` em desktop

### 3. `components/admin/sidebar.tsx`

**Modificações**:
- Aceita prop `isOpen` e `onClose` para controlled drawer
- Usa `Sheet` do shadcn/ui para comportamento drawer
- Nav items com `touch-target`

### 4. `app/admin/login/page.tsx`

**Modificações**:
- Card full-width em mobile
- Inputs `w-full` por padrão
- Botão submit com `touch-target`

### 5. `app/admin/signup/page.tsx`

**Modificações**:
- Formulário em stack vertical em mobile
- Inputs `w-full`
- Botão submit com `touch-target`

### 6. `app/admin/dashboard/page.tsx`

**Modificações**:
- Grid de métricas: `grid-cols-2 md:grid-cols-2 lg:grid-cols-4`
- Cards empilham em mobile
- Recent orders em list/cards em mobile

### 7. `app/admin/categories/page.tsx`

**Modificações**:
- Desktop (≥ 1024px): Table
- Mobile/Tablet (< 1024px): Cards com ações
- Botões de ação com `touch-target`
- Dialog em tela cheia em mobile

### 8. `app/admin/products/page.tsx`

**Modificações**:
- Desktop (≥ 1024px): Table + Dialog pequeno
- Mobile/Tablet (< 1024px): Grid 1-2 colunas + Dialog fullscreen
- Imagens com `aspect-ratio` preservado
- Botões com `touch-target`

### 9. `app/admin/orders/page.tsx`

**Modificações**:
- Desktop (≥ 1024px): Table
- Mobile/Tablet (< 1024px): Cards
- Botões confirmar/cancelar com `min-h-[44px] min-w-[44px]`
- Dialog fullscreen em mobile

### 10. `app/menu/[slug]/page.tsx`

**Modificações**:
- Categorias em grid `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
- Produtos em lista vertical em mobile, grid em tablet+
- Carrinho FAB em mobile (já implementado)
- Sheet para carrinho (já implementado)
- Botões com `touch-target`

---

## Interfaces / Contracts

### Classe Utilitária `.touch-target`

```css
.touch-target {
  min-height: 44px;
  min-width: 44px;
}
```

**Uso**:
```tsx
<Button className="touch-target">Texto</Button>
```

### Breakpoint Helpers (via Tailwind)

| Classe | Breakpoint | Equivalent CSS |
|--------|------------|----------------|
| (none) | < 768px | `@media (max-width: 767px)` |
| `md:` | 768px - 1023px | `@media (min-width: 768px)` |
| `lg:` | ≥ 1024px | `@media (min-width: 1024px)` |

### Container Queries (para componentes críticos)

```css
@container (min-width: 400px) {
  .product-card {
    grid-template-columns: 2fr 1fr;
  }
}
```

---

## Testing Strategy

### TDD (Unit Tests)

**Testes de renderização responsiva**:

```typescript
// tests/unit/components/responsive.test.ts
describe('Responsive Layout', () => {
  it('should apply touch-target class to buttons', () => {
    // Verificar que botões têm min-height: 44px
  });

  it('should hide sidebar on mobile', () => {
    // Verificar que sidebar está oculta < 1024px
  });
});
```

### BDD (Integration Tests)

Criar arquivos `.feature` para cada página comdevice emulation:

```gherkin
# tests/e2e/responsive-login.feature
@integration-test="tests/integration/responsive-login.test.ts"
Funcionalidade: Login Responsivo

Cenário: Login em viewport mobile
Dado que a janela está em 320px
Quando acesso /admin/login
Então o formulário deve ocupar 100% da largura
E o botão deve ter 44x44px mínimo

Cenário: Login em viewport desktop
Dado que a janela está em 1024px
Quando acesso /admin/login
Então o formulário deve estar centralizado
E ter max-width: 448px
```

### ATDD (Playwright E2E)

**Device Emulation**:

```typescript
// tests/e2e/responsive.test.ts
const devices = [
  { name: 'iPhone 12', width: 390, height: 844 },
  { name: 'iPad', width: 768, height: 1024 },
  { name: 'MacBook', width: 1280, height: 800 },
];

devices.forEach(device => {
  test(`Responsive - ${device.name}`, async ({ page }) => {
    await page.setViewportSize({ width: device.width, height: device.height });
    // Testes...
  });
});
```

**Testes de Acessibilidade**:

```typescript
// tests/e2e/accessibility-touch-targets.test.ts
test('Todos os botões têm 44x44px', async ({ page }) => {
  await page.goto('/admin/dashboard');
  const buttons = await page.locator('button').all();
  for (const button of buttons) {
    const box = await button.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
});
```

**Testes de Overflow**:

```typescript
// tests/e2e/layout-no-overflow.test.ts
test('Sem overflow horizontal', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/admin/login');
  const body = await page.locator('body');
  const overflowX = await body.evaluate(el => el.scrollWidth > el.clientWidth);
  expect(overflowX).toBe(false);
});
```

---

## Migration / Rollback

### Migration Strategy

1. **Branch-based**: Todas as mudanças em `feature/responsive-pages`
2. **Incremental**: Cada página/modificação em commits separados
3. **Validation**: Playwright E2E valida cada breakpoint

### Rollback Plan

1. `git revert HEAD` em até 5 minutos
2. Mudanças são puramente CSS/classes - sem alteração de lógica
3. Commits atômicos permitem revert granular

---

## Open Questions

| # | Questão | Status | Decisão |
|---|---------|--------|---------|
| 1 | Dialog fullscreen vs bottom sheet em mobile? | Aberto | Dialog fullscreen para Products (form complex), bottom sheet seria alternativa para Cases simplificados |
| 2 | Container queries para ProductCard? | Aberto | Implementar apenas se necessário após testes com Media Queries |
| 3 | Touch targets em links de navegação do Sidebar? | Aberto | Adicionar `touch-target` nos Links do sidebar |

---

## Dependencies

| Dependência | Versão | Uso |
|-------------|--------|-----|
| tailwindcss | ^4 | CSS framework |
| @radix-ui/react-dialog | ^1.1.x | Dialog/Sheet |
| playwright | ^1.48.x | E2E testing |

---

## Risks and Mitigations

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Breaking changes em layout desktop | Alta | Alto | Branch feature + testes E2E desktop antes/depois |
| Regressão em desktop | Média | Alto | Playwright E2E em MacBook viewport ≥1024px |
| Inconsistência visual entre páginas | Média | Médio | Design tokens centralizados em globals.css |
| Performance degradada em low-end mobiles | Baixa | Médio | Lazy loading + code splitting já implementado |
| Touch targets quebrados em componentes herdados | Baixa | Médio | Audit visual com device emulation antes de cada PR |
