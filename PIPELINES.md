# Pipelines - MenuLink

## Visão Geral

Este documento descreve todas as **pipelines** (fluxos de trabalho automatizados) configuradas no projeto MenuLink. Uma pipeline é um workflow definido que deve ser executado após uma ação específica.

**Idioma**: Português Brasileiro (pt-BR)
**Paradigma**: Workflows automatizados + SDD

---

## Índice

1. [Pipeline SDD (Specification-Driven Development)](#1-pipeline-sdd-specification-driven-development)
2. [Pipeline CI/CD (GitHub Actions)](#2-pipeline-cicd-github-actions)
3. [Pipeline Post-Archive Review](#3-pipeline-post-archive-review)
4. [Pipeline Error Handling (RCA)](#4-pipeline-error-handling-rca)
5. [Pipeline Code Quality Gates](#5-pipeline-code-quality-gates)

---

## 1. Pipeline SDD (Specification-Driven Development)

### Descrição

Pipeline principal de desenvolvimento orientado por especificações. Executado após cada **mudança significativa** (nova funcionalidade, API, regra de negócio).

### Gatilho (Trigger)

- Nova change criada em `.openspec/changes/`
- PRD aprovado para implementação

### Fluxo

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PIPELINE SDD COMPLETA                                │
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
  │ tasks    │───▶│ implementation    │───▶│ verification │───▶│ archive  │
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

  ┌──────────┐
  │ post-    │───▶ NOVA CHANGE ou PRONTO
  │ archive  │
  └──────────┘
```

### Fases Detalhadas

| Fase | Artefato | Descrição | Gate |
|------|----------|-----------|------|
| 1 | PRD.md | Product Requirements Document | Análise inicial |
| 2 | Análise | Viabilidade técnica confrontada | Tech Lead |
| 3 | proposal.md | Proposta formal | Scope definido |
| 4 | spec.md | Requisitos RFC 2119 | Oracle |
| 5 | design.md | Design técnico | Oracle |
| 6 | tasks.md | Decomposição DDD | Completude |
| 7 | implementation | Código + Testes + Documentação | CI/CD |
| 8 | verification | Compliance report | Deep agent |
| 9 | archive | Consolidado e arquivado | Tech Lead |
| 10 | post-archive-review | Verificação final | Orchestrator |

### Artefatos por Fase

```
.openspec/changes/{change-name}/
├── proposal.md    # Proposta formal
├── spec.md        # Especificação RFC 2119
├── design.md      # Design técnico
├── tasks.md       # Lista de tarefas
├── status.md      # Status atual
└── archive/       # Após conclusão
    ├── verify-report.md
    └── archive-report.md
```

### Skills Associadas

| Phase | Skill | Agente |
|-------|-------|--------|
| proposal | `sdd-propose` | Deep |
| spec | `sdd-spec` | Deep |
| design | `sdd-design` | Deep |
| tasks | `sdd-tasks` | Deep |
| apply | `sdd-apply` | Deep |
| verify | `sdd-verify` | Deep |
| archive | `sdd-archive` | Deep |
| review | `plan-reviewer` | Oracle |
| post-archive | `post-archive-review` | Orchestrator |

### Critérios de Progresso

- [ ] proposal.md criado e aprovado
- [ ] spec.md criado e aprovado (Oracle)
- [ ] design.md criado e aprovado (Oracle)
- [ ] tasks.md criado e aprovado
- [ ] 100% das tarefas implementadas
- [ ] Build passa
- [ ] Lint passa (0 errors)
- [ ] Testes passam (cobertura ≥80%)
- [ ] verification report com PASS
- [ ] post-archive-review executado

### Execução

```bash
# Iniciar nova change
mkdir -p .openspec/changes/{change-name}

# O SDD é executado via skill do Orchestrator
# Não é executado manualmente via CLI
```

---

## 2. Pipeline CI/CD (GitHub Actions)

### Descrição

Pipeline de integração contínua e deploy automático. Executado em cada **push** e **pull request**.

### Gatilho (Trigger)

- `push` para branch `main`
- `pull_request` para branch `main`
- Workflow `dispatch` manual

### Fluxo

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PIPELINE CI/CD                                       │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
  │ Lint     │───▶│ Typecheck│───▶│ Build    │───▶│ Testes   │
  │ ESLint   │    │ tsc      │    │ npm run  │    │ Unit +   │
  │          │    │          │    │ build    │    │ Integração│
  └──────────┘    └──────────┘    └──────────┘    └──────────┘
                                                              │
  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
  │ Falha    │◀───│ Falha    │◀───│ Falha    │◀───│ 80%+     │
  │           │    │           │    │           │    │ cobertura │
  └──────────┘    └──────────┘    └──────────┘    └──────────┘
                                                              │
  ┌──────────┐
  │ PR Status│
  │ Approved │
  └──────────┘
```

### Jobs

| Job | Comando | Gate |
|-----|---------|------|
| `lint` | `npm run lint` | 0 errors |
| `typecheck` | `npx tsc --noEmit` | 0 errors |
| `build` | `npm run build` | Exit 0 |
| `test` | `npm run test:unit` | 80%+ coverage |
| `e2e` | `npm run test:e2e` | Playwright passes |

### Configuração

**Arquivo**: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  build:
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build

  test:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:coverage
```

### Variáveis de Ambiente (Secrets)

| Secret | Descrição | Obrigatório |
|--------|-----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase | Sim |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima do Supabase | Sim |
| `WHATSAPP_TOKEN` | Token da API WhatsApp | Sim |
| `WHATSAPP_PHONE_NUMBER_ID` | Phone ID do WhatsApp | Sim |

### Gates de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Lint | 0 errors | Crítica |
| TypeScript | 0 errors | Crítica |
| Build | Success | Crítica |
| Cobertura | ≥80% | Alta |
| E2E | 100% fluxos críticos | Alta |

---

## 3. Pipeline Post-Archive Review

### Descrição

Revisão obrigatória após cada change ser arquivada. Executado pelo Orchestrator após `sdd-archive`.

### Gatilho (Trigger)

- Change arquivada em `.openspec/changes/archive/{date}/{change-name}/`

### Fluxo

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     PIPELINE POST-ARCHIVE REVIEW                            │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
  │ Code Review  │───▶│ Docs Review  │───▶│ Spec Review  │
  │              │    │              │    │              │
  └──────────────┘    └──────────────┘    └──────────────┘
         │                   │                   │
         ▼                   ▼                   ▼
  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
  │ Build passa  │    │ AGENTS.md    │    │ Specs        │
  │ Lint passa  │    │ atualizados  │    │ consolidadas │
  │ Testes      │    │ Proximidade  │    │ REQ-XXX      │
  │ passam      │    │ respeitada   │    │ atualizados  │
  └──────────────┘    └──────────────┘    └──────────────┘
         │                   │                   │
         └───────────────────┴───────────────────┘
                             │
                             ▼
                   ┌──────────────┐
                   │ Report      │
                   │ (compliance)│
                   └──────────────┘
                             │
                             ▼
                   ┌──────────────┐
                   │ PRONTO      │
                   │ ou NOVA     │
                   │ CHANGE      │
                   └──────────────┘
```

### Etapas de Verificação

#### 3.1 Code Review

- [ ] Build passa (`npm run build`)
- [ ] Lint passa (`npm run lint`, 0 errors)
- [ ] TypeScript compila (`npx tsc --noEmit`)
- [ ] Testes unitários passam (`npm run test:unit`)
- [ ] Cobertura ≥80%
- [ ] Testes de integração passam
- [ ] E2E passam (se aplicável)

#### 3.2 Documentation Review

- [ ] AGENTS.md existe no nível mais próximo do elemento
- [ ] AGENTS.md do módulo/pai atualizado
- [ ] BDD scenarios com tag `@integration-test`
- [ ] Arquivos `.feature` no nível correto (proximidade)
- [ ] README atualizado se necessário

#### 3.3 Spec Consolidation

- [ ] Specs em `.openspec/specs/` atualizadas com mudanças
- [ ] REQ-XXX relevantes atualizados
- [ ] Critérios de aceitação verificados
- [ ] Changelog atualizado

### Skills Associadas

| Skill | Agente | Descrição |
|-------|--------|-----------|
| `post-archive-review` | Orchestrator | Executa revisão completa |

### Template de Report

```markdown
# Post-Archive Review Report

**Change**: {change-name}
**Date**: {date}
**Status**: ✅ PASS | ⚠️ WARNINGS | ❌ FAIL

---

## Code Quality

| Check | Status | Notes |
|-------|--------|-------|
| Build | ✅/❌ | |
| Lint | ✅/❌ | |
| TypeScript | ✅/❌ | |
| Unit Tests | ✅/❌ | |
| Coverage | ✅/❌ | |
| Integration Tests | ✅/❌ | |
| E2E Tests | ✅/❌ | |

## Documentation

| Check | Status | Notes |
|-------|--------|-------|
| AGENTS.md | ✅/❌ | |
| Proximity Rules | ✅/❌ | |
| BDD Tags | ✅/❌ | |
| README Updated | ✅/❌ | |

## Spec Consolidation

| Check | Status | Notes |
|-------|--------|-------|
| Specs Updated | ✅/❌ | |
| REQ-XXX Updated | ✅/❌ | |
| Changelog | ✅/❌ | |

## Verdict

- [ ] **PASS**: Change pronta para produção
- [ ] **WARNINGS**: Change pronta com observações
- [ ] **FAIL**: Blockers encontrados, ação necessária
```

---

## 4. Pipeline Error Handling (RCA)

### Descrição

Pipeline para tratamento de erros reportados. Todo erro **DEVE** passar por este processo antes da correção.

### Gatilho (Trigger)

- Bug reportado em produção ou desenvolvimento
- Error log com stack trace
- Teste falhando

### Fluxo

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PIPELINE ERROR HANDLING (RCA)                         │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
  │ Error        │───▶│ RCA Created  │───▶│ Severity     │
  │ Reported     │    │ (10 sections)│    │ Classified   │
  └──────────────┘    └──────────────┘    └──────────────┘
                                                    │
         ┌──────────────────────────────────────────┘
         │
         ▼
  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
  │ Tests         │───▶│ Fix          │───▶│ Validation   │
  │ Created       │    │ Implemented  │    │              │
  └──────────────┘    └──────────────┘    └──────────────┘
         │                                       │
         └───────────────────────────────────────┘
                             │
                             ▼
                   ┌──────────────┐
                   │ Archive     │
                   │ (root-cause)│
                   └──────────────┘
```

### 10 Seções Obrigatórias do RCA

1. **Descrição do Erro** - O que aconteceu
2. **Impacto** - Usuários, funcionalidade, receita afetados
3. **Linha do Tempo** - Quando foi detectado
4. **Causa Imediata** - O que causou diretamente
5. **Causa Raiz (5 Porquês)** - Análise profunda
6. **Categoria da Causa Raiz** - CODE, CONFIG, INFRA, PROC, DSGN, TEST, DOCS
7. **Testes Criados** - Unitários, integração, BDD
8. **Correção Aplicada** - O que foi mudado
9. **Lições Aprendidas** - O que aprendemos
10. **Ação Preventiva** - Como evitar recurrence

### Classificação de Severidade

| Severidade | Unitários | Integração | BDD | Impacto |
|------------|-----------|------------|-----|---------|
| **Critical** | 3 | 2 | 1 | Sistema indisponível ou perda de dados |
| **High** | 2 | 1 | 1 | Funcionalidade principal comprometida |
| **Medium** | 1 | 1 | 0 | Funcionalidade secundária afetada |
| **Low** | 1 | 0 | 0 | Impacto mínimo, workarounds disponíveis |

### Diretório de RCAs

```
.openspec/root-causes/
├── README.md              # Guia do processo
└── RCA-YYYY-MM-DD-NNN.md # Arquivos RCA individuais
```

### Template RCA

**Arquivo**: `.openspec/templates/rca-template.md`

```markdown
# RCA: {Título do Erro}

**ID**: RCA-YYYY-MM-DD-NNN
**Data**: {YYYY-MM-DD}
**Severity**: Critical | High | Medium | Low
**Status**: In Progress | Completed | Archived

---

## 1. Descrição do Erro

[Descrição clara do que aconteceu]

## 2. Impacto

| Métrica | Valor |
|---------|-------|
| Usuários afetados | N |
| Funcionalidade | X |
| Receita estimada | R$ Y |

## 3. Linha do Tempo

| Horário | Evento |
|---------|--------|
| HH:MM | Erro detectado |
| HH:MM | Investigação iniciada |
| HH:MM | Causa identificada |

## 4. Causa Imediata

[O que causou diretamente o erro]

## 5. Causa Raiz (5 Porquês)

1. **Por que ocorreu?** → [Resposta]
2. **Por que [resposta 1]?** → [Resposta 2]
3. **Por que [resposta 2]?** → [Resposta 3]
4. **Por que [resposta 3]?** → [Resposta 4]
5. **Por que [resposta 4]?** → [Causa Raiz Final]

## 6. Categoria da Causa Raiz

| Código | Categoria |
|--------|-----------|
| CODE | Código - Bug em código fonte |
| CONFIG | Configuração - Erro em variáveis de ambiente |
| INFRA | Infraestrutura - Problemas de servidor/rede |
| PROC | Processo - Falta de processo definido |
| DSGN | Design - Decisão arquitetural incorreta |
| TEST | Testes - Cobertura insuficiente |
| DOCS | Documentação - Documentação ausente |

## 7. Testes Criados

| Tipo | Quantidade | Arquivo |
|------|------------|---------|
| Unitários | N | `tests/unit/...` |
| Integração | N | `tests/integration/...` |
| BDD | N | `...feature` |

## 8. Correção Aplicada

[Descrição da correção implementada]

## 9. Lições Aprendidas

1. [Lição 1]
2. [Lição 2]

## 10. Ação Preventiva

| Ação | Responsável | Prazo |
|------|-------------|-------|
| [Ação 1] | [Nome] | [Data] |

---

## Rastreabilidade

| Campo | Valor |
|-------|-------|
| Change ID | TBD (se aplicável) |
| Commit | TBD |
| Sprint | [Sprint ID] |
```

### Integração com SDD

```
Erro Reportado
       │
       ▼
1. RCA criado (.openspec/root-causes/RCA-YYYY-MM-DD-NNN.md)
       │
       ▼
2. Se mudança significativa → seguir fluxo SDD completo
   - Criar change em .openspec/changes/
   - Seguir: proposal → spec → design → tasks → verification → archive
       │
       ▼
3. Archive: .openspec/root-causes/RCA-YYYY-MM-DD-NNN.md
```

---

## 5. Pipeline Code Quality Gates

### Descrição

Pipeline de verificação de qualidade de código. Executado **antes de cada commit** e **antes do merge**.

### Gatilho (Trigger)

- Pre-commit hook
- Antes de merge

### Gates

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CODE QUALITY GATES                                     │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
  │ Lint         │───▶│ TypeScript   │───▶│ Build        │
  │ (ESLint)     │    │ (tsc)        │    │ (next build) │
  │              │    │              │    │              │
  └──────────────┘    └──────────────┘    └──────────────┘
         │                   │                   │
         ▼                   ▼                   ▼
  0 errors              0 errors             Exit 0
         │                   │                   │
         └───────────────────┴───────────────────┘
                             │
                             ▼
                   ┌──────────────┐
                   │ Tests        │
                   │ (vitest)    │
                   └──────────────┘
                             │
                             ▼
                   ┌──────────────┐
                   │ Coverage    │
                   │ ≥80%        │
                   └──────────────┘
                             │
                             ▼
                   ┌──────────────┐
                   │ ✅ PRONTO    │
                   │ para commit  │
                   └──────────────┘
```

### Comandos

```bash
# Verificação completa (antes de commit)
npm run lint          # ESLint
npx tsc --noEmit     # TypeScript
npm run build         # Next.js build
npm run test:unit     # Testes unitários
npm run test:coverage # Verificar cobertura

# Versão rápida (durante desenvolvimento)
npm run lint          # Só lint
npx tsc --noEmit      # TypeScript rápido
```

### Critérios

| Gate | Comando | Target | Prioridade |
|------|---------|--------|------------|
| Lint | `npm run lint` | 0 errors | Crítica |
| TypeScript | `npx tsc --noEmit` | 0 errors | Crítica |
| Build | `npm run build` | Success | Crítica |
| Tests | `npm run test:unit` | All pass | Crítica |
| Coverage | `npm run test:coverage` | ≥80% | Alta |

---

## Pipelines Resumidas

| Pipeline | Trigger | Executor | Frequência |
|----------|---------|---------|------------|
| **SDD** | Nova change | Orchestrator + Deep | A cada mudança significativa |
| **CI/CD** | Push/PR | GitHub Actions | A cada push |
| **Post-Archive** | Change arquivada | Orchestrator | A cada change concluída |
| **RCA** | Bug reportado | Orchestrator + Deep | A cada erro |
| **Quality Gates** | Pre-commit | Dev (local) | A cada commit |

---

## Dependências entre Pipelines

```
                    ┌──────────────┐
                    │ Quality Gates│
                    │ (pre-commit) │
                    └──────────────┘
                           │
                           ▼
    ┌──────────────────────────────────────────────┐
    │                                              │
    ▼                                              ▼
┌──────────────┐                           ┌──────────────┐
│    CI/CD     │                           │    SDD       │
│ (GitHub)     │                           │ (Change)     │
└──────────────┘                           └──────────────┘
       │                                         │
       │                                         ▼
       │                               ┌──────────────────┐
       │                               │  implementation  │
       │                               └──────────────────┘
       │                                         │
       ▼                                         ▼
┌──────────────┐                           ┌──────────────┐
│  Build Fail  │                           │  verification│
│     ❌       │                           │      ✅      │
└──────────────┘                           └──────────────┘
                                                   │
                                                   ▼
                                           ┌──────────────┐
                                           │   archive    │
                                           └──────────────┘
                                                   │
                                                   ▼
                                           ┌──────────────┐
                                           │post-archive  │
                                           │   review     │
                                           └──────────────┘
```

---

## Referências

- [AGENTS.md](./AGENTS.md) - Visão geral do projeto
- [.openspec/AGENTS.md](./.openspec/AGENTS.md) - SDD workflow
- [.openspec/specs/menulink-rules.md](./.openspec/specs/menulink-rules.md) - Regras de qualidade
- [Template RCA](./.openspec/templates/rca-template.md) - Template para RCA

---

**Versão**: 1.0
**Última Atualização**: 2026-04-17
**Autor**: AI Agent