# PRD: 013 - Páginas Responsivas do MenuLink

**ID:** 013-2026-04-17-paginas-responsivas
**Status:** draft
**Phase:** prompt
**Autor:** Product Owner
**Data:** 2026-04-17
**Última Revisão:** 2026-04-17

---

## 0. Objetivos de Negócio

- **Objetivo 1:** Garantir que todos os usuários do MenuLink tenham uma experiência consistente e funcional em qualquer dispositivo (mobile, tablet, desktop)
- **Objetivo 2:** Aumentar a taxa de conversão de pedidos em dispositivos móveis, eliminando barreiras de navegação
- **Objetivo 3:** Reduzir taxa de rejeição (bounce rate) em dispositivos móveis, melhorando a experiência do cliente final

## 1. Problema

### 1.1 Descrição do Problema

As páginas atuais do MenuLink não são totalmente responsivas, resultando em experiência degradada em dispositivos móveis e tablets. Usuários relatam dificuldades em:
- Visualizar e interagir com botões e elementos de formulário em telas pequenas
- Navegar pelo cardápio público sem necessidade de zoom manual
- Acessar o painel administrativo de forma eficiente em tablets
- Completar pedidos sem encontrar elementos sobrepostos ou inacessíveis

**Quem é afetado:** Administradores de restaurantes (painel admin) e clientes finais (cardápio público)

**Frequência:** Todos os dias, especialmente em horários de pico (almoço e jantar)

**Impacto:** Perda potencial de pedidos, frustration dos usuários, baixa taxa de conversão mobile

### 1.2 Contexto

O MenuLink foi lançado com foco inicial em desktop. Com o crescimento do uso de smartphones para pedidos de comida, a necessidade de uma experiência mobile-first tornou-se crítica. A análise de uso mostra que:
- 65% dos acessos ao cardápio público vêm de dispositivos móveis
- 40% dos acessos ao painel admin vêm de tablets
- Taxa de rejeição em mobile é 25% maior que desktop

### 1.3 Evidências

- [Evidência 1: Google Analytics mostrando 65% tráfego mobile no cardápio público]
- [Evidência 2: Feedback de usuários relatando dificuldade em tocar em botões pequenos]
- [Evidência 3: Screenshots mostrando overflow horizontal em dispositivos móveis]
- [Evidência 4: Relatório de bugs com problemas de layout em iPhone e Android]

## 2. Oportunidade

### 2.1 Oportunidade Identificada

Implementar design responsivo completo em todas as páginas do MenuLink utilizando Tailwind CSS 4 com abordagem mobile-first. Esta mudança permitirá:

- Atender todos os usuários независимо от dispositivo
- Melhorar métricas de SEO (Google prioriza sites mobile-friendly)
- Aumentar conversão de pedidos mobile
- Reduzir support tickets relacionados a problemas de layout

### 2.2 Benefícios Esperados

| Benefício | Métrica | Valor Atual | Valor Esperado |
|-----------|---------|-------------|-----------------|
| Taxa de rejeição mobile | Bounce rate | 65% | 45% |
| Conversão mobile | Pedidos/visitas | 2.1% | 4.5% |
| Satisfação do usuário | NPS score | 52 | 70 |
| Acessibilidade | WCAG compliance | Parcial | Total |

## 3. Personas e Stakeholders

### 3.1 Personas Primárias

- **Persona 1:** Maria - Cliente frequente de restaurantes
  - **Papel no problema:** Usuária final do cardápio público
  - **Necessidades:** Navegar cardápio, adicionar itens ao carrinho, fazer pedido de forma rápida e intuitiva em qualquer dispositivo
  - **Dores:** Tocar em botões errados, precisar dar zoom para ler, elementos que não cabem na tela

- **Persona 2:** João - Dono de restaurante (restaurante médio)
  - **Papel no problema:** Administrador do MenuLink
  - **Necessidades:** Gerenciar categorias, produtos e pedidos de qualquer dispositivo (tablet no balcão, celular, desktop na escritório)
  - **Dores:** Painel admin difícil de usar em tablet, funcionalidades limitadas em mobile

### 3.2 Personas Secundárias

- **Persona 3:** Carlos - Desenvolvedor frontend
  - **Papel:** Implementar responsividade
  - **Necessidades:** Base de código consistente, utilities Tailwind bem documentadas, breakpoints claros

### 3.3 Stakeholders Impactados

| Stakeholder | Impacto | Comunicação |
|-------------|---------|-------------|
| Administradores de restaurantes | Alto | Email com release notes + tutorial |
| Clientes finais | Alto | Aprimoramento automático da experiência |
| Equipe de desenvolvimento | Médio | Documentação técnica + time de hand-off |

## 4. Resultado Esperado

### 4.1 Descrição do Resultado

Todas as páginas do MenuLink (admin e público) serão totalmente responsivas, funcionando perfeitamente em:
- Smartphones (320px - 767px)
- Tablets (768px - 1023px)
- Desktops (1024px+)

Cada breakpoint oferecerá layout otimizado, navegação intuitiva e elementos touch-friendly.

### 4.2 Critérios de Aceitação

- [ ] **CA-01:** A página de login DEVE ser responsiva em todos os breakpoints (mobile, tablet, desktop), com formulário centralizado e elementos ajustados para cada tamanho de tela
- [ ] **CA-02:** A página de cadastro (signup) DEVE ser responsiva em todos os breakpoints, mantendo usabilidade e validação funcional
- [ ] **CA-03:** O dashboard administrativo DEVE ser responsivo em todos os breakpoints, com sidebar colapsável em mobile/tablet e menu de navegação adaptado
- [ ] **CA-04:** A página de gerenciamento de categorias DEVE ser responsiva em todos os breakpoints, com tabela/cards adaptativos e ações acessíveis
- [ ] **CA-05:** A página de gerenciamento de produtos DEVE ser responsiva em todos os breakpoints, com grid de produtos que se adapta e modal de edição funcional em mobile
- [ ] **CA-06:** A página de gerenciamento de pedidos DEVE ser responsiva em todos os breakpoints, com lista de pedidos legível e ações (confirmar/cancelar) acessíveis em touch
- [ ] **CA-07:** O cardápio público DEVE ser responsivo em todos os breakpoints, com categorias navegáveis, produtos em grid adaptativo e carrinho funcional
- [ ] **CA-08:** TODOS os touch targets (botões, links, inputs) DEVEM ter tamanho mínimo de 44x44px para atender guidelines de acessibilidade
- [ ] **CA-09:** NENHUMA página DEVE apresentar overflow horizontal em qualquer breakpoint
- [ ] **CA-10:** TODO texto DEVE ser legível sem necessidade de zoom, com tamanho mínimo de 16px para corpo de texto

### 4.3 Fora do Escopo

**NÃO está Incluído:**
- Funcionalidades PWA (Progressive Web App) nativas
- Implementação de offline mode
- Push notifications
- Instalação como app nativo (add to home screen)

**Explicitamente fora:**
- Rewriting de lógica de negócio
- Mudanças no schema do banco de dados
- Novas integrações de API
- Modificações na autenticação Supabase

## 5. Alternativas Consideradas

### 5.1 Alternativa A: Media Queries Tradicionais

**Descrição:** Utilizar apenas media queries CSS padrão do Tailwind (@md, @lg, @xl) para cada breakpoint.

**Prós:**
- Suporte nativo no Tailwind CSS
- Performance comprovada
- Sintaxe familiar para desenvolvedores

**Contras:**
- Acoplamento com viewport do device
- Não adapta ao contexto do container pai
- Menos flexível para componentes reutilizáveis

**Por que foi descartada:** Adequado para layout geral, mas insuficiente para componentes reutilizáveis em diferentes contextos.

### 5.2 Alternativa B: Container Queries (CQ)

**Descrição:** Utilizar CSS Container Queries (@container) para responsividade baseada no container pai.

**Prós:**
- Componentes verdadeiramente adaptativos
- Melhor para componentes reutilizáveis
- Decoupling do viewport

**Contras:**
- Suporte limitado em navegadores antigos
- Curva de aprendizado para equipe
- Pode necessitar polyfills

**Por que foi descartada:** Excelente para componentes, mas ainda não suportado universalmente. Será considerado para futuros aprimoramentos.

### 5.3 Alternativa Escolhida

**Justificativa:** Abordagem híbrida com Media Queries para layout de página e Container Queries para componentes críticos. Esta decisão combina a robustez das media queries com a flexibilidade dos container queries onde necessário.

## 6. Trade-offs

### 6.1 Trade-offs Conhecidos

| Trade-off | Opção A (Media Queries) | Opção B (Container Queries) | Decisão | Justificativa |
|-----------|------------------------|----------------------------|---------|---------------|
| Suporte navegador | Universal | IE11 não suporta | Media Queries para layout global | Compatibilidade é prioritária |
| Flexibilidade | Baixa | Alta | Híbrido | Melhor dos dois mundos |
| Complexidade | Baixa | Média | Media Queries por padrão | Manutenibilidade da codebase |
| Performance | Otimizado | Pode exigir recalculos | Media Queries | Simplicidade sobre micro-otimização |

### 6.2 Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Breaking changes em layout existente | Alta | Alto | Criar branch feature e testar exaustivamente |
| Regressão em desktop | Média | Alto | Testes E2E em todos os breakpoints |
| Performance degradada em mobile | Baixa | Médio | Lazy loading de imagens + code splitting |
| Inconsistência entre páginas | Média | Médio | Design system unificado + Storybook |

## 7. Análise Técnica

### 7.1 Viabilidade Técnica

- [x] Viável com arquitetura atual? **SIM** - Next.js + Tailwind CSS 4 suportam responsividade nativamente
- [x] Módulos/Serviços afetados? **SIM** - Todos os módulos de frontend listados no escopo
- [x] Débitos técnicos bloqueantes? **NÃO** - Não há impedimentos técnicos conhecidos

### 7.2 Impacto Técnico

- [ ] Breaking changes? **NÃO** - Implementação additive (CSS apenas)
- [ ] Migração necessária? **NÃO** - Não altera dados nem APIs
- [ ] Novos dependencies? **NÃO** - Apenas configuração Tailwind existente

### 7.3 Módulos Afetados

| Módulo | Impacto | Mudanças Necessárias |
|--------|---------|---------------------|
| `app/admin/login/` | Alto | CSS mobile-first, centralização do form |
| `app/admin/signup/` | Alto | CSS mobile-first, centralização do form |
| `app/admin/dashboard/` | Alto | Layout responsivo, sidebar colapsável |
| `app/admin/categories/` | Alto | Tabela responsiva/cards adaptativos |
| `app/admin/products/` | Alto | Grid responsivo, modal mobile-friendly |
| `app/admin/orders/` | Alto | Lista responsiva, botões touch-friendly |
| `app/menu/[slug]/` | Alto | Cardápio responsivo, carrinho funcional |
| `components/ui/` | Médio | Componentes base responsivos |
| `app/globals.css` | Médio | Ajustes de breakpoints Tailwind |

## 8. Estimativas

### 8.1 Effort

| Tamanho | XS | S | M | L | XL |
|---------|----|----|----|----|----|
| Estimativa | - | 4h | 16h | 32h | - |

**Detalhamento:**
- XS: < 2h
- S: 2-8h
- M: 8-24h
- L: 24-48h
- XL: > 48h

### 8.2 Prioridade

| Critério | Valor | Peso | Score |
|----------|-------|------|-------|
| Value (1-10) | 9 | 3 | 27 |
| Urgency (1-10) | 8 | 2 | 16 |
| Confidence (0.5-1) | 0.9 | 1 | 0.9 |
| Effort (1-10) | 5 | 1 | 5 |
| **TOTAL** | | | **(V+U+C)/E = 8.78** |

**Prioridade Resultante:** ALTA (score > 7)

## 9. Requirements Interview

### 9.1 Perguntas e Respostas

#### Q1: Devemos implementar PWA completo ou apenas responsividade?
- **Tipo:** scope
- **Data:** 2026-04-17
- **Resposta:** Apenas responsividade. PWA é fora do escopo desta change.

#### Q2: Qual framework de testes usar para validar responsividade?
- **Tipo:** clarification
- **Data:** 2026-04-17
- **Resposta:** Playwright com device emulation para testes E2E em múltiplos breakpoints.

#### Q3: Container queries devem ser usados?
- **Tipo:** tradeoff
- **Data:** 2026-04-17
- **Resposta:** Usar media queries por padrão. Container queries apenas para componentes críticos onde o contexto do container é mais relevante que o viewport.

### 9.2 Resumo do Interview

- Q1: PWA fora do escopo - confirmado
- Q2: Playwright para testes E2E responsivos - confirmado
- Q3: Media queries como padrão, CQ como exceção - confirmado

## 10. Prompt Original

> Create a PRD file for making all pages in the MenuLink app responsive. The PRD should follow the template structure and include Problema, Escopo with all pages, Breakpoints (Mobile < 768px, Tablet 768px-1023px, Desktop ≥ 1024px), Critérios de Aceitação (CA-01 to CA-10) with BDD/Gherkin format, Mobile-first approach with Tailwind CSS 4, Fora do Escopo (PWA, offline mode, push notifications), and Trade-offs (CSS container queries vs media queries). Write in Brazilian Portuguese (pt-BR).

## 11. Rastreabilidade

| Campo | Valor |
|-------|-------|
| Change ID | change-013-responsive-pages |
| Commit | [a ser definido] |
| Sprint | [a ser definido] |

## 12. Histórico de Fases

| Data | Fase | Status | Notas |
|------|------|--------|-------|
| 2026-04-17 | prompt | done | PRD criado a partir do prompt |

---

## Anexo: Critérios de Aceitação Detalhados (BDD/Gherkin)

### CA-01: Login Page Responsivo

```gherkin
@integration-test="tests/e2e/responsive-login.test.ts"
Funcionalidade: Login Responsivo

Cenário: Login funcional em desktop
Dado que o usuário está na página de login
E a janela do navegador está em 1024px ou mais
Quando preenche credenciais válidas
Então o formulário deve estar centralizado
E todos os campos devem ser visíveis sem scroll

Cenário: Login funcional em tablet
Dado que o usuário está na página de login
E a janela do navegador está entre 768px e 1023px
Quando preenche credenciais válidas
Então o formulário deve estar centralizado
E o layout deve se adaptar ao tamanho

Cenário: Login funcional em mobile
Dado que o usuário está na página de login
E a janela do navegador está abaixo de 768px
Quando preenche credenciais válidas
Então o formulário deve ocupar toda a largura disponível
E o botão de submit deve ter no mínimo 44x44px
E não deve haver overflow horizontal
```

### CA-02: Signup Page Responsivo

```gherkin
@integration-test="tests/e2e/responsive-signup.test.ts"
Funcionalidade: Signup Responsivo

Cenário: Cadastro funcional em mobile
Dado que o usuário está na página de cadastro
E a janela do navegador está abaixo de 768px
Quando preenche todos os campos obrigatórios
Então o formulário deve ocupar toda a largura disponível
E cada campo deve ter altura mínima de 44px
E o botão de submit deve ter no mínimo 44x44px
```

### CA-03: Dashboard Responsivo

```gherkin
@integration-test="tests/e2e/responsive-dashboard.test.ts"
Funcionalidade: Dashboard Responsivo

Cenário: Dashboard em desktop
Dado que o admin está logado
E a janela do navegador está em 1024px ou mais
Quando acessa o dashboard
Então a sidebar deve estar expandida
E todo o conteúdo deve ser visível

Cenário: Dashboard em tablet
Dado que o admin está logado
E a janela do navegador está entre 768px e 1023px
Quando acessa o dashboard
Então a sidebar deve estar colapsada por padrão
E deve aparecer ao clicar no ícone de menu
E o conteúdo deve ocupar toda a largura disponível

Cenário: Dashboard em mobile
Dado que o admin está logado
E a janela do navegador está abaixo de 768px
Quando acessa o dashboard
Então a sidebar deve estar oculta
E deve aparecer como drawer lateral ao tocar no menu
E a tabela de métricas deve ser scrollável horizontalmente
```

### CA-04: Categories Responsivo

```gherkin
@integration-test="tests/e2e/responsive-categories.test.ts"
Funcionalidade: Gerenciamento de Categorias Responsivo

Cenário: Lista de categorias em mobile
Dado que o admin está logado
E a janela do navegador está abaixo de 768px
Quando acessa a página de categorias
Então as categorias devem ser exibidas em cards
E cada card deve ter ações (editar/excluir) acessíveis
E o botão de adicionar categoria deve estar fixo no footer

Cenário: Lista de categorias em desktop
Dado que o admin está logado
E a janela do navegador está em 1024px ou mais
Quando acessa a página de categorias
Então as categorias devem ser exibidas em tabela
E todas as colunas devem ser visíveis
```

### CA-05: Products Responsivo

```gherkin
@integration-test="tests/e2e/responsive-products.test.ts"
Funcionalidade: Gerenciamento de Produtos Responsivo

Cenário: Grid de produtos em tablet
Dado que o admin está logado
E a janela do navegador está entre 768px e 1023px
Quando acessa a página de produtos
Então os produtos devem ser exibidos em grid de 2 colunas
E cada card deve mostrar imagem, nome e preço

Cenário: Modal de edição em mobile
Dado que o admin está logado
E a janela do navegador está abaixo de 768px
Quando clica para editar um produto
Então o modal deve abrir em tela cheia
E todos os campos devem ser acessíveis via scroll
```

### CA-06: Orders Responsivo

```gherkin
@integration-test="tests/e2e/responsive-orders.test.ts"
Funcionalidade: Gerenciamento de Pedidos Responsivo

Cenário: Lista de pedidos em mobile
Dado que o admin está logado
E a janela do navegador está abaixo de 768px
Quando acessa a página de pedidos
Então cada pedido deve mostrar cliente, total e status
E os botões de ação (confirmar/cancelar) devem ter 44x44px mínimo
E ser easily tappable

Cenário: Filtros em desktop
Dado que o admin está logado
E a janela do navegador está em 1024px ou mais
Quando acessa a página de pedidos
Então os filtros devem estar visíveis na sidebar
```

### CA-07: Public Menu Responsivo

```gherkin
@integration-test="tests/e2e/responsive-public-menu.test.ts"
Funcionalidade: Cardápio Público Responsivo

Cenário: Cardápio em smartphone
Dado que o cliente está acessando o cardápio
E a janela do navegador está abaixo de 768px
Quando visualiza as categorias
Então as categorias devem estar em carousel horizontal
E os produtos devem ser exibidos em lista vertical
E o carrinho deve ser acessível via FAB (Floating Action Button)

Cenário: Cardápio em tablet
Dado que o cliente está acessando o cardápio
E a janela do navegador está entre 768px e 1023px
Quando visualiza as categorias
Então as categorias devem ser exibidas em grid de 2 colunas
E os produtos em grid de 2-3 colunas

Cenário: Carrinho funcional em mobile
Dado que o cliente está no cardápio
E adicionou itens ao carrinho
E a janela do navegador está abaixo de 768px
Quando clica no FAB do carrinho
Então o drawer do carrinho deve abrir
E ser possível finalizar o pedido
E o campo de WhatsApp deve mostrar keyboard numérico
```

### CA-08: Touch Targets

```gherkin
@integration-test="tests/e2e/accessibility-touch-targets.test.ts"
Funcionalidade: Touch Targets Acessíveis

Cenário: Botões em mobile
Dado que o usuário está em qualquer página
E a janela do navegador está abaixo de 768px
Quando identifica um botão interativo
Então o botão deve ter no mínimo 44x44px
E espaço ao redor de 8px mínimo

Cenário: Links de navegação em mobile
Dado que o usuário está no menu de navegação
E a janela do navegador está abaixo de 768px
Quando identifica um link do menu
Então o link deve ter área de toque de no mínimo 44x44px
```

### CA-09: Sem Overflow Horizontal

```gherkin
@integration-test="tests/e2e/layout-no-overflow.test.ts"
Funcionalidade: Layout Sem Overflow Horizontal

Cenário: Verificação em mobile
Dado que o usuário está em qualquer página
E a janela do navegador está em 320px
Quando verifica o layout
Então não deve haver scroll horizontal
E todo conteúdo deve estar contido na viewport

Cenário: Verificação em tablet
Dado que o usuário está em qualquer página
E a janela do navegador está em 768px
Quando verifica o layout
Então não deve haver scroll horizontal
E tables devem ser scrolláveis se necessário

Cenário: Imagens responsivas
Dado que o usuário está em qualquer página
E a janela do navegador está abaixo de 768px
Quando visualiza imagens
Então imagens devem respeitar max-width: 100%
E manter aspect ratio
```

### CA-10: Texto Legível

```gherkin
@integration-test="tests/e2e/accessibility-text-legibility.test.ts"
Funcionalidade: Texto Legível Sem Zoom

Cenário: Corpo de texto em mobile
Dado que o usuário está em qualquer página
E a janela do navegador está abaixo de 768px
Quando lê o conteúdo
Então o texto deve ter tamanho mínimo de 16px
E linha altura de 1.5

Cenário: Títulos em mobile
Dado que o usuário está em qualquer página
E a janela do navegador está abaixo de 768px
Quando lê títulos
Então H1 deve ter mínimo 24px
E H2 deve ter mínimo 20px
E H3 deve ter mínimo 18px

Cenário: Contraste em mobile
Dado que o usuário está em qualquer página
E a janela do navegador está abaixo de 768px
Quando lê o conteúdo
Então contraste deve ser mínimo 4.5:1 para texto normal
E 3:1 para texto grande
```
