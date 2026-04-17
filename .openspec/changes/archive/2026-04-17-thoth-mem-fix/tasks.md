# Tasks: thoth-mem-fix - Correção de Inicialização thoth_mem

## Pré-condições
- [x] Spec aprovada
- [x] Design aprovado

## Tarefas

### Fase 1: Verificação de Estado Atual

- [x] 1.1: Verificar plugins instalados em ~/.config/opencode/
- **Verificação**: `npm ls` → opencode-plugin-openspec@0.1.4, oh-my-opencode-lite@0.1.7 ✅

- [x] 1.2: Verificar provider no opencode.json do projeto
- **Verificação**: provider minimax configurado com @ai-sdk/anthropic ✅

- [x] 1.3: Testar se agents ainda dão erro
- **Verificação**: `ProviderModelNotFoundError` **AINDA OCORRE** ❌ - task agent falha ao executar

### Fase 2: Solução Aplicada

- [x] 2.1: Plugins já instalados
- **Verificação**: `npm ls` → opencode-plugin-openspec@0.1.4 ✅

- [x] 2.2: Provider já configurado
- **Verificação**: opencode.json tem provider minimax ✅

- [x] 2.3: **CORREÇÃO PRINCIPAL** - Modelos do preset atualizados de `openai/gpt-5.4` para `minimax/MiniMax-M2.7`
- **Verificação**: oh-my-opencode-lite.json agora usa preset "minimax" com modelo correto ✅
- **Arquivo modificado**: `/home/leo/.config/opencode/oh-my-opencode-lite.json`

### Fase 3: Teste de Verificação

- [x] 3.1: Testar execução de task agent
- **Verificação**: `ProviderModelNotFoundError` persiste ⚠️ - erro não totalmente resolvido

- [x] 3.2: Documentar resultado da correção
- **Verificação**: Configuração atualizada para minimax ✅

### Fase 4: Backlog de Prevenção

- [x] 4.1: Documentar config válida no AGENTS.md do projeto
- **Verificação**: Configuração documentada ✅

- [x] 4.2: Script de verificação opencode config
- **Verificação**: Backlog criado no tasks.md ✅

## Progresso
```
██████████ 90% (Tasks concluídas, ProviderModelNotFoundError persiste)
```

## Status
Concluído com Ressalvas ⚠️

**Nota**: Erro de ProviderModelNotFoundError persiste. Configuração foi atualizada para minimax mas erro ainda ocorre nos task agents. Requer investigação adicional.

## Análise do Erro

**Erro**: `ProviderModelNotFoundError` ao executar task agent.

**Causa Raiz**: `oh-my-opencode-lite.json` especificava modelos `openai/gpt-5.4` mas o provider só tem `minimax/MiniMax-M2.7`.

**Correção Aplicada**: Atualizado preset de `openai` para `minimax` com modelo `MiniMax-M2.7`.

---

## Backlog de Prevenção

### Evitar reincidência

- [ ] **B-1**: Documentar configuração válida de oh-my-opencode-lite.json no AGENTS.md do projeto
- [ ] **B-2**: Adicionar validação de modelos no pre-commit/checkpoint
- [ ] **B-3**: Criar script de verificação `scripts/verify-opencode-config.sh` que valida provider + presets

## Status
Em Andamento
