# AI Development Workflow - MenuLink

## Visão Geral

Documentação de como utilizar o workflow de desenvolvimento com IA no projeto MenuLink.

**Idioma**: Português Brasileiro (pt-BR)
**Paradigma**: SDD (Specification-Driven Development)

---

## Arquitetura Multi-Agente

### Agentes Disponíveis

| Agente | Responsabilidade Principal |
|--------|---------------------------|
| **Orchestrator** | Coordena fluxo SDD, cria branches, gerencia changes |
| **Oracle** | Revisa specs (RFC 2119) e design (arquitetura) |
| **Deep Agent** | Executa tasks, implementa código, cria testes |
| **Coder** | Executa tarefas específicas de código |

### Quando Usar Cada Agente

1. **Orchestrator** → Iniciar nova mudança, arquivar, gerar tasks
2. **Oracle** → Revisar spec antes de implementar, validar design
3. **Deep Agent** → Implementar código seguindo tasks
4. **Coder** → Tarefas técnicas específicas (refatoração, mapear código)

---

## Fluxo SDD Completo

### Passo a Passo

```bash
# 1. PRD.md - Conceber ideia
# 2. Análise - Viabilidade técnica
# 3. proposal.md - Proposta formal com scope
# 4. spec.md - Requisitos RFC 2119
# 5. design.md - Design técnico
# 6. tasks.md - Lista de tarefas
# 7. implementation - Código + Testes + Documentação
# 8. verification - Compliance report
# 9. archive - Consolidado e arquivado
```

### Gates de Aprovação

| Fase | Gate | Responsável |
|------|------|-------------|
| proposal | Análise inicial | Orchestrator |
| spec | Revisão técnica (RFC 2119) | Oracle |
| design | Revisão de arquitetura | Oracle |
| tasks | Verificação de completude | Orchestrator |
| implementation | Testes passam + lint + build | CI/CD |
| verification | Compliance report | Deep Agent |
| archive | Consolidado e arquivado | Tech Lead |

---

## Skills por Agente

### Orchestrator Skills

| Skill | Uso |
|-------|-----|
| `sdd-init` | Inicializar estrutura OpenSpec |
| `sdd-propose` | Criar proposal.md |
| `sdd-tasks` | Gerar tasks.md |
| `sdd-archive` | Arquivar change |
| `requirements-interview` | Descoberta de requisitos |

### Oracle Skills

| Skill | Uso |
|-------|-----|
| `sdd-spec` | Escrever specs RFC 2119 |
| `sdd-design` | Criar design.md |
| `plan-reviewer` | Revisar planos |

### Deep Agent Skills

| Skill | Uso |
|-------|-----|
| `sdd-apply` | Executar tasks SDD |
| `sdd-verify` | Verificar implementação |
| `executing-plans` | Executar checklists |

### Coder Skills

| Skill | Uso |
|-------|-----|
| `cartography` | Mapear estrutura do repositório |
| `sdd-apply` | Implementar código |

---

## Como Iniciar uma Nova Mudança

### 1. Criar diretório da change

```bash
mkdir -p .openspec/changes/minha-mudanca
```

### 2. Usar skill sdd-init (Orchestrator)

```
Carregar skill: sdd-init
Prompt: Bootstrap OpenSpec structure para "nome-da-mudanca"
```

### 3. Seguir fluxo SDD

```
PRD → proposal → spec → design → tasks → implementation → verification → archive
```

### 4. Cada fase tem artefatos específicos

| Fase | Artefato | Localização |
|------|----------|-------------|
| proposal | `proposal.md` | `.openspec/changes/{nome}/` |
| spec | `spec.md` | `.openspec/changes/{nome}/` |
| design | `design.md` | `.openspec/changes/{nome}/` |
| tasks | `tasks.md` | `.openspec/changes/{nome}/` |

---

## Validação e Testes

### Fluxo de Validação

1. **Código**: Build passa, lint passa, testes passam
2. **Documentação**: AGENTS.md existe, BDD com tags @integration-test
3. **Compliance**: REQ-XXX mapeados para evidência

### Limites de Tarefas

Conforme tasks.md da change `ai-development-workflow`:

| Fase | Tarefa | Status |
|------|--------|--------|
| 1 | Infraestrutura de Agentes | ✅ Documentada |
| 2 | Configuração de Plugins | ⚠️ Apenas documentação |
| 3 | Integração OpenAgentsControl | ✅ Documentada |
| 4 | Documentação e Treinamento | ✅ Criada |
| 5 | Testes e Validação | ⚠️ Manual |

### Notas sobre Plugins

- **create-opencode-workflow**: Apenas documentado (instalação futura)
- **opencode-plus**: Apenas documentado (instalação futura)
- Configuração registrada em `opencode.json`

---

## Referências

- `.openspec/AGENTS.md` - Visão geral SDD
- `.openspec/specs/menulink-specification.md` - Regras de negócio
- `.openspec/skills/AGENTS.md` - Skills disponíveis
- `OPENCODE.md` - Configuração OpenCode

---

**Versão**: 1.0
**Última Atualização**: 2026-04-17
**Autor**: AI Agent