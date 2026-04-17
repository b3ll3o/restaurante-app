# Pipelines - MenuLink

## Visão Geral

**IMPORTANTE**: A documentação completa de pipelines está centralizada em `.openspec/specs/menulink-rules.md` (Seção 9 - Fluxos Procedimentais).

Este arquivo é um índice resumido para referência rápida.

**Idioma**: Português Brasileiro (pt-BR)

---

## Índice de Pipelines

| Pipeline | Descrição | Documentação Completa |
|----------|-----------|----------------------|
| **SDD** | Specification-Driven Development | [.openspec/AGENTS.md](./.openspec/AGENTS.md) |
| **CI/CD** | GitHub Actions (lint, build, test) | [.github/workflows/ci.yml](../.github/workflows/ci.yml) |
| **Post-Archive** | Revisão pós-archive | [.openspec/templates/post-archive-review-template.md](./.openspec/templates/post-archive-review-template.md) |
| **RCA** | Error Handling | [.openspec/AGENTS.md](./.openspec/AGENTS.md) - Seção Error Handling |
| **PRD Fix** | Bug Fix PRD Flow | [.openspec/backlog/AGENTS.md](./.openspec/backlog/AGENTS.md) - REGRA 4B |
| **Quality Gates** | Pre-commit checks | [AGENTS.md](./AGENTS.md) - Gates de Qualidade |

---

## Fluxo SDD Resumido

```
PRD → proposal → spec → design → tasks → implementation → verification → archive → post-archive
```

### Gates de Aprovação

| Fase | Gate | Responsável |
|------|------|-------------|
| proposal | Scope definido | Orchestrator |
| spec | Revisão RFC 2119 | Oracle |
| design | Revisão arquitetura | Oracle |
| tasks | Completude | Orchestrator |
| implementation | CI/CD | CI/CD |
| verification | Compliance | Deep Agent |
| archive | Consolidado | Tech Lead |

---

## Referências

- [AGENTS.md](./AGENTS.md) - Visão geral do projeto
- [.openspec/AGENTS.md](./.openspec/AGENTS.md) - SDD workflow
- [.openspec/specs/menulink-rules.md](./.openspec/specs/menulink-rules.md) - **FONTE CENTRALIZADA** de regras

---

**Versão**: 1.0
**Última Atualização**: 2026-04-17
**Autor**: AI Agent