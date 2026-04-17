# Design: error-handling-rule

## Technical Approach

Implementação de fluxo obrigatório de tratamento de erros com RCA (Root Cause Analysis), testes obrigatórios por severidade, e documentação estruturada. Esta mudança é primariamente **processual/DDD** - não adiciona código de produção, mas estabelece workflow de qualidade.

---

## Architecture Decisions

### Decision 1: Estrutura de Diretórios para RCA

**Choice**: Criar `.openspec/templates/rca-template.md` e `.openspec/root-causes/`

**Alternatives considered**:
- Armazenar RCAs no mesmo diretório de changes: rejeitado - mistura artefatos de processo com mudanças ativas
- Usar sistema de tickets externo: rejeitado - fragmentaria a documentação

**Rationale**: O `.openspec/` é a fonte da verdade para processos SDD. RCAs são artefatos de qualidade, não de implementação, e devem residir junto às specs.

---

### Decision 2: Template RCA com 10 Seções Obrigatórias

**Choice**: Template com seções fixas (descrição, impacto, timeline, causa imediata, 5 Whys, categoria, testes, fix, lições, preventivas)

**Alternatives considered**:
- Template minimalista: rejeitado - não garante análise profunda
- Template muito extenso: rejeitado - criaria atrito na adoção

**Rationale**: As 10 seções equilibram completude com praticidade. O formato 5 Whys é padrão da indústria para RCA.

---

### Decision 3: Classificação de Categoria em 7 Tipos

**Choice**: Código, Configuração, Infraestrutura, Processo, Design, Testes, Documentação

**Alternatives considered**:
- Categorias genéricas (técnico/não-técnico): rejeitado - muito vago para trending
- Categorias بسیار زیاد (muitas): rejeitado - complicaria a análise

**Rationale**: As 7 categorias cobrem todas as fontes comuns de erros em projetos full-stack Next.js/Supabase.

---

### Decision 4: Tabela de Testes por Severidade

**Choice**: Matriz fixa Critical/High/Medium/Low com números mínimos de testes

**Alternatives considered**:
- Definir por tecnologia (unit/integration/e2e): rejeitado - complexidade desnecessária
- Usar apenas "testes suficientes": rejeitado - subjetivo, não mensurável

**Rationale**: Números mínimos objetivamente verificáveis. Critical requer mais cobertura porque tem maior impacto.

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              FLUXO DE TRATAMENTO DE ERROS (OBRIGATÓRIO)                    │
└─────────────────────────────────────────────────────────────────────────────┘

Erro Reportado
       │
       ▼
┌──────────────────────┐
│ Criar RCA no template│ ──► .openspec/root-causes/RCA-YYYY-MM-DD-NNN.md
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
│ Verification          │
│ (compliance report)   │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│ Archive               │ ──► .openspec/changes/archive/YYYY-MM-DD-error-handling/
└──────────────────────┘
```

---

## File Changes

### Novos Arquivos (Criar)

| Arquivo | Descrição |
|---------|-----------|
| `.openspec/templates/rca-template.md` | Template RCA com 10 seções obrigatórias |
| `.openspec/root-causes/README.md` | Guia de uso do processo RCA |
| `.openspec/root-causes/.gitkeep` | Placeholder para diretório |

### Arquivos Modificados

| Arquivo | Mudança |
|---------|---------|
| `.openspec/specs/menulink-rules.md` | Adicionar seção 10 com REQ-ERR-001 a REQ-ERR-006 |
| `AGENTS.md` (root) | Adicionar seção de Fluxo de Tratamento de Erros |

### Arquivos de Mudança SDD

| Arquivo | Descrição |
|---------|-----------|
| `.openspec/changes/error-handling-rule/design.md` | Este documento |

---

## DDD Integration (Process/Domain)

Este é um **process DDD change** - define workflow, não código. Integra-se ao DDD existente através de:

### Bounded Context: Qualidade de Software

```
┌─────────────────────────────────────────────────────────────┐
│              Bounded Context: QUALIDADE                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Entity: ErrorReport                                        │
│    - id: UUID                                               │
│    - description: string                                     │
│    - severity: Critical | High | Medium | Low                │
│    - reportedAt: DateTime                                    │
│    - status: open | in_analysis | fixed | closed           │
│                                                             │
│  Entity: RootCauseAnalysis                                  │
│    - id: RCA-YYYY-MM-DD-NNN                                 │
│    - errorReportId: UUID                                     │
│    - immediateCause: string                                 │
│    - rootCause: string (5 Whys)                            │
│    - category: Code | Config | Infra | Process | Design | Test | Docs │
│    - testsCreated: TestEvidence[]                            │
│    - lessonsLearned: string[]                               │
│    - preventiveActions: string[]                           │
│                                                             │
│  Value Object: SeverityTable                                │
│    - critical: { unit: 3, integration: 2, bdd: 1 }         │
│    - high: { unit: 2, integration: 1, bdd: 1 }            │
│    - medium: { unit: 1, integration: 1, bdd: 0 }          │
│    - low: { unit: 1, integration: 0, bdd: 0 }            │
│                                                             │
│  Aggregate: ErrorManagement                                 │
│    - createRCA(error): RCA                                  │
│    - validateTests(rca, severity): boolean                  │
│    - trackCompliance(): ComplianceMetric                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Ubiquitous Language (pt-BR)

| Termo | Definição |
|-------|-----------|
| Erro | Falha não planejada no sistema |
| RCA | Root Cause Analysis - Análise de Causa Raiz |
| 5 Whys | Técnica de análise: perguntar "por quê?" 5 vezes |
| Severidade | Impacto do erro (Critical/High/Medium/Low) |
| Testes de Reprodução | Testes que falham antes do fix e passam depois |
| Compliance | Conformidade com o workflow obrigatório |

---

## Testing Strategy

### TDD (Test-Driven Development)

**Não aplicável**: Este change não adiciona código de produção. Testes são *artefatos obrigatórios do processo*, não de TDD.

### BDD (Behavior-Driven Development)

**Cenários Gherkin** (arquivos `.feature`):

| Arquivo | Módulo | Cenários |
|---------|--------|----------|
| `error-handling.feature` | `.openspec/` | 6 cenários derivados de REQ-ERR-001 a REQ-ERR-006 |

**Tag**: `@integration-test="tests/integration/error-handling.test.ts"`

### ATDD (Acceptance Test-Driven Development)

| Critério de Aceitação | Evidência |
|---------------------|-----------|
| CA-ERR-001 | `.openspec/templates/rca-template.md` existe com 10 seções |
| CA-ERR-002 | `.openspec/root-causes/` existe com README.md e RCAs seguem padrão |
| CA-ERR-003 | `menulink-rules.md` contém REQ-ERR-001 a REQ-ERR-006 |
| CA-ERR-004 | `AGENTS.md` (root) documenta fluxo de erros |
| CA-ERR-005 | Métrica de 100% RCA compliance documentada |

### QA Checklist

- [ ] Template RCA foi criado corretamente
- [ ] README do root-causes explica o processo
- [ ] menulink-rules.md foi atualizado sem remover regras existentes
- [ ] AGENTS.md foi atualizado com novo fluxo
- [ ] Nenhum código de produção foi modificado

---

## Migration / Rollback

### Migração
1. Criar `.openspec/templates/rca-template.md`
2. Criar `.openspec/root-causes/` com `README.md`
3. Atualizar `.openspec/specs/menulink-rules.md` (append da nova seção)
4. Atualizar `AGENTS.md` (append do novo fluxo)

### Rollback
- Remover `.openspec/templates/rca-template.md` se não houver RCA criado
- Remover `.openspec/root-causes/` se vazio
- Reverter modificações em `menulink-rules.md` e `AGENTS.md`

### Breaking Changes
- Nenhum: mudança puramente processual/documental

---

## Open Questions

| Pergunta | Resposta |
|----------|----------|
| Onde armazenar métricas de compliance? | Na seção de qualidade do `menulink-rules.md` |
| Como rastrear RCAs automaticamente? | Por enquanto manual; automação fica para futuro |
| Quem é responsável por validar RCA? | Tech Lead / Reviewer no gate de verification |
| RCAs antigos precisam ser retroativos? | Não; a regra vale para erros reportados após a data de vigência |

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| Nenhuma | - | Change puramente documental |

---

## Risks and Mitigations

| Risco | Mitigação |
|-------|-----------|
| Não adoção do processo pela equipe | Incluir na revisão de PR como gate obrigatório |
| RCAs genéricos sem análise real | Template com 5 Whys força profundidade |
| Testes superficiais | Tabela com números mínimos por severidade |
| Acúmulo de RCAs sem ação | Preventive actions são seção obrigatória |

---

**Change ID**: 002-2026-04-17-error-handling-rule  
**Status**: Design  
**Author**: AI Agent  
**Date**: 2026-04-17
