# Proposta: backlog-workflow

## Problema

O projeto MenuLink precisa de um fluxo estruturado onde:
1. Ideias são **trabalhadas** via requirements-interview
2. PRD é **enriquecido** com perguntas e respostas
3. PRD é **completo e rico** antes de entrar em desenvolvimento

## Solução Proposta

Criar fluxo de **backlog com requirements-interview**:

1. **Prompt do usuário** → **Requirements Interview** → **PRD Rico** → **SDD** → **Done**
2. **Perguntas estruturadas** para esclarecer dúvidas
3. **Alternativas e trade-offs** explorados
4. **PRD completo** seguindo template rico

## Impacto
- [ ] Breaking changes? **Não**
- [ ] Migração necessária? **Sim** - criar estrutura de backlog
- [ ] Novos dependencies? **Não**

## Alternativas Consideradas

| Alternativa | Por que Descartada |
|-------------|-------------------|
| Prompt → PRD direto | PRD rasos, sem exploration |
| Sem processo de interview | Falta clareza sobre requisitos |

## Urgência
- [x] Alta

## Scope

### In
- Criar `.openspec/backlog/prds/` com estrutura
- Criar template de PRD rico (perguntas, alternativas, trade-offs)
- Criar fluxo de requirements-interview
- Criar `backlog.md` como índice unificado
- Definir gates de qualidade (DoR, DoD)

### Out
- NÃO implementar scripts de automação
- NÃO criar dashboard visual

## Fluxo Detalhado

```
IDEA (prompt)
    ↓
REQUIREMENTS INTERVIEW (perguntas + respostas)
    ↓
PRD REFINADO (template rico)
    ↓
APPROVED (usuário aprova)
    ↓
SDD (proposal → spec → design → tasks → apply → verify)
    ↓
DONE
```

## Estrutura

```
.openspec/backlog/
├── prds/
│   ├── 001-2026-04-17-exemplo.md
│   └── ...
├── backlog.md        # Índice unificado
└── README.md        # Guia do fluxo
```

## Template de PRD

O PRD deve incluir:
- Objetivos de negócio
- Problema detalhado com evidências
- Oportunidade com benefícios
- Personas e stakeholders
- Alternativas consideradas
- Trade-offs documentados
- Riscos e mitigações
- Requirements interview (Q&A)
- Prompt original preservado

## Success Criteria

- [ ] Estrutura `.openspec/backlog/prds/` criada
- [ ] Template de PRD rico definido
- [ ] Fluxo de requirements-interview documentado
- [ ] `backlog.md` com índice unificado
- [ ] Gates de qualidade definidos

## Status

Proposta
