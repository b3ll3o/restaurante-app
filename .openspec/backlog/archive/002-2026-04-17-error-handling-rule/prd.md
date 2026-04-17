# PRD: 002 - Regra de Tratamento de Erros com Causa Raiz e Testes

**ID:** 002-2026-04-17-error-handling-rule
**Status:** draft
**Phase:** prompt
**Autor:** AI Agent
**Data:** 2026-04-17
**Última Revisão:** 2026-04-17

---

## 0. Objetivos de Negócio

- **Objetivo 1:** Garantir que erros não se repitam
- **Objetivo 2:** Criar rastreabilidade de erros → causa raiz → correção → testes
- **Objetivo 3:** Melhorar continuamente a qualidade do código

---

## 1. Problema

### 1.1 Descrição do Problema

Erros são reportados, corrigidos, mas podem se repetir porque:
- Não há análise formal de causa raiz
- Não há testes específicos para prevenir recorrência
- Falta documentação da causa raiz para futura referência

### 1.2 Contexto

Fluxo atual:
1. Erro é reportado
2. Desenvolvedor corrige rapidamente
3. Ninguém garante que não vai acontecer de novo

Fluxo desejado:
1. Erro é reportado
2. Análise de causa raiz é criada
3. Testes são escritos (unitários, integração, BDD)
4. Correção é aplicada
5. Testes validam que erro não ocorre mais
6. Causa raiz documentada para referência futura

---

## 2. Oportunidade

Criar um processo sistemático onde:
- Todo erro vira uma oportunidade de melhorar
- Testes impedem recorrência
- Conhecimento é documentado e compartilhado

---

## 3. Regra: Fluxo de Tratamento de Erros

### 3.1 Quando Aplicar

Esta regra se aplica quando:
- Um bug/erro é reportado por usuário ou QA
- Um erro é descoberto em produção ou desenvolvimento
- Um erro aparece em logs ou监控系统

### 3.2 Fluxo Obrigatório

```
ERRO REPORTADO
      │
      ▼
┌─────────────────┐
│ CAUSA RAIZ      │  ← Análise obrigatória
│ (Root Cause)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ TESTES          │  ← Testes para prevenir
│ (Unit/Int/BDD) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ CORREÇÃO        │  ← Fix que passa nos testes
│ (Fix)           │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ VALIDAÇÃO       │  ← Testes passam
│ (Verification)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ DOCUMENTAÇÃO   │  ← Causa raiz + solução
│ (Documentation)│   documentadas
└─────────────────┘
```

---

## 4. Template: Análise de Causa Raiz

### 4.1 Estrutura

```markdown
# Análise de Causa Raiz: [Título do Erro]

**ID:** RCA-{YYYY-MM-DD}-{序号}
**Data:** {YYYY-MM-DD}
**Reportado por:** {nome}
**Severity:** {critical/high/medium/low}

---

## 1. Descrição do Erro

[Descrição clara do que aconteceu]

## 2. Impacto

- **Usuários afetados:** {quantidade}
- **Funcionalidade impactada:** {descrição}
- **Receita/Operação impactada:** {sim/não + descrição}

## 3. Linha do Tempo

| Horário | Evento |
|---------|--------|
| HH:MM | Erro ocorreu |
| HH:MM | Erro reportado |
| HH:MM | Investigação iniciada |
| HH:MM | Correção aplicada |

## 4. Causa Raiz

### 4.1 Causa Imediata

[O que causou o erro diretamente]

### 4.2 Causa Raiz (5 Porquês)

```
Porquê 1: [fato]
Porquê 2: [fato]
Porquê 3: [fato]
Porquê 4: [fato]
Porquê 5: [fato - causa raiz]
```

### 4.3 Categoria da Causa Raiz

- [ ] Código - bug no código
- [ ] Configuração - erro em config
- [ ] Infraestrutura - problema de infraestrutura
- [ ] Process - processo inadequado
- [ ] Design - falha de arquitetura
- [ ] Testes - falta/insuficiência de testes
- [ ] Documentação - docs desatualizadas

## 5. Testes Criados

### 5.1 Testes Unitários

| Teste | Módulo | Cobertura |
|-------|--------|-----------|
| {nome} | {módulo} | { % } |

### 5.2 Testes de Integração

| Teste | Módulo | Validação |
|-------|--------|-----------|
| {nome} | {módulo} | {descrição} |

### 5.3 Cenários BDD

| Cenário | Feature | Critério |
|---------|---------|----------|
| {nome} | {feature} | {critério} |

## 6. Correção Aplicada

[Descrição da correção de código]

```typescript
// Código antes (se aplicável)
[trecho]

// Código depois
[trecho]
```

## 7. Lições Aprendidas

1. [Lição 1]
2. [Lição 2]

## 8. Ação Preventiva

[ação para evitar que erro se repita]

---

**Investigado por:** {nome}
**Data de encerramento:** {YYYY-MM-DD}
**Status:** Fechado
```

---

## 5. Critérios de Aceitação

### 5.1 Regra Obrigatória

- [ ] Todo erro reportado deve ter Análise de Causa Raiz
- [ ] Todo erro deve ter pelo menos 1 teste prevenindo recorrência
- [ ] Causa raiz deve ser documentada em lugar permanente

### 5.2 Testes Mínimos

| Severidade | Unitários | Integração | BDD |
|------------|-----------|-----------|-----|
| Critical | ≥ 3 | ≥ 2 | ≥ 1 |
| High | ≥ 2 | ≥ 1 | ≥ 1 |
| Medium | ≥ 1 | ≥ 1 | 0 |
| Low | ≥ 1 | 0 | 0 |

---

## 6. Localização da Documentação

```
.openspec/
├── root-causes/                    # Causas raiz
│   ├── rca-001-2026-04-17-email-conf.md
│   ├── rca-002-2026-04-17-xxx.md
│   └── ...
├── tests/
│   ├── unit/                     # Testes unitários
│   ├── integration/               # Testes de integração
│   └── e2e/                      # Testes E2E
└── backlog/
    └── prds/                     # PRD do erro (linkado)
```

---

## 7. Integração com SDD

O PRD do erro deve fazer parte do backlog:

1. Erro reportado → cria PRD no backlog
2. PRD entra em requirements-interview
3. Análise de causa raiz é parte do interview
4. Correção segue fluxo SDD normal

---

## 8. Métricas

| Métrica | Target | Descrição |
|---------|--------|-----------|
| Erros com RCA | 100% | % de erros com análise de causa raiz |
| Testes por erro | ≥ 1 | Testes criados por erro reportado |
| Recorrência de erro | 0 | Mesmo erro não deve se repetir |

---

## 9. Prompt Original

> [criar uma regra que toda vez que for reportado um erro, deve ser criado os cenários de testes que compoem o erro e validar se a alteração solucionou o erro e também deve ser feita uma análise de causa raiz do erro e documentada para que não ocorra novamente, testes unitários, integração, cenários bdd são essenciais para que erros não aconteçam mais de 1 vez]

---

## 10. Histórico

| Data | Fase | Status | Notas |
|------|------|--------|-------|
| 2026-04-17 | prompt | done | Regra proposta |

---

**Última Atualização:** 2026-04-17
**Status:** Proposta
