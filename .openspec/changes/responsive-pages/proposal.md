# Proposal: responsive-pages

## Intent

Implementar design responsivo mobile-first em todas as páginas do MenuLink (admin e público) utilizando Tailwind CSS 4 com abordagem híbrida Media Queries + Container Queries. O objetivo é eliminar barriers de navegação em dispositivos móveis (65% do tráfego do cardápio público) e tablets (40% do tráfego admin), reduzir bounce rate em 25% e aumentar conversão mobile de 2.1% para 4.5%.

## Scope

### In Scope

- **Páginas admin:** login (`app/admin/login/`), signup (`app/admin/signup/`), dashboard (`app/admin/dashboard/`), categories (`app/admin/categories/`), products (`app/admin/products/`), orders (`app/admin/orders/`)
- **Cardápio público:** `app/menu/[slug]/` com carrinho funcional
- **Componentes base:** `components/ui/` (botões, inputs, cards, dialogs, tables)
- **Globais:** `app/globals.css` — breakpoints Tailwind, gap, padding, container
- **Touch targets:** tamanho mínimo 44x44px para todos os elementos interativos
- **Layout:** sem overflow horizontal em qualquer breakpoint
- **Tipografia:** corpo de texto mínimo 16px, títulos H1≥24px, H2≥20px, H3≥18px
- **Testes E2E:** Playwright com device emulation nos três breakpoints (mobile <768px, tablet 768-1023px, desktop ≥1024px)

### Out of Scope

- Funcionalidades PWA (Progressive Web App)
- Offline mode
- Push notifications
- Add to home screen
- Mudanças na lógica de negócio (REQ-XXX existentes)
- Alterações no schema do banco de dados
- Novas integrações de API externas
- Modificações na autenticação Supabase

## Approach

**Metodologia:** Mobile-first CSS com Tailwind CSS 4

**Estratégia de breakpoints:**

- Mobile-first: estilos base para <768px, depois `md:` e `lg:` para escalar
- Breakpoints Tailwind: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px)

**Híbrido Media Queries + Container Queries:**

- Media Queries para layout de página (grid/flex do page-level)
- Container Queries (`@container`) apenas para componentes críticos reutilizáveis (cards de produto, modal de edição) onde o contexto do container é mais relevante que o viewport

**Testes:**

- Playwright com device emulation (iPhone 12, iPad, MacBook) para validação visual e funcional em cada breakpoint
- Testes de accessibility (touch targets 44x44px, contraste 4.5:1)

**Implementação:**

- globals.css: CSS variables para breakpoints customizados
- shadcn/ui: componentes base com classes responsivas nativas
- pages: layout adaptations por breakpoint (sidebar colapsável, cards, tables)

## Affected Areas

| Área | Impacto | Mudanças |
|------|---------|----------|
| `app/admin/login/page.tsx` | Alto | Centralização do form, inputs full-width em mobile |
| `app/admin/signup/page.tsx` | Alto | Form em stack vertical em mobile, validação funcional |
| `app/admin/dashboard/page.tsx` | Alto | Sidebar colapsável (drawer em mobile), métricas em grid |
| `app/admin/categories/page.tsx` | Alto | Tabela→cards em mobile, actions touch-friendly |
| `app/admin/products/page.tsx` | Alto | Grid 1→2→3 colunas por breakpoint, modal fullscreen em mobile |
| `app/admin/orders/page.tsx` | Alto | Lista cards em mobile, botões confirmar/cancelar 44x44px |
| `app/menu/[slug]/page.tsx` | Alto | Categorias em carousel/grid, produtos em lista/grid, FAB carrinho |
| `components/ui/*` | Médio | Base components com `min-h-[44px]` e classes responsivas |
| `app/globals.css` | Médio | Breakpoint variables, overflow-x hidden global |

## Risks

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Breaking changes em layout existente (desktop) | Alta | Alto | Branch feature + testes E2E desktop antes/depois |
| Regressão em desktop | Média | Alto | Playwright E2E em MacBook viewport ≥1024px |
| Inconsistência visual entre páginas | Média | Médio | Design tokens centralizados em globals.css |
| Performance degradada em low-end mobiles | Baixa | Médio | Lazy loading imagens + code splitting já implementado |
| Touch targets quebrados em componentes herdados | Baixa | Médio | Audit visual com device emulation antes de cada PR |

## Rollback Plan

1. **Git revert** das mudanças CSS em `globals.css` e nos componentes afetados
2. Branch-based testing: todas as mudanças ficam em `feature/responsive-pages` até validação completa
3. Se rollback necessário: `git revert HEAD` em até 5 minutos
4. Backward compatibility: mudanças são puramente CSS/classes, sem lógica de negócio alterada

## Success Criteria

| ID | Critério | Evidência |
|----|----------|-----------|
| CA-01 | Login responsivo em todos os breakpoints | Playwright: `responsive-login.test.ts` com device emulation |
| CA-02 | Signup responsivo em todos os breakpoints | Playwright: `responsive-signup.test.ts` |
| CA-03 | Dashboard com sidebar colapsável em tablet/mobile | Playwright: `responsive-dashboard.test.ts` |
| CA-04 | Categories com tabela→cards adaptativo | Playwright: `responsive-categories.test.ts` |
| CA-05 | Products com grid responsivo + modal mobile-friendly | Playwright: `responsive-products.test.ts` |
| CA-06 | Orders com lista responsiva + botões 44x44px | Playwright: `responsive-orders.test.ts` |
| CA-07 | Public menu com carrinho FAB em mobile | Playwright: `responsive-public-menu.test.ts` |
| CA-08 | Touch targets 44x44px em todos os breakpoints | Playwright: `accessibility-touch-targets.test.ts` |
| CA-09 | Sem overflow horizontal em qualquer breakpoint | Playwright: `layout-no-overflow.test.ts` |
| CA-10 | Texto legível sem zoom (16px mínimo) | Playwright: `accessibility-text-legibility.test.ts` |

**KPIs alvo:**

- Bounce rate mobile: 65% → 45%
- Conversão mobile: 2.1% → 4.5%
- NPS: 52 → 70
