# Skills SDD - MenuLink

## Visão Geral

Este diretório contém a documentação dos skills disponíveis para cada agente no fluxo SDD do MenuLink.

**Idioma**: Português Brasileiro (pt-BR)

---

## Estrutura de Skills

| Skill | Agente | Arquivo |
|-------|--------|---------|
| `sdd-init` | Orchestrator | Bootstrap OpenSpec structure |
| `sdd-propose` | Orchestrator | Criar proposal.md |
| `sdd-spec` | Oracle | Escrever specs RFC 2119 |
| `sdd-design` | Oracle | Criar design.md |
| `sdd-tasks` | Orchestrator | Gerar tasks.md |
| `sdd-apply` | Deep Agent | Executar tasks SDD |
| `sdd-verify` | Deep Agent | Verificar implementação |
| `sdd-archive` | Orchestrator | Arquivar change |
| `plan-reviewer` | Oracle | Revisar planos |
| `requirements-interview` | Orchestrator | Descoberta de requisitos |
| `executing-plans` | Deep Agent | Executar tarefas |
| `cartography` | Coder | Mapear repositório |

---

## Habilidades por Agente

### Orchestrator

- **sdd-init**: Inicializar estrutura OpenSpec
- **sdd-propose**: Criar proposta formal
- **sdd-tasks**: Decompor em tarefas
- **sdd-archive**: Arquivar mudança concluída
- **requirements-interview**: Descoberta de requisitos

### Oracle

- **sdd-spec**: Escrever especificações RFC 2119
- **sdd-design**: Documentar design técnico
- **plan-reviewer**: Revisar planos para blockers

### Deep Agent

- **sdd-apply**: Executar tarefas SDD
- **sdd-verify**: Verificar conformidade
- **executing-plans**: Executar checklists

### Coder

- **cartography**: Gerar codemap do repositório
- **sdd-apply**: Implementar código

---

## Localização

Skills estão registrados em: `/home/leo/.config/opencode/skills/`

**Versão**: 1.0
**Última Atualização**: 2026-04-17