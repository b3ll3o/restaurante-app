# MenuLink - Regras do Projeto

## Visão Geral

MenuLink é um SaaS multi-tenant para restaurantes que permite gerenciamento de cardápio digital e pedidos via WhatsApp.

**Idioma**: Português Brasileiro (pt-BR) para documentação e UI. Nomes técnicos em inglês.
**Paradigma**: SDD (Specification-Driven Development)
**Versão**: 5.0
**Última Atualização**: 2026-04-19

---

## Índice

1. [Stack Tecnológica](#stack-tecnológica)
2. [Arquitetura](#arquitetura)
3. [Estrutura de Diretórios](#estrutura-de-diretórios)
4. [Arquitetura de Agentes IA](#arquitetura-de-agentes-ia)
5. [Skills Disponíveis](#skills-disponíveis)
6. [Regras de Desenvolvimento](#regras-de-desenvolvimento)
7. [Fluxo SDD Completo](#fluxo-sdd-completo)
8. [Gates de Qualidade](#gates-de-qualidade)
9. [Fluxos Procedimentais](#fluxos-procedimentais)
10. [Lições Aprendidas de RCAs](#10-li%C3%A7%C3%B5es-aprendidas-de-rcas)
11. [Regras de Documentação](#11-regras-de-documentação)
12. [Glossário](#glossário)
13. [Documentação de Referência](#documentação-de-referência)

---

## Stack Tecnológica

| Tecnologia | Versão |
|------------|--------|
| Next.js | 16.2.3 |
| React | 19 |
| TypeScript | strict |
| Tailwind CSS | 4 |
| Supabase | - |

---

## Arquitetura

- **Multi-tenant**: cada restaurante é um tenant isolado por `restaurant_id`
- **Mobile-first**: interface otimizada para dispositivos móveis
- **Offline-first**: carrinho persiste em localStorage

---

## Estrutura de Diretórios

```
app/              # Rotas (admin/, menu/[slug]/, api/)
components/       # Componentes UI e admin
lib/              # Utils, Supabase, WhatsApp
context/          # CartContext
hooks/            # Custom hooks
types/            # Definições TypeScript
tests/            # unit/, integration/, e2e/
supabase/         # Schema SQL
opencode/         # Documentação IA centralizada
  ├── specs/      # Especificações SDD
  ├── docs/       # Documentação adicional
  ├── skills/     # Skills SDD
  ├── templates/  # Templates SDD
  ├── changes/    # Mudanças em andamento
  └── root-causes/ # Análise de erros RCA
```

---

## Arquitetura de Agentes IA

### Papéis dos Agentes

O projeto MenuLink utiliza uma arquitetura multi-agente para execução do fluxo SDD:

| Agente | Tipo | Responsabilidade | Gate |
|--------|------|------------------|------|
| **Orchestrator** | task | Coordena o fluxo SDD, cria branches, gerencia changes | Análise inicial |
| **Oracle** | task | Revisa specs (RFC 2119) e design (arquitetura) | spec, design |
| **Deep** | task | Executa tasks complexas, lógica de negócio, refactors | implementation |
| **Designer** | task | Implementa UI/UX, componentes, páginas, visual QA | frontend |
| **Explorer** | background_task | Discovery, busca de arquivos, análise de codebase | read-only |
| **Librarian** | background_task | Documentação, APIs, examples, pesquisa externa | read-only |
| **Quick** | task | Mudanças mecânicas, bulk updates, renames, config | mechanical |

### Fluxo de Interação

```
Orchestrator (coordena)
    │
    ├──► Oracle (revisa spec/design)
    │         │
    │         ▼
    │    proposal → spec → design
    │
    ├──► Deep (implementa código complexo)
    │         │
    │         ├──► Designer (UI/UX se necessário)
    │         │
    │         └──► Quick (bulk changes se necessário)
    │
    ├──► Explorer (background discovery)
    │
    ├──► Librarian (background research)
    │
    ▼
verification → archive → post-archive-review
```

### Regras de Interação entre Agentes

1. **Orchestrator** nunca faz trabalho direto - só delega
2. **Oracle** é ALWAYS consultado antes de decisões arquiteturais
3. **Deep** executa tasks quando lógica de negócio é complexa
4. **Designer** é ALWAYS usado para trabalho UI/UX (componentes, páginas)
5. **Explorer** roda em background para descoberta paralela
6. **Librarian** roda em background para pesquisa de APIs
7. **Quick** para mudanças mecânicas uniformes (bulk updates)

### Responsabilidades Detalhadas por Agente

#### Orchestrator
- Coordena o fluxo SDD completo
- Cria branches para mudanças
- Gerencia changes (proposal → archive)
- Decide quando paralelizar tarefas
- Verifica gates de qualidade

#### Oracle
- Revisa specs em RFC 2119
- Valida design arquitetural
- Detecta blockers em planos
- Verifica consistência de regras

#### Deep
- Implementação de lógica de negócio
- Refactors complexos
- Integração de APIs
- State management
- Lógica de domínio

#### Designer
- Componentes UI (`components/ui/`)
- Páginas (`app/`)
- Layouts responsivos
- Estilização (Tailwind, CSS)
- **Visual QA**: screenshots, verificação de UI
- Interações do usuário

#### Explorer
- Busca de arquivos por padrão
- Análise de estrutura de diretórios
- Descoberta de símbolos (types, functions)
- Análise de dependências
- **NUNCA modifica código**

#### Librarian
- Pesquisa de documentação externa
- Exemplos de APIs
- Versões de libraries
- Pesquisa de best practices
- **NUNCA modifica código**

#### Quick
- Bulk renames
- Config changes uniformes
- Copy edits
- Pattern application uniforme
- **NUNCA faz decisões arquiteturais**

### Quando Usar Cada Agente

| Tipo de Trabalho | Agente |
|------------------|--------|
| Decisões arquiteturais | Oracle |
| Lógica de negócio complexa | Deep |
| UI/UX, componentes, páginas | Designer |
| Descoberta de código | Explorer |
| Pesquisa de APIs/docs | Librarian |
| Mudanças mecânicas uniformes | Quick |
| Coordenação de fluxo SDD | Orchestrator |

### Gates de Qualidade por Agente

| Agente | Gate |
|--------|------|
| Orchestrator | Análise inicial OK |
| Oracle | Spec/design aprovado |
| Deep | Build + Tests + Lint |
| Designer | Build + Visual QA |
| Explorer | (read-only, sem gate) |
| Librarian | (read-only, sem gate) |
| Quick | Build + Lint |

---

## Skills Disponíveis

| Skill | Agente | Descrição | Tipo |
|-------|--------|-----------|------|
| `sdd-init` | Orchestrator | Bootstrap OpenSpec structure e SDD context | task |
| `sdd-propose` | Orchestrator | Criar proposal.md | task |
| `sdd-spec` | Oracle | Escrever specs RFC 2119 | task |
| `sdd-design` | Oracle | Criar design.md com arquitetura | task |
| `sdd-tasks` | Orchestrator | Gerar tasks.md de specs e design | task |
| `sdd-apply` | Deep | Executar tasks SDD | task |
| `sdd-verify` | Deep | Verificar implementação contra specs | task |
| `sdd-archive` | Orchestrator | Arquivar change concluída | task |
| `post-archive-review` | Orchestrator | Revisão pós-archive: build, testes, docs | task |
| `plan-reviewer` | Oracle | Revisar planos para blockers | task |
| `requirements-interview` | Orchestrator | Descoberta de requisitos | task |
| `executing-plans` | Deep | Executar listas de tarefas | task |
| `cartography` | Explorer | Mapear estrutura do repositório | background_task |
| `simplify` | Designer/Quick | Simplificar e refinar código | task |
| `agent-browser` | Designer | Automação de browser, visual QA | task |

---

## Regras de Desenvolvimento

**ATENÇÃO**: Esta é a **FONTE CENTRALIZADA** de TODAS as regras do projeto. Todas as implementações, decisões técnicas e processos derivam deste documento.

### 1. Regras de Negócio

#### 1.1 Gestão de Restaurante

| ID | Regra | Prioridade |
|----|-------|------------|
| REQ-001 | O sistema **DEVE** permitir que um usuário crie uma conta e registre seu restaurante | MUST |
| REQ-002 | O sistema **DEVE** gerar automaticamente um slug único baseado no nome do restaurante | MUST |
| REQ-003 | O restaurante **DEVE** possuir um número de WhatsApp válido para receber pedidos | MUST |
| REQ-004 | O dono **PODE** atualizar o nome e WhatsApp do seu restaurante | MAY |

#### 1.2 Gestão de Categorias

| ID | Regra | Prioridade |
|----|-------|------------|
| REQ-010 | O sistema **DEVE** permitir que o owner crie categorias para seu restaurante | MUST |
| REQ-011 | Cada categoria **DEVE** pertencer a um único restaurante | MUST |
| REQ-012 | As categorias **DEVEM** ser ordenadas por `display_order` | MUST |
| REQ-013 | O owner **PODE** editar, reordenar e deletar categorias | MAY |

#### 1.3 Gestão de Produtos

| ID | Regra | Prioridade |
|----|-------|------------|
| REQ-020 | O sistema **DEVE** permitir que o owner adicione produtos às categorias | MUST |
| REQ-021 | Cada produto **DEVE** pertencer a uma única categoria | MUST |
| REQ-022 | O produto **DEVE** possuir: nome (obrigatório), preço (obrigatório), descrição (opcional), imagem (opcional) | MUST |
| REQ-023 | O produto **PODE** estar disponível ou indisponível (`is_available`) | MAY |
| REQ-024 | Produtos indisponíveis **NÃO DEVEM** aparecer no cardápio público | MUST NOT |
| REQ-025 | Os produtos **DEVEM** ser ordenados por `display_order` | MUST |

#### 1.4 Cardápio Público

| ID | Regra | Prioridade |
|----|-------|------------|
| REQ-030 | O sistema **DEVE** exibir o cardápio público via `/menu/[slug]` | MUST |
| REQ-031 | O cardápio **DEVE** mostrar apenas produtos com `is_available = true` | MUST |
| REQ-032 | O cardápio **DEVE** agrupar produtos por categoria | MUST |

#### 1.5 Finalização de Pedido (Checkout)

| ID | Regra | Prioridade |
|----|-------|------------|
| REQ-040 | O customer **DEVE** informar nome e WhatsApp para fazer pedido | MUST |
| REQ-041 | O customer **DEVE** escolher forma de pagamento (PIX ou Dinheiro) | MUST |
| REQ-042 | O sistema **DEVE** criar o pedido no banco de dados com status "pending" | MUST |
| REQ-043 | O sistema **DEVE** criar os OrderItems associados ao pedido | MUST |
| REQ-044 | Após pedido confirmado, **DEVE** redirecionar customer para WhatsApp do restaurante | MUST |

#### 1.6 Estados do Pedido

```
┌──────────────┐
│   pending    │ (inicial)
└──────┬───────┘
       │
   ┌───┴───┐
   │       │
   ▼       ▼
┌────────┐ ┌────────┐
│confirmed│ │cancelled│
└────────┘ └────────┘
```

---

### 2. Regras de Arquitetura

#### 2.1 Arquitetura de Camadas

```
┌─────────────────────────────────────┐
│         interfaces/ (UI)            │
│  app/admin/*, app/menu/[slug]/*   │
├─────────────────────────────────────┤
│       application/ (Services)       │
│  API routes, business logic        │
├─────────────────────────────────────┤
│         domain/ (Entities)          │
│  types/, context/                   │
├─────────────────────────────────────┤
│      infrastructure/                │
│  lib/supabase/* (DB, Auth, Storage)│
└─────────────────────────────────────┘
```

#### 2.2 Arquitetura Multi-Tenant

**Princípios:**
- Cada restaurante é um tenant distinto
- Todos os tenants compartilham o mesmo banco de dados
- Isolamento de dados por `restaurant_id`
- Escalabilidade horizontal

**Regras de Acesso:**
- APIs devem validar `restaurant_id` do usuário autenticado
- Nenhum tenant pode acessar dados de outro tenant
- Queries sempre filtradas por `restaurant_id`

#### 2.3 Restrições de Autenticação

| Rota | Autenticação | Descrição |
|------|-------------|-----------|
| `/menu/[slug]` | Nenhuma | Público |
| `/admin/*` | Supabase Auth | Protegido |
| `/api/orders` | Nenhuma | Público (POST) |

#### 2.3.1 Regra de Supabase Client (CRÍTICA - memoização)

**REGRA**: `createClient()` **SEMPRE** deve ser memoizado quando usado em componentes React.

```tsx
// ❌ INCORRETO - nova instância a cada render (causa loop infinito)
export default function AdminLayout({ children }) {
  const supabase = createClient(); // BUG
  // ...
}

// ✅ CORRETO - mesma instância em todas as renders
export default function AdminLayout({ children }) {
  const supabase = useMemo(() => createClient(), []);
  // ...
}
```

**Porquê**: `createClient()` gera novo objeto a cada chamada, fazendo `supabase.auth` ser referência diferente. Isso causa re-execução de `useEffect` com dependências de objeto mutável, resultando em loops infinitos.

**Locais afetados**:
- `app/admin/layout.tsx`
- `app/admin/login/page.tsx`
- `app/admin/dashboard/page.tsx`
- `app/admin/orders/page.tsx`
- `app/admin/products/page.tsx`
- `app/admin/categories/page.tsx`
- `app/admin/settings/page.tsx`
- `app/admin/signup/page.tsx`
- `app/menu/[slug]/page.tsx`
- `components/admin/header.tsx`

#### 2.3.2 Configurações de Autenticação Supabase

**DEV**: Desabilitar "Enable email confirmations" no Supabase Dashboard > Authentication > Settings

**PROD**: Implementar fluxo completo de confirmação de email com SMTP customizado

**Regra**: Configurações de auth DEVEM estar documentadas em `supabase/AGENTS.md`

#### 2.4 Variáveis de Ambiente

```bash
# Obrigatórias
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
WHATSAPP_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
```

---

### 3. Regras de Qualidade

#### 3.1 Cobertura de Testes

| Tipo | Target | Obrigatoriedade |
|------|--------|----------------|
| Unitários | ≥ 80% | MUST |
| E2E (fluxos críticos) | 100% | MUST |
| Integração | Máximo possível | SHOULD |

#### 3.2 Paradigmas de Desenvolvimento

| Paradigma | Quando | Fluxo |
|-----------|--------|-------|
| **TDD** | Lógica de negócio, utils, hooks | RED → GREEN → REFACTOR |
| **BDD** | Interação entre módulos, API | Given-When-Then (Gherkin) |
| **ATDD** | Fluxos críticos do usuário | Critérios de aceitação |
| **DDD** | Entidades, value objects, aggregates | Linguagem ubíqua |
| **SDD** | Mudanças significativas | proposal → spec → design → tasks → verify → archive |

---

## Gates de Qualidade

**ANTES DE FAZER COMMIT, TODO SEGUINTE DEVE PASSAR:**

```bash
npm run lint        # 0 errors, 0 warnings
npm run build       # Build passa
npm run test:unit   # 100% testes unitários passando
npx tsc --noEmit   # 0 TypeScript errors
```

| Verificação | Target | Prioridade |
|-------------|--------|------------|
| Lint | 0 errors, 0 warnings | Crítica |
| Build | Passa sem erros | Crítica |
| Unit Tests | 100% passando | Crítica |
| TypeScript | 0 errors | Crítica |

**REGRA DE OURO:** NUNCA commitar com testes falhando. Corrija-os ANTES do commit.

---

## Fluxo SDD Completo

```
Prompt do Usuário → proposal → spec → design → tasks → implementation → verification → archive → post-archive-review
```

### Etapas Detalhadas

| Etapa | Artefato | Descrição | Gate |
|-------|----------|-----------|-------|
| 1 | prompt | Prompt original do usuário | Análise inicial |
| 2 | proposal.md | Proposta formal com scope, riscos | Scope definido |
| 3 | spec.md | Requisitos RFC 2119 | Revisão técnica |
| 4 | design.md | Design técnico | Revisão arquitetura |
| 5 | tasks.md | Decomposição DDD | Completude |
| 6 | implementation | Código + Testes + Documentação | CI/CD |
| 7 | verification | Compliance report | Deep agent |
| 8 | archive | Consolidado e arquivado | Tech Lead |
| 9 | post-archive-review | Verificação: build, testes, docs | **Obrigatório** |

### Gates de Aprovação

| Fase | Gate | Responsável |
|------|------|-------------|
| prompt | Análise inicial | Orchestrator |
| proposal | Scope definido, riscos identificados | Tech Lead |
| spec | Revisão técnica (RFC 2119) | Oracle |
| design | Revisão de arquitetura | Oracle |
| tasks | Verificação de completude | Orchestrator |
| implementation | Testes + lint + build | CI/CD |
| verification | Compliance report | Deep agent |
| archive | Consolidado e arquivado | Tech Lead |
| post-archive | Build + Tests + Docs | Orchestrator |

---

## Fluxos Procedimentais

### 9.1 Regra: Qualidade sobre Velocidade (CRÍTICA)

**Sempre priorize qualidade sobre velocidade.**

- É melhor demorar mais para fazer a revisão correta do que fazer rápido e errado
- Revise sempre que achar necessário antes de executar
- Não pule etapas de verificação
- Uma change só está concluída quando for arquivada
- Só inicie uma nova change após todas as anteriores estarem arquivadas

### 9.2 Regra: Change Concluída Somente Quando Arquivada

Uma change só está concluída quando for arquivada em `opencode/changes/archive/YYYY-MM-DD-{change-name}/`. Não considerar change como finalizada enquanto não estiver arquivada.

### 9.3 Regra: Ordem de Execução

- Só iniciar nova change após todas as anteriores estarem arquivadas
- Mudanças paralelas devem ser sequencializadas quando houver dependência

### 9.4 Fluxo de Checkout (Customer)

```
Customer acessa /menu/[slug]
         │
         ▼
Visualiza categorias e produtos (apenas is_available=true)
         │
         ▼
Adiciona produtos ao carrinho
         │
         ▼
Abre carrinho (Sheet/Drawer)
         │
         ▼
Clica "Continuar" → Checkout
         │
         ▼
Preenche formulário:
  ├── Nome (obrigatório)
  ├── WhatsApp (obrigatório, formato internacional)
  └── Pagamento: PIX ou Dinheiro
         │
         ▼
Clica "Confirmar e Enviar"
         │
         ▼
POST /api/orders
         │
         ├── Sucesso (201):
         │   ├── Limpar carrinho
         │   ├── Mostrar confirmação
         │   └── Redirecionar para WhatsApp
         │
         └── Erro (400/500):
             └── Mostrar mensagem de erro (não bloquear)
```

**Regras do Checkout:**
1. O formulário **DEVE** validar nome e WhatsApp antes do envio
2. WhatsApp **DEVE** ser formatado para padrão internacional (+55...)
3. Em caso de erro de rede, **NÃO BLOQUEAR** - mostrar cache se disponível
4. Carrinho **DEVE** ser limpo após sucesso

### 9.5 Fluxo SDD (Specification-Driven Development)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FLUXO SDD (OBRIGATÓRIO)                         │
└─────────────────────────────────────────────────────────────────────┘

Prompt do Usuário
    │
    ▼
proposal.md
   ├── Scope definido
   ├── Riscos identificados
   └── Rollback plan
   │
   ▼
spec.md (RFC 2119)
   ├── REQ-XXX em linguagem formal
   ├── Cenários Given/When/Then
   └── Critérios de aceitação
   │
   ▼
design.md
   ├── Decisões de arquitetura
   ├── TDD/BDD/ATDD/DDD
   └── File changes
   │
   ▼
tasks.md
   ├── Fases (Infra, Domínio, App, Interface, Docs)
   └── Checkboxes
   │
   ▼
implementation
   ├── Código
   ├── Testes
   └── Documentação
   │
   ▼
verification
   ├── Código: build, lint, tests, coverage
   ├── Docs: AGENTS.md, BDD, proximity
   └── Compliance report
   │
   ▼
post-archive-review
   ├── Build passa
   ├── Tests passam
   ├── Docs atualizadas
   └── Cobertura de rotas
   │
   ▼
archive
   └── Move para opencode/changes/archive/

─────────────────────────────────────────────────────────────────────

Gates de Aprovação:

| Fase | Gate | Responsável |
|------|------|-------------|
| proposal | Scope, riscos | Tech Lead |
| spec | RFC 2119 | Oracle |
| design | Arquitetura | Oracle |
| tasks | Completude | Orchestrator |
| verification | Compliance | Deep Agent |
| archive | Consolidado | Tech Lead |
| post-archive | Build + Tests + Docs | Orchestrator |
```

**Regras SDD:**
1. **TODO** mudança significativa **DEVE** seguir este fluxo
2. **NUNCA** pular fases
3. **NUNCA** implementar sem spec aprovada
4. **verification = código + documentação** (não é só código)
5. **POST-ARCHIVE-REVIEW é obrigatório** após cada archive

---

### 10. Regras de Reutilização de Código

O princípio fundamental é: **quanto menos código, menos manutenção**. Cada linha de código é uma liability. Antes de escrever código novo, verificar se já existe solução no codebase.

#### 10.1 Hierarquia de Componentes

**Ordem de prioridade (do mais reutilizável ao mais específico):**

```
1. shadcn/ui primitives     (button, input, dialog, table)
        │
        ▼
2. components/ui/            (offline-indicator, custom components)
        │
        ▼
3. lib/utils.ts             (formatPrice, generateSlug, isValidWhatsApp)
        │
        ▼
4. lib/constants.ts         (ORDER_STATUS, STATUS_LABELS, LOCALE)
        │
        ▼
5. hooks/                   (useOnlineStatus - browser APIs)
        │
        ▼
6. context/                 (CartContext - estado complexo)
        │
        ▼
7. components/{module}/     (admin/*, landing/* - específicos)
```

#### 10.2 Checklist de Reutilização

**Antes de criar novo código:**

- [ ] Procurei em `components/ui/`?
- [ ] Procurei em `lib/utils.ts`?
- [ ] Procurei em `lib/constants.ts`?
- [ ] Procurei em `hooks/`?
- [ ] Procurei em `types/`?
- [ ] O código pode ser genérico?
- [ ] Posso usar composição ao invés de duplicação?
- [ ] Existe prop/interface que já uso e posso estender?

**Se respondeu SIM a qualquer "procurei", USAR o existente.**

---

### 11. Regras de Segurança de Dados

A proteção de dados sensíveis é **OBRIGATÓRIA** conforme LGPD.

#### 11.1 Classificação de Dados

| Dado | Classificação | Proteção Obrigatória |
|------|--------------|---------------------|
| `customer_whatsapp` | **Sensível** | Mascarar em logs/URLs, owner vê completo |
| `customer_name` | **Pessoal** | Mascarar em logs públicos |
| `password` | **Crítico** | Nunca logar, hash seguro |
| `payment_key` (PIX) | **Crítico** | Nunca logar, mascarar |

#### 11.2 Regras de Sanitização

**REGRA**: TODO `console.log` que contenha dados de users/customers **DEVE** usar sanitização.

```typescript
// ❌ PROIBIDO - dados sensíveis em log
console.log('Order:', order);

// ✅ OBRIGATÓRIO - usar sanitizeForLog
import { sanitizeForLog } from '@/lib/sanitize';
console.log('Order:', sanitizeForLog(order));
```

#### 11.3 Checklist de Segurança

**Antes de cada commit:**

- [ ] Dados sensíveis não aparecem em `console.log`
- [ ] URLs não contêm query params com dados pessoais
- [ ] Errors não expõem stack traces com dados
- [ ] Sanitização usada em todos os logs
- [ ] RLS policies verificadas

---

### 12. Fluxo de Tratamento de Erros

### 12.1 Workflow Obrigatório

Todo erro reportado **DEVE** passar por este processo:

```
Erro Reportado
       │
       ▼
┌──────────────────────┐
│ Criar RCA no template│ ──► opencode/root-causes/RCA-YYYY-MM-DD-NNN.md
│ (10 seções)          │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│ Classificar severidade│ ──► Critical / High / Medium / Low
│ (tabela de testes)   │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│ Criar testes OBRIGATÓRIOS│ ──► unit/ / integration/ / e2e/
│ ANTES do fix        │
└──────────────────────┘
       │
       ├──► Testes falham (reproduzem erro)
       │
       ▼
┌──────────────────────┐
│ Aplicar fix          │
└──────────────────────┘
       │
       ├──► Testes passam
       ├──► Regression tests OK
       │
       ▼
┌──────────────────────┐
│ Verification          │ ──► Compliance report
│ (código + docs)      │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│ Archive               │ ──► opencode/root-causes/RCA-YYYY-MM-DD-NNN.md
└──────────────────────┘
```

### 12.2 Requisitos (REQ-ERR)

| ID | Regra | Prioridade |
|----|-------|------------|
| REQ-ERR-001 | Todo erro reportado **DEVE** ter RCA completo criado | MUST |
| REQ-ERR-003 | Antes de aplicar fix, **DEVEM** ser criados testes conforme severidade | MUST |
| REQ-ERR-005 | RCA deve ser armazenado em `opencode/root-causes/RCA-YYYY-MM-DD-NNN.md` | MUST |

### 12.3 Testes Obrigatórios por Severidade

| Severidade | Unitários | Integração | BDD |
|------------|-----------|------------|-----|
| **Critical** | 3 | 2 | 1 |
| **High** | 2 | 1 | 1 |
| **Medium** | 1 | 1 | 0 |
| **Low** | 1 | 0 | 0 |

---

## 11. Lições Aprendidas de RCAs

### Consolidado de Erros Conhecidos

Esta seção consolida todas as lições aprendidas de RCAs arquivados para evitar recorrência.

#### RCA-2026-04-17-001: Login Reload Loop Infinito

**Categoria**: CODE (memoização ausente)
**Severidade**: Critical

**Causa Raiz**: `createClient()` era chamado diretamente no corpo do componente, gerando nova instância a cada render. Isso fazia `supabase.auth` ser objeto diferente, causando re-execução infinita do `useEffect`.

**Regra Extraída**:
`createClient()` **SEMPRE** deve ser memoizado com `useMemo` quando usado em componentes React client.

**Impacto**: 9 arquivos corrigidos

#### RCA-001: Login Admin - Email Não Confirmado

**Categoria**: CONFIG (Supabase Auth)
**Severidade**: High

**Causa Raiz**: Supabase Dashboard com "Email Confirmation" habilitado por padrão.

**Regra Extraída**:
- DEV: Desabilitar email confirmation no Supabase Dashboard
- PROD: Implementar fluxo completo de confirmação ou confirmar manualmente

---

### Padrões de Erro Conhecidos

| Padrão | Causa Comum | Prevenção |
|--------|-------------|-----------|
| Loop infinito em auth | `createClient()` não memoizado | Usar `useMemo` |
| Erro de email não confirmado | Config Supabase | Documentar configs de auth |
| Redirect loop | Dependência de `useEffect` mutável | Usar refs para objetos stable |
| Bug em produção | Falta de teste E2E | 100% cobertura fluxos críticos |

---

### Checklist Anti-Regressão

**Antes de fazer commit em código de autenticação**:

- [ ] `createClient()` está memoizado com `useMemo`?
- [ ] Dependencies do `useEffect` não são objetos mutáveis?
- [ ] Login/Logout fluxo está testado?
- [ ] Build passa?
- [ ] Lint passa?

---

### Ações de Preventive Checklists

| Ação | Status | Ref |
|------|--------|-----|
| Criar regra de memoização em AGENTS.md | ✅ Feito | Seção 2.3.1 |
| Documentar configs Supabase | ⚠️ Pendente | supabase/AGENTS.md |
| Adicionar teste E2E para /admin/login | ⚠️ Pendente | tests/e2e/ |
| Criar checklist de configuração para novos ambientes | ⚠️ Pendente | supabase/AGENTS.md |

---

## 12. Regras de Documentação

### 12.1 Obrigatoriedade

**TODO elemento da arquitetura DEVE ter AGENTS.md.**

A documentação é parte do desenvolvimento, não um item opcional.

### 12.2 Princípio da Proximidade (REGRA CRÍTICA)

**Os arquivos AGENTS.md DEVEM estar no nível mais próximo possível do elemento que documentam.**

```
# ✅ CORRETO
app/admin/login/page.tsx
app/admin/login/AGENTS.md          ← Mesma pasta

# ❌ INCORRETO
app/admin/AGENTS.md              ← Nível muito alto
app/admin/login/page.tsx
```

### 12.3 Arquivos BDD

**Arquivos `.feature` DEVEM estar no nível mais próximo do módulo que documentam.**

**Tag obrigatória**: TODO cenário BDD DEVE ter `@integration-test` apontando para o teste.

```gherkin
@integration-test="tests/integration/orders.test.ts"
Funcionalidade: Criação de Pedido
...
```

---

## Glossário

| Termo | Definição |
|-------|-----------|
| **Tenant** | Instância isolada de restaurante |
| **Multi-tenant** | Arquitetura com múltiplos tenants |
| **RLS** | Row Level Security (Segurança por linha) |
| **Slug** | Identificador URL único |
| **Cart** | Lista temporária de produtos |
| **Order** | Pedido realizado |
| **RCA** | Root Cause Analysis - Análise de Causa Raiz |
| **DRY** | Don't Repeat Yourself |
| **YAGNI** | You Aren't Gonna Need It |
| **KISS** | Keep It Simple, Stupid |
| **TDD** | Test-Driven Development |
| **BDD** | Behavior-Driven Development |
| **ATDD** | Acceptance Test-Driven Development |
| **DDD** | Domain-Driven Design |
| **SDD** | Specification-Driven Development |

---

## Documentação de Referência

Toda documentação IA está centralizada em `opencode/`. O arquivo `opencode/rules/AGENTS.md` é a fonte centralizada de regras para agentes IA.

### Estrutura do opencode/

```
opencode/
├── rules/            # Regras centralizadas do projeto
│   └── AGENTS.md     # Fonte centralizada de TODAS as regras
├── specs/          # Especificações SDD (Source of Truth)
│   ├── menulink-specification.md
│   ├── menulink-technical-plan.md
│   └── menulink-quality-rules.md
├── docs/           # Documentação adicional
│   ├── OPENCODE.md # Configuração OpenCode
│   ├── PERSONAS.md # Personas de cliente
│   └── PIPELINES.md # Índice de pipelines
├── skills/         # Skills SDD
├── templates/      # Templates SDD
├── changes/        # Mudanças em andamento
│   ├── README.md
│   └── AGENTS.md
└── root-causes/    # Análise de erros RCA
```

### Referências Rápidas

| Necessidade | Arquivo |
|-------------|---------|
| Regras completas do projeto | `opencode/rules/AGENTS.md` |
| Specs do sistema | `opencode/specs/menulink-specification.md` |
| Arquitetura técnica | `opencode/specs/menulink-technical-plan.md` |
| Personas de cliente | `opencode/docs/PERSONAS.md` |
| Pipelines | `opencode/docs/PIPELINES.md` |

---

**Versão**: 5.0
**Última Atualização**: 2026-04-19
**Autor**: AI Agent

**FONTE CENTRALIZADA**: `opencode/rules/AGENTS.md`