# Design: Fluxo de Desenvolvimento Guiado por IA com OpenCode

## Fonte da Verdade

Este documento detalha as decisões de arquitetura, estratégia de testes e modelagem de domínio para o pipeline de agentes IA especificado em `spec.md` (REQ-001 a REQ-007).

---

## 1. Decisões de Arquitetura

### 1.1 Visão Geral do Pipeline

O pipeline de desenvolvimento assistido por IA executa em fases sequenciais com gates de aprovação:

```
PRD.md
  │
  ▼
┌─────────────┐
│ Agente PM   │──▶ Backlog (Histórias XP + INVEST)
└─────────────┘
  │
  ▼
┌───────────────────┐
│ Agente Arquiteto  │──▶ design.md + tasks.md
└───────────────────┘
  │
  ▼
┌─────────────┐
│ Agente Dev  │──▶ TDD (Red-Green-Refactor) + Código
└─────────────┘
  │
  ▼
┌─────────────┐
│ Agente      │──▶ Validação + Aprovação
│ Revisor     │
└─────────────┘
```

### 1.2 Agentes Especializados

| Agente | Responsabilidade | Skills | Output |
|--------|------------------|--------|--------|
| **PM** | Elicitação de requisitos | INVEST, XP Format, DDD | Backlog de histórias |
| **Arquiteto** | Design técnico | Next.js 16, React 19, TypeScript strict, DDD | design.md, tasks.md |
| **Dev** | Implementação | TDD, Vitest, Red-Green-Refactor | Código + Testes |
| **Revisor** | Validação | ESLint, TypeScript, Playwright | Aprovação/Rejeição |

### 1.3 Integração com OpenCode

**Plugins Requeridos:**

| Plugin | Função | Configuração |
|--------|--------|--------------|
| `create-opencode-workflow` | Orquestração base do pipeline | `.opencode/workflows/ai-pipeline.ts` |
| `opencode-plus` | Sistema TDD com agentes | `.opencode/plugins/tdd-agent.ts` |
| `OpenAgentsControl` | Validação de padrões | `.opencode/agents/openagents-control.ts` |

**Arquivos de Contexto:**

| Arquivo | Propósito | Atualização |
|---------|-----------|-------------|
| `OPENCODE.md` | Contexto de alto nível para agentes | A cada nova change |
| `.openspec/AGENTS.md` | Comportamento e regras dos agentes | Apenas quando regras mudam |
| `.openspec/specs/*.md` | Fonte da verdade (Specs ativas) | Não alterado por agentes |

### 1.4 Stack Validada

Todo código gerado **DEVE** ser compatível com:

- **Runtime**: Node.js 20+
- **Framework**: Next.js 16.2.3 + React 19
- **Linguagem**: TypeScript `strict: true`
- **Estilização**: Tailwind CSS 4 (CSS-based config)
- **UI Components**: shadcn/ui (componentes em `components/ui/`)
- **Validação**: Zod
- **ORM**: Drizzle ORM + Supabase
- **Banco**: PostgreSQL via Supabase

---

## 2. TDD (Test-Driven Development)

### 2.1 Estratégia

Ciclo **Red-Green-Refactor** obrigatório para toda implementação:

```
RED     → Agente Dev escreve teste que falha
GREEN   → Agente Dev implementa código mínimo para teste passar
REFACTOR→ Agente Dev refatora mantendo testes passando
```

### 2.2 Cobertura Mínima

| Tipo de Teste | Cobertura Mínima | Ferramenta |
|---------------|------------------|------------|
| Unitários | ≥80% linhas | Vitest |
| Integração | 100% APIs e interações | Vitest + Supertest |
| E2E | 100% fluxos críticos | Playwright |

### 2.3 Estrutura de Testes

```
tests/
├── unit/
│   ├── lib/
│   │   └── whatsapp.test.ts
│   ├── hooks/
│   │   └── useCart.test.ts
│   └── domain/
│       └── order.test.ts
├── integration/
│   ├── api/
│   │   └── orders.test.ts
│   └── modules/
│       └── cart-context.test.ts
└── e2e/
    └── critical-flows/
        ├── menu-navigation.test.ts
        └── checkout-flow.test.ts
```

### 2.4 Regras de TDD

1. **TESTES PRIMEIRO**: Todo código de produção **DEVE** ter testes escritos antes
2. **NOMECLATURA**: `{nome-função}.test.ts`
3. **MOCKS**: Utilizar Vitest mocks para dependências externas
4. **ISOLAMENTO**: Testes **DEVEM** ser independentes (sem ordem de execução)
5. **DETERMINSMO**: Testes **DEVEM** produzir resultados consistentes

---

## 3. BDD (Behavior-Driven Development)

### 3.1 Cenários Gherkin

Arquivos `.feature` **DEVEM** estar no nível mais próximo do módulo documentado:

| Módulo | Arquivo BDD |
|--------|-------------|
| Pipeline IA | `.openspec/changes/ai-development-workflow/pipeline.feature` |
| Agente PM | `.openspec/changes/ai-development-workflow/pm-agent.feature` |
| Agente Dev | `.openspec/changes/ai-development-workflow/dev-agent.feature` |
| Revisor | `.openspec/changes/ai-development-workflow/revisor.feature` |

### 3.2 Tag @integration-test

**REGRA CRÍTICA**: Todo cenário BDD **DEVE** ter tag `@integration-test` apontando para teste de integração:

```gherkin
@integration-test="tests/integration/pipeline/agent-pm.test.ts"
Funcionalidade: Geração de Backlog INVEST
  Cenário: Histórias geradas cumprem critérios INVEST
    Dado que o Agente PM recebeu PRD válido
    Quando o agente termina a geração de backlog
    Então cada história DEVE ser Independent
    E cada história DEVE ser Negotiable
    E cada história DEVE ser Valuable
    E cada história DEVE ser Estimable
    E cada história DEVE ser Small
    E cada história DEVE ser Testable
```

### 3.3 Critérios de Cobertura

- 100% dos fluxos críticos documentados com BDD
- Cada cenário BDD **DEVE** ter teste de integração correspondente
- Cada teste de integração **DEVE** referenciar cenário BDD via tag

---

## 4. ATDD (Acceptance Test-Driven Development)

### 4.1 Critérios de Aceitação por Fase

| Fase | Critério | Verificação |
|------|----------|-------------|
| PRD → PM | Comando `/prd start` funciona | Teste E2E |
| PM → Backlog | Histórias XP + INVEST | Teste de validação |
| Backlog → Arquiteto | design.md com seções completas | Checklist |
| Arquiteto → Tasks | tasks.md com fases DDD | Checklist |
| Dev → Código | TDD seguido, cobertura ≥80% | Relatório coverage |
| Revisor → Aprovado | lint + typecheck + build | CI/CD |

### 4.2 Checklist QA

- [ ] Testes exploratórios manuais
- [ ] Validação de segurança (não expor secrets)
- [ ] Teste de performance (build time)
- [ ] Validação de acessibilidade (a11y)

---

## 5. DDD (Domain-Driven Design)

### 5.1 Bounded Context: AI Development Workflow

```
┌─────────────────────────────────────────────────────────────┐
│              Bounded Context: AI Development Workflow       │
├─────────────────────────────────────────────────────────────┤
│  Agregados                                                 │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Workflow  │  │   Agent    │  │    Task    │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│                           │                                 │
│                    ┌────────────┐                           │
│                    │ Artifact   │                           │
│                    └────────────┘                           │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Agregados e Entidades

#### Workflow (Agregado Raiz)

```typescript
// types/domain/workflow.ts
interface Workflow {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'completed';
  currentPhase: WorkflowPhase;
  artifacts: Artifact[];
  createdAt: Date;
  updatedAt: Date;
}

type WorkflowPhase = 'pm' | 'architect' | 'dev' | 'review';
```

#### Agent (Entidade)

```typescript
// types/domain/agent.ts
interface Agent {
  id: string;
  type: AgentType;
  name: string;
  skills: Skill[];
  currentTask?: Task;
  status: 'idle' | 'working' | 'waiting_approval' | 'approved' | 'rejected';
}

type AgentType = 'pm' | 'architect' | 'dev' | 'reviewer';
```

#### Task (Entidade)

```typescript
// types/domain/task.ts
interface Task {
  id: string;
  workflowId: string;
  agentId: string;
  description: string;
  phase: WorkflowPhase;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  testCoverage?: number;
  validationResult?: ValidationResult;
}

interface ValidationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
}
```

#### Artifact (Value Object)

```typescript
// types/domain/artifact.ts
interface Artifact {
  id: string;
  workflowId: string;
  type: ArtifactType;
  path: string;
  content: string;
  phase: WorkflowPhase;
  validated: boolean;
}

type ArtifactType = 
  | 'prd' 
  | 'backlog' 
  | 'spec' 
  | 'design' 
  | 'tasks' 
  | 'code' 
  | 'tests' 
  | 'documentation';
```

### 5.3 Repositórios

```
lib/domain/repositories/
├── workflow-repository.ts
├── agent-repository.ts
├── task-repository.ts
└── artifact-repository.ts
```

### 5.4 Serviços de Domínio

```
lib/domain/services/
├── pipeline-orchestrator.ts  # Orquestra fluxo entre agentes
├── validation-service.ts     # Valida outputs contra padrões
└── agent-coordinator.ts      # Coordena execução de agentes
```

### 5.5 Linguagem Ubíqua

| Termo | Definição | Contexto |
|-------|-----------|----------|
| Pipeline | Fluxo completo de desenvolvimento | Workflow geral |
| Fase | Etapa do pipeline (PM, Arquiteto, Dev, Revisor) | Workflow |
| Artifact | Artefato gerado em cada fase | Todas as fases |
| Gate | Ponto de aprovação entre fases | Workflow |
| Backlog | Lista de histórias de usuário | Fase PM |

---

## 6. Arquitetura de Diretórios

### 6.1 Estrutura de Arquivos

```
ai-development-workflow/
├── .opencode/
│   ├── workflows/
│   │   └── ai-pipeline.ts          # Orquestração do pipeline
│   ├── plugins/
│   │   ├── tdd-agent.ts            # Agente TDD
│   │   └── create-opencode-workflow.ts
│   ├── agents/
│   │   ├── pm-agent.ts             # Agente Product Manager
│   │   ├── architect-agent.ts      # Agente Arquiteto
│   │   ├── dev-agent.ts            # Agente Desenvolvedor
│   │   ├── reviewer-agent.ts       # Agente Revisor
│   │   └── openagents-control.ts   # Validação de padrões
│   └── config.ts                   # Configuração OpenCode
├── types/domain/
│   ├── workflow.ts
│   ├── agent.ts
│   ├── task.ts
│   └── artifact.ts
├── lib/domain/
│   ├── services/
│   │   ├── pipeline-orchestrator.ts
│   │   ├── validation-service.ts
│   │   └── agent-coordinator.ts
│   └── repositories/
│       ├── workflow-repository.ts
│       ├── agent-repository.ts
│       ├── task-repository.ts
│       └── artifact-repository.ts
├── tests/
│   ├── unit/
│   │   ├── domain/
│   │   │   ├── workflow.test.ts
│   │   │   └── task.test.ts
│   │   └── services/
│   │       └── pipeline-orchestrator.test.ts
│   ├── integration/
│   │   └── pipeline/
│   │       ├── pm-agent.test.ts
│   │       ├── architect-agent.test.ts
│   │       └── dev-agent.test.ts
│   └── e2e/
│       └── pipeline/
│           └── full-pipeline.test.ts
└── docs/
    └── ai-workflow-guide.md        # Guia de uso (se necessário)
```

### 6.2 Arquivos a Modificar

| Arquivo | Modificação | Prioridade |
|---------|-------------|------------|
| `.openspec/AGENTS.md` | Adicionar seção de agentes IA | Alta |
| `OPENCODE.md` | Criar contexto de alto nível | Alta |
| `.openspec/templates/design-template.md` | Atualizar com seções TDD/BDD/DDD | Média |
| `package.json` | Adicionar plugins OpenCode | Alta |
| `tsconfig.json` | Adicionar path alias `@/domain/*` | Média |

---

## 7. Interface de API Interna

### 7.1 Pipeline Orchestrator

```typescript
// lib/domain/services/pipeline-orchestrator.ts
interface PipelineOrchestrator {
  start(changeName: string, prdContent: string): Promise<Workflow>;
  executePhase(workflowId: string, phase: WorkflowPhase): Promise<PhaseResult>;
  validateOutput(workflowId: string, phase: WorkflowPhase): Promise<ValidationResult>;
  approve(workflowId: string, phase: WorkflowPhase): Promise<void>;
  reject(workflowId: string, phase: WorkflowPhase, reason: string): Promise<void>;
}
```

### 7.2 Validation Service

```typescript
// lib/domain/services/validation-service.ts
interface ValidationService {
  validateStoriesXP(stories: UserStory[]): ValidationResult;
  validateStoriesINVEST(stories: UserStory[]): ValidationResult;
  validateDesignDocument(doc: DesignDocument): ValidationResult;
  validateCode(code: string, context: ValidationContext): ValidationResult;
  validateTestCoverage(coverage: CoverageReport): boolean;
}
```

---

## 8. Dependências

| Dependência | Versão | Propósito | Fonte |
|-------------|--------|-----------|-------|
| `vitest` | ^2.0 | Testes unitários e integração | npm |
| `@playwright/test` | ^1.45 | Testes E2E | npm |
| `create-opencode-workflow` | latest | Pipeline base | npm |
| `opencode-plus` | latest | Sistema TDD agentes | npm |
| `typescript` | 5.x | Tipo estrito | Existing |
| `zod` | ^3.0 | Validação runtime | Existing |
| `drizzle-orm` | ^0.30 | ORM | Existing |

---

## 9. Riscos e Mitigações

### 9.1 Riscos Identificados

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Curva de aprendizado elevada | Alta | Médio | Documentação clara com exemplos; tutorials interativos |
| Dependência de plugins externos | Média | Alto | Definir fallback manual; lock de versões com `pin`; documento de rollback |
| Código gerado fora dos padrões | Média | Alto | OpenAgentsControl com validação rigorosa; testes de consistência |
| Agentes entrando em loop | Baixa | Médio | Timeout configurável (max 5 min/phase); limite de iterations (max 10) |
| Incompatibilidade com Next.js 16 | Baixa | Alto | Testar em ambiente isolado antes de deploy; CI/CD com matrix testing |
| PRD mal formatado | Alta | Baixo | Validação de schema antes de iniciar pipeline; mensagens de erro claras |

### 9.2 Planos de Contingência

| Cenário | Ação |
|---------|------|
| Plugin falha | Fallback para fluxo SDD manual documentado em `.openspec/AGENTS.md` |
| Agente em loop | Timeout mata processo; gera log para análise; notifica usuário |
| Código não passa validação | Revisor rejeita com feedback detalhado; Dev corrige |
| Build falha | CI/CD não permite merge; log detalhado com linha do erro |

---

## 10. Gates de Qualidade

### 10.1 Gate de Cada Fase

| Fase | Gate | Verificação |
|------|------|-------------|
| PM | Aprovação Revisor | Histórias XP + INVEST válidas |
| Arquiteto | Aprovação Revisor | design.md completo |
| Dev | lint + typecheck + build | `npm run lint && npm run typecheck && npm run build` |
| Revisor Final | Cobertura ≥80% | `npm run test:coverage` |

### 10.2 Critérios de Aprovação Final

- [ ] Todos os gates de fase passaram
- [ ] Cobertura de testes ≥80%
- [ ] 0 erros de lint
- [ ] 0 erros de typecheck
- [ ] Build bem-sucedido
- [ ] 100% fluxos críticos com BDD

---

## 11. Implementação Sequencial (Fases)

### Fase 1: Infraestrutura de Agentes
- Configurar estrutura de diretórios `.opencode/agents/`
- Definir tipos em `types/domain/`
- Criar skeletal dos agentes

### Fase 2: Domínio (DDD)
- Implementar agregados (Workflow, Agent, Task, Artifact)
- Criar serviços de domínio
- Implementar repositórios

### Fase 3: Aplicação (Casos de Uso)
- Pipeline Orchestrator
- Validation Service
- Agent Coordinator

### Fase 4: Interface
- Plugin `create-opencode-workflow` integrado
- Comandos OpenCode (`/prd start`, etc.)
- Configuração em `.opencode/config.ts`

### Fase 5: Testes
- Unitários para domain/services
- Integração para agentes
- E2E para pipeline completo

### Fase 6: Documentação
- Atualizar `.openspec/AGENTS.md`
- Criar `OPENCODE.md`
- Cenários BDD em `.feature`

---

**Design criado em**: 2026-04-17
**Autor**: AI Agent
**Baseado em**: spec.md "ai-development-workflow" (REQ-001 a REQ-007)