# Proposal: SDDD Templates - Templates OpenSpec com Qualidade Integrada

## Intent

Criar e atualizar os templates OpenSpec (PRD, design, tasks) para incorporar práticas de qualidade (TDD, BDD, ATDD, DDD) desde a fase de design, garantindo que toda mudança significativa passe por um fluxo estruturado de concepção, análise e especificação.

## Scope

### In Scope
- Template PRD.md com estrutura de PRD (Product Requirements Document)
- Atualização do template design.md com seções obrigatórias de TDD, BDD, ATDD e DDD
- Atualização do template tasks.md com decomposição baseada em DDD
- Atualização do AGENTS.md principal para refletir o novo fluxo SDD

### Out of Scope
- Criação de AGENTS.md individuais de módulos/componentes (isso é da change `documentation-proximity`)
- Criação de arquivos BDD (.feature)
- Implementação de código

## Approach

1. **Template PRD.md**: Documento inicial conciso focando no "o quê" e "por quê"
2. **Template design.md**: Seções obrigatórias para estratégia de qualidade
3. **Template tasks.md**: Decomposição DDD (Infraestrutura, Domínio, Aplicação, Interface, Documentação)
4. **Fluxo SDD atualizado**: PRD → Análise → proposal → spec → design → tasks → implementation → verification → archive

## Affected Areas

- `.openspec/templates/` - Templates OpenSpec
- `.openspec/AGENTS.md` - Fluxo principal de documentação

## Risks

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Curva de aprendizado | Média | Baixo | Documentação clara dos templates |

## Success Criteria

- [ ] Template PRD.md disponível em `.openspec/templates/`
- [ ] Template design.md inclui seções de TDD, BDD, ATDD, DDD
- [ ] Template tasks.md segue decomposição DDD
- [ ] AGENTS.md principal atualizado com novo fluxo SDD