# Changes - PediAi

## Visão Geral

Controle de mudanças do projeto PediAi seguindo o fluxo OpenSpec (SDD - Specification-Driven Development).

**Idioma**: Português Brasileiro (pt-BR)

---

## Estrutura de Diretórios

```
changes/
├── README.md           # Guia de controle de mudanças
├── AGENTS.md           # Este arquivo - regras e padrões
└── {change-name}/      # Diretório da mudança ativa
    ├── proposal.md     # Proposta inicial
    ├── spec.md         # Especificação formal (full pipeline)
    ├── design.md       # Design técnico (full pipeline)
    ├── tasks.md        # Lista de tarefas
    ├── verify-report.md # Relatório de verificação
    └── status.md       # Status da mudança (opcional)
```

---

## Padrão de Organização de Archives

**REGRA CRÍTICA**: Usar `YYYY-MM-DD-{change-name}` - diretório com hífen, não barra.

```
archive/
└── YYYY-MM-DD-{change-name}/  # Padrão: data-nome (hífen, não barra)
    ├── proposal.md
    ├── spec.md
    ├── design.md
    ├── tasks.md
    ├── verify-report.md
    └── archive-report.md
```

**Exemplo**: `2026-04-17-quality-workflow-evolution/`

---

## Fluxo de Vida de uma Change

```
proposal → spec → design → tasks → implementation → verification → archive
```

| Fase | Descrição | Gate |
|------|-----------|------|
| proposal | Proposta inicial com scope e riscos | Análise inicial |
| spec | Requisitos RFC 2119 com cenários Given/When/Then | Revisão técnica |
| design | Design técnico com TDD/BDD/ATDD/DDD | Revisão de arquitetura |
| tasks | Decomposição DDD em tarefas | Verificação de completude |
| implementation | Código + Testes + Documentação | Testes passam + lint + build |
| verification | Compliance report (código + documentação) | Verificação completa |
| archive | Consolidado e arquivado | Reporte de arquivamento |

**Uma change só está CONCLUÍDA quando for ARQUIVADA.**

---

## Regras de Organização

**REGRA 1**: Uma change só pode iniciar se todas as changes anteriores estiverem arquivadas.

**REGRA 2**: Todos os artefatos de uma change devem estar no diretório da change.

**REGRA 3**: Archives DEVEM seguir o padrão `YYYY-MM-DD-{change-name}/`.

**REGRA 4**: Não misturar padrões de data (barra vs hífen).

**REGRA 5**: O arquivo `archive-report.md` é obrigatório ao arquivar.

---

## Gates de Aprovação

| Fase | Gate | Responsável |
|------|------|-------------|
| proposal | Análise inicial | Orchestrator |
| spec | Revisão técnica (RFC 2119) | Oracle |
| design | Revisão de arquitetura | Oracle |
| tasks | Verificação de completude | Orchestrator |
| verification | Compliance report | Deep agent |
| archive | Consolidado e arquivado | Tech Lead |

---

## Como Arquivar uma Change

1. Verificar que todos os tasks estão `[x]`
2. Criar `archive-report.md` com resumo das mudanças
3. Mover diretório para `archive/YYYY-MM-DD-{change-name}/`
4. Remover diretório original

```bash
# Exemplo de arquivamento
mv opencode/openspec/changes/minha-mudanca opencode/openspec/changes/archive/2026-04-17-minha-mudanca/
```

---

## Referências

- `opencode/openspec/AGENTS.md` - Visão geral do fluxo SDD
- `opencode/openspec/specs/` - Especificações do projeto
- `opencode/openspec/templates/` - Templates de artefatos

---

**Versão**: 1.0
**Última Atualização**: 2026-04-17