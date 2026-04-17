# Design: thoth-mem-fix - Correção de Inicialização thoth_mem

## Decisões de Arquitetura

### 1. Modo de Persistência

**Decisão**: Usar modo `openspec` apenas (sem thoth_mem)

**Rationale**: thoth_mem requer configuração complexa de MCP server. O modo openspec é mais simples e já funciona.

**Alternativas consideradas**:
- Configurar thoth_mem completamente - Rejeitado (complexidade alta, benefit baixo)
- Usar modo hybrid (thoth + openspec) - Rejeitado (problema persiste)

### 2. Provider Configuration

**Decisão**: Adicionar provider config diretamente no opencode.json do projeto

**Rationale**: O provider não estava sendo herdado do global config. Adicionar no projeto garante que funciona.

---

## Arquitetura

### Estrutura de Configuração

```
~/.config/opencode/
├── opencode.json          # Config global
├── node_modules/
│   ├── @opencode-ai/
│   │   └── plugin/       # Plugin base
│   ├── opencode-plugin-openspec/  # Plugin SDD (INSTALADO)
│   └── oh-my-opencode-lite/      # Plugin agents (INSTALADO)
```

### Configuração opencode.json (projeto)

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "minimax/MiniMax-M2.7",
  "provider": {
    "minimax": {
      "npm": "@ai-sdk/anthropic",
      "options": {
        "baseURL": "https://api.minimax.io/anthropic/v1",
        "apiKey": "..."
      },
      "models": {
        "MiniMax-M2.7": {
          "name": "MiniMax-M2.7"
        }
      }
    }
  },
  "plugin": ["oh-my-opencode-lite", "opencode-plugin-openspec"],
  "skills": {
    "enabled": true,
    "directory": "~/.config/opencode/skills"
  }
}
```

---

## Arquivos a Modificar

### Criar

Nenhum arquivo criado.

### Modificar

| Arquivo | Mudança |
|---------|---------|
| `opencode.json` | Adicionar provider config (JÁ FEITO) |

---

## Verificação

### Teste de Agents

```bash
# Verificar que plugins estão instalados
cd ~/.config/opencode && npm ls

# Verificar que opencode.json tem provider
cat /home/leo/projetos/restaurante/opencode.json | grep provider
```

---

## Status

Design
