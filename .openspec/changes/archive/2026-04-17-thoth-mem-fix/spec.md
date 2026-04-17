# Spec: thoth-mem-fix - Correção de Inicialização thoth_mem

## Fonte da Verdade

Este documento é parte das especificações do MenuLink.

## Problema

O MCP `thoth_mem` está com erro de inicialização (`ProviderModelNotFoundError`), impedindo a execução de task agents via SDD.

### Sintomas

1. **`configLoaded: false`** - Configuração não carregada nos logs
2. **`ProviderModelNotFoundError`** - Erro ao usar task agents
3. **Plugins npm não instalados** - `opencode-plugin-openspec` e `oh-my-opencode-lite` faltando

---

## Requisitos

### REQ-TM-01: Plugins Instalados

O sistema **DEVE** ter os seguintes plugins instalados em `~/.config/opencode/`:
- `opencode-plugin-openspec`
- `oh-my-opencode-lite`

### REQ-TM-02: Provider Configurado

O sistema **DEVE** ter provider configurado no `opencode.json` do projeto:
```json
{
  "provider": {
    "minimax": {
      "npm": "@ai-sdk/anthropic",
      "options": { ... }
    }
  }
}
```

### REQ-TM-03: Agents Funcionando

O sistema **DEVE** permitir execução de task agents sem erro `ProviderModelNotFoundError`.

---

## Critérios de Aceitação

### CA-TM-01: Plugins Instalados

- [ ] `npm ls opencode-plugin-openspec` em `~/.config/opencode/` retorna versão
- [ ] `npm ls oh-my-opencode-lite` em `~/.config/opencode/` retorna versão

### CA-TM-02: Provider Configurado

- [ ] `opencode.json` do projeto contém seção `provider`
- [ ] Provider contém configuração minimax válida

### CA-TM-03: Agents Executam

- [ ] Task agent consegue executar sem erro
- [ ] `ProviderModelNotFoundError` não ocorre

---

## Análise Técnica

### Root Cause

1. `opencode-plugin-openspec` não estava instalado
2. `oh-my-opencode-lite` não estava instalado
3. `opencode.json` do projeto não tinha seção `provider`

### Solução Aplicada

1. Instalação de `opencode-plugin-openspec` via npm
2. Instalação de `oh-my-opencode-lite` via npm
3. Adição de configuração de provider no `opencode.json`

---

## Status

Especificação
