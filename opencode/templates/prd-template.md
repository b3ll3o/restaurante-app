# PRD: [Título da Iniciativa]

**Status:** Rascunho
**Autor:** [Nome/Time]
**Data:** [YYYY-MM-DD]
**Última Revisão:** [YYYY-MM-DD]
**Versão:** 2.0

## 0. Objetivos de Negócio

- **Objetivo 1:** [Descrição]
- **Objetivo 2:** [Descrição]
- **Objetivo 3:** [Descrição]

## 1. Problema

[Descrição do problema que esta mudança resolve. Foco no "o quê" e "por quê".]

## 2. Oportunidade

[A oportunidade identificada e como a solução proposta a endereça.]

## 3. Personas e Stakeholders

### 3.1 Personas Primárias

- **Persona 1:** [Nome]
  - [Descrição do perfil e necessidades]
- **Persona 2:** [Nome]
  - [Descrição do perfil e necessidades]

### 3.2 Stakeholders Impactados

- [Lista de stakeholders afetados]

## 4. Resultado Esperado (Alto Nível)

[O que se espera alcançar. Seja mensurável se possível.]

### 4.1 Fora do Escopo

- [Item que NÃO está incluído]
- [Item que NÃO está incluído]

## 5. Critérios de Sucesso

### 5.1 Critérios de Aceitação do Produto (Checklist)

- [ ] **CRIT-01:** [Critério verificável]
- [ ] **CRIT-02:** [Critério verificável]

### 5.2 Métricas de Sucesso (KPIs)

- **KPI-01:** [Métrica com target]
- **KPI-02:** [Métrica com target]

## 6. Backlog Inicial (Épicos e Histórias de Usuário)

### Épico 1: [Nome do Épico]

- **História 1.1:** Como um [ator], eu quero [ação] para que [benefício].
  - *Critérios de Aceitação (Given-When-Then):*
    - **Dado** que [contexto], **Quando** [ação], **Então** [resultado esperado].

## 7. Análise Inicial

### 7.1 Viabilidade Técnica

- [X] Viável com arquitetura atual?
- [X] Módulos/Serviços afetados?
- [X] Débitos técnicos bloqueantes?

### 7.2 Impacto Estimado

- [X] Breaking changes?
- [X] Migração necessária?
- [X] Novos dependencies?

### 7.3 Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
| :--- | :--- | :--- | :--- |
| [Risco] | [Alta/Média/Baixa] | [Alto/Médio/Baixo] | [Mitigação] |

### 7.4 Dependências Externas

- [Lista de dependências externas]

## 8. Urgência e Justificativa

- [X] **Alta** - Alto impacto no negócio
- **Justificativa:** [Justificativa da urgência]

## 9. Instruções para Orquestração de Agentes (se aplicável)

- **Comando de Início:** [Comando ou arquivo que inicia o fluxo]
- **Pipeline Esperado:** [Descrição do fluxo de agentes]
- **Contexto Obrigatório:** [Arquivos que os agentes devem ler]
- **Práticas Obrigatórias:** [INVEST, TDD, etc.]

## 10. Definição de Pronto (DoR e DoD)

### 10.1 Definition of Ready (DoR)

Uma história está "pronta" quando:

- [ ] Formato: "Como um [ator], eu quero [ação] para que [benefício]"
- [ ] Atende critérios INVEST
- [ ] Critérios de aceitação em Given-When-Then
- [ ] Estimada pelo time
- [ ] Sem dependências bloqueantes

### 10.2 Definition of Done (DoD)

Uma tarefa está "pronta" quando:

- [ ] Código implementado e revisado
- [ ] Testes passando
- [ ] Cobertura >= 85%
- [ ] Segue padrões em AGENTS.md
- [ ] Documentação atualizada
- [ ] Change arquivada no OpenSpec

## 11. Referências

- **Template PRD:** Este documento
- **Issues Relacionadas:** [links]
- **Documentação:** [links]