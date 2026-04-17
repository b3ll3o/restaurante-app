# Tasks: backlog-workflow

## Pré-condições
- [x] Proposal aprovado

## Tarefas

### Fase 1: Estrutura Inicial

- [x] 1.1: Criar diretório `.openspec/backlog/`
- **Verificação**: `ls -la .openspec/backlog/` | Expected: diretório existe ✅

- [x] 1.2: Criar subdiretório `.openspec/backlog/prds/`
- **Verificação**: `ls -la .openspec/backlog/prds/` | Expected: diretório existe ✅

- [x] 1.3: Criar subdiretório `.openspec/backlog/archive/`
- **Verificação**: `ls -la .openspec/backlog/archive/` | Expected: diretório existe ✅

### Fase 2: Template de PRD

- [x] 2.1: Criar template `.openspec/templates/backlog-prd-template.md`
- **Verificação**: `cat .openspec/templates/backlog-prd-template.md | head -30` | Expected: template existe ✅

- [x] 2.2: Documentar template no README.md do backlog
- **Verificação**: `grep -c "template" .openspec/backlog/README.md` | Expected: ≥1 ✅

### Fase 3: Índice Unificado (backlog.md)

- [x] 3.1: Criar `.openspec/backlog/backlog.md` com tabela de progresso
- **Verificação**: `cat .openspec/backlog/backlog.md` | Expected: tabela com colunas #, Data, Título, Fase, Status ✅

- [x] 3.2: Criar seção de pipeline visual
- **Verificação**: `grep -c "PIPELINE" .openspec/backlog/backlog.md` | Expected: 1 ✅

### Fase 4: Documentação do Fluxo

- [x] 4.1: Criar `.openspec/backlog/README.md` com fluxo completo
- **Verificação**: `cat .openspec/backlog/README.md | head -50` | Expected: fluxo documentado ✅

- [x] 4.2: Documentar gates de qualidade
- **Verificação**: `grep -c "Gate" .openspec/backlog/README.md` | Expected: ≥9 ✅

### Fase 5: Ajustar estrutura para seguir padrão de changes

- [x] 5.1: Remover `prds/` antigo e recriar como `backlog/{id}/`
- **Verificação**: `ls .openspec/backlog/` | Expected: pastas de PRD, não arquivos .md soltos ✅

- [x] 5.2: Atualizar README.md com nova estrutura
- **Verificação**: `grep "same pattern" .openspec/backlog/README.md` | Expected: 1 ✅

- [x] 5.3: Atualizar backlog.md índice
- **Verificação**: `cat .openspec/backlog/backlog.md | head -20` | Expected: estrutura correta ✅

## Progresso
```
██████████ 100%
```

## Status
Concluído ✅
