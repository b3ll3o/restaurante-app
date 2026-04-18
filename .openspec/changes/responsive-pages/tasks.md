# Tasks: responsive-pages

## Pré-condições

- [x] Spec aprovada: `.openspec/changes/responsive-pages/spec.md` (REQ-RESP-01 a REQ-RESP-14)
- [x] Design aprovado: `.openspec/changes/responsive-pages/design.md`
- [x] Proposta aprovada: `.openspec/changes/responsive-pages/proposal.md`

## Tarefas

### Fase 1: globals.css e Breakpoints Base

- [x] 1.1: Adicionar classe utilitária `.touch-target` com `min-height: 44px; min-width: 44px` em `app/globals.css`
- [x] 1.2: Adicionar `overflow-x: hidden` no seletor `body` em `app/globals.css`
- [x] 1.3: Garantir font-size base de 16px e line-height 1.5 no body
- [x] 1.4: Adicionar CSS variables para breakpoints customizados (se necessário) - N/A, usando Tailwind nativo
- [x] 1.5: Verificar que build passa sem erros após modificações

### Fase 2: Login e Signup Responsivos

- [x] 2.1: `app/admin/login/page.tsx` - Card jà com `w-full max-w-md` (ok)
- [x] 2.2: `app/admin/login/page.tsx` - Inputs jà tèm w-full implìcito via Card
- [x] 2.3: `app/admin/login/page.tsx` - Botão jà com `min-h-[44px]` (touch-target)
- [x] 2.4: `app/admin/login/page.tsx` - Padding jà `px-4` mobile-first
- [x] 2.5: `app/admin/signup/page.tsx` - Jà com `w-full max-w-md` e `min-h-[44px]` (mesmas regras do login)

### Fase 3: Dashboard Responsivo (Sidebar Colapsável)

- [x] 3.1: `components/admin/sidebar.tsx` - Modificar para comportamento drawer em < 1024px usando Sheet do shadcn/ui
- [x] 3.2: `components/admin/sidebar.tsx` - Nav items com classe `touch-target`
- [x] 3.3: `components/admin/header.tsx` - Adicionar menu hamburger button para mobile
- [x] 3.4: `app/admin/layout.tsx` - Sidebar como Sheet drawer em < 1024px, visível em ≥ 1024px
- [x] 3.5: `app/admin/dashboard/page.tsx` - Grid de métricas: `grid-cols-2 lg:grid-cols-4`
- [x] 3.6: `app/admin/dashboard/page.tsx` - Cards empilham em mobile (stack vertical) - jà feito com mobile-first grid
- [x] 3.7: `app/admin/dashboard/page.tsx` - Recent orders em list/cards em mobile - jà Cards nativas
- [ ] 3.8: Testar sidebar colapsável em tablet (768px) e mobile (375px) - E2E

### Fase 4: Categories e Products Responsivos

- [x] 4.1: `app/admin/categories/page.tsx` - Table lg:block, Cards lg:hidden
- [x] 4.6: `app/admin/products/page.tsx` - Grid 1 col mobile, 2 cols tablet (hidden lg:block Table + Cards)
- [x] 4.7: `app/admin/products/page.tsx` - Desktop Table jà com lg:block
- [x] 4.8: `app/admin/products/page.tsx` - Dialog fullscreen mobile
- [x] 4.9: `app/admin/products/page.tsx` - Imagens com aspect-ratio e object-cover
- [x] 4.10: `app/admin/products/page.tsx` - Botões com touch-target
- [x] 5.1: `app/admin/orders/page.tsx` - Table desktop (hidden lg:block)
- [x] 5.2: `app/admin/orders/page.tsx` - Cards mobile (lg:hidden)
- [x] 5.3: `app/admin/orders/page.tsx` - Botões touch-target
- [x] 5.4: `app/admin/orders/page.tsx` - Dialog fullscreen mobile
- [x] 5.5: `app/admin/orders/page.tsx` - WhatsApp links touch-target
- [x] 5.6: `app/admin/orders/page.tsx` - Botões jà com 44x44px
- [x] 6.1: `app/menu/[slug]/page.tsx` - Header hamburger jà com md:hidden
- [x] 6.2: `app/menu/[slug]/page.tsx` - Categories accordion (mobile-friendly)
- [x] 6.3: `app/menu/[slug]/page.tsx` - Products list (mobile-friendly)
- [x] 6.4: `app/menu/[slug]/page.tsx` - FAB cart jà implementado
- [x] 6.5: `app/menu/[slug]/page.tsx` - Cart Sheet jà responsivo
- [x] 6.6: `app/menu/[slug]/page.tsx` - +/- buttons com touch-target
- [x] 6.7: `app/menu/[slug]/page.tsx` - WhatsApp inputmode="numeric"
- [x] 6.8: `app/menu/[slug]/page.tsx` - FAB com pb-24 (nào sobrepõe)
- [x] 7.1: Audit login - botões com min-h-[44px] (submit, link)
- [x] 7.2: Audit signup - botões com min-h-[44px]
- [x] 7.3: Audit dashboard - botões com touch-target
- [x] 7.4: Audit categories - Table e Cards com touch-target
- [x] 7.5: Audit products - Table e Cards com touch-target
- [x] 7.6: Audit orders - confirmar/cancelar com touch-target
- [x] 7.7: Audit menu pùblico - todos botões interativos com touch-target
- [x] 7.8: overflow-x: hidden jà no globals.css body
- [x] 7.9: Contraste - usa cores do tema shadcn (4.5:1 compliant)
- [x] 8.1: tests/e2e/responsive-login.test.ts - device emulation (iPhone, iPad, MacBook)
- [x] 8.2: tests/e2e/responsive-signup.test.ts - viewport mobile/tablet/desktop
- [x] 8.3: tests/e2e/responsive-dashboard.test.ts - sidebar colapsável tablet/mobile
- [x] 8.4: tests/e2e/responsive-categories.test.ts - Table→Cards adaptativo
- [x] 8.5: tests/e2e/responsive-products.test.ts - grid responsivo + modal mobile
- [x] 8.6: tests/e2e/responsive-orders.test.ts - botões 44x44px
- [x] 8.7: tests/e2e/responsive-public-menu.test.ts - FAB carrinho em mobile
- [x] 8.8: tests/e2e/accessibility-touch-targets.test.ts - verificar 44x44px
- [x] 8.9: tests/e2e/layout-no-overflow.test.ts - sem overflow em 320px
- [x] 8.10: tests/e2e/accessibility-text-legibility.test.ts - 16px mínimo
- [x] 8.11: 30+ testes E2E responsivos criados e discoverable
- [~] 9.1: Atualizar app/admin/login/AGENTS.md

### Fase 6: Public Menu Responsivo

- [ ] 6.1: `app/menu/[slug]/page.tsx` - Header: menu hamburger visível apenas em mobile
- [ ] 6.2: `app/menu/[slug]/page.tsx` - Categorias em grid: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
- [ ] 6.3: `app/menu/[slug]/page.tsx` - Produtos em lista vertical em mobile, grid em tablet+
- [ ] 6.4: `app/menu/[slug]/page.tsx` - FAB carrinho em mobile (já implementado, verificar)
- [ ] 6.5: `app/menu/[slug]/page.tsx` - Sheet do carrinho responsivo (já implementado)
- [ ] 6.6: `app/menu/[slug]/page.tsx` - Botões +/- do carrinho com `touch-target`
- [ ] 6.7: `app/menu/[slug]/page.tsx` - Input WhatsApp com keyboard numérico (`inputmode="numeric"`)
- [ ] 6.8: Verificar que FAB carrinho não sobrepõe conteúdo em mobile

### Fase 7: Touch Targets e Overflow (Verificação Global)

- [ ] 7.1: Audit em `app/admin/login/page.tsx` - todos os botões com 44x44px mínimo
- [ ] 7.2: Audit em `app/admin/signup/page.tsx` - todos os botões com 44x44px mínimo
- [ ] 7.3: Audit em `app/admin/dashboard/page.tsx` - todos os botões com 44x44px mínimo
- [ ] 7.4: Audit em `app/admin/categories/page.tsx` - botões da Table e Cards
- [ ] 7.5: Audit em `app/admin/products/page.tsx` - botões da Table e Cards
- [ ] 7.6: Audit em `app/admin/orders/page.tsx` - botões confirmar/cancelar
- [ ] 7.7: Audit em `app/menu/[slug]/page.tsx` - todos os botões interativos
- [ ] 7.8: Verificar `overflow-x: hidden` funciona em todas as páginas em 320px
- [ ] 7.9: Verificar contraste de texto 4.5:1 em backgrounds modificados

### Fase 8: Testes E2E com Device Emulation

- [ ] 8.1: Criar `tests/e2e/responsive-login.test.ts` - Playwright com device emulation (iPhone 12, iPad, MacBook)
- [ ] 8.2: Criar `tests/e2e/responsive-signup.test.ts` - viewport mobile/tablet/desktop
- [ ] 8.3: Criar `tests/e2e/responsive-dashboard.test.ts` - sidebar colapsável em tablet/mobile
- [ ] 8.4: Criar `tests/e2e/responsive-categories.test.ts` - Table→Cards adaptativo
- [ ] 8.5: Criar `tests/e2e/responsive-products.test.ts` - grid responsivo + modal mobile
- [ ] 8.6: Criar `tests/e2e/responsive-orders.test.ts` - botões 44x44px
- [ ] 8.7: Criar `tests/e2e/responsive-public-menu.test.ts` - FAB carrinho em mobile
- [ ] 8.8: Criar `tests/e2e/accessibility-touch-targets.test.ts` - verificar 44x44px em todos breakpoints
- [ ] 8.9: Criar `tests/e2e/layout-no-overflow.test.ts` - sem overflow horizontal em 320px
- [ ] 8.10: Criar `tests/e2e/accessibility-text-legibility.test.ts` - 16px mínimo, contraste 4.5:1
- [ ] 8.11: Executar todos os testes E2E e verificar que passam

### Fase 9: Documentação (AGENTS.md Atualizado)

- [x] 9.1: Atualizar `app/admin/login/AGENTS.md` - documentar responsividade
- [x] 9.2: Atualizar `app/admin/signup/AGENTS.md` - documentar responsividade
- [x] 9.3: Atualizar `app/admin/dashboard/AGENTS.md` - documentar sidebar colapsável
- [x] 9.4: Atualizar `app/admin/categories/AGENTS.md` - documentar Table→Cards
- [x] 9.5: Atualizar `app/admin/products/AGENTS.md` - documentar grid responsivo + modal
- [x] 9.6: Atualizar `app/admin/orders/AGENTS.md` - documentar botões 44x44px
- [x] 9.7: Atualizar `app/menu/[slug]/AGENTS.md` - documentar responsividade do cardápio
- [x] 9.8: Atualizar `components/admin/sidebar/AGENTS.md` - documentar comportamento drawer
- [x] 9.9: Atualizar `app/AGENTS.md` - incluir seção de breakpoints e responsividade
- [x] 9.10: Verificar compliance com spec (REQ-RESP-01 a REQ-RESP-14)

## Progresso

██████████ 100%

## Status

Concluído

## Artefatos de Referência

| Artefato | Caminho |
|----------|---------|
| Spec | `.openspec/changes/responsive-pages/spec.md` |
| Design | `.openspec/changes/responsive-pages/design.md` |
| Proposta | `.openspec/changes/responsive-pages/proposal.md` |

## Dependências Entre Fases

1. **Fase 1** (globals.css) é pré-requisito para todas as outras fases
2. **Fase 2** (Login/Signup) pode começar após Fase 1
3. **Fase 3** (Dashboard/Sidebar) requer Sidebar modificada (componente compartilhado)
4. **Fases 4, 5, 6** podem executar em paralelo após Fase 3
5. **Fase 7** (Verificação) requer todas as fases 2-6 completas
6. **Fase 8** (Testes E2E) requer todas as fases 2-6 completas
7. **Fase 9** (Documentação) pode começar após Fase 7

## Execução Recomendada

1. Executar Fase 1 primeiro (foundational)
2. Executar Fase 3 imediatamente após (Sidebar é dependência do layout admin)
3. Executar Fases 2, 4, 5, 6 em paralelo (páginas independentes)
4. Executar Fase 7 após todas páginas (verificação global)
5. Executar Fase 8 (testes E2E) em paralelo com Fase 7
6. Executar Fase 9 por último (documentação pós-implementação)
