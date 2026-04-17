# Design: Token Tracker Plugin

## Decisões de Arquitetura
- Plugin adicionado ao array `plugins` no opencode.json
- Configuração minimalista, usando defaults do plugin
- Sem modificações no código do projeto

## Arquitetura
```
opencode.json
└── plugins: ["opencode-token-tracker", ...]
```

## Arquivos a Modificar
- `opencode.json` - Adicionar plugin ao array de plugins

## Dependências
| Dependência | Versão | Uso |
|-------------|--------|-----|
| opencode-token-tracker | latest | Plugin de tracking de tokens |

## TDD/BDD/ATDD/DDD
Não aplicável - trata-se de configuração de plugin, não código de domínio.

## Riscos e Mitigações
| Risco | Mitigação |
|-------|-----------|
| Plugin incompatível com versão atual do OpenCode | Verificar compatibilidade antes de instalar; rollback simples removendo do array |