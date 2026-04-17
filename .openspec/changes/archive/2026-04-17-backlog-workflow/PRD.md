# PRD: backlog-workflow - Sistema de Backlog com Requirements Interview

**Status:** Rascunho
**Autor:** AI Agent
**Data:** 2026-04-17

---

## 1. Problema / Oportunidade

O projeto MenuLink precisa de um fluxo onde ideias são **trabalhadas** até estarem prontas para implementação:
1. Ideia brutal → Interview → PRD Refinado → SDD → Implementação
2. O PRD deve ser o mais rico possível antes de entrar em desenvolvimento
3. Perguntas e esclarecimentos são parte do processo

### Problema Atual

- Ideias são implementadas sem questionamento suficiente
- PRDs são rasos e não capturam todos os detalhes
- Falta exploration das alternativas e trade-offs
- Decisões são tomadas tarde no processo

### Oportunidade

Criar um fluxo de **requirements-interview** onde:
- Toda ideia passa por questionamento estruturado
- PRD é enriquecido com insights, alternativas e trade-offs
- Decisões são tomadas early com informação completa

---

## 2. Visão do Fluxo Integrado

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLUXO: IDEA → PRD → SDD → DONE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────┐    ┌──────────────┐    ┌─────────┐    ┌─────────┐          │
│  │  IDEA   │───▶│ REQUIREMENTS │───▶│   PRD   │───▶│   SDD   │          │
│  │(prompt) │    │  INTERVIEW   │    │(refined)│    │(proposal│          │
│  └─────────┘    └──────────────┘    └─────────┘    └─────────┘          │
│       │              │                   │              │                 │
│       │              ▼                   ▼              ▼                 │
│       │         ┌──────────┐       ┌─────────┐    ┌─────────┐          │
│       │         │QUESTIONS │       │ APPROVED│    │ TASKS   │          │
│       │         │& ANSWERS │       │         │    │ & APPLY │          │
│       │         └──────────┘       └─────────┘    └─────────┘          │
│       │                                                    │               │
│       ▼                                                    ▼               │
│  ┌─────────┐                                        ┌─────────┐          │
│  │REFINED  │                                        │  DONE   │          │
│  │ OR      │                                        │         │          │
│  │REJECTED │                                        │         │          │
│  └─────────┘                                        └─────────┘          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Modelo de Dados

### 3.1 PRD (Product Requirements Document)

```typescript
interface PRD {
  id: string;                    // Formato: {order:3d}-{YYYY-MM-DD}-{slug}
  order: number;                 // 001, 002, 003...
  date: string;                  // YYYY-MM-DD
  slug: string;                 // Slug do título
  title: string;                 // Título
  promptOriginal: string;       // Ideia original do usuário
  status: 'draft' | 'in-interview' | 'refined' | 'approved' | 'in-progress' | 'done' | 'rejected';
  source: 'user' | 'ai';
  createdAt: string;
  updatedAt: string;
  changeId?: string;
}
```

### 3.2 Interview Record

```typescript
interface Interview {
  prdId: string;
  questions: Question[];
  answers: Answer[];
  notes: string;
  timestamp: string;
}

interface Question {
  id: string;
  text: string;
  type: 'clarification' | 'tradeoff' | 'alternative' | 'scope' | 'priority';
  status: 'pending' | 'answered' | 'skipped';
}

interface Answer {
  questionId: string;
  text: string;
  timestamp: string;
}
```

---

## 4. Fluxo Detalhado: Requirements Interview

### Fase 1: IDEA (Prompt Inicial)

```
[Usuário envia ideia/prompt]
     ↓
PRD criado com status "draft"
     ↓
promptOriginal registrado
     ↓
Status: "in-interview"
```

### Fase 2: REQUIREMENTS INTERVIEW

```
Eu faço perguntas ao usuário:
     ↓
┌─────────────────────────────────────────────────────────────┐
│                    TIPOS DE PERGUNTAS                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. CLARIFICATION - Esclarecer o que foi dito             │
│     "O que você quer dizer com X?"                         │
│     "Pode dar um exemplo de X?"                            │
│                                                              │
│  2. SCOPE - Definir o escopo                              │
│     "Isso deve incluir X ou apenas Y?"                      │
│     "Qual a prioridade: X ou Y?"                           │
│                                                              │
│  3. ALTERNATIVE - Explorar alternativas                    │
│     "Você considerou fazer X em vez de Y?"                  │
│     "Quais são as outras formas de resolver isso?"          │
│                                                              │
│  4. TRADEOFF - Entender trade-offs                         │
│     "Se adicionarmos X, perdemos Y. Isso é aceitável?"      │
│     "Entre simplicidade e flexibilidade, qual prefere?"      │
│                                                              │
│  5. PRIORITY - Entender prioridades                        │
│     "Como você priorizaria X vs Y?"                        │
│     "O que é mais crítico para o usuário?"                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
     ↓
Usuário responde
     ↓
Republicar PRD com respostas incorporadas
     ↓
Repetir até que não haja mais dúvidas
     ↓
Status: "refined"
```

### Fase 3: PRD REFINADO

```
PRD agora contém:
     ↓
- Descrição clara do problema
- Oportunidade identificada
- Personas e stakeholders
- Resultado esperado detalhado
- Critérios de aceitação completos
- Alternativas consideradas
- Trade-offs documentados
- Scope definido (in e out)
- Estimativas de esforço
- Riscos e mitigações
     ↓
Status: "approved"
```

### Fase 4: SDD (Desenvolvimento)

```
PRD approved
     ↓
Proposal → Spec → Design → Tasks → Apply → Verify
     ↓
Status: "in-progress" → "done"
```

---

## 5. Estrutura de Diretórios

```
.openspec/
├── backlog/
│   ├── prds/                    # PRDs numerados
│   │   ├── 001-2026-04-17-melhorar-validacao-whatsapp.md
│   │   ├── 002-2026-04-17-adicionar-notificacao-push.md
│   │   └── ...
│   ├── backlog.md               # Índice unificado
│   └── README.md               # Guia do fluxo
├── changes/                     # Changes SDD
└── specs/                      # Especificações
```

---

## 6. Template de PRD ( Rico e Completo )

```markdown
# PRD: {order} - {Título}

**ID:** {order}-{YYYY-MM-DD}-{slug}
**Status:** {status}
**Phase:** {phase}
**Autor:** {autor}
**Data:** {YYYY-MM-DD}
**Última Revisão:** {YYYY-MM-DD}

---

## 0. Objetivos de Negócio

- **Objetivo 1:** [Descrição clara do objetivo de negócio]
- **Objetivo 2:** [Descrição]
- **Objetivo 3:** [Descrição]

## 1. Problema

### 1.1 Descrição do Problema

[Descrição detalhada do problema que esta mudança resolve. Quem é afetado? Com que frequência? Qual o impacto?]

### 1.2 Contexto

[Qual o contexto que levou a este problema? Eventos recentes? Mudanças?]

### 1.3 Evidências

- [Evidência 1: screenshots, dados, feedback de usuários]
- [Evidência 2]
- [Evidência 3]

## 2. Oportunidade

### 2.1 Oportunidade Identificada

[A oportunidade que esta mudança endereça. Como isso beneficia o negócio?]

### 2.2 Benefícios Esperados

| Benefício | Métrica | Valor Atual | Valor Esperado |
|-----------|---------|-------------|---------------|
| [Benefício 1] | [Métrica] | [Atual] | [Esperado] |
| [Benefício 2] | [Métrica] | [Atual] | [Esperado] |

## 3. Personas e Stakeholders

### 3.1 Personas Primárias

- **Persona 1:** [Nome/Perfil]
  - **Papel no problema:** [Descrição]
  - **Necessidades:** [Lista]
  - **Dores:** [Lista]

### 3.2 Personas Secundárias

- **Persona 2:** [Nome/Perfil]
  - **Papel:** [Descrição]

### 3.3 Stakeholders Impactados

| Stakeholder | Impacto | Comunicação |
|-------------|---------|-------------|
| [Nome] | [Impacto] | [Como comunicar] |

## 4. Resultado Esperado

### 4.1 Descrição do Resultado

[Descrição em alto nível do que se espera alcançar]

### 4.2 Critérios de Aceitação

- [ ] **CA-01:** [Critério verificável e testável]
- [ ] **CA-02:** [Critério verificável e testável]
- [ ] **CA-03:** [Critério verificável e testável]

### 4.3 fora do Escopo

**NÃO está Included:**
- [Item 1]
- [Item 2]

**Explicitamente fora:**
- [Item 3]

## 5. Alternativas Consideradas

### 5.1 Alternativa A: [Nome]

**Descrição:** [Descrição da alternativa]

**Prós:**
- [Prós]

**Contras:**
- [Contras]

**Por que foi descartada:** [Justificativa]

### 5.2 Alternativa B: [Nome]

[Mesma estrutura]

### 5.3 Alternativa Escolhida

**Justificativa:** [Por que esta alternativa foi escolhida]

## 6. Trade-offs

### 6.1 Trade-offs Conhecidos

| Trade-off | Opção A | Opção B | Decisão | Justificativa |
|-----------|---------|---------|---------|---------------|
| [Trade-off 1] | [Opção A] | [Opção B] | [Decisão] | [Justificativa] |

### 6.2 Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| [Risco 1] | [Alta/Média/Baixa] | [Alto/Médio/Baixo] | [Mitigação] |

## 7. Análise Técnica

### 7.1 Viabilidade Técnica

- [X] Viável com arquitetura atual?
- [X] Módulos/Serviços afetados?
- [X] Débitos técnicos bloqueantes?

### 7.2 Impacto Técnico

- [ ] Breaking changes?
- [ ] Migração necessária?
- [ ] Novos dependencies?

### 7.3 Módulos Afetados

| Módulo | Impacto | Mudanças Necessárias |
|--------|---------|---------------------|
| [Módulo 1] | [Alto/Médio/Baixo] | [Mudanças] |

## 8. Estimativas

### 8.1 Effort

| Tamanho | XS | S | M | L | XL |
|---------|----|----|----|----|----|
| Estimativa | [horas] | | | | |

### 8.2 Prioridade

| Critério | Valor | Peso | Score |
|----------|-------|------|-------|
| Value (1-10) | [x] | [w] | [v*w] |
| Urgency (1-10) | [x] | [w] | [u*w] |
| Confidence (0.5-1) | [x] | [w] | [c*w] |
| Effort (1-10) | [x] | [w] | [e*w] |
| **TOTAL** | | | **(V+U+C)/E** |

## 9. Requirements Interview

### 9.1 Perguntas e Respostas

#### Q1: [Pergunta de Clarificação]
- **Tipo:** clarification
- **Data:** YYYY-MM-DD
- **Resposta:** [Resposta do usuário]

#### Q2: [Pergunta de Escopo]
- **Tipo:** scope
- **Data:** YYYY-MM-DD
- **Resposta:** [Resposta do usuário]

#### Q3: [Pergunta de Trade-off]
- **Tipo:** tradeoff
- **Data:** YYYY-MM-DD
- **Resposta:** [Resposta do usuário]

### 9.2 Resumo do Interview

[Pares de perguntas e respostas mais relevantes]

## 10. Prompt Original

> [Ideia original do usuário, preservada integralmente]

## 11. Rastreabilidade

| Campo | Valor |
|-------|-------|
| Change ID | [change-id] |
| Commit | [commit-hash] |
| Sprint | [sprint-number] |

## 12. Histórico de Fases

| Data | Fase | Status | Notas |
|------|------|--------|-------|
| YYYY-MM-DD | prompt | done | Prompt recebido |
| YYYY-MM-DD | interview | done | X perguntas respondidas |
| YYYY-MM-DD | prd | approved | PRD aprovado |
| YYYY-MM-DD | sdd | done | Implementação concluída |
```

---

## 7. Índice do Backlog (backlog.md)

```markdown
# Backlog de Demandas

## Resumo
| #  | Data       | Título                          | Fase         | CA's | Status |
|----|------------|--------------------------------|--------------|------|--------|
| 001| 2026-04-17| Melhorar validação WhatsApp     | interview    | 3    | in-progress |
| 002| 2026-04-17| Adicionar notificação push       | prd         | 5    | draft |
| 003| 2026-04-18| Corrigir bug checkout           | sdd         | 2    | approved |
| 004| 2026-04-18| Criar dashboard analytics       | prompt      | 0    | draft |
| 005| 2026-04-19| Refatorar estrutura de testes   | done        | 4    | done |

## Pipeline Visual

```
PROMPT     ████░░░░░░░░░░░░░░░░  004
INTERVIEW  ████████░░░░░░░░░░░░  001
PRD        ████░░░░░░░░░░░░░░░░  002
SDD        ████████████░░░░░░░░░░  003
DONE       ████░░░░░░░░░░░░░░░░  005
```

## PRDs em Draft/In-Interview

### 001 - Melhorar validação WhatsApp
- **Fase:** interview
- **Perguntas pendentes:** 2
- **Última atualização:** 2026-04-17
```

---

## 8. Gates de Qualidade

| Fase | Gate | Critério | Responsável |
|------|------|----------|-------------|
| prompt → interview | - | Ideia registrada | Sistema |
| interview → prd | DoR | Min 3 perguntas respondidas, alternativas consideradas | Orchestrator |
| prd → approved | Review | PRD completo com todos os campos | Usuário |
| approved → sdd | SDD Gate 1 | Proposal aprovado | Oracle |
| sdd → done | DoD | Build + Tests + Coverage ≥80% | Deep Agent |

---

## 9. Métricas

| Métrica | Target | Descrição |
|---------|--------|-----------|
| Perguntas por PRD | ≥ 5 | Riqueza do interview |
| Tempo interview | < 24h | Por PRD |
| PRDs approved | 100% | Com todas as seções |
| Tempo prompt → done | < 14 dias | Ciclo completo |

---

## 10. Urgência

- [x] Alta

---

## 11. Próximos Passos

1. [ ] Aprovar PRD
2. [ ] Criar estrutura `.openspec/backlog/prds/`
3. [ ] Criar template de PRD rico
4. [ ] Implementar fluxo de requirements-interview
5. [ ] Criar backlog.md com índice

---

## 12. Referências

- `.openspec/templates/prd-template.md`
- `.openspec/AGENTS.md`
- Skill: `requirements-interview`
