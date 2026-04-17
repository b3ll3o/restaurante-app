# Delta for responsive-pages

## ADDED Requirements

### REQ-RESP-01: Login Responsivo em Todos Breakpoints

O sistema DEVE exibir a página de login de forma responsiva em todos os breakpoints (mobile <768px, tablet 768-1023px, desktop ≥1024px), com formulário centralizado e elementos ajustados para cada tamanho de tela.

#### Cenário: Login funcional em desktop
- **GIVEN** o usuário está na página de login
- **AND** a janela do navegador está em 1024px ou mais
- **WHEN** preenche credenciais válidas
- **THEN** o formulário deve estar centralizado
- **AND** todos os campos devem ser visíveis sem scroll

#### Cenário: Login funcional em tablet
- **GIVEN** o usuário está na página de login
- **AND** a janela do navegador está entre 768px e 1023px
- **WHEN** preenche credenciais válidas
- **THEN** o formulário deve estar centralizado
- **AND** o layout deve se adaptar ao tamanho

#### Cenário: Login funcional em mobile
- **GIVEN** o usuário está na página de login
- **AND** a janela do navegador está abaixo de 768px
- **WHEN** preenche credenciais válidas
- **THEN** o formulário deve ocupar toda a largura disponível
- **AND** o botão de submit deve ter no mínimo 44x44px
- **AND** não deve haver overflow horizontal

---

### REQ-RESP-02: Signup Responsivo em Todos Breakpoints

O sistema DEVE exibir a página de cadastro (signup) de forma responsiva em todos os breakpoints, mantendo usabilidade e validação funcional.

#### Cenário: Cadastro funcional em mobile
- **GIVEN** o usuário está na página de cadastro
- **AND** a janela do navegador está abaixo de 768px
- **WHEN** preenche todos os campos obrigatórios
- **THEN** o formulário deve ocupar toda a largura disponível
- **AND** cada campo deve ter altura mínima de 44px
- **AND** o botão de submit deve ter no mínimo 44x44px

---

### REQ-RESP-03: Dashboard com Sidebar Colapsável em Mobile/Tablet

O sistema DEVE exibir o dashboard administrativo de forma responsiva em todos os breakpoints, com sidebar colapsável em mobile/tablet e menu de navegação adaptado.

#### Cenário: Dashboard em desktop
- **GIVEN** o admin está logado
- **AND** a janela do navegador está em 1024px ou mais
- **WHEN** acessa o dashboard
- **THEN** a sidebar deve estar expandida
- **AND** todo o conteúdo deve ser visível

#### Cenário: Dashboard em tablet
- **GIVEN** o admin está logado
- **AND** a janela do navegador está entre 768px e 1023px
- **WHEN** acessa o dashboard
- **THEN** a sidebar deve estar colapsada por padrão
- **AND** deve aparecer ao clicar no ícone de menu
- **AND** o conteúdo deve ocupar toda a largura disponível

#### Cenário: Dashboard em mobile
- **GIVEN** o admin está logado
- **AND** a janela do navegador está abaixo de 768px
- **WHEN** acessa o dashboard
- **THEN** a sidebar deve estar oculta
- **AND** deve aparecer como drawer lateral ao tocar no menu
- **AND** a tabela de métricas deve ser scrollável horizontalmente

---

### REQ-RESP-04: Categories com Tabela/Cards Adaptativos

O sistema DEVE exibir a página de gerenciamento de categorias de forma responsiva em todos os breakpoints, com tabela/cards adaptativos e ações acessíveis.

#### Cenário: Lista de categorias em mobile
- **GIVEN** o admin está logado
- **AND** a janela do navegador está abaixo de 768px
- **WHEN** acessa a página de categorias
- **THEN** as categorias devem ser exibidas em cards
- **AND** cada card deve ter ações (editar/excluir) acessíveis
- **AND** o botão de adicionar categoria deve estar fixo no footer

#### Cenário: Lista de categorias em desktop
- **GIVEN** o admin está logado
- **AND** a janela do navegador está em 1024px ou mais
- **WHEN** acessa a página de categorias
- **THEN** as categorias devem ser exibidas em tabela
- **AND** todas as colunas devem ser visíveis

---

### REQ-RESP-05: Products com Grid Adaptativo e Modal Mobile-Friendly

O sistema DEVE exibir a página de gerenciamento de produtos de forma responsiva em todos os breakpoints, com grid de produtos que se adapta e modal de edição funcional em mobile.

#### Cenário: Grid de produtos em tablet
- **GIVEN** o admin está logado
- **AND** a janela do navegador está entre 768px e 1023px
- **WHEN** acessa a página de produtos
- **THEN** os produtos devem ser exibidos em grid de 2 colunas
- **AND** cada card deve mostrar imagem, nome e preço

#### Cenário: Modal de edição em mobile
- **GIVEN** o admin está logado
- **AND** a janela do navegador está abaixo de 768px
- **WHEN** clica para editar um produto
- **THEN** o modal deve abrir em tela cheia
- **AND** todos os campos devem ser acessíveis via scroll

---

### REQ-RESP-06: Orders com Lista Responsiva e Botões 44x44px

O sistema DEVE exibir a página de gerenciamento de pedidos de forma responsiva em todos os breakpoints, com lista de pedidos legível e ações (confirmar/cancelar) acessíveis em touch.

#### Cenário: Lista de pedidos em mobile
- **GIVEN** o admin está logado
- **AND** a janela do navegador está abaixo de 768px
- **WHEN** acessa a página de pedidos
- **THEN** cada pedido deve mostrar cliente, total e status
- **AND** os botões de ação (confirmar/cancelar) devem ter 44x44px mínimo
- **AND** ser easily tappable

#### Cenário: Filtros em desktop
- **GIVEN** o admin está logado
- **AND** a janela do navegador está em 1024px ou mais
- **WHEN** acessa a página de pedidos
- **THEN** os filtros devem estar visíveis na sidebar

---

### REQ-RESP-07: Public Menu Responsivo com Carrinho Funcional

O sistema DEVE exibir o cardápio público de forma responsiva em todos os breakpoints, com categorias navegáveis, produtos em grid adaptativo e carrinho funcional.

#### Cenário: Cardápio em smartphone
- **GIVEN** o cliente está acessando o cardápio
- **AND** a janela do navegador está abaixo de 768px
- **WHEN** visualiza as categorias
- **THEN** as categorias devem estar em carousel horizontal
- **AND** os produtos devem ser exibidos em lista vertical
- **AND** o carrinho deve ser acessível via FAB (Floating Action Button)

#### Cenário: Cardápio em tablet
- **GIVEN** o cliente está acessando o cardápio
- **AND** a janela do navegador está entre 768px e 1023px
- **WHEN** visualiza as categorias
- **THEN** as categorias devem ser exibidas em grid de 2 colunas
- **AND** os produtos em grid de 2-3 colunas

#### Cenário: Carrinho funcional em mobile
- **GIVEN** o cliente está no cardápio
- **AND** adicionou itens ao carrinho
- **AND** a janela do navegador está abaixo de 768px
- **WHEN** clica no FAB do carrinho
- **THEN** o drawer do carrinho deve abrir
- **AND** ser possível finalizar o pedido
- **AND** o campo de WhatsApp deve mostrar keyboard numérico

---

### REQ-RESP-08: Touch Targets Mínimo 44x44px

O sistema DEVE garantir que TODOS os touch targets (botões, links, inputs) TENHAM tamanho mínimo de 44x44px para atender guidelines de acessibilidade.

#### Cenário: Botões em mobile
- **GIVEN** o usuário está em qualquer página
- **AND** a janela do navegador está abaixo de 768px
- **WHEN** identifica um botão interativo
- **THEN** o botão deve ter no mínimo 44x44px
- **AND** espaço ao redor de 8px mínimo

#### Cenário: Links de navegação em mobile
- **GIVEN** o usuário está no menu de navegação
- **AND** a janela do navegador está abaixo de 768px
- **WHEN** identifica um link do menu
- **THEN** o link deve ter área de toque de no mínimo 44x44px

---

### REQ-RESP-09: Nenhum Overflow Horizontal

O sistema DEVE garantir que NENHUMA página apresente overflow horizontal em qualquer breakpoint.

#### Cenário: Verificação em mobile
- **GIVEN** o usuário está em qualquer página
- **AND** a janela do navegador está em 320px
- **WHEN** verifica o layout
- **THEN** não deve haver scroll horizontal
- **AND** todo conteúdo deve estar contido na viewport

#### Cenário: Verificação em tablet
- **GIVEN** o usuário está em qualquer página
- **AND** a janela do navegador está em 768px
- **WHEN** verifica o layout
- **THEN** não deve haver scroll horizontal
- **AND** tables devem ser scrolláveis se necessário

#### Cenário: Imagens responsivas
- **GIVEN** o usuário está em qualquer página
- **AND** a janela do navegador está abaixo de 768px
- **WHEN** visualiza imagens
- **THEN** imagens devem respeitar max-width: 100%
- **AND** manter aspect ratio

---

### REQ-RESP-10: Texto Legível Sem Zoom

O sistema DEVE garantir que TODO texto seja legível sem necessidade de zoom, com tamanho mínimo de 16px para corpo de texto.

#### Cenário: Corpo de texto em mobile
- **GIVEN** o usuário está em qualquer página
- **AND** a janela do navegador está abaixo de 768px
- **WHEN** lê o conteúdo
- **THEN** o texto deve ter tamanho mínimo de 16px
- **AND** linha altura de 1.5

#### Cenário: Títulos em mobile
- **GIVEN** o usuário está em qualquer página
- **AND** a janela do navegador está abaixo de 768px
- **WHEN** lê títulos
- **THEN** H1 deve ter mínimo 24px
- **AND** H2 deve ter mínimo 20px
- **AND** H3 deve ter mínimo 18px

#### Cenário: Contraste em mobile
- **GIVEN** o usuário está em qualquer página
- **AND** a janela do navegador está abaixo de 768px
- **WHEN** lê o conteúdo
- **THEN** contraste deve ser mínimo 4.5:1 para texto normal
- **AND** 3:1 para texto grande

---

### REQ-RESP-11: Touch Targets Mínimo 44x44px em Todos Breakpoints

O sistema DEVE garantir que todos os elementos interativos tenham touch target mínimo de 44x44px independente do breakpoint ativo.

#### Cenário: Verificação em desktop
- **GIVEN** o usuário está em qualquer página
- **AND** a janela do navegador está em 1024px ou mais
- **WHEN** identifica um botão interativo
- **THEN** o botão deve ter área de toque de no mínimo 44x44px

#### Cenário: Verificação em tablet
- **GIVEN** o usuário está em qualquer página
- **AND** a janela do navegador está entre 768px e 1023px
- **WHEN** identifica um botão interativo
- **THEN** o botão deve ter área de toque de no mínimo 44x44px

---

### REQ-RESP-12: Nenhum Overflow Horizontal em Qualquer Breakpoint

O sistema DEVE garantir que nenhuma página tenha overflow horizontal, utilizando overflow-x: hidden ou layouts que previnam scroll horizontal em todos os breakpoints.

#### Cenário: Página admin login em mobile
- **GIVEN** o usuário está na página de login admin
- **AND** a janela do navegador está abaixo de 768px
- **WHEN** verifica o layout
- **THEN** não deve haver scroll horizontal

#### Cenário: Página admin dashboard em tablet
- **GIVEN** o admin está logado
- **AND** a janela do navegador está entre 768px e 1023px
- **WHEN** acessa o dashboard
- **THEN** não deve haver scroll horizontal

---

### REQ-RESP-13: Texto de Corpo Mínimo 16px

O sistema DEVE garantir que todo texto de corpo tenha tamanho mínimo de 16px para garantir legibilidade sem zoom.

#### Cenário: Parágrafos em mobile
- **GIVEN** o usuário está em qualquer página
- **AND** a janela do navegador está abaixo de 768px
- **WHEN** lê parágrafos
- **THEN** o texto deve ter no mínimo 16px

#### Cenário: Labels de input em mobile
- **GIVEN** o usuário está em qualquer página
- **AND** a janela do navegador está abaixo de 768px
- **WHEN** visualiza labels de input
- **THEN** o texto deve ter no mínimo 16px

---

### REQ-RESP-14: Contraste Mínimo 4.5:1

O sistema DEVE garantir contraste mínimo de 4.5:1 para texto normal e 3:1 para texto grande em todos os breakpoints.

#### Cenário: Verificação de contraste em mobile
- **GIVEN** o usuário está em qualquer página
- **AND** a janela do navegador está abaixo de 768px
- **WHEN** verifica contraste do texto
- **THEN** contraste deve ser mínimo 4.5:1 para texto normal
- **AND** 3:1 para texto grande

#### Cenário: Verificação de contraste em desktop
- **GIVEN** o usuário está em qualquer página
- **AND** a janela do navegador está em 1024px ou mais
- **WHEN** verifica contraste do texto
- **THEN** contraste deve ser mínimo 4.5:1 para texto normal
- **AND** 3:1 para texto grande

---

## MODIFIED Requirements

Nenhum requisito existente foi modificado nesta change.

## REMOVED Requirements

Nenhum requisito foi removido nesta change.

---

## Critérios de Aceitação

| ID | Critério | Evidência |
|----|----------|-----------|
| CA-RESP-01 | Login responsivo em todos breakpoints | Playwright: `tests/e2e/responsive-login.test.ts` |
| CA-RESP-02 | Signup responsivo em todos breakpoints | Playwright: `tests/e2e/responsive-signup.test.ts` |
| CA-RESP-03 | Dashboard com sidebar colapsável em tablet/mobile | Playwright: `tests/e2e/responsive-dashboard.test.ts` |
| CA-RESP-04 | Categories com tabela→cards adaptativo | Playwright: `tests/e2e/responsive-categories.test.ts` |
| CA-RESP-05 | Products com grid responsivo + modal mobile-friendly | Playwright: `tests/e2e/responsive-products.test.ts` |
| CA-RESP-06 | Orders com lista responsiva + botões 44x44px | Playwright: `tests/e2e/responsive-orders.test.ts` |
| CA-RESP-07 | Public menu com carrinho FAB em mobile | Playwright: `tests/e2e/responsive-public-menu.test.ts` |
| CA-RESP-08 | Touch targets 44x44px em todos breakpoints | Playwright: `tests/e2e/accessibility-touch-targets.test.ts` |
| CA-RESP-09 | Sem overflow horizontal em qualquer breakpoint | Playwright: `tests/e2e/layout-no-overflow.test.ts` |
| CA-RESP-10 | Texto legível sem zoom (16px mínimo) | Playwright: `tests/e2e/accessibility-text-legibility.test.ts` |

---

## Breakpoints

| Breakpoint | Largura | Tailwind Prefix |
|------------|---------|-----------------|
| Mobile | < 768px | Default (mobile-first) |
| Tablet | 768px - 1023px | `md:` |
| Desktop | ≥ 1024px | `lg:` |

---

## Status

Especificação

## Fonte

PRD 013-2026-04-17-responsive-pages (`.openspec/backlog/prds/013-2026-04-17-responsive-pages/prd.md`)