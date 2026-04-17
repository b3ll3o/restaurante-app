# Backlog de Demandas

## Resumo

| #  | Data       | Título                          | Fase     | Status       |
|----|------------|--------------------------------|----------|--------------|
| 003 | 2026-04-17 | Landing Pages Segmentadas       | SDD      | done         |
| 004 | 2026-04-17 | Testes de Interface com Relatório | SDD  | done         |
| 005 | 2026-04-17 | String Constants Refactor       | SDD      | done         |
| 006 | 2026-04-17 | Data Security Protection       | SDD      | done         |
| 007 | 2026-04-17 | CSS Mobile-First Responsividade | SDD      | done         |
| 008 | 2026-04-17 | Supabase Env Build Fix         | SDD      | done         |

## Pipeline Visual

```
PROMPT     ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  -
INTERVIEW  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  -
PRD        ░░░░░░░░░░░░░░░░░░░  -
SDD        ░░░░░░░░░░░░░░░░░░░  -
DONE       ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  6 PRDs
```

## Estrutura de Pastas

```
backlog/
├── AGENTS.md              # Regras e padrões do backlog
├── README.md              # Visão geral do fluxo backlog → SDD
├── backlog.md             # Índice unificado de todos os PRDs/Changes
├── prds/                  # PRDs em andamento (vazio - todos arquivados)
├── archive/               # PRDs concluídos/rejeitados
│   └── {order}-{date}-{slug}/
│       └── prd.md
└── templates/             # Templates de PRD
    └── backlog-prd-template.md
```

## Changes (SDD - Em Andamento)

### Changes Arquivadas

| ID | Título | Commit | Status |
|----|--------|--------|--------|
| 001 | Email Confirmation Auth Issue | - | ✅ Arquivada |
| 002 | Error Handling Rule | - | ✅ Arquivada |
| 003 | Landing Pages Segmentadas | `16de575` | ✅ Arquivada |
| 004 | Interface Tests Report | `16de575` | ✅ Arquivada |
| 005 | String Constants Refactor | `16de575` | ✅ Arquivada |
| 006 | Data Security Protection | `16de575` | ✅ Arquivada |
| 007 | CSS Mobile-First Responsividade | `16de575` | ✅ Arquivada |
| 008 | Supabase Env Build Fix | `16de575` | ✅ Arquivada |
| 009 | PWA Icons Fix | `16de575` | ✅ Arquivada |

## PRDs Arquivados

Consulte `.openspec/backlog/archive/` para ver os PRDs arquivados.

### PRDs Recentes (Arquivados)

| #  | Data       | Título                          | Status | Archive |
|----|------------|--------------------------------|--------|---------|
| 003 | 2026-04-17 | Landing Pages Segmentadas       | done | [Ver](./archive/003-2026-04-17-landing-pages-segmentadas/) |
| 004 | 2026-04-17 | Testes de Interface com Relatório | done | [Ver](./archive/004-2026-04-17-interface-tests-report/) |
| 005 | 2026-04-17 | String Constants Refactor       | done | [Ver](./archive/005-2026-04-17-string-constants-refactor/) |
| 006 | 2026-04-17 | Data Security Protection       | done | [Ver](./archive/006-2026-04-17-data-security/) |
| 007 | 2026-04-17 | CSS Mobile-First Responsividade | done | [Ver](./archive/007-2026-04-17-mobile-css-fix/) |
| 008 | 2026-04-17 | Supabase Env Build Fix         | done | [Ver](./archive/008-2026-04-17-supabase-env-build-fix/) |
| 009 | 2026-04-17 | PWA Icons Fix                 | done | [Ver](./archive/009-2026-04-17-pwa-icons-fix/) |

## Fluxo de Arquivamento

```
PRD (prds/) → Approved → SDD (changes/) → Concluído → PRD Arquivado (backlog/archive/)
     │                           │
     │                           └──────────────────┐
     │                                          │
     ▼                                          ▼
Rejeitado                                  Commit feito
(archive/rejected/)                        + PRD movido para
                                           backlog/archive/
```

**REGRA (AGENTS.md):** TODO PRD DEVE ser arquivado após conclusão da change SDD.
Consulte `.openspec/backlog/AGENTS.md` para as regras completas.

## Regras do Backlog

Consulte [AGENTS.md](./AGENTS.md) para as regras completas do backlog.

## Como Criar Nova Demandas

1. Criar PRD em `.openspec/backlog/prds/`
2. Executar requirements-interview
3. Aprovar PRD (approved)
4. Criar change em `.openspec/changes/`
5. Executar pipeline SDD
6. **ARQUIVAR PRD** (REGRA CRÍTICA)

## Últimas Atualizações

| Data | Ação | Commit |
|------|------|--------|
| 2026-04-17 | PRDs 003-009 implementados e arquivados | `16de575` |

---

**Última atualização:** 2026-04-17
**Total de PRDs arquivados:** 9
**Changes ativas:** 0