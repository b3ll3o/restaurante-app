<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:sdd-rules -->
# MenuLink - SDD (Specification-Driven Development)

## Core Principle

**Specification is the Source of Truth.** Before writing any code, read and follow the specifications in `.openspec/specs/`.

## Workflow

1. **Read**: Consult `.openspec/specs/menulink-specification.md` for business rules
2. **Plan**: Check `.openspec/specs/menulink-technical-plan.md` for architecture decisions
3. **Implement**: Write code that fulfills the specifications
4. **Verify**: Ensure implementation matches SPEC before calling complete

## SDD Artifacts Location

```
.openspec/
├── specs/                    # Live specifications (Source of Truth)
│   ├── menulink-specification.md   # Business rules (RFC 2119)
│   └── menulink-technical-plan.md  # Architecture & data models
└── changes/                  # Changes in progress (proposals, design, tasks)
```

## Key Specifications

### Business Rules (from specification.md)
- REQ-001 to REQ-006: Restaurant management
- REQ-010 to REQ-013: Category management
- REQ-020 to REQ-026: Product management
- REQ-030 to REQ-034: Public menu
- REQ-040 to REQ-045: Checkout flow
- REQ-050 to REQ-054: Order management

### Architecture (from technical_plan.md)
- Frontend: Next.js 16.2.3 + React 19 + Tailwind CSS 4
- Backend: Next.js API Routes + Supabase
- Auth: Supabase Auth (admin routes protected, public menu open)

### Acceptance Criteria
- CA-001 to CA-006 defined in specification.md

## When Implementing

1. Check if the feature exists in `.openspec/specs/`
2. If adding/changing functionality, update the spec first
3. Use the language ubíqua defined in specification.md
4. Follow the architecture defined in technical-plan.md
5. Ensure code fulfills REQ-*** requirements

## Prohibited Actions

- DO NOT implement features not defined in specifications without updating specs first
- DO NOT skip reading specifications before implementing business logic
<!-- END:sdd-rules -->

# Project: MenuLink (Restaurant SaaS)

Stack: Next.js 16.2.3 + React 19 + TypeScript (strict) + Tailwind CSS 4 + Supabase

## Idioma Padrão
- **Idioma**: Português Brasileiro (pt-BR)
- **Documentação**: Todas as documentações em pt-BR
- **Interface**: Textos da UI em pt-BR
- **Código**: Comentários e mensagens em pt-BR
- **Exceções**: Nomes técnicos (funções, variáveis, APIs) podem ser em inglês

## Regras de Qualidade
- **Cobertura mínima de testes**: 80% (unitários)
- **Paradigmas**: TDD, BDD, ATDD, DDD, SDD
- **Arquitetura**: Multi-tenant (cada restaurante é um tenant)
- **Testes E2E**: 100% dos fluxos críticos
- **Idioma**: pt-BR padrão
- **npm install**: **DEVE** funcionar sem `--legacy-peer-deps`. Conflitos de peer dependencies devem ser resolvidos atualizando ou removendo packages incompatíveis, nunca usando flags de bypass.

## Paradigmas de Desenvolvimento

### Prioridade: Testes (TDD, BDD, ATDD)

**TDD (Test-Driven Development)** — Testes Unitários
- **Quando**: Toda lógica de negócio, utilitários, hooks, e funções puras.
- **Fluxo**: RED (escrever teste que falha) → GREEN (código mínimo para passar) → REFACTOR (melhorar mantendo testes).
- **Foco**: Cobertura ≥80%, testes rápidos e isolados.

**BDD (Behavior-Driven Development)** — Testes de Integração
- **Quando**: Interação entre módulos, API routes, contexto de carrinho.
- **Formato**: Gherkin (Given-When-Then) para documentar comportamento.
- **Foco**: Cenários de negócio derivam dos requisitos (REQ-XXX).

**ATDD (Acceptance Test-Driven Development)** — Testes de Interface (E2E)
- **Quando**: Fluxos críticos do usuário (criar pedido, gerenciar cardápio).
- **Foco**: 100% dos fluxos críticos automatizados com Playwright.
- **Validação**: Critérios de aceitação (CA-XXX) verificáveis.

### Prioridade: Especificação (SDD)

**SDD (Specification-Driven Development)** — Specs e Documentação
- **Quando**: Toda mudança significativa (nova funcionalidade, API, regra de negócio).
- **Fluxo**: proposal → spec (RFC 2119) → design → tasks → implementation → verification → archive.
- **Foco**: Especificações são fonte da verdade; código deriva das specs.

### Prioridade: Domínio (DDD)

**DDD (Domain-Driven Design)** — Modelagem de Domínio
- **Quando**: Definir entidades, value objects, aggregates, e bounded contexts.
- **Foco**: Linguagem ubíqua (pt-BR) refletida em tipos, funções e documentação.
- **Domínios do MenuLink**:
  - **Gestão de Restaurante**: Restaurant, Owner
  - **Cardápio**: Category, Product
  - **Pedidos**: Order, OrderItem, Cart, CartItem
  - **Pagamento**: PaymentMethod, PaymentStatus

## Commands

```bash
npm run dev    # Development server
npm run build  # Production build
npm run start  # Start production server
npm run lint   # ESLint
```

## Tailwind CSS 4

This project uses Tailwind 4 with the new CSS-based config. There is NO `tailwind.config.js` — theme variables are defined in `app/globals.css` using CSS custom properties (`--primary`, `--background`, etc.) and `@theme inline {}`. Do not create a tailwind.config.js.

## Path Alias

`@/*` maps to the root `./*`. Use `@/lib/...`, `@/components/...`, `@/types/...`.

## Supabase Integration

- Client (browser): `lib/supabase/client.ts` — `createBrowserClient`
- Server (SSR): `lib/supabase/server.ts` — `createServerClient` with async cookies
- Auth callback: `app/admin/auth/callback/route.ts`

## Architecture

- Admin routes: `app/admin/*` (login, signup, dashboard)
- Public menu: `app/menu/[slug]/*`
- API routes: `app/api/*`
- shadcn/ui components: `components/ui/*` (already installed)
- Admin components: `components/admin/*` (header, sidebar)

## Database

Run `supabase/schema.sql` in your Supabase SQL Editor to create tables: `restaurants`, `categories`, `products`, `orders`, `order_items`.

## Required Env Vars

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
WHATSAPP_TOKEN
WHATSAPP_PHONE_NUMBER_ID
```

## Important Constraints

- Strict TypeScript mode (`strict: true` in tsconfig)
- No RSC "use client" on admin layout (`app/admin/layout.tsx` uses client-side auth check)
- Public menu/orders are unauthenticated; admin routes require Supabase auth

## Domain Model (MenuLink)

### Entities

- **Restaurant**: id, name, slug, owner_whatsapp
- **Category**: id, restaurant_id, name, display_order
- **Product**: id, category_id, name, description, price, image_url, is_available, display_order
- **Order**: id, restaurant_id, customer_name, customer_whatsapp, total, status, payment_method
- **OrderItem**: id, order_id, product_id, product_name, unit_price, quantity, total_price

### Business Rules

- Products belong to a Category
- Categories and Products have display_order for sorting
- Orders have status: pending → confirmed → cancelled
- Order total is calculated from order_items

## Módulos do Sistema

### 1. App Router (`app/`)
- **Admin** (`app/admin/`): Painel administrativo (login, dashboard, categorias, produtos, pedidos, settings)
- **Público** (`app/menu/[slug]/`): Cardápio público por slug do restaurante
- **API** (`app/api/`): Endpoints da API (orders)
- **Layout**: Layout raiz e configurações globais

### 2. Componentes (`components/`)
- **UI** (`components/ui/`): Componentes shadcn/ui reutilizáveis (Button, Input, Card, Dialog, Table, etc.)
- **Admin** (`components/admin/`): Componentes específicos do painel (Header, Sidebar)

### 3. Biblioteca (`lib/`)
- **Utils** (`lib/utils.ts`): Funções utilitárias (formatação, validação, slugs)
- **Supabase** (`lib/supabase/`): Clientes para browser e server-side
- **WhatsApp** (`lib/whatsapp.ts`): Integração com WhatsApp API

### 4. Contexto (`context/`)
- **Carrinho** (`context/cart-context.tsx`): Gerenciamento de estado do carrinho com persistência

### 5. Hooks (`hooks/`)
- **Custom Hooks**: Lógica reutilizável (useAuth, useRestaurant - futuros)

### 6. Tipos (`types/`)
- **Tipos de Domínio**: Restaurant, Category, Product, Order, OrderItem, CartItem

### 7. Testes (`tests/`)
- **Unitários** (`tests/unit/`): ≥80% cobertura obrigatória
- **Integração** (`tests/integration/`): Testes entre módulos
- **E2E** (`tests/e2e/`): 100% fluxos críticos
- **Setup** (`tests/setup.ts`): Configuração global

### 8. Especificações (`.openspec/`)
- **Specs** (`.openspec/specs/`): Fonte da verdade SDD
- **Changes** (`.openspec/changes/`): Controle de mudanças

### 9. Banco de Dados (`supabase/`)
- **Schema** (`supabase/schema.sql`): Definição das tabelas

## Arquitetura Multi-Tenant
- Cada restaurante é um tenant distinto
- Todos os tenants compartilham o mesmo banco
- Isolamento por `restaurant_id`
- Escalabilidade horizontal

## Scripts de Desenvolvimento

```bash
# Desenvolvimento
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Iniciar produção
npm run lint         # ESLint

# Testes
npm run test         # Todos os testes
npm run test:unit    # Apenas unitários
npm run test:integration  # Testes de integração
npm run test:e2e     # Testes end-to-end
npm run test:coverage # Testes com cobertura (≥80% obrigatório)
npm run test:watch   # Modo watch
```

## Configuração de Ambiente

### Variáveis de Ambiente Obrigatórias
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
WHATSAPP_TOKEN
WHATSAPP_PHONE_NUMBER_ID
```

### Tailwind CSS 4
- Configuração via CSS custom properties em `app/globals.css`
- **NÃO** criar `tailwind.config.js`
- Usar `@theme inline {}` para customização

### TypeScript Strict
- `strict: true` no tsconfig.json
- Tipagem rigorosa em todo o código

## Regras de Commit
- Mensagens em português (pt-BR)
- Referenciar requisitos (REQ-XXX)
- Incluir scope do módulo: `feat(app):`, `fix(lib):`, `test(unit):`

## Gates de Qualidade
1. **PR Checks**: Testes devem passar
2. **Cobertura**: ≥80% unitários
3. **Lint**: Sem erros do ESLint
4. **Build**: Build de produção bem-sucedido
5. **E2E**: Fluxos críticos testados

## Regras de Documentação

### Obrigatoriedade de Documentação (REGRA CRÍTICA)

**TODO elemento da arquitetura DEVE ter AGENTS.md**. A documentação é parte do desenvolvimento, não um item opcional. Não existe exceção: se existe código, existe documentação.

#### Elementos que DEVEM ser documentados:
- **Módulos**: `app/`, `components/`, `lib/`, `context/`, `hooks/`, `types/`, `tests/`, `supabase/`, `.openspec/`
- **Sub-módulos**: `app/admin/`, `app/menu/`, `app/api/`, `components/ui/`, `components/admin/`, `lib/supabase/`
- **Rotas**: `app/admin/login/`, `app/admin/dashboard/`, `app/menu/[slug]/`, `app/api/orders/`
- **Classes de negócio**: Qualquer lógica de domínio em `lib/domain/`, `lib/validations/`
- **Componentes React**: Todo componente em `components/ui/` ou `components/admin/`
- **Hooks customizados**: Todo hook em `hooks/`
- **Contextos**: Todo contexto em `context/`
- **Tipos TypeScript**: Entidades como `Restaurant`, `Category`, `Product`, `Order`
- **Utilitários**: Funções em `lib/utils.ts`, `lib/whatsapp.ts`
- **Clientes Supabase**: `lib/supabase/client.ts`, `lib/supabase/server.ts`

### Princípio da Proximidade (REGRA CRÍTICA)

**Os arquivos AGENTS.md DEVEM estar no nível mais próximo possível do elemento que documentam.**

#### Estrutura de Proximidade:
```
# ✅ CORRETO - Documentação junto ao código
app/admin/login/page.tsx
app/admin/login/AGENTS.md          ← Mesma pasta da rota

app/admin/login/
├── page.tsx                      ← Arquivo da rota
└── AGENTS.md                     ← Documentação da rota

# ❌ INCORRETO - Documentação longe do código
app/admin/AGENTS.md               ← Nível muito alto
app/admin/login/page.tsx          ← Rota longe da documentação
```

#### Hierarquia de Proximidade:
1. **Rota (page.tsx, route.ts)** → AGENTS.md na mesma pasta
2. **Componente** → AGENTS.md na mesma pasta do componente
3. **Hook** → AGENTS.md na mesma pasta do hook
4. **Tipo/Entidade** → AGENTS.md na pasta do tipo
5. **Módulo** → AGENTS.md no nível do módulo (visão geral)

### Regras de Documentação BDD (REGRA CRÍTICA)

**Arquivos `.feature` DEVEM estar no nível mais próximo do módulo que documentam.**

#### Estrutura de Proximidade BDD:
```
# ✅ CORRETO - BDD junto ao módulo que documenta
app/admin/orders/
├── page.tsx              ← Rota
├── AGENTS.md             ← Documentação
└── orders.feature        ← Cenários BDD (mesmo nível)

# ❌ INCORRETO - BDD longe do módulo
tests/e2e/orders.feature  ← Longe do domínio
app/admin/orders/page.tsx ← Rota longe dos cenários
```

#### Link BDD ↔ Testes de Integração (REGRA):
- **TODO cenário BDD DEVE ter tag `@integration-test`** apontando para o teste que o valida
- **Formato**: `@integration-test="tests/integration/orders.test.ts"`
- A documentação em `tests/integration/AGENTS.md` DEVE listar todos os cenários BDD e seus testes correspondentes

#### Exemplo de Cenário BDD com Link:
```gherkin
@integration-test="tests/integration/orders.test.ts"
Funcionalidade: Criação de Pedido

Cenário: Cliente cria pedido com dados válidos
Dado que o cliente está na página do cardápio
Quando preenche "Maria Silva" no campo nome
E clica em "Confirmar Pedido"
Então o pedido deve ser criado com status "pending"
```

#### Arquivos BDD por Módulo (proximidade):
| Módulo | Arquivo BDD |
|--------|-------------|
| `app/admin/login/` | `login.feature` |
| `app/admin/signup/` | `signup.feature` |
| `app/admin/dashboard/` | `dashboard.feature` |
| `app/admin/categories/` | `categories.feature` |
| `app/admin/products/` | `products.feature` |
| `app/admin/orders/` | `orders.feature` |
| `app/menu/[slug]/` | `menu.feature` |
| `app/api/orders/` | `orders.feature` |

### Template de AGENTS.md por Tipo

### Padrão de Documentação AGENTS.md

Todo AGENTS.md deve seguir este template:

```markdown
# [Nome do Módulo] - MenuLink

## Visão Geral
[Descrição breve do módulo e sua responsabilidade]

**Idioma**: Português Brasileiro (pt-BR)
**Stack**: [Stack tecnológica usada]

---

## Estrutura de Diretórios
[Árvore de arquivos do módulo]

---

## Sub-módulo: [Nome]
### Responsabilidade
[O que o sub-módulo faz]

### Arquitetura
[Código de exemplo da arquitetura]

### Interface Pública
[Funções, componentes, tipos exportados]

### Uso
[Exemplos de uso]

---

## Regras de Implementação
1. [Regra 1]
2. [Regra 2]

---

## Métricas de Qualidade
| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura | ≥80% | Alta |

---

## Dependências
| Dependência | Versão | Uso |
|-------------|--------|-----|
| [nome] | [versão] | [uso] |

---

## Referências
- [Link 1]
- [Link 2]

---

**Versão**: 1.0
**Última Atualização**: [YYYY-MM-DD]
**Autor**: AI Agent
```

### Atualização de Documentação

**Documentação deve ser ATUALIZADA quando**:
- Nova funcionalidade é adicionada
- API pública muda
- Regras de negócio mudam
- Dependências são adicionadas/removidas
- Após conclusão de cada change OpenSpec

**Frequência mínima**: A cada PR que modifica um módulo

### Checklist de Documentação

Ao criar/modificar código, verificar:
- [ ] AGENTS.md existe no nível mais próximo do elemento documentado?
- [ ] AGENTS.md do módulo/pai está atualizado com referência ao novo AGENTS.md?
- [ ] Nova API pública está documentada?
- [ ] Exemplos de uso estão corretos?
- [ ] Dependências estão listadas?
- [ ] Regras de implementação estão claras?
- [ ] Parâmetros, request/response, códigos de erro documentados (para rotas)?
- [ ] Props, estados, callbacks documentados (para componentes)?

## Fluxo OpenSpec para Mudanças

### Regra de Ouro

**TODO mudança significativa DEVE passar pelo fluxo OpenSpec**. Não se implementa sem spec aprovada.

### O que é "mudança significativa"?

- Nova funcionalidade de negócio
- Nova API route
- Novo componente com lógica complexa
- Mudança em regras de negócio
- Nova integração externa
- Alteração de schema de banco
- Mudança de arquitetura

### O que NÃO precisa de OpenSpec?

- Correções de bugs simples (sem mudança de comportamento)
- Refatorações internas (sem mudança de API)
- Updates de dependências
- Documentação (exceto specs)
- Testes (desde que não mudem comportamento)

### Fluxo Completo (REGRA OBRIGATÓRIA)

**TODO mudança significativa DEVE seguir este fluxo na ordem EXATA:**

```
PRD.md → Análise → proposal.md → spec.md → design.md → tasks.md → implementation → verification → archive
```

**verification = código + documentação** (verificação completa, não apenas código)

---

## Descrição Detalhada das Etapas do Fluxo SDD

### Etapa 1: PRD.md (Product Requirements Document)

**Objetivo**: Capturar a essência da ideia, o problema ou oportunidade identificada.

**Responsável**: Product Owner / Tech Lead / Equipe

**Entrada**: Necessidade de negócio identificada

**Atividades**:
1. Descrever o problema/oportunidade de forma concisa
2. Identificar o público-alvo impactado
3. Definir resultado esperado de alto nível (sem detalhamento técnico)
4. Estabelecer critérios de sucesso preliminares
5. Classificar urgência (Crítica/Alta/Média/Baixa)

**Saída**: Documento `PRD.md` com:
- Título da iniciativa
- Descrição do problema/oportunidade
- Público-alvo impactado
- Resultado esperado de alto nível
- Critérios de sucesso preliminares
- Classificação de urgência

**Exemplo**:
```markdown
# PRD: Adicionar Notificação Push

## Problema
Clientes não são notificados quando o status do pedido muda.

## Público-Alvo
Clientes do restaurante que fazem pedidos pelo cardápio digital.

## Resultado Esperado
Aumentar satisfação do cliente com transparência sobre status do pedido.

## Critérios de Sucesso
- [ ] Notificação enviada em até 5 segundos após mudança de status
- [ ] Taxa de entrega > 95%
```

---

### Etapa 2: Análise (PRD.md + Codebase)

**Objetivo**: Confrontar a ideia do PRD.md com a realidade atual da aplicação.

**Responsável**: Tech Lead / Arquiteto

**Entrada**: PRD.md aprovado, PRD.md existente, codebase

**Atividades**:
1. Ler PRD.md (Product Requirement Document) existente
2. Analisar codebase atual e arquitetura
3. Avaliar viabilidade técnica
4. Identificar módulos/serviços afetados
5. Identificar dependências e débitos técnicos bloqueantes
6. Documentar síntese da análise

**Saída**: Síntese de análise respondendo:
- A ideia é viável com a arquitetura atual?
- Quais módulos/serviços serão afetados?
- Existem dependências ou débitos técnicos bloqueantes?
- Impacto estimado (breaking changes, migração, novos dependencies)?

---

### Etapa 3: proposal.md (Proposta Formal)

**Objetivo**: Formalizar a intenção de desenvolvimento enriquecida com contexto.

**Responsável**: Tech Lead / Equipe

**Entrada**: PRD.md, Análise, PRD.md

**Atividades**:
1. Criar `proposal.md` seguindo template
2. Referenciar PRD.md e análise realizada
3. Definir scope (in/out)
4. Identificar riscos e mitigações
5. Definir critérios de sucesso

**Saída**: Documento `proposal.md` com:
- Intent (propósito)
- Scope (in/out)
- Approach (abordagem)
- Affected Areas (áreas afetadas)
- Risks (riscos)
- Rollback Plan (plano de rollback)
- Success Criteria (critérios de sucesso)

---

### Etapa 4: spec.md (Especificação Formal)

**Objetivo**: Transformar proposta em requisitos testáveis usando RFC 2119.

**Responsável**: Tech Lead / Product Owner

**Entrada**: proposal.md aprovado

**Atividades**:
1. Escrever requisitos usando palavras-chave RFC 2119 (MUST, SHOULD, MAY)
2. Criar cenários Given/When/Then para cada requisito
3. Definir critérios de aceitação (CA-XXX)
4. Garantir que todo requisito seja testável

**Saída**: Documento `spec.md` com:
- Requisitos numerados (REQ-XXX)
- Cenários Gherkin para cada requisito
- Critérios de aceitação (CA-XXX)

**Exemplo**:
```markdown
### REQ-XXX: Notificação ao Confirmar Pedido

O sistema DEVE enviar notificação push ao cliente quando o status do pedido mudar.

#### Cenário: Notificação enviada ao confirmar
- **GIVEN** um pedido com status "pending"
- **WHEN** o admin clica em "Confirmar"
- **THEN** o sistema DEVE enviar notificação push para o cliente
```

---

### Etapa 5: design.md (Design Técnico com Qualidade)

**Objetivo**: Detalhar a solução técnica com estratégia de qualidade integrada.

**Responsável**: Tech Lead / Arquiteto

**Entrada**: spec.md aprovada

**Atividades**:
1. Documentar decisões de arquitetura (com rationale)
2. Definir estratégia de testes (TDD/BDD/ATDD/DDD)
3. Criar diagramas de fluxo e estrutura
4. Mapear file changes (criar/modificar/deletar)
5. Definir interfaces e contratos
6. Documentar estratégia de migração/rollback

**Saída**: Documento `design.md` com seções obrigatórias:

#### 5.1 TDD (Test-Driven Development)
- Cobertura mínima obrigatória (80% linhas, 100% branches críticos)
- Ferramentas (Vitest)
- Estratégia de Mock/Stub

#### 5.2 BDD (Behavior-Driven Development)
- Cenários Gherkin (arquivos .feature)
- Ferramenta (Playwright)
- Cobertura E2E (100% fluxos críticos)
- **Localização**: Arquivos `.feature` no nível do módulo (REGRA DE PROXIMIDADE)

#### 5.3 ATDD (Acceptance Test-Driven Development)
- Critérios de aceitação por tarefa
- Checklist QA (testes exploratórios, segurança, performance)

#### 5.4 DDD (Domain-Driven Design)
- Bounded Context
- Agregados, Entidades, Value Objects
- Linguagem Ubíqua

---

### Etapa 6: tasks.md (Decomposição DDD)

**Objetivo**: Gerar checklist de tarefas a partir do design orientado a DDD.

**Responsável**: Tech Lead / Equipe

**Entrada**: design.md aprovado

**Atividades**:
1. Decompor em tarefas por camada DDD
2. Estruturar em fases (Infraestrutura, Domínio, Aplicação, Infraestrutura, Interface, Documentação)
3. Definir critérios de conclusão (código + testes + documentação)

**Saída**: Documento `tasks.md` com estrutura:

```markdown
### Fase 1: Infraestrutura de Testes
- [ ] 1.1: Configurar suíte de testes com cobertura mínima de 80%

### Fase 2: Domínio (DDD)
- [ ] 2.1: Implementar Agregado `Entidade` com regras de negócio

### Fase 3: Aplicação (Casos de Uso)
- [ ] 3.1: Implementar Caso de Uso `NomeDoCasoDeUso`

### Fase 4: Infraestrutura
- [ ] 4.1: Implementar Repositório `EntidadeRepository`

### Fase 5: Interface
- [ ] 5.1: Expor endpoint REST `/recurso`

### Fase 6: Documentação
- [ ] 6.1: Criar `pasta/AGENTS.md`
- [ ] 6.2: Criar `pasta/nome.feature`
```

**Critério de Conclusão (REGRA)**:
Uma tarefa só é `[x]` quando:
1. ✅ Código de produção escrito
2. ✅ Testes unitários/integração obrigatórios passam
3. ✅ Testes E2E referentes passam localmente
4. ✅ AGENTS.md do módulo atualizado com proximidade
5. ✅ Cenários BDD criados com tag `@integration-test`

---

### Etapa 7: implementation (Implementação)

**Objetivo**: Implementar código seguindo tasks.md e specs.

**Responsável**: Equipe de Desenvolvimento

**Entrada**: tasks.md, spec.md, design.md

**Atividades**:
1. Implementar código seguindo ordem das tarefas
2. Escrever testes antes do código (TDD)
3. Executar testes frequentemente
4. Manter cobertura ≥80%
5. Atualizar documentação em paralelo

**Saída**:
- Código implementado
- Testes passando
- Documentação atualizada

---

### Etapa 8: verification (Verificação Completa - REGRA CRÍTICA)

**Objetivo**: Verificar código E documentação antes de archivar.

**Responsável**: Tech Lead / QA

**Entrada**: implementation completa

**Atividades**:

#### 8.1 Verificação de Código
- Build passa sem erros
- Lint passa sem warnings
- Testes passam (unitários, integração, E2E)
- Cobertura ≥80%

#### 8.2 Verificação de Documentação
- AGENTS.md existe no nível mais próximo do elemento
- AGENTS.md do módulo/pai está atualizado
- Cenários BDD têm tag `@integration-test`
- Arquivos `.feature` estão no nível correto (proximidade)

#### 8.3 Correção de Documentação (se necessário)
- Se AGENTS.md faltando: criar
- Se BDD fora do nível: mover
- Se tag faltando: adicionar

#### 8.4 Compliance Report
- Mapear cada requisito (REQ-XXX) à evidência
- Mapear cada critério de aceitação (CA-XXX) à evidência
- Documentar issues encontrados

**Saída**: Documento `verify-report.md` com:
- Completeness (artefatos criados)
- Build and Test Evidence
- Compliance Matrix (REQ-XXX → evidência)
- Design Coherence
- Issues Found
- Verdict (PASS/PASS WITH WARNINGS/FAIL)

**REGRA**: verification = código + documentação. Não é apenas verificar código.

---

### Etapa 9: archive (Arquivamento)

**Objetivo**: Consolidar mudanças e arquivar artefatos.

**Responsável**: Tech Lead

**Entrada**: verify-report.md com PASS

**Atividades**:
1. Mover artefatos para `.openspec/changes/archive/{data}/{change-name}/`
2. Consolidar mudanças nas specs principais (se aplicável)
3. Atualizar changelog
4. Criar archive-report.md com resumo

**Saída**:
- Diretório arquivado
- Archive report
- Specs principais atualizadas (se necessário)

---

## Fluxo Visual Completo

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FLUXO SDD MENULINK (OBRIGATÓRIO)                     │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌─────────┐    ┌─────────┐    ┌──────────┐    ┌────────┐    ┌──────────┐
  │ PRD.md  │───▶│ Análise │───▶│ proposal │───▶│ spec   │───▶│ design   │
  └─────────┘    └─────────┘    └──────────┘    └────────┘    └──────────┘
       │              │              │               │              │
       │         PRD.md +        RFC 2119      TDD/BDD/       TDD/BDD/
       │         Codebase        requisitos     ATDD/DDD      ATDD/DDD
       │              │              │               │              │
       ▼              ▼              ▼               ▼              ▼
  ┌─────────┐    ┌─────────┐    ┌──────────┐    ┌────────┐    ┌──────────┐
  │Concepção│    │Viabilid.│    │Formaliz. │    │Testável│    │Técnico   │
  │Inicial  │    │Técnica  │    │          │    │        │    │+ Qualidade│
  └─────────┘    └─────────┘    └──────────┘    └────────┘    └──────────┘

  ┌──────────┐    ┌──────────────────┐    ┌──────────────┐    ┌──────────┐
  │ tasks    │───▶│ implementation   │───▶│ verification │───▶│ archive  │
  └──────────┘    └──────────────────┘    └──────────────┘    └──────────┘
       │                  │                    │                  │
       │            Código +              Código +              Consolidado
       │            Testes +              Documentação           e Arquivado
       │            Documentação          = Compliance
       │                  │                    │
       ▼                  ▼                    ▼
  ┌──────────┐    ┌──────────────────┐    ┌──────────────┐
  │ DDD      │    │ Tarefas check    │    │ verify-      │
  │ Fases    │    │ quando código    │    │ report.md    │
  │          │    │ + testes + docs  │    │              │
  └──────────┘    │ passam           │    │ PASS ✅      │
                  └──────────────────┘    └──────────────┘

  verification = código + documentação (não é só código)
```

---

## Gates de Aprovação por Etapa

| Etapa | Gate | Responsável |
|-------|------|-------------|
| PRD.md | Análise inicial | Orchestrator |
| Análise | Viabilidade confirmada | Tech Lead |
| proposal | Scope definido, riscos identificados | Tech Lead |
| spec | Revisão técnica (RFC 2119) | Oracle |
| design | Revisão de arquitetura (TDD/BDD/ATDD/DDD) | Oracle |
| tasks | Verificação de completude | Orchestrator |
| implementation | Testes passam + lint + build | CI/CD |
| verification | Compliance report (código + docs) | Deep agent |
| archive | Consolidado e arquivado | Tech Lead |

---

## Proibições (REGRA)

- **NÃO** pular etapas do fluxo
- **NÃO** implementar sem PRD.md e análise
- **NÃO** implementar sem spec aprovada
- **NÃO** pular verification (código + documentação)
- **NÃO** archivar sem verification com PASS
- **NÃO** modificar specs sem passar pelo fluxo de mudança
PRD.md → Análise → proposal.md → spec.md → design.md → tasks.md → implementation → verification → archive
   │        │           │           │         │          │            │              │           │
   │        │           │           │         │          │            │              │           │
   │        ▼           ▼           ▼         ▼          ▼            ▼              ▼           ▼
   │   Viabilid.   Formaliz.   RFC 2119   TDD/BDD    DDD         Código         Código +     Consolidado
   │   Técnica      da ideia    Requisitos ATDD/DDD   Fases      + Testes       Documentação  e Arquivado
   │   + Codebase                            Qualidade              + Docs
   │
   ▼
Concepção
Inicial
```

#### Etapas Detalhadas:

1. **PRD.md** - Product Requirements Document: Concepção inicial da ideia (o quê e por quê)
2. **Análise** - Viabilidade técnica confrontada com PRD.md e codebase
3. **proposal.md** - Proposta formal com scope, riscos, rollback
4. **spec.md** - Requisitos RFC 2119 com cenários Given/When/Then
5. **design.md** - Design técnico com TDD/BDD/ATDD/DDD integrados
6. **tasks.md** - Decomposição DDD (Infraestrutura, Domínio, Aplicação, Interface, Documentação)
7. **implementation** - Código + Testes + Documentação (AGENTS.md, BDD)
8. **verification** - Verificação COMPLETA (código + documentação):
   - Build, lint, testes, cobertura (código)
   - Proximidade AGENTS.md, BDD com tags @integration-test (documentação)
   - Correção de documentação se necessário
   - Compliance report
9. **archive** - Arquivamento e consolidação nas specs principais
proposal.md → spec.md → design.md → tasks.md → implementation → verification → archive
     ↓           ↓          ↓          ↓              ↓               ↓
  Proposta    Spec RFC   Design     Tarefas      Código          Testes       Arquivar
  2119       2119      técnico    checkadas    implementado    passam
```

### Como iniciar uma mudança

```bash
# 1. Criar diretório da change
mkdir -p .openspec/changes/minha-mudanca

# 2. Criar proposal.md seguindo template
# 3. Obter aprovação
# 4. Criar spec.md
# 5. Criar design.md
# 6. Criar tasks.md
# 7. Implementar seguindo tasks
# 8. Verificar (sdd-verify)
# 9. Arquivar (sdd-archive)
```

### Templates OpenSpec

**proposal.md**:
```markdown
# Proposta: [Nome da Mudança]

## Problema
[Descrição do problema que esta mudança resolve]

## Solução Proposta
[Descrição da solução]

## Impacto
- [ ] Breaking changes?
- [ ] Migração necessária?
- [ ] Novos dependencies?

## Alternativas Consideradas
[Outras soluções consideradas e por que foram descartadas]

## Urgência
- [ ] Crítica
- [ ] Alta
- [ ] Média
- [ ] Baixa

## Status
Proposta
```

**spec.md**:
```markdown
# Spec: [Nome da Mudança]

## Fonte da Verdade
Este documento é parte das especificações do MenuLink.

## Requisitos
### REQ-XXX: [Título]
[Descrição em RFC 2119]

## Critérios de Aceitação
### CA-XXX: [Título]
[Condição verificável]

## Status
Especificação
```

**design.md**:
```markdown
# Design: [Nome da Mudança]

## Decisões de Arquitetura
[Arquitetura técnica]

## Arquitetura
[Diagramas se necessário]

## Arquivos a Modificar
- `caminho/arquivo1.ts`
- `caminho/arquivo2.ts`

## Dependências
[Lista de dependências]

## Riscos e Mitigações
| Risco | Mitigação |
|-------|-----------|
| [risco] | [mitigação] |
```

**tasks.md**:
```markdown
# Tasks: [Nome da Mudança]

## Pré-condições
- [ ] Spec aprovada
- [ ] Design aprovado

## Tarefas

### Fase 1: [Nome]
- [ ] Task 1.1
- [ ] Task 1.2

### Fase 2: [Nome]
- [ ] Task 2.1

## Progresso
░░░░░░░░░░ 0%

## Status
Em Andamento
```

### Gates de Aprovação

| Fase | Gate | Responsável |
|------|------|-------------|
| proposal | Análise inicial | Orchestrator |
| spec | Revisão técnica | Oracle |
| design | Revisão de arquitetura | Oracle |
| tasks | Verificação de completude | Orchestrator |
| implementation | Testes passam + lint + build | CI/CD |
| verification | Compliance report | Deep agent |

### Proibições

- **NÃO** pular fases do fluxo
- **NÃO** implementar sem spec aprovada
- **NÃO** modificar specs sem passar pelo fluxo de mudança
- **NÃO** commitar código que viola spec existente

## Documentação de Referência

### Especificações SDD
1. `.openspec/specs/menulink-specification.md` - Regras de negócio
2. `.openspec/specs/menulink-technical-plan.md` - Arquitetura
3. `.openspec/specs/menulink-quality-rules.md` - Regras de qualidade
4. `.openspec/specs/menulink-modules-documentation.md` - Documentação de módulos
5. `.openspec/specs/menulink-unit-tests-checklist.md` - Checklist de testes

### AGENTS.md por Módulo
Cada módulo possui seu próprio AGENTS.md com documentação detalhada:

1. **App Router** (`app/AGENTS.md`) - Rotas, API, layouts, autenticação
2. **Components** (`components/AGENTS.md`) - Componentes UI e admin
3. **Library** (`lib/AGENTS.md`) - Utils, Supabase, WhatsApp
4. **Context** (`context/AGENTS.md`) - CartContext com localStorage
5. **Hooks** (`hooks/AGENTS.md`) - Custom hooks (futuros)
6. **Types** (`types/AGENTS.md`) - Definições TypeScript
7. **Tests** (`tests/AGENTS.md`) - Infraestrutura de testes
8. **Database** (`supabase/AGENTS.md`) - Schema PostgreSQL, RLS
9. **OpenSpec** (`.openspec/AGENTS.md`) - SDD workflow, specs

### Arquitetura de Documentação

```
AGENTS.md (este arquivo)
├── app/AGENTS.md (rotas, API, admin)
├── components/AGENTS.md (UI components)
├── lib/AGENTS.md (utils, services)
├── context/AGENTS.md (state management)
├── hooks/AGENTS.md (custom hooks)
├── types/AGENTS.md (TypeScript types)
├── tests/AGENTS.md (test infrastructure)
├── supabase/AGENTS.md (database schema)
└── .openspec/AGENTS.md (SDD specs)
```

### Hierarquia de Documentação

1. **Este arquivo (AGENTS.md)**: Visão geral e regras do projeto
2. **Módulo AGENTS.md**: Documentação completa do módulo
3. **Specs (.openspec/specs/)**: Especificações técnicas detalhadas
4. **Código fonte**: Implementação com comentários em pt-BR