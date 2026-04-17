# Backlog de Demandas - MenuLink

## Visão Geral

Este diretório contém o backlog de PRDs do projeto MenuLink. Cada PRD representa uma ideia ou demanda que passa pelo fluxo de requirements-interview antes de ser aprovada para desenvolvimento.

**Idioma**: Português Brasileiro (pt-BR)

---

## Estrutura de Diretórios

```
backlog/
├── prds/                           # PRDs individuais (demandas)
│   └── {order}-{date}-{slug}/      # Ex: 001-2026-04-17-exemplo/
│       └── prd.md                  # O PRD em si
├── backlog.md                      # Índice unificado
├── archive/                        # PRDs concluídos/rejeitados
│   └── {order}-{date}-{slug}/     # Mesma estrutura do prds/
└── README.md                       # Este arquivo
```

**Nota**: A estrutura segue o mesmo padrão de `.openspec/changes/`.

---

## Nomenclatura de PRDs

**Formato pasta**: `{order:3d}-{YYYY-MM-DD}-{slug}/`
**Formato arquivo**: `prd.md`

**Exemplos**:
```
backlog/prds/001-2026-04-17-melhorar-validacao-whatsapp/prd.md
backlog/prds/002-2026-04-17-adicionar-notificacao-push/prd.md
backlog/prds/003-2026-04-18-corrigir-bug-checkout/prd.md
```

**Benefícios**:
- Ordenação alfabética = ordem de criação
- Data visível no nome da pasta
- Slug identifica o conteúdo rapidamente
- Mesma estrutura das changes ( fácil navegação)

---

## Fluxo de Trabalho

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

### Descrição das Fases

| Fase | Descrição | Status Possible |
|------|-----------|----------------|
| **prompt** | Ideia bruta recebida | draft |
| **interview** | Requirements interview em andamento | in-interview |
| **prd** | PRD refinado e completo | draft → approved |
| **sdd** | Entrou no fluxo SDD | in-progress → done |
| **done** | Implementação concluída | done |
| **rejected** | PRD rejeitado na triagem | rejected |

---

## Requirements Interview

### Tipos de Perguntas

Durante o requirements interview, eu farei perguntas para:

1. **CLARIFICATION** - Esclarecer o que foi dito
   - "O que você quer dizer com X?"
   - "Pode dar um exemplo de X?"

2. **SCOPE** - Definir o escopo
   - "Isso deve incluir X ou apenas Y?"
   - "Qual a prioridade: X ou Y?"

3. **ALTERNATIVE** - Explorar alternativas
   - "Você considerou fazer X em vez de Y?"
   - "Quais são as outras formas de resolver isso?"

4. **TRADEOFF** - Entender trade-offs
   - "Se adicionarmos X, perdemos Y. Isso é aceitável?"
   - "Entre simplicidade e flexibilidade, qual prefere?"

5. **PRIORITY** - Entender prioridades
   - "Como você priorizaria X vs Y?"
   - "O que é mais crítico para o usuário?"

### Critérios para PRD Completo

Um PRD está pronto para aprovação quando:
- [ ] Mínimo 3 perguntas respondidas
- [ ] Alternativas consideradas
- [ ] Trade-offs documentados
- [ ] Scope definido (in e out)
- [ ] Critérios de aceitação claros
- [ ] Estimativa de effort feita

---

## Gates de Qualidade

| Fase | Gate | Critério | Responsável |
|------|------|----------|-------------|
| prompt → interview | - | Ideia registrada | Sistema |
| interview → prd | DoR | Min 3 perguntas, alternativas consideradas | Orchestrator |
| prd → approved | Review | PRD completo com todos os campos | Usuário |
| approved → sdd | SDD Gate 1 | Proposal aprovado | Oracle |
| sdd → done | DoD | Build + Tests + Coverage ≥80% | Deep Agent |

---

## Métricas

| Métrica | Target | Descrição |
|---------|--------|-----------|
| Perguntas por PRD | ≥ 5 | Riqueza do interview |
| Tempo interview | < 24h | Por PRD |
| PRDs approved | 100% | Com todas as seções |
| Tempo prompt → done | < 14 dias | Ciclo completo |

---

## Template de PRD

O template de PRD está em: `.openspec/templates/backlog-prd-template.md`

---

## Como Usar

### Ver backlog

```bash
# Ver índice
cat .openspec/backlog/backlog.md

# Listar PRDs
ls -la .openspec/backlog/prds/

# Ver PRD específico
cat .openspec/backlog/prds/001-2026-04-17-exemplo/prd.md
```

### Criar novo PRD (via prompt)

Quando você enviar uma ideia/prompt:
1. Eu crio a pasta `prds/{order}-{date}-{slug}/`
2. Crio `prd.md` dentro com status "in-interview"
3. Faço perguntas para esclarecer
4. Trabalhamos até o PRD estar completo
5. Você aprova o PRD
6. Entra no fluxo SDD (cria change em `changes/`)

---

## Referências

- `.openspec/AGENTS.md` - Visão geral do SDD
- `.openspec/templates/backlog-prd-template.md` - Template de PRD
- `.openspec/changes/` - Changes em andamento (mesma estrutura)
