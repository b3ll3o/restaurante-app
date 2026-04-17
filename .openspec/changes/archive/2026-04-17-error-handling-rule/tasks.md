# Tasks: error-handling-rule

## Pré-condições
- [x] Spec aprovada (`.openspec/changes/error-handling-rule/specs/sdd/spec.md`)
- [x] Design aprovado (`.openspec/changes/error-handling-rule/design.md`)

---

## Phase 1: Infraestrutura

Criação da estrutura de diretórios e templates RCA.

### Fase 1.1: Template RCA

- [x] 1.1.1: Criar `.openspec/templates/rca-template.md` com as 10 seções obrigatórias:
  - Descrição do erro
  - Impacto (usuários, funcionalidade, receita)
  - Linha do tempo
  - Causa imediata
  - Causa raiz (5 Porquês)
  - Categoria da causa raiz (Código, Configuração, Infraestrutura, Processo, Design, Testes, Documentação)
  - Testes criados (unitários, integração, BDD)
  - Correção aplicada
  - Lições aprendidas
  - Ação preventiva

- [x] 1.1.2: Verificar que o template contém placeholders claros para cada seção

### Fase 1.2: Diretório Root-Causes

- [x] 1.2.1: Criar diretório `.openspec/root-causes/`

- [x] 1.2.2: Criar `.openspec/root-causes/.gitkeep` como placeholder

- [x] 1.2.3: Criar `.openspec/root-causes/README.md` com:
  - Visão geral do processo RCA
  - Como criar um RCA (passo a passo)
  - Nomenclatura `RCA-YYYY-MM-DD-NNN`
  - Referência ao template `.openspec/templates/rca-template.md`
  - Tabela de severidade (Critical/High/Medium/Low)
  - Regras de categorização (7 categorias)

### Fase 1.3: Estrutura de Arquivos SDD

- [x] 1.3.1: Verificar que `.openspec/templates/` existe

- [x] 1.3.2: Verificar que `.openspec/root-causes/` foi criado corretamente

---

## Phase 2: Domínio

Implementação das regras de tratamento de erros e integração com o domínio de Qualidade.

### Fase 2.1: Regras de Erro (Domain Model)

- [x] 2.1.1: Documentar entidade `ErrorReport` com atributos:
  - id: UUID
  - description: string
  - severity: Critical | High | Medium | Low
  - reportedAt: DateTime
  - status: open | in_analysis | fixed | closed

- [x] 2.1.2: Documentar entidade `RootCauseAnalysis` com atributos:
  - id: RCA-YYYY-MM-DD-NNN
  - errorReportId: UUID
  - immediateCause: string
  - rootCause: string (5 Whys)
  - category: Code | Config | Infra | Process | Design | Test | Docs
  - testsCreated: TestEvidence[]
  - lessonsLearned: string[]
  - preventiveActions: string[]

- [x] 2.1.3: Documentar Value Object `SeverityTable` com números mínimos de testes:
  - critical: { unit: 3, integration: 2, bdd: 1 }
  - high: { unit: 2, integration: 1, bdd: 1 }
  - medium: { unit: 1, integration: 1, bdd: 0 }
  - low: { unit: 1, integration: 0, bdd: 0 }

### Fase 2.2: Fluxo de Tratamento de Erros

- [x] 2.2.1: Documentar fluxo obrigatório:
  ```
  Erro Reportado → RCA (10 seções) → Classificar Severidade →
  Criar Testes (mínimos por severidade) → Fix → Validação → Archive
  ```

- [x] 2.2.2: Definir linguagem ubíqua (pt-BR):
  - Erro: Falha não planejada no sistema
  - RCA: Root Cause Analysis - Análise de Causa Raiz
  - 5 Whys: Técnica de análise: perguntar "por quê?" 5 vezes
  - Severidade: Impacto do erro (Critical/High/Medium/Low)
  - Testes de Reprodução: Testes que falham antes do fix e passam depois
  - Compliance: Conformidade com o workflow obrigatório

---

## Phase 3: Documentação

Atualização das especificações e documentação existente.

### Fase 3.1: Atualização menulink-rules.md

- [x] 3.1.1: Adicionar nova seção 11 (Fluxo de Tratamento de Erros) em `.openspec/specs/menulink-rules.md`

- [x] 3.1.2: Documentar REQ-ERR-001 a REQ-ERR-006 na seção 11:
  - REQ-ERR-001: RCA obrigatório para todo erro reportado
  - REQ-ERR-002: Template RCA com 10 seções obrigatórias
  - REQ-ERR-003: Testes obrigatórios por severidade (antes do fix)
  - REQ-ERR-004: Validação - todos os testes devem passar
  - REQ-ERR-005: Armazenamento e recuperação de RCA
  - REQ-ERR-006: Integração com fluxo SDD

- [x] 3.1.3: Adicionar tabela de severidade com números mínimos de testes

- [x] 3.1.4: Adicionar 7 categorias de causa raiz

### Fase 3.2: Atualização AGENTS.md (root)

- [x] 3.2.1: Adicionar seção de Fluxo de Tratamento de Erros em `AGENTS.md` (root)

- [x] 3.2.2: Documentar workflow:
  ```
  Erro Reportado → Criar RCA → Classificar Severidade →
  Criar Testes → Aplicar Fix → Verificar → Archive
  ```

- [x] 3.2.3: Referenciar `.openspec/templates/rca-template.md` e `.openspec/root-causes/`

- [x] 3.2.4: Adicionar métricas de compliance (100% RCA)

### Fase 3.3: Verificação de Documentação

- [x] 3.3.1: Verificar que `menulink-rules.md` contém todas as 10 seções originais + nova seção 11

- [x] 3.3.2: Verificar que `AGENTS.md` root menciona o fluxo de erros

- [x] 3.3.3: Verificar que template RCA está acessível em `.openspec/templates/rca-template.md`

- [x] 3.3.4: Verificar que README do root-causes explica o processo

---

## Phase 4: Integração SDD

Integração do fluxo de erros com o pipeline SDD existente.

### Fase 4.1: Integração com Fluxo SDD

- [x] 4.1.1: Documentar que erro reportado cria entrada PRD em `.openspec/backlog/prds/`

- [x] 4.1.2: Garantir que RCA é criado ANTES de qualquer mudança de código

- [x] 4.1.3: Garantir que testes são criados ANTES do fix

- [x] 4.1.4: Documentar integração: `error → PRD → RCA → tests → fix → verification → archive`

### Fase 4.2: Critérios de Aceitação

- [x] 4.2.1: CA-ERR-001: Template RCA existe com 10 seções verificado

- [x] 4.2.2: CA-ERR-002: Diretório root-causes existe com README.md verificado

- [x] 4.2.3: CA-ERR-003: menulink-rules.md contém REQ-ERR-001 a REQ-ERR-006 verificado

- [x] 4.2.4: CA-ERR-004: AGENTS.md root documenta fluxo de erros verificado

- [x] 4.2.5: CA-ERR-005: Métrica 100% RCA compliance documentada

---

## Progresso

████████████████████████████████ 100%

---

## Status

Concluído ✓

---

## Resumo de Entregáveis

| Artefato | Caminho | Status |
|----------|---------|--------|
| Template RCA | `.openspec/templates/rca-template.md` | Concluído |
| Diretório RCA | `.openspec/root-causes/` | Concluído |
| README RCA | `.openspec/root-causes/README.md` | Concluído |
| menulink-rules.md (Seção 11) | `.openspec/specs/menulink-rules.md` | Concluído |
| AGENTS.md (fluxo erros) | `AGENTS.md` (root) | Concluído |

---

## Dependências

Nenhuma — mudança puramente documental/processual.

---

## Riscos e Mitigações

| Risco | Mitigação |
|-------|-----------|
| Não adoção do processo | Incluir na revisão de PR como gate obrigatório |
| RCAs genéricos sem análise real | Template com 5 Whys força profundidade |
| Testes superficiais | Tabela com números mínimos por severidade |

---

**Change ID**: 002-2026-04-17-error-handling-rule
**Author**: AI Agent
**Date**: 2026-04-17
