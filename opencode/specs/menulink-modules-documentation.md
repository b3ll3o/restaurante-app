# MenuLink - Documentação de Módulos e Sub-módulos

## Fonte da Verdade

Este documento descreve todos os módulos e sub-módulos do sistema MenuLink, suas responsabilidades e dependências.

---

## 1. Arquitetura Geral

```
MenuLink/
├── app/                    # Next.js App Router
├── components/            # Componentes React
├── lib/                   # Utilitários e serviços
├── hooks/                 # Custom hooks
├── context/              # Contextos React
├── types/                # Tipos TypeScript
├── tests/                # Testes automatizados
└── opencode/             # Especificações SDD
```

---

## 2. Módulo: App Router (`app/`)

### 2.1 Sub-módulo: Admin (`app/admin/`)
- **Responsabilidade**: Painel administrativo para donos de restaurantes
- **Rotas**:
  - `/admin/login` - Autenticação
  - `/admin/signup` - Cadastro
  - `/admin/dashboard` - Dashboard principal
  - `/admin/categories` - Gestão de categorias
  - `/admin/products` - Gestão de produtos
  - `/admin/orders` - Gestão de pedidos
  - `/admin/settings` - Configurações
- **Dependências**: Supabase Auth, componentes UI

### 2.2 Sub-módulo: Público (`app/menu/[slug]/`)
- **Responsabilidade**: Cardápio público dos restaurantes
- **Rotas**: `/menu/[slug]` - Cardápio dinâmico por slug
- **Dependências**: Supabase, Cart Context

### 2.3 Sub-módulo: API (`app/api/`)
- **Responsabilidade**: Endpoints da API
- **Rotas**:
  - `/api/orders` - Criação de pedidos (POST)
- **Dependências**: Supabase, WhatsApp service

### 2.4 Sub-módulo: Layout (`app/layout.tsx`)
- **Responsabilidade**: Layout raiz da aplicação
- **Dependências**: Tailwind CSS, fonts

---

## 3. Módulo: Componentes (`components/`)

### 3.1 Sub-módulo: UI (`components/ui/`)
- **Responsabilidade**: Componentes de interface reutilizáveis (shadcn/ui)
- **Componentes**:
  - `Button` - Botões
  - `Input` - Campos de entrada
  - `Card` - Cards
  - `Dialog` - Modais
  - `Table` - Tabelas
  - `Badge` - Badges
  - `Avatar` - Avatares
  - `Select`, `DropdownMenu`, `Tabs`, etc.
- **Dependências**: Radix UI, Tailwind CSS

### 3.2 Sub-módulo: Admin (`components/admin/`)
- **Responsabilidade**: Componentes específicos do painel admin
- **Componentes**:
  - `Header` - Cabeçalho do admin
  - `Sidebar` - Menu lateral
- **Dependências**: Supabase Auth, componentes UI

---

## 4. Módulo: Biblioteca (`lib/`)

### 4.1 Sub-módulo: Utilitários (`lib/utils.ts`)
- **Responsabilidade**: Funções utilitárias gerais
- **Funções**:
  - `cn()` - Merge de classes Tailwind
  - `formatPrice()` - Formatação de preços em BRL
  - `generateSlug()` - Geração de slugs
  - `isValidWhatsApp()` - Validação de WhatsApp
  - `isValidPrice()` - Validação de preço
  - `isValidName()` - Validação de nome
- **Dependências**: clsx, tailwind-merge

### 4.2 Sub-módulo: Supabase (`lib/supabase/`)
- **Responsabilidade**: Clientes do Supabase
- **Arquivos**:
  - `client.ts` - Cliente para browser
  - `server.ts` - Cliente para server-side
- **Dependências**: @supabase/ssr, @supabase/supabase-js

### 4.3 Sub-módulo: WhatsApp (`lib/whatsapp.ts`)
- **Responsabilidade**: Integração com WhatsApp API
- **Funções**:
  - `sendWhatsAppMessage()` - Envio de mensagens
  - `formatOrderMessage()` - Formatação de mensagens de pedido
  - `generateWhatsAppUrl()` - Geração de URLs do WhatsApp
- **Dependências**: fetch API, env vars

---

## 5. Módulo: Hooks (`hooks/`)

### 5.1 Sub-módulo: Custom Hooks
- **Responsabilidade**: Lógica reutilizável encapsulada em hooks
- **Hooks**:
  - `useAuth()` - Autenticação (futuro)
  - `useRestaurant()` - Dados do restaurante (futuro)
- **Dependências**: Supabase, React

---

## 6. Módulo: Contexto (`context/`)

### 6.1 Sub-módulo: Carrinho (`context/cart-context.tsx`)
- **Responsabilidade**: Gerenciamento de estado do carrinho
- **Funcionalidades**:
  - Adicionar/remover itens
  - Atualizar quantidades
  - Persistência no localStorage
  - Cálculo de total
- **Dependências**: React Context, localStorage

---

## 7. Módulo: Tipos (`types/`)

### 7.1 Sub-módulo: Tipos TypeScript
- **Responsabilidade**: Definições de tipos para o domínio
- **Tipos**:
  - `Restaurant` - Restaurante
  - `Category` - Categoria
  - `Product` - Produto
  - `Order` - Pedido
  - `OrderItem` - Item do pedido
  - `CartItem` - Item do carrinho
- **Dependências**: TypeScript

---

## 8. Módulo: Testes (`tests/`)

### 8.1 Sub-módulo: Unitários (`tests/unit/`)
- **Responsabilidade**: Testes unitários de lógica
- **Cobertura**: ≥80% obrigatório
- **Arquivos**:
  - `utils.test.ts` - Testes de funções utilitárias
  - `cart-context.test.tsx` - Testes do contexto do carrinho (futuro)
  - `whatsapp.test.ts` - Testes do serviço WhatsApp (futuro)

### 8.2 Sub-módulo: Integração (`tests/integration/`)
- **Responsabilidade**: Testes de integração entre módulos
- **Arquivos**:
  - `api.test.ts` - Testes de API routes (futuro)
  - `database.test.ts` - Testes de banco de dados (futuro)

### 8.3 Sub-módulo: E2E (`tests/e2e/`)
- **Responsabilidade**: Testes end-to-end de fluxos críticos
- **Cobertura**: 100% dos fluxos críticos
- **Arquivos**:
  - `admin.spec.ts` - Fluxos do admin (futuro)
  - `public-menu.spec.ts` - Fluxos do cardápio público (futuro)
  - `checkout.spec.ts` - Fluxo de checkout (futuro)

### 8.4 Sub-módulo: Setup (`tests/setup.ts`)
- **Responsabilidade**: Configuração global dos testes
- **Funcionalidades**: Mocks, configurações do Jest

---

## 9. Módulo: Especificações (`opencode/`)

### 9.1 Sub-módulo: Specs (`opencode/specs/`)
- **Responsabilidade**: Especificações do sistema (SDD)
- **Documentos**:
  - `menulink-specification.md` - Regras de negócio (RFC 2119)
  - `menulink-technical-plan.md` - Plano técnico
  - `menulink-unit-tests-checklist.md` - Checklist de testes
  - `menulink-acceptance-tests.feature` - Cenários BDD
  - `menulink-quality-rules.md` - Regras de qualidade
  - `menulink-modules-documentation.md` - Este documento

### 9.2 Sub-módulo: Changes (`opencode/changes/`)
- **Responsabilidade**: Controle de mudanças em andamento
- **Estrutura**: Proposals, designs, tasks para cada change

---

## 10. Módulo: Banco de Dados (`supabase/`)

### 10.1 Sub-módulo: Schema (`supabase/schema.sql`)
- **Responsabilidade**: Definição do schema do banco
- **Tabelas**:
  - `restaurants` - Restaurantes
  - `categories` - Categorias
  - `products` - Produtos
  - `orders` - Pedidos
  - `order_items` - Itens dos pedidos
- **Dependências**: Supabase PostgreSQL

---

## 11. Dependências entre Módulos

```
App Router → Components → Context → Hooks → Lib → Types
     ↓           ↓           ↓        ↓       ↓      ↓
   Supabase   UI Library  Cart State  Auth  Utils  Domain
     ↓           ↓           ↓        ↓       ↓      ↓
   Database   Radix UI   localStorage        BRL   Business
                                      Formatting    Logic
```

---

## 12. Regras de Desenvolvimento por Módulo

### 12.1 App Router
- Seguir convenções do Next.js 16 App Router
- Server Components por padrão, Client Components quando necessário
- Proteção de rotas admin com middleware de autenticação

### 12.2 Components
- Componentes UI devem ser reutilizáveis e acessíveis
- Seguir padrões do shadcn/ui
- Testes de interação com Testing Library

### 12.3 Lib
- Funções puras quando possível
- Testes unitários para todas as funções
- Tratamento de erros adequado

### 12.4 Context
- Estado global mínimo necessário
- Otimização de re-renders com React.memo/useMemo
- Persistência apropriada (localStorage, sessionStorage)

### 12.5 Tests
- TDD para novas funcionalidades
- Cobertura ≥80% para unitários
- Testes E2E para fluxos críticos

### 12.6 Specs
- Atualizar specs antes de implementar
- Usar linguagem ubíqua do domínio
- Seguir RFC 2119 para requisitos

---

## 13. Métricas de Qualidade por Módulo

| Módulo | Cobertura Mínima | Complexidade Máxima | Dependências Máximas |
|--------|------------------|---------------------|----------------------|
| App Router | 70% | 15 | 10 |
| Components | 80% | 10 | 5 |
| Lib | 90% | 5 | 3 |
| Context | 85% | 8 | 4 |
| Tests | 100% | - | - |
| Specs | - | - | - |

---

## 14. Manutenção e Evolução

### 14.1 Novos Módulos
1. Criar documentação no `opencode/specs/`
2. Definir interface pública
3. Implementar com TDD
4. Adicionar ao AGENTS.md

### 14.2 Modificações em Módulos Existentes
1. Atualizar specs primeiro
2. Atualizar testes
3. Implementar mudanças
4. Verificar dependências

### 14.3 Remoção de Módulos
1. Verificar dependências
2. Remover gradualmente
3. Atualizar documentação
4. Remover do AGENTS.md

---

## 15. Referências

1. `AGENTS.md` - Regras do projeto
2. `menulink-quality-rules.md` - Regras de qualidade
3. `menulink-technical-plan.md` - Arquitetura técnica
4. `package.json` - Dependências do projeto

---

## 16. Versionamento

| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 1.1 | 2026-04-17 | AI Agent | Atualização pós reorganização de módulos (module-organization) |
| 1.0 | 2026-04-15 | AI Agent | Documentação inicial de módulos |

---

## 17. Reorganização de Módulos (module-organization)

### Resultado da Análise
A change "module-organization" analisou a estrutura de documentação do projeto e identificou que **97% da estrutura já estava conforme** o princípio da proximidade definido em AGENTS.md.

### Correções Aplicadas
- Adicionado AGENTS.md em `app/menu/[slug]/checkout/` (único módulo missing)

### Estrutura de Documentação
Todos os módulos devem seguir o **princípio da proximidade**:
- `AGENTS.md` deve estar no nível mais próximo do código documentado
- Arquivos `.feature` (BDD) devem estar no nível do módulo que documentam
- Cada cenário BDD deve ter tag `@integration-test` apontando para o teste de integração

### Módulos com AGENTS.md
| Módulo | AGENTS.md | .feature |
|--------|-----------|----------|
| `app/admin/*` | ✅ | ✅ |
| `app/menu/[slug]/*` | ✅ | ✅ |
| `app/api/*` | ✅ | ✅ |
| `components/ui/*` | ✅ | N/A |
| `components/admin/*` | ✅ | N/A |
| `lib/supabase/*` | ✅ | N/A |
| `lib/whatsapp.ts` | ✅ | N/A |
| `context/*` | ✅ | N/A |
| `hooks/*` | ✅ | N/A |
| `types/*` | ✅ | N/A |

---

**NOTA**: Esta documentação deve ser mantida atualizada conforme o projeto evolui. Qualquer nova funcionalidade ou módulo deve ser documentado aqui.