# Backlog - MenuLink

## Visão Geral

O módulo **Backlog** contém os Product Requirements Documents (PRDs) que ainda não entraram no fluxo SDD. É o primeiro passo do pipeline de desenvolvimento, onde ideias são capturadas, refinadas via requirements-interview, e então promovidas a changes quando estiverem prontas.

**Idioma**: Português Brasileiro (pt-BR)
**Paradigma**: Requirements-Driven Development + SDD

---

## Estrutura de Diretórios

```
.openspec/backlog/
├── README.md              # Este arquivo (visão geral + regras)
├── backlog.md             # Índice unificado de todos os PRDs
├── AGENTS.md              # Regras e padrões do backlog (este arquivo)
├── prds/                  # PRDs em andamento
│   └── {order}-{date}-{slug}/
│       └── prd.md         # PRD rico com interview, trade-offs, critérios
├── archive/               # PRDs concluídos/rejeitados
│   └── {order}-{date}-{slug}/
│       └── prd.md
└── landing-pages-segmentadas.md  # Link para PRD da change em progresso
```

---

## Fluxo de Vida do Backlog

```
IDEA → PROMPT → PRD (draft) → INTERVIEW → PRD (approved) → SDD → DONE
                   │                    │
                   ▼                    ▼
               Rejeitado            Change criada
                   │                    │
                   ▼                    ▼
               archive/             .openspec/changes/
```

### Estados do PRD

| Estado | Descrição | Ação |
|--------|-----------|------|
| `draft` | PRD recém-criado, precisa de interview | Aguardar requirements-interview |
| `in-interview` | Interview em progresso | Completar perguntas e respostas |
| `approved` | PRD completo e aprovado | Criar change em `.openspec/changes/` |
| `rejected` | PRD não aprovado ou descartado | Mover para `archive/` |
| `done` | PRD convertido para change | Mover para `archive/` |

---

## Regras do Backlog (REGRA CRÍTICA)

### REGRA 1: Todo PRD deve passar por Requirements Interview

**Antes de criar uma change, o PRD DEVE ter:**
- [ ] Pelo menos 3 perguntas de clarification respondidas
- [ ] 1 pergunta de trade-off explorada
- [ ] Contexto, evidências e critérios de aceite definidos

**Perguntas obrigatórias do interview:**
1. **Scope** - O que está dentro e fora do escopo?
2. **Clarification** - Detalhes específicos do problema
3. **Trade-off** - Alternativas consideradas e justificativa da escolha

### REGRA 2: PRD deve ser rico antes de virar Change

**Um PRD é considerado "pronto" quando:**
- [ ] Todos os campos do template estão preenchidos
- [ ] Seção "Análise Técnica" está completa (viabilidade confirmada)
- [ ] Critérios de aceite são verificáveis (CA-01, CA-02, etc.)
- [ ] Estimativa de effort está preenchida
- [ ] Prioridade calculada (score RICE ou similar)

### REGRA 3: Conversão PRD → Change

**Para criar uma change a partir de um PRD:**

1. Criar diretório em `.openspec/changes/{change-name}/`
2. Copiar/mover proposal, spec, design, tasks conforme pipeline
3. Atualizar `backlog.md` para mover o PRD de "em andamento" para "concluído"
4. O change-id no PRD deve referenciar a change criada

### REGRA 4: PRDs Rejeitados

**Um PRD pode ser rejeitado quando:**
- [ ] Não é viável tecnicamente
- [ ] Não se alinha com estratégia do produto
- [ ] Escopo muito vago ou irrealista
- [ ] Dependências bloqueantes não resolvidas

**Ao rejeitar:**
1. Mover para `archive/{id}-rejected/prd.md`
2. Adicionar razão da rejeição no histórico
3. Manter para referência futura

### REGRA 5: backlog.md é fonte da verdade

**O arquivo `backlog.md` deve listar TODOS os PRDs:**
- Em andamento (draft, in-interview, approved)
- Concluídos (done, rejected)

**Formato da tabela:**
```markdown
| #  | Data       | Título                          | Fase     | Status       |
|----|------------|--------------------------------|----------|--------------|
| 001 | 2026-04-17 | Email Confirmation Auth Issue   | PRD      | in-interview |
```

### REGRA 6: Arquivamento obrigatório de PRDs (REGRA CRÍTICA)

**TODO PRD DEVE ser arquivado quando:**
1. ✅ **Concluído (done)**: Change criada e implementada com sucesso
2. ❌ **Rejeitado (rejected)**: PRD não aprovado, inviável ou descartado

**Fluxo de Arquivamento:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLUXO DE ARQUIVAMENTO DO BACKLOG                         │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
  │ PRD Draft   │───▶│ PRD Approved│───▶│ Change SDD  │
  │ (prds/)    │    │ (prds/)     │    │ (changes/)  │
  └─────────────┘    └─────────────┘    └─────────────┘
                                                 │
                         ┌───────────────────────┘
                         │
                         ▼
  ┌─────────────────────────────────────────────────────────────┐
  │                    APÓS CONCLUSÃO DA CHANGE                  │
  │  1. SDD completo (proposal → spec → design → tasks →      │
  │     implementation → verification → archive)                 │
  │  2. Commit com todas as mudanças feito                    │
  │  3. PRD original em prds/ deve ser ARQUIVADO              │
  └─────────────────────────────────────────────────────────────┘
                         │
                         ▼
  ┌─────────────────────────────────────────────────────────────┐
  │              BACKLOG ARCHIVE (obrigatório)                   │
  │                                                              │
  │  De: .openspec/backlog/prds/{id}/prd.md                    │
  │  Para: .openspec/backlog/archive/{id}-{date}-{slug}/prd.md  │
  │                                                              │
  │  OU (se rejeitado):                                         │
  │  Para: .openspec/backlog/archive/{id}-rejected/prd.md       │
  └─────────────────────────────────────────────────────────────┘
```

**Procedimento de Arquivamento (ao concluir PRD):**

1. **Verificar se change foi criada:**
   ```bash
   # Change existe em .openspec/changes/?
   ls .openspec/changes/{change-id}/
   ```

2. **Mover PRD para archive:**
   ```bash
   # Concluído
   mkdir -p .openspec/backlog/archive/{id}-{date}-{slug}
   mv .openspec/backlog/prds/{id}-{date}-{slug}/prd.md \
      .openspec/backlog/archive/{id}-{date}-{slug}/prd.md
   
   # Rejeitado
   mkdir -p .openspec/backlog/archive/{id}-rejected
   mv .openspec/backlog/prds/{id}-{date}-{slug}/prd.md \
      .openspec/backlog/archive/{id}-rejected/prd.md
   ```

3. **Atualizar `backlog.md`:**
   - Remover da seção "PRDs em Andamento"
   - Adicionar à seção "PRDs Arquivados" com status `done` ou `rejected`

4. **Adicionar ao PRD arquivado:**
   ```markdown
   ## Histórico de Fases
   
   | Data | Fase | Status | Notas |
   |------|------|--------|-------|
   | YYYY-MM-DD | prompt | done | ... |
   | YYYY-MM-DD | approved | done | Change criada |
   | YYYY-MM-DD | SDD | done | Implementado |
   | YYYY-MM-DD | archive | done | Movido para backlog/archive |
   ```

### REGRA 7: Checklist de Arquivamento (OBRIGATÓRIO)

**Antes de fechar uma change SDD, verificar:**

- [ ] PRD foi movido de `prds/` para `backlog/archive/`
- [ ] `backlog.md` atualizado (PRD removido da lista ativa)
- [ ] Status do PRD em `backlog.md` = `done` ou `rejected`
- [ ] Commit menciona "archive PRD {id}"

**REGRA DE OURO:** O backlog NUNCA deve ter PRDs "órfãos" - PRDs que:
- Viraram changes mas não foram arquivados
- Foram rejeitados mas não foram movidos para rejected/

### REGRA 8: Prazo de Arquivamento

| Situação | Prazo Máximo |
|----------|--------------|
| Change SDD concluída | Arquivar PRD imediatamente após commit |
| PRD rejeitado | Arquivar no mesmo dia da rejeição |
| PRD "concluído" sem change | Investigar - não deve acontecer |

**REGRA:** Arquivar PRDs é **OBRIGATÓRIO**, não opcional. O backlog limpo é sinal de disciplina de processo.

---

## Template de PRD

Todo PRD deve seguir o template padrão:

```markdown
# PRD: {order} - {Título}

**ID:** {order}-{YYYY-MM-DD}-{slug}
**Status:** draft | in-interview | approved | rejected | done
**Phase:** prompt
**Autor:** {nome}
**Data:** {YYYY-MM-DD}
**Última Revisão:** {YYYY-MM-DD}

---

## 0. Objetivos de Negócio
- **Objetivo 1:** [Descrição]

## 1. Problema
### 1.1 Descrição
### 1.2 Contexto
### 1.3 Evidências

## 2. Oportunidade
### 2.1 Oportunidade
### 2.2 Benefícios Esperados

## 3. Personas e Stakeholders
## 4. Resultado Esperado
### 4.1 Descrição
### 4.2 Critérios de Aceitação (CA-01, CA-02...)
### 4.3 fora do Escopo

## 5. Alternativas Consideradas
## 6. Trade-offs e Riscos
## 7. Análise Técnica
## 8. Estimativas
## 9. Requirements Interview (Q&A)
## 10. Prompt Original

---

## Histórico de Fases

| Data | Fase | Status | Notas |
|------|------|--------|-------|
| YYYY-MM-DD | prompt | done | ... |
```

---

## Métricas do Backlog

| Métrica | Target | Descrição |
|---------|--------|-----------|
| PRDs com interview completo | 100% | Todo PRD approved deve ter interview |
| Tempo em draft | ≤ 2 dias | PRDs velhos indicam problemas |
| Conversão PRD → Change | ≥ 80% | Taxa de PRDs que viram changes |
| Cobertura de CA | 100% | Todo CA deve ser verificável |

---

## Boas Práticas

### Como escrever um bom PRD

1. **Seja específico** - Evite termos vagos como "melhorar" ou "otimizar"
2. **Use dados** - Evidências quantificadas são mais fortes que intuição
3. **Defina scope claro** - O que NÃO está included é tão importante quanto o que está
4. **Critérios verificáveis** - "CA-01: Taxa de conversão > 10%" é melhor que "CA-01: Aumentar conversão"

### Como fazer um bom Requirements Interview

1. **Comece com clarification** - Entenda o problema fundo
2. **Explore trade-offs** - "E se fizéssemos X ao invés de Y?"
3. **Valide suposições** - "Você mencionou A, isso significa que B também é verdade?"
4. **Documente respostas** - Preserve o contexto da decisão

### Como priorizr PRDs

Use a fórmula RICE:
- **Reach** (Alcance): Quantos usuários serão impactados?
- **Impact** (Impacto): Quanto isso move o needle?
- **Confidence** (Confiança): Quão certo estamos da estimativa?
- **Effort** (Esforço): Quanto tempo (em semanas/meses)?

Score = (Reach × Impact × Confidence) / Effort

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| requirements-interview skill | - | Framework de interview |
| sdd-propose skill | - | Criar proposal a partir de PRD |
| sdd-spec skill | - | Criar spec a partir de proposal |

---

## Referências

- [Requirements Interview Skill](../.config/opencode/skills/requirements-interview/SKILL.md)
- [SDD Proposal Skill](../.config/opencode/skills/sdd-propose/SKILL.md)
- [Template PRD](./templates/backlog-prd-template.md)
- [.openspec/AGENTS.md](../AGENTS.md) - Visão geral do SDD
- [.openspec/changes/AGENTS.md](../changes/AGENTS.md) - Regras das changes

---

**Versão**: 1.0
**Última Atualização:** 2026-04-17
**Autor:** AI Agent