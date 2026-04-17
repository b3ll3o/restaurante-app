# Design: Instalar Plugins de IA para OpenCode

## Decisões de Arquitetura

### Abordagem de Instalação
- Instalação via npm (registry padrão)
- Registro dos plugins no `opencode.json` na seção `plugins`
- Cada plugin expõe comandos customizados no ambiente OpenCode

### Configuração do opencode.json
```json
{
  "plugins": [
    "opencode-plugin-openspec",
    "opencode-autopm",
    "oh-my-opencode-slim"
  ]
}
```

## Arquitetura

### Arquivos a Modificar
- `opencode.json` - Adicionar seção de plugins

### Dependências a Instalar
| Plugin | Versão | Propósito |
|--------|--------|-----------|
| opencode-plugin-openspec | latest | Integração OpenSpec |
| opencode-autopm | latest | Auto PM assistant |
| oh-my-opencode-slim | latest | Helpers gerais |

## TDD (Test-Driven Development)
- **Cobertura**: N/A (configuração apenas)
- **Ferramentas**: N/A

## BDD (Behavior-Driven Development)
- **Ferramenta**: N/A
- **Cenários**: Definidos em `spec.md`

## DDD (Domain-Driven Design)
- **Bounded Context**: Configuração de Ambiente
- **Agregados**: PluginsConfiguration
- **Linguagem Ubíqua**: Plugin, Instalação, Configuração

## Riscos e Mitigações

| Risco | Probabilidade | Mitigação |
|-------|---------------|-----------|
| Incompatibilidade de versão | Baixa | Verificar compatibilidade antes de instalar |
| Conflito com plugins existentes | Baixa | Verificar opencode.json atual |
| Plugin não encontrado no npm | Baixa | Verificar nomes corretos no registry |

## Status: Design