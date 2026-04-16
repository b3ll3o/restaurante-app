# Tasks: Evolução do Fluxo de Desenvolvimento com Qualidade Integrada

## Pré-condições
- [x] Spec aprovada
- [x] Design aprovado

## Tarefas

### Fase 1: Templates OpenSpec

- [x] 1.1: Criar `.openspec/templates/prb-template.md` com estrutura de PRB (título, problema/oportunidade, público-alvo, resultado esperado, critérios de sucesso)
- [x] 1.2: Criar `.openspec/templates/design-template.md` com seções obrigatórias de TDD, BDD, ATDD, DDD
- [x] 1.3: Criar `.openspec/templates/tasks-template.md` com decomposição DDD (Infraestrutura de Testes, Domínio, Aplicação, Infraestrutura, Interface, Documentação)
- [x] 1.4: Atualizar `.openspec/AGENTS.md` para refletir novos templates e fluxo completo

### Fase 2: Atualização do AGENTS.md Principal

- [ ] 2.1: Atualizar `AGENTS.md` - fluxo SDD para incluir PRB.md e etapa de Análise
- [ ] 2.2: Atualizar `AGENTS.md` - templates OpenSpec com novos templates de PRB, design e tasks
- [ ] 2.3: Atualizar `AGENTS.md` - seção de qualidade com cobertura 80% unitários e 100% E2E
- [ ] 2.4: Atualizar `AGENTS.md` - Gates de aprovação com PRB como porta de entrada

### Fase 3: Atualização de Documentação dos Módulos Afetados

- [ ] 3.1: Atualizar `tests/AGENTS.md` - incluir estratégia TDD/BDD/ATDD com Vitest e Playwright
- [ ] 3.2: Atualizar `lib/AGENTS.md` - documentar utils, supabase, whatsapp com regras de implementação
- [ ] 3.3: Atualizar `app/AGENTS.md` - manter como visão geral do App Router (sem detalhamento de rotas)
- [ ] 3.4: Atualizar `components/AGENTS.md` - documentar componentes UI e admin (visão geral)
- [ ] 3.5: Atualizar `context/AGENTS.md` - documentar CartContext com localStorage
- [ ] 3.6: Atualizar `hooks/AGENTS.md` - documentar custom hooks (useAuth, useRestaurant)
- [ ] 3.7: Atualizar `types/AGENTS.md` - documentar tipos TypeScript (Restaurant, Category, Product, Order, OrderItem, CartItem)
- [ ] 3.8: Atualizar `supabase/AGENTS.md` - documentar schema PostgreSQL e integrações

### Fase 3.5: Reorganização de AGENTS.md para Proximidade (CORREÇÃO)

#### Correção: Admin Routes - AGENTS.md no nível correto
- [x] 3.9: Criar `app/admin/login/AGENTS.md` - documentação da rota de login (autenticação, validação, redirect)
- [x] 3.10: Criar `app/admin/signup/AGENTS.md` - documentação da rota de cadastro (validação, criação de conta)
- [x] 3.11: Criar `app/admin/dashboard/AGENTS.md` - documentação do dashboard (métricas, atalhos, estado de carregamento)
- [x] 3.12: Criar `app/admin/categories/AGENTS.md` - documentação de categorias (CRUD, ordenação)
- [x] 3.13: Criar `app/admin/products/AGENTS.md` - documentação de produtos (CRUD, upload de imagem, disponibilidade)
- [x] 3.14: Criar `app/admin/orders/AGENTS.md` - documentação de pedidos (listagem, status, ações)
- [x] 3.15: Criar `app/admin/settings/AGENTS.md` - documentação de configurações (dados do restaurante, WhatsApp)
- [x] 3.16: Criar `app/admin/auth/callback/AGENTS.md` - documentação do callback de autenticação

#### Correção: Menu Routes - AGENTS.md no nível correto
- [x] 3.17: Criar `app/menu/[slug]/AGENTS.md` - documentação do cardápio público (listagem de categorias, produtos, carrinho)

#### Correção: API Routes - AGENTS.md no nível correto
- [x] 3.18: Criar `app/api/orders/AGENTS.md` - documentação do endpoint POST /api/orders (criação de pedido, validação, integração WhatsApp)

#### Correção: Components - AGENTS.md no nível correto
- [ ] 3.19: Criar `components/admin/header/AGENTS.md` - documentação do Header admin
- [ ] 3.20: Criar `components/admin/sidebar/AGENTS.md` - documentação do Sidebar admin
- [ ] 3.21: Criar `components/ui/button/AGENTS.md` - documentação do componente Button
- [ ] 3.22: Criar `components/ui/input/AGENTS.md` - documentação do componente Input
- [ ] 3.23: Criar `components/ui/card/AGENTS.md` - documentação do componente Card

#### Correção: Context e Hooks - AGENTS.md no nível correto
- [ ] 3.24: Criar `context/cart-context/AGENTS.md` - documentação detalhada do CartContext

#### Correção: Lib - AGENTS.md no nível correto
- [ ] 3.25: Criar `lib/supabase/client/AGENTS.md` - documentação do cliente Supabase browser
- [ ] 3.26: Criar `lib/supabase/server/AGENTS.md` - documentação do cliente Supabase server
- [ ] 3.27: Criar `lib/whatsapp/AGENTS.md` - documentação do serviço WhatsApp
- [ ] 3.28: Criar `lib/utils/AGENTS.md` - documentação dos utilitários

#### Atualizar AGENTS.md pai após reorganização
- [ ] 3.29: Atualizar `app/admin/AGENTS.md` - remover detalhamento de rotas (agora em cada pasta) e manter apenas visão geral do módulo admin
- [ ] 3.30: Atualizar `app/menu/AGENTS.md` - remover detalhamento de rotas (agora em cada pasta) e manter apenas visão geral do módulo menu
- [ ] 3.31: Atualizar `app/api/AGENTS.md` - remover detalhamento de endpoints (agora em cada pasta) e manter apenas visão geral da API
- [ ] 3.32: Atualizar `components/admin/AGENTS.md` - remover detalhamento de componentes (agora em cada pasta) e manter apenas visão geral
- [ ] 3.33: Atualizar `components/ui/AGENTS.md` - remover detalhamento de componentes (agora em cada pasta) e manter apenas visão geral
- [ ] 3.34: Atualizar `lib/AGENTS.md` - remover detalhamento de sub-módulos (agora em cada pasta) e manter apenas visão geral
- [ ] 3.35: Atualizar `lib/supabase/AGENTS.md` - remover detalhamento de clientes (agora em cada pasta) e manter apenas visão geral
- [ ] 3.36: Atualizar `context/AGENTS.md` - remover detalhamento de context (agora em cada pasta) e manter apenas visão geral

### Fase 3.6: Documentação de Classes de Negócio e Utilitários

#### Classes de Negócio (se existirem em lib/)
- [ ] 3.37: Criar `lib/validations/AGENTS.md` - documentação de regras de validação
- [ ] 3.38: Criar `lib/domain/AGENTS.md` - documentação de entidades e regras de domínio

#### Hooks Individual
- [ ] 3.39: Criar `hooks/useAuth/AGENTS.md` - documentação do hook de autenticação
- [ ] 3.40: Criar `hooks/useRestaurant/AGENTS.md` - documentação do hook de restaurante

#### Types Individual
- [ ] 3.41: Criar `types/restaurant/AGENTS.md` - documentação do tipo Restaurant
- [ ] 3.42: Criar `types/category/AGENTS.md` - documentação do tipo Category
- [ ] 3.43: Criar `types/product/AGENTS.md` - documentação do tipo Product
- [ ] 3.44: Criar `types/order/AGENTS.md` - documentação do tipo Order e OrderItem
- [ ] 3.45: Criar `types/cart/AGENTS.md` - documentação do tipo Cart e CartItem

### Fase 3.7: Documentação de Testes e Supabase

#### Testes
- [ ] 3.46: Criar `tests/unit/AGENTS.md` - documentação da estrutura de testes unitários
- [ ] 3.47: Criar `tests/integration/AGENTS.md` - documentação da estrutura de testes de integração
- [ ] 3.48: Criar `tests/e2e/AGENTS.md` - documentação da estrutura de testes E2E

#### Supabase
- [ ] 3.49: Criar `supabase/schema/AGENTS.md` - documentação do schema do banco
- [ ] 3.50: Criar `supabase/migrations/AGENTS.md` - documentação das migrations

### Fase 3.8: Arquivos BDD com Proximidade

#### Cenários BDD por módulo (seguindo proximidade)
- [x] 3.51: Criar `app/admin/login/login.feature` - cenários BDD de autenticação (login, logout, validação)
- [x] 3.52: Criar `app/admin/signup/signup.feature` - cenários BDD de cadastro
- [x] 3.53: Criar `app/admin/dashboard/dashboard.feature` - cenários BDD do dashboard
- [x] 3.54: Criar `app/admin/categories/categories.feature` - cenários BDD de categorias (CRUD)
- [x] 3.55: Criar `app/admin/products/products.feature` - cenários BDD de produtos (CRUD, disponibilidade)
- [x] 3.56: Criar `app/admin/orders/orders.feature` - cenários BDD de pedidos (listagem, status, ações)
- [ ] 3.57: Criar `app/admin/settings/settings.feature` - cenários BDD de configurações
- [x] 3.58: Criar `app/menu/[slug]/menu.feature` - cenários BDD do cardápio público
- [x] 3.59: Criar `app/api/orders/orders.feature` - cenários BDD da API de pedidos

#### Link BDD ↔ Testes de Integração
- [ ] 3.60: Atualizar `tests/integration/AGENTS.md` - documentar link entre cenários BDD e testes de integração
- [x] 3.61: Adicionar tags `@integration-test` nos arquivos `.feature` apontando para os testes correspondentes
- [ ] 3.62: Verificar se existem cenários BDD em `.openspec/specs/menulink-acceptance-tests.feature` e reorganizar para proximidade

### Fase 4: Verificação

- [ ] 4.1: Verificar que todos os templates estão em `.openspec/templates/`
- [ ] 4.2: Verificar que AGENTS.md principal tem fluxo atualizado
- [ ] 4.3: Verificar que todos os AGENTS.md de módulos estão atualizados
- [ ] 4.4: Verificar que todos os AGENTS.md de rotas estão criados (proximidade)
- [ ] 4.5: Verificar que todos os AGENTS.md de componentes estão criados (proximidade)
- [ ] 4.6: Verificar consistência entre documentação e implementação
- [ ] 4.7: Verificar que AGENTS.md pai só têm visão geral (não detalhamento)

## Critério de Conclusão

Uma tarefa só é considerada `[x]` quando:
- Template/documento criado/atualizado
- Conteúdo revisado e consistente com o spec.md
- Verificação de consistência passa

## Progresso

░░░░░░░░░░ 0%

## Status

Em Andamento