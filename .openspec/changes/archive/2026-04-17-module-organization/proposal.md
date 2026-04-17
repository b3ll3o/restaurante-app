# Proposta: module-organization

## Problema
Os módulos do MenuLink não seguem um padrão consistente de organização. Documentação (AGENTS.md) e cenários BDD (.feature) estão dispersos em diferentes níveis, dificultando a manutenibilidade e a localização de artefatos relacionados.

## Solução Proposta
Padronizar a organização de módulos para que código, documentação (AGENTS.md) e cenários BDD (.feature) fiquem no mesmo nível, seguindo o princípio da proximidade definido em AGENTS.md.

## Impacto
- [ ] Breaking changes? Não
- [ ] Migração necessária? Sim - mover arquivos de documentação
- [ ] Novos dependencies? Não

## Alternativas Consideradas
- Manter estrutura atual - descartada por inconsistência
- Centralizar documentação em único diretório - descartada por violar princípio da proximidade

## Urgência
- [ ] Crítica
- [x] Alta
- [ ] Média
- [ ] Baixa

## Scope
### In
- Analisar estrutura atual de todos os módulos
- Reorganizar AGENTS.md para o nível mais próximo do código
- Reorganizar arquivos .feature para o nível mais próximo do módulo que documentam
- Atualizar referências de documentação

### Out
- Não modifica lógica de código
- Não altera rotas ou APIs
- Não muda dependências

## Affected Areas
- `app/`
- `components/`
- `lib/`
- `context/`
- `hooks/`
- `types/`
- `tests/`

## Approach
1. Analisar estrutura atual de cada módulo
2. Criar AGENTS.md no nível correto (proximidade)
3. Mover arquivos .feature para o nível do módulo
4. Verificar imports após reorganização
5. Atualizar referências na documentação

## Risks
| Risco | Mitigação |
|-------|-----------|
| Mover arquivos pode quebrar imports | Verificar imports antes e após movimentação |
| Perda de referências em outros AGENTS.md | Atualizar referências após reorganização |

## Rollback Plan
`git revert` do commit de reorganização restaura estrutura original.

## Success Criteria
- Todos os módulos possuem AGENTS.md no nível mais próximo do código
- Todos os módulos com cenários BDD possuem .feature no nível correto
- AGENTS.md e .feature estão juntos quando ambos existem no mesmo módulo
- Imports e referências permanecem válidos após reorganização

## Status
Proposta