# Proposta: Instalar Plugins de IA para OpenCode

## Problema
O PRD.md identifica a necessidade de instalar plugins de IA para completar o pipeline OpenCode + OpenSpec. Os plugins necessários são: opencode-plugin-openspec, opencode-autopm e oh-my-opencode-slim. Atualmente, nenhum desses plugins está instalado no projeto.

## Solução Proposta
Instalar os três plugins de IA mencionados no PRD.md via npm e configurá-los no arquivo `opencode.json` para que estejam disponíveis no ambiente OpenCode.

## Impacto
- [ ] Breaking changes? **Não** - Apenas adição de plugins
- [ ] Migração necessária? **Não**
- [ ] Novos dependencies? **Sim** - 3 novos packages npm

## Alternativas Consideradas
1. **Instalar apenas um plugin** - Descartado pois o PRD.md especifica todos os três
2. **Usar alternatives** - Não há alternativas equivalentes aos plugins especificados

## Urgência
- [ ] Crítica
- [x] Alta
- [ ] Média
- [ ] Baixa

## Status: Proposta