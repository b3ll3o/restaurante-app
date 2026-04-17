# Backlog de Demandas

## Resumo

| #  | Data       | Título                          | Fase     | Status       |
|----|------------|--------------------------------|----------|--------------|
| 001 | 2026-04-17 | Email Confirmation Auth Issue   | SDD      | in-progress  |
| 002 | 2026-04-17 | Regra de Tratamento de Erros     | SDD      | in-progress  |
| 003 | 2026-04-17 | Landing Pages Segmentadas       | PRD      | draft        |
| 004 | 2026-04-17 | Testes de Interface com Relatório | PRD      | draft        |
| 005 | 2026-04-17 | String Constants Refactor       | PRD      | draft        |

## Pipeline Visual

```
PROMPT     ░░░░░░░░░░░░░░░░░░░  -
INTERVIEW  ░░░░░░░░░░░░░░░░░░░  -
PRD        ░░░░░░░░░░░░░░░░░░░  -
SDD        ░░░░░░░░░░░░░░░░░░░  -
DONE       ░░░░░░░░░░░░░░░░░░░  -
```

## Estrutura de Pastas

```
backlog/
├── AGENTS.md              # Regras e padrões do backlog
├── README.md              # Visão geral do fluxo backlog → SDD
├── backlog.md             # Índice unificado de todos os PRDs/Changes
├── prds/                  # PRDs em andamento (antes de SDD)
│   └── {order}-{date}-{slug}/
│       └── prd.md
├── archive/               # PRDs concluídos/rejeitados
│   └── {order}-{date}-{slug}/
│       └── prd.md
└── templates/             # Templates de PRD
    └── backlog-prd-template.md
```

## Changes (SDD em progresso)

### Changes (SDD em progresso)
- `001-2026-04-17-email-conf-auth-issue` — [Ver Change](../changes/email-conf-auth-issue/) ⚙️ Config-only
- `002-2026-04-17-error-handling-rule` — [Ver Change](../changes/error-handling-rule/) 📋 Process

### PRDs (Backlog)
- `003-2026-04-17-landing-pages-segmentadas` — [Ver PRD](./prds/003-2026-04-17-landing-pages-segmentadas/prd.md)
- `004-2026-04-17-interface-tests-report` — [Ver PRD](./prds/004-2026-04-17-interface-tests-report/prd.md)
- `005-2026-04-17-string-constants-refactor` — [Ver PRD](./prds/005-2026-04-17-string-constants-refactor/prd.md)

## Regras do Backlog

Consulte [AGENTS.md](./AGENTS.md) para as regras completas do backlog.

## Últimos PRDs/Changes

Use `cat .openspec/backlog/prds/{id}/prd.md` para ver detalhes de PRDs.
Use `cat .openspec/changes/{change-name}/tasks.md` para ver progresso de Changes.

---

**Última atualização:** 2026-04-17
**Total de PRDs:** 5 (2 PRDs backlog + 3 Changes SDD)