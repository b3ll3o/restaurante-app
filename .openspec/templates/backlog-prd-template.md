# PRD: {order} - {Título}

**ID:** {order}-{YYYY-MM-DD}-{slug}
**Status:** draft
**Phase:** prompt
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

**Justificativa:** [Por que esta alternativa foi escolhido]

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

- [ ] Viável com arquitetura atual?
- [ ] Módulos/Serviços afetados?
- [ ] Débitos técnicos bloqueantes?

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
