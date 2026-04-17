# Tasks: Evolução do Fluxo de Desenvolvimento com Qualidade Integrada

## Pré-condições
- [x] Spec aprovada
- [x] Design aprovado

## Tarefas

### Fase 1: Templates OpenSpec

- [x] 1.1: Criar `.openspec/templates/prd-template.md` com estrutura de PRD (título, problema/oportunidade, público-alvo, resultado esperado, critérios de sucesso)
- [x] 1.2: Criar `.openspec/templates/design-template.md` com seções obrigatórias de TDD, BDD, ATDD, DDD
- [x] 1.3: Criar `.openspec/templates/tasks-template.md` com decomposição DDD (Infraestrutura de Testes, Domínio, Aplicação, Infraestrutura, Interface, Documentação)
- [x] 1.4: Atualizar `.openspec/AGENTS.md` para refletir novos templates e fluxo completo

### Fase 2: Atualização do AGENTS.md Principal

- [x] 2.1: Atualizar `AGENTS.md` - fluxo SDD para incluir PRD.md e etapa de Análise
- [x] 2.2: Atualizar `AGENTS.md` - templates OpenSpec com novos templates de PRD, design e tasks
- [x] 2.3: Atualizar `AGENTS.md` - seção de qualidade com cobertura 80% unitários e 100% E2E
- [x] 2.4: Atualizar `AGENTS.md` - Gates de aprovação com PRD como porta de entrada

### Fase 3: Atualização de Documentação dos Módulos Afetados

- [x] 3.1: Atualizar `tests/AGENTS.md` - incluir estratégia TDD/BDD/ATDD com Vitest e Playwright
- [x] 3.2: Atualizar `lib/AGENTS.md` - documentar utils, supabase, whatsapp com regras de implementação
- [x] 3.3: Atualizar `app/AGENTS.md` - manter como visão geral do App Router (sem detalhamento de rotas)
- [x] 3.4: Atualizar `components/AGENTS.md` - documentar componentes UI e admin (visão geral)
- [x] 3.5: Atualizar `context/AGENTS.md` - documentar CartContext com localStorage
- [x] 3.6: Atualizar `hooks/AGENTS.md` - documentar custom hooks (useAuth, useRestaurant)
- [x] 3.7: Atualizar `types/AGENTS.md` - documentar tipos TypeScript (Restaurant, Category, Product, Order, OrderItem, CartItem)
- [x] 3.8: Atualizar `supabase/AGENTS.md` - documentar schema PostgreSQL e integrações

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
- [x] 3.19: Criar `components/admin/header/AGENTS.md` - documentação do Header admin
- [x] 3.20: Criar `components/admin/sidebar/AGENTS.md` - documentação do Sidebar admin
- [x] 3.21: Criar `components/ui/button/AGENTS.md` - documentação do componente Button
- [x] 3.22: Criar `components/ui/input/AGENTS.md` - documentação do componente Input
- [x] 3.23: Criar `components/ui/card/AGENTS.md` - documentação do componente Card

#### Correção: Context e Hooks - AGENTS.md no nível correto
- [x] 3.24: Criar `context/cart-context/AGENTS.md` - documentação detalhada do CartContext

#### Correção: Lib - AGENTS.md no nível correto
- [x] 3.25: Criar `lib/supabase/client/AGENTS.md` - documentação do cliente Supabase browser
- [x] 3.26: Criar `lib/supabase/server/AGENTS.md` - documentação do cliente Supabase server
- [x] 3.27: Criar `lib/whatsapp/AGENTS.md` - documentação do serviço WhatsApp
- [x] 3.28: Criar `lib/utils/AGENTS.md` - documentação dos utilitários

#### Atualizar AGENTS.md pai após reorganização
- [x] 3.29: Atualizar `app/admin/AGENTS.md` - remover detalhamento de rotas (agora em cada pasta) e manter apenas visão geral do módulo admin
- [x] 3.30: Atualizar `app/menu/AGENTS.md` - remover detalhamento de rotas (agora em cada pasta) e manter apenas visão geral do módulo menu
- [x] 3.31: Atualizar `app/api/AGENTS.md` - remover detalhamento de endpoints (agora em cada pasta) e manter apenas visão geral da API
- [x] 3.32: Atualizar `components/admin/AGENTS.md` - remover detalhamento de componentes (agora em cada pasta) e manter apenas visão geral
- [x] 3.33: Atualizar `components/ui/AGENTS.md` - remover detalhamento de componentes (agora em cada pasta) e manter apenas visão geral
- [x] 3.34: Atualizar `lib/AGENTS.md` - remover detalhamento de sub-módulos (agora em cada pasta) e manter apenas visão geral
- [x] 3.35: Atualizar `lib/supabase/AGENTS.md` - remover detalhamento de clientes (agora em cada pasta) e manter apenas visão geral
- [x] 3.36: Atualizar `context/AGENTS.md` - remover detalhamento de context (agora em cada pasta) e manter apenas visão geral

### Fase 3.6: Documentação de Classes de Negócio e Utilitários

#### Classes de Negócio (se existirem em lib/)
- [x] 3.37: Criar `lib/validations/AGENTS.md` - NÃO SE APLICA (validações em lib/utils.ts)
- [x] 3.38: Criar `lib/domain/AGENTS.md` - documento criado (módulo planejado)

#### Hooks Individual
- [x] 3.39: Criar `hooks/useAuth/AGENTS.md` - NÃO SE APLICA (hook não existe)
- [x] 3.40: Criar `hooks/useRestaurant/AGENTS.md` - NÃO SE APLICA (hook não existe)

#### Types Individual
- [x] 3.41: Criar `types/restaurant/AGENTS.md` - documento criado
- [x] 3.42: Criar `types/category/AGENTS.md` - documento criado
- [x] 3.43: Criar `types/product/AGENTS.md` - documento criado
- [x] 3.44: Criar `types/order/AGENTS.md` - documento criado
- [x] 3.45: Criar `types/cart/AGENTS.md` - documento criado

### Fase 3.7: Documentação de Testes e Supabase

#### Testes
- [x] 3.46: Criar `tests/unit/AGENTS.md` - documento criado
- [x] 3.47: Criar `tests/integration/AGENTS.md` - documento criado
- [x] 3.48: Criar `tests/e2e/AGENTS.md` - documento criado

#### Supabase
- [x] 3.49: Criar `supabase/schema/AGENTS.md` - documento criado
- [x] 3.50: Criar `supabase/migrations/AGENTS.md` - documento criado

### Fase 3.8: Arquivos BDD com Proximidade

#### Cenários BDD por módulo (seguindo proximidade)
- [x] 3.51: Criar `app/admin/login/login.feature` - cenários BDD de autenticação (login, logout, validação)
- [x] 3.52: Criar `app/admin/signup/signup.feature` - cenários BDD de cadastro
- [x] 3.53: Criar `app/admin/dashboard/dashboard.feature` - cenários BDD do dashboard
- [x] 3.54: Criar `app/admin/categories/categories.feature` - cenários BDD de categorias (CRUD)
- [x] 3.55: Criar `app/admin/products/products.feature` - cenários BDD de produtos (CRUD, disponibilidade)
- [x] 3.56: Criar `app/admin/orders/orders.feature` - cenários BDD de pedidos (listagem, status, ações)
- [x] 3.57: Criar `app/admin/settings/settings.feature` - cenários BDD de configurações (já existia)
- [x] 3.58: Criar `app/menu/[slug]/menu.feature` - cenários BDD do cardápio público
- [x] 3.59: Criar `app/api/orders/orders.feature` - cenários BDD da API de pedidos

#### Link BDD ↔ Testes de Integração
- [x] 3.60: Atualizar `tests/integration/AGENTS.md` - documento criado com links BDD
- [x] 3.61: Adicionar tags `@integration-test` nos arquivos `.feature` apontando para os testes correspondentes
- [x] 3.62: Verificar se existem cenários BDD em `.openspec/specs/menulink-acceptance-tests.feature` e reorganizar para proximidade

### Fase 4: Verificação

- [x] 4.1: Verificar que todos os templates estão em `.openspec/templates/` ✅
- [x] 4.2: Verificar que AGENTS.md principal tem fluxo atualizado ✅
- [x] 4.3: Verificar que todos os AGENTS.md de módulos estão atualizados ✅
- [x] 4.4: Verificar que todos os AGENTS.md de rotas estão criados (proximidade) ✅
- [x] 4.5: Verificar que todos os AGENTS.md de componentes estão criados (proximidade) ✅
- [x] 4.6: Verificar consistência entre documentação e implementação ✅
- [x] 4.7: Verificar que AGENTS.md pai só têm visão geral (não detalhamento) ✅

## Critério de Conclusão

Uma tarefa só é considerada `[x]` quando:
- Template/documento criado/atualizado
- Conteúdo revisado e consistente com o spec.md
- Verificação de consistência passa

## Progresso

████████████████████ 100%

## Status

✅ CONCLUÍDO