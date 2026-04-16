# Proposal: Evolução do Fluxo de Desenvolvimento com Qualidade Integrada

## Intent

Evoluir o fluxo SDD do MenuLink para incorporar práticas de qualidade (TDD, BDD, ATDD, DDD) desde a fase de design, adicionar uma etapa inicial de concepção (PRB.md) com análise de impacto confrontada contra o PRD.md, e garantir atualização obrigatória de documentação de todos os módulos afetados por cada mudança.

## Scope

### In Scope
- Nova etapa PRB.md (Product Requirement Brief) como documento inicial de concepção
- Etapa formal de Análise com PRD.md para confrontar ideia com a realidade atual da aplicação
- Atualização do template design.md para incluir seções obrigatórias de TDD, BDD, ATDD e DDD
- Atualização do template tasks.md para decomposição baseada em DDD (Infraestrutura, Domínio, Aplicação, Interface)
- Cobertura mínima de testes obrigatória: 80% para unitários, 100% para fluxos críticos E2E
- Atualização obrigatória de documentação (AGENTS.md) de todos os módulos afetados

### Out of Scope
- Implementação de novas funcionalidades de negócio
- Mudança de stack tecnológica (Next.js, React, Supabase mantidos)
- Alteração no schema do banco de dados
- Configuração de CI/CD (será documentado como recomendação futura)

## Approach

1. **PRB.md como porta de entrada**: Toda mudança significativa começa com um PRB.md conciso focando no "o quê" e "por quê"
2. **Análise de impacto formal**: Confrontar PRB.md com PRD.md existente e analisar codebase antes de criar proposal.md
3. **Design com qualidade integrada**: Design.md deve explicitamente definir estratégia de testes e modelagem DDD
4. **Tasks orientadas a DDD**: Decomposição por camadas (Infraestrutura, Domínio, Aplicação, Interface)
5. **Documentação como entregável**: Atualização de AGENTS.md dos módulos afetados é parte do critério de conclusão

## Affected Areas

- `.openspec/` - Workflow SDD, templates (PRB.md, design.md, tasks.md)
- `AGENTS.md` - Fluxo principal de documentação
- `tests/AGENTS.md` - Infraestrutura de testes
- `lib/AGENTS.md` - Biblioteca (utils, supabase, whatsapp)
- `app/AGENTS.md` - App Router (admin, menu, api)
- `components/AGENTS.md` - Componentes UI e admin
- `context/AGENTS.md` - Contextos React
- `hooks/AGENTS.md` - Custom hooks
- `types/AGENTS.md` - Definições TypeScript
- `supabase/AGENTS.md` - Schema e integração banco

## Risks

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Curva de aprendizado (DDD/TDD) | Alta | Médio | Treinamento interno, pair programming |
| Resistência à mudança de processo | Média | Alto | Demonstrar benefícios com piloto |
| Sobrecarga inicial na equipe | Média | Médio | Implementação gradual por módulo |

## Rollback Plan

Se a mudança causar impacto negativo na produtividade:
1. Reverter para templates antigos via git
2. Manter apenas práticas de documentação que já funcionavam
3. Implementar TDD/BDD/DDD de forma incremental por módulo

## Success Criteria

- [ ] Template PRB.md disponível em `.openspec/`
- [ ] Template design.md inclui seções de TDD, BDD, ATDD, DDD
- [ ] Template tasks.md segue decomposição DDD
- [ ] Todos os AGENTS.md dos módulos afetados atualizados
- [ ] Cobertura mínima de 80% para unitários documentada
- [ ] Fluxo completo testado em pelo menos uma mudança real