# Proposta: Estratégia de Automação de Testes Full-Stack

## Problema

O MenuLink atualmente não possui testes automatizados. Isso significa:
- Bugs podem ser introduzidos sem serem detectados
- Deploys não são confiáveis
- Refatorações são arriscadas
- Tempo gasto em testes manuais

## Solução Proposta

Implementar uma estratégia de automação de testes multicamadas conforme PRD.md:

1. **Testes Unitários e de Integração** com Vitest
2. **Testes E2E** com Playwright + BDD (Gherkin)
3. **Mock de APIs** com MSW
4. **Regressão Visual** com Percy (opcional - pode ser simplificado)

## Impacto

- [ ] Breaking changes? **Não**
- [ ] Migração necessária? **Não**
- [ ] Novos dependencies? **Sim** - Vitest, Playwright, MSW

## Alternativas Consideradas

1. **Jest em vez de Vitest** - Vitest é 10-20x mais rápido e suporte nativo a ESM/TypeScript
2. **Cypress em vez de Playwright** - Playwright tem melhor suporte cross-browser e arquitetura mais resiliente
3. **Sem BDD** - BDD serve como documentação viva e especificação executável

## Urgência

- [x] Alta - Sem testes, não há confiança no deploy
- [ ] Média
- [ ] Baixa

## Status

Proposta