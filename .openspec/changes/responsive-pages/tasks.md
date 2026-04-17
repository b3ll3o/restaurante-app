# Tasks: responsive-pages

## Pré-condições

- [x] Spec aprovada: `.openspec/changes/responsive-pages/spec.md` (REQ-RESP-01 a REQ-RESP-14)
- [x] Design aprovado: `.openspec/changes/responsive-pages/design.md`
- [x] Proposta aprovada: `.openspec/changes/responsive-pages/proposal.md`

## Tarefas

### Fase 1: globals.css e Breakpoints Base

- [ ] 1.1: Adicionar classe utilitária `.touch-target` com `min-height: 44px; min-width: 44px` em `app/globals.css`
- [ ] 1.2: Adicionar `overflow-x: hidden` no seletor `body` em `app/globals.css`
- [ ] 1.3: Garantir font-size base de 16px e line-height 1.5 no body
- [ ] 1.4: Adicionar CSS variables para breakpoints customizados (se necessário)
- [ ] 1.5: Verificar que build passa sem erros após modificações

### Fase 2: Login e Signup Responsivos

- [ ] 2.1: `app/admin/login/page.tsx` - Garantir Card full-width em mobile (`w-full max-w-md md:max-w-md lg:max-w-md`)
- [ ] 2.2: `app/admin/login/page.tsx` - Inputs com `w-full` por padrão
- [ ] 2.3: `app/admin/login/page.tsx` - Botão submit com classe `touch-target`
- [ ] 2.4: `app/admin/login/page.tsx` - Verificar padding responsivo (`px-4` mobile, `px-6` tablet+)
- [ ] 2.5: `app/admin/signup/page.tsx` - Aplicar mesmas regras de responsividade do login
- [ ] 2.6: Verificar que não há overflow horizontal em 320px (viewport mobile)

### Fase 3: Dashboard Responsivo (Sidebar Colapsável)

- [ ] 3.1: `components/admin/sidebar.tsx` - Modificar para comportamento drawer em < 1024px usando Sheet do shadcn/ui
- [ ] 3.2: `components/admin/sidebar.tsx` - Nav items com classe `touch-target`
- [ ] 3.3: `components/admin/header.tsx` - Adicionar menu hamburger button para mobile
- [ ] 3.4: `app/admin/layout.tsx` - Sidebar como Sheet drawer em < 1024px, visível em ≥ 1024px
- [ ] 3.5: `app/admin/dashboard/page.tsx` - Grid de métricas: `grid-cols-2 lg:grid-cols-4`
- [ ] 3.6: `app/admin/dashboard/page.tsx` - Cards empilham em mobile (stack vertical)
- [ ] 3.7: `app/admin/dashboard/page.tsx` - Recent orders em list/cards em mobile
- [ ] 3.8: Testar sidebar colapsável em tablet (768px) e mobile (375px)

### Fase 4: Categories e Products Responsivos

- [ ] 4.1: `app/admin/categories/page.tsx` - Desktop (≥ 1024px): manter Table
- [ ] 4.2: `app/admin/categories/page.tsx` - Mobile/Tablet (< 1024px): substituir Table por Cards responsivos
- [ ] 4.3: `app/admin/categories/page.tsx` - Cards com ações (editar/excluir) usando `touch-target`
- [ ] 4.4: `app/admin/categories/page.tsx` - Dialog abre em tela cheia em mobile (< 768px)
- [ ] 4.5: `app/admin/categories/page.tsx` - Botão "Nova Categoria" com `touch-target`
- [ ] 4.6: `app/admin/products/page.tsx` - Grid 1 coluna mobile, 2 colunas tablet (`grid-cols-1 md:grid-cols-2`)
- [ ] 4.7: `app/admin/products/page.tsx` - Desktop (≥ 1024px): manter Table
- [ ] 4.8: `app/admin/products/page.tsx` - Dialog fullscreen em mobile (`w-full h-full max-w-none`)
- [ ] 4.9: `app/admin/products/page.tsx` - Imagens com `aspect-ratio` e `object-cover`
- [ ] 4.10: `app/admin/products/page.tsx` - Botões de ação com `touch-target`

### Fase 5: Orders Responsivo

- [ ] 5.1: `app/admin/orders/page.tsx` - Desktop (≥ 1024px): manter Table
- [ ] 5.2: `app/admin/orders/page.tsx` - Mobile/Tablet (< 1024px): Table → Cards responsivos
- [ ] 5.3: `app/admin/orders/page.tsx` - Botões confirmar/cancelar com `min-h-[44px] min-w-[44px]`
- [ ] 5.4: `app/admin/orders/page.tsx` - Dialog detalhes em tela cheia em mobile
- [ ] 5.5: `app/admin/orders/page.tsx` - Links WhatsApp com `touch-target` (área de toque maior)
- [ ] 5.6: Testar em mobile: botões tappáveis com 44x44px mínimo

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

- [ ] 9.1: Atualizar `app/admin/login/AGENTS.md` - documentar responsividade
- [ ] 9.2: Atualizar `app/admin/signup/AGENTS.md` - documentar responsividade
- [ ] 9.3: Atualizar `app/admin/dashboard/AGENTS.md` - documentar sidebar colapsável
- [ ] 9.4: Atualizar `app/admin/categories/AGENTS.md` - documentar Table→Cards
- [ ] 9.5: Atualizar `app/admin/products/AGENTS.md` - documentar grid responsivo + modal
- [ ] 9.6: Atualizar `app/admin/orders/AGENTS.md` - documentar botões 44x44px
- [ ] 9.7: Atualizar `app/menu/[slug]/AGENTS.md` - documentar responsividade do cardápio
- [ ] 9.8: Atualizar `components/admin/sidebar/AGENTS.md` - documentar comportamento drawer
- [ ] 9.9: Atualizar `app/AGENTS.md` - incluir seção de breakpoints e responsividade
- [ ] 9.10: Verificar compliance com spec (REQ-RESP-01 a REQ-RESP-14)

## Progresso

░░░░░░░░░░ 0%

## Status

Em Andamento

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
