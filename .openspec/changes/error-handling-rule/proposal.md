# Proposta: error-handling-rule

**ID:** 002-2026-04-17-error-handling-rule  
**Change:** error-handling-rule  
**PRD:** `.openspec/backlog/prds/002-2026-04-17-error-handling-rule/prd.md`  
**Autor:** AI Agent  
**Data:** 2026-04-17  
**Status:** Proposta  

---

## Problema

Erros são reportados e corrigidos, mas podem se repetir porque:

- **Sem análise formal de causa raiz**: O desenvolvedor corrige o sintoma sem investigar a origem real do problema.
- **Sem testes de prevenção**: Nenhum teste é criado especificamente para garantir que o erro não ocorra novamente.
- **Sem documentação**: A causa raiz não é registrada, impossibilitando aprendizado futuro e rastreabilidade.

**Fluxo atual (problemático)**:
```
Erro reportado → Correção rápida → Ninguém garante que não recorre
```

**Fluxo desejado**:
```
Erro reportado → Análise de causa raiz → Testes criados → Correção aplicada → Validação → Documentação
```

---

## Solução Proposta

Criar um **fluxo obrigatório de tratamento de erros** que inclua:

### 1. Análise de Causa Raiz (RCA — Root Cause Analysis)

Toda vez que um erro for reportado, **DEVE** ser criado um documento de análise de causa raiz usando a técnica dos **5 Porquês**, classificando a categoria (Código, Configuração, Infraestrutura, Processo, Design, Testes, Documentação).

### 2. Testes Obrigatórios por Severidade

Antes de aplicar a correção, **DEVEM** ser escritos testes que reproduzem o erro:

| Severidade | Unitários | Integração | BDD |
|------------|-----------|------------|-----|
| Critical   | ≥ 3       | ≥ 2        | ≥ 1 |
| High       | ≥ 2       | ≥ 1        | ≥ 1 |
| Medium     | ≥ 1       | ≥ 1        | 0   |
| Low        | ≥ 1       | 0          | 0   |

### 3. Correção (Fix)

A correção é aplicada **após** os testes, garantindo que os testes que falhavam (reproduzindo o erro) passem após a correção.

### 4. Validação

Todos os testes criados **DEVEM** passar. Testes de regressão existentes **NÃO DEVEM** quebrar.

### 5. Documentação Permanente

A análise de causa raiz **DEVE** ser armazenada em `.openspec/root-causes/` com um identificador único (`RCA-YYYY-MM-DD-NNN`) para consulta futura.

### Template RCA

Será criado o template `.openspec/templates/rca-template.md` com a estrutura:
- Descrição do erro
- Impacto (usuários, funcionalidade, receita)
- Linha do tempo
- Causa imediata e causa raiz (5 Porquês)
- Categoria da causa raiz
- Testes criados (unitários, integração, BDD)
- Correção aplicada
- Lições aprendidas
- Ação preventiva

---

## Scope

### In Scope

- Template de análise de causa raiz (`rca-template.md`)
- Diretório de causas raiz (`.openspec/root-causes/`)
- Regras obrigatórias documentadas na spec e no `AGENTS.md`
- Integração com o fluxo SDD existente (PRD → RCA → tests → fix → archive)
- Atualização das regras de qualidade (`menulink-rules.md`)

### Out of Scope

- Ferramenta de automação de RCA
- Integração com sistemas externos de monitoramento (Sentry, Datadog)
- Dashboard de métricas de erros
- Alertas automáticos

---

## Impacto

- **Breaking changes?** Não — nenhuma API ou contrato de código muda.
- **Migração necessária?** Não — erros existentes não precisam ser retroativamente analisados.
- **Novos dependencies?** Não — mudança de processo e documentação apenas.
- **Módulos afetados:** `.openspec/` (specs, templates, root-causes), `AGENTS.md` raiz.
- **Comportamento do sistema:** Nenhuma alteração no software em execução.

---

## Alternativas Consideradas

### Alternativa 1: Correção rápida sem RCA

**Descrição**: Manter o fluxo atual — desenvolvedor corrige o bug sem análise formal.

**Por que foi descartada**: Não resolve o problema central. Erros continuam recorrendo porque a causa raiz nunca é identificada e não há testes de prevenção.

### Alternativa 2: Post-mortem sem testes

**Descrição**: Criar documento de post-mortem após cada erro, mas sem a obrigatoriedade de testes.

**Por que foi descartada**: Documentação sem testes não previne recorrência. Um erro documentado que não possui teste associado pode voltar a acontecer em refatorações futuras. A combinação RCA + testes é o que garante que o conhecimento se torne proteção real no código.

### Alternativa 3: Apenas testes, sem RCA

**Descrição**: Obrigar testes de regressão para cada bug, sem análise formal de causa raiz.

**Por que foi descartada**: Sem entender a causa raiz, os testes podem cobrir o sintoma mas não o problema real. Além disso, perde-se o valor de aprendizado que a RCA oferece para o time.

---

## Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Time achar o processo burocrático e pular a RCA | Média | Alto | RCA é curta (template estruturado), não um relatório extenso |
| Dificuldade em classificar severidade | Baixa | Médio | Tabela de critérios de severidade incluída no template |
| Acúmulo de RCAs sem revisão | Baixa | Baixo | Diretório versionado em Git com histórico |

---

## Rollback Plan

Por ser uma mudança de processo e documentação (sem código de produção alterado), o rollback é trivial: remover ou ignorar o template e o diretório `root-causes`. Nenhum sistema é afetado.

---

## Critérios de Sucesso

- [ ] Template `rca-template.md` criado e disponível em `.openspec/templates/`
- [ ] Diretório `.openspec/root-causes/` criado com `README.md` explicativo
- [ ] Regra documentada em `.openspec/specs/menulink-rules.md` (REQ-ERR-*)
- [ ] `AGENTS.md` raiz atualizado com o fluxo de tratamento de erros
- [ ] Fluxo SDD integrado: erro → PRD no backlog → RCA → tests → fix → archive
- [ ] Métrica definida: 100% dos erros reportados com RCA

---

## Urgência

- [ ] Crítica  
- [x] **Alta** — Diretamente relacionada à qualidade do produto e prevenção de regressões  
- [ ] Média  
- [ ] Baixa  

---

## Próximos Passos

1. Aprovação desta proposta
2. Criação de `spec.md` com requisitos RFC 2119 (REQ-ERR-001 a REQ-ERR-006)
3. Criação de `design.md` com estrutura de diretórios e template RCA
4. Criação de `tasks.md` com tarefas de implementação
5. Implementação (criação de templates, dirs, atualização de specs)
6. Verificação e archive

---

**Última Atualização:** 2026-04-17  
**Autor:** AI Agent  
**Status:** Proposta
