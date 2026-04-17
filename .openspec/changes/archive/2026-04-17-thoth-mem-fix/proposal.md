# Proposta: thoth-mem-fix

## Problema
O MCP `thoth_mem` está com erro de inicialização (`ProviderModelNotFoundError`), impedindo a execução de task agents via SDD. O plugin `opencode-plugin-openspec`referenciado em `opencode.json` não está instalado no ambiente.

## Solução Proposta
Duas opções:
1. **Opção A (Recomendada)**: Instalar o plugin `opencode-plugin-openspec` via npm
2. **Opção B**: Operar apenas em modo `openspec` sem thoth_mem (workaround)

## Impacto
- [ ] Breaking changes? Não
- [ ] Migração necessária? Sim - instalar plugin ou ajustar config
- [ ] Novos dependencies? `opencode-plugin-openspec` (se Opção A)

## Alternativas Consideradas
- **Opção A**: Instalar plugin - solução completa, thoth_mem funciona
- **Opção B**: Usar apenas modo `openspec` - funciona sem thoth_mem, sem persistência em memória

## Urgência
- [x] Alta - agentes não funcionam

## Scope
### In
- Analisar configuração atual
- Implementar solução (A ou B)
- Testar se agentes executam

### Out
- Não modifica lógica do projeto MenuLink
- Não altera código fonte

## Affected Areas
- `~/.config/opencode/`
- `opencode.json`

## Approach
1. Verificar se `opencode-plugin-openspec` está instalado
2. Se não: tentar instalar via npm
3. Se instalação falhar: usar modo `openspec` apenas
4. Testar execução de task agent

## Risks
| Risco | Mitigação |
|-------|-----------|
| Plugin não disponível no npm | Usar modo openspec como fallback |
| Configuração incompatível | Ajustar opencode.json |

## Rollback Plan
Reverter configuração do opencode.json para modo `openspec` apenas.

## Success Criteria
- Erro `ProviderModelNotFoundError` eliminado
- Task agents executando com sucesso
- Modo de persistência funcionando (thoth-mem ou openspec)

## Status
Proposta
