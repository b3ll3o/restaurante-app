# Design: [Nome da Mudança]

## Fonte da Verdade

Este documento é parte das especificações do PediAi.

---

## Technical Approach

[Descrição da abordagem técnica adotada. Como a mudança será implementada?]

---

## Architecture Decisions

### Decision: [Título da Decisão]

**Choice**: [Escolha feita]

**Alternatives considered**:
- [Alternativa 1] - [por que foi descartada]
- [Alternativa 2] - [por que foi descartada]

**Rationale**: [Justificativa da escolha]

---

## Estratégia de Qualidade e Design de Código

### TDD (Test-Driven Development)

- **Cobertura mínima**: [X]% de cobertura de linhas
- **Branches críticos**: [X]% de cobertura
- **Ferramentas**: Vitest
- **Estratégia de Mock/Stub**: [Descrição de como isolar dependências]

### BDD (Behavior-Driven Development)

- **Cenários Gherkin**: [Lista ou referência aos arquivos .feature]
- **Ferramenta**: Playwright
- **Cobertura E2E**: 100% dos fluxos críticos
- **Localização**: Arquivos `.feature` no nível do módulo que documentam

### ATDD (Acceptance Test-Driven Development)

- **Critérios de aceitação**: [Por tarefa, derivados do spec.md]
- **Checklist QA**: [Descrição dos testes exploratórios, segurança, performance]

### DDD (Domain-Driven Design)

- **Bounded Context**: [Diagrama ou descrição]
- **Agregados**: [Lista de agregados identificados]
- **Entidades**: [Lista de entidades]
- **Value Objects**: [Lista de value objects]
- **Linguagem Ubíqua**: [Termos de domínio usados]

---

## Data Flow

[Diagrama ou descrição do fluxo de dados. Como a informação flui através do sistema?]

```
[Diagrama em texto ou Mermaid]
```

---

## File Changes

### Arquivos a Criar

| Arquivo | Descrição |
|---------|-----------|
| [caminho/arquivo] | [descrição] |

### Arquivos a Modificar

| Arquivo | Modificação |
|---------|-------------|
| [caminho/arquivo] | [descrição] |

### Arquivos a Deletar

| Arquivo | Razão |
|---------|-------|
| [caminho/arquivo] | [razão] |

---

## Interfaces / Contratos

### API Endpoints (se aplicável)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | /api/recurso | Lista recursos | [Sim/Não] |
| POST | /api/recurso | Cria recurso | [Sim/Não] |

### Componentes (se aplicável)

| Componente | Props | Descrição |
|------------|-------|-----------|
| [Nome] | [props] | [descrição] |

---

## Testing Strategy

### Testes Unitários
- [Descrição da estratégia de testes unitários]
- [O que deve ser testado]

### Testes de Integração
- [Descrição da estratégia de testes de integração]
- [Cenários BDD relacionados via @integration-test]

### Testes E2E
- [Descrição da estratégia de testes E2E]
- [Fluxos críticos cobertos]

---

## Migration / Rollout

### Fase 1: [Nome]
[Descrição da primeira fase de rollout]

### Fase 2: [Nome]
[Descrição da segunda fase]

### Rollback
[Como reverter a mudança se necessário]

---

## Open Questions

1. [Questão 1] - [Status: Aberta/Respondida]
2. [Questão 2] - [Status: Aberta/Respondida]

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| [nome] | [versão] | [uso] |

---

## Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| [risco] | [Alta/Média/Baixa] | [Alto/Médio/Baixo] | [mitigação] |

---

**Versão**: 1.0
**Data**: [YYYY-MM-DD]
**Autor**: [Nome]