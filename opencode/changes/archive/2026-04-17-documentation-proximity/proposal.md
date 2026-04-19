# Proposal: Documentation Proximity - AGENTS.md com Proximidade

## Intent

Reorganizar toda a documentação do projeto (AGENTS.md) seguindo o princípio da proximidade: cada AGENTS.md deve estar no nível mais próximo possível do elemento que documenta. Além disso, criar cenários BDD (.feature) no nível do módulo que documentam.

## Scope

### In Scope
- Criar AGENTS.md de components (header, sidebar, button, input, card)
- Criar AGENTS.md de context (cart-context)
- Criar AGENTS.md de lib (supabase/client, supabase/server, whatsapp, utils)
- Atualizar AGENTS.md pai para manter apenas visão geral (remover detalhamento)
- Criar cenários BDD (settings.feature)
- Adicionar tags @integration-test nos arquivos .feature

### Out of Scope
- Criação de templates OpenSpec (isso é da change `sddd-templates`)
- Implementação de código

## Approach

1. **Proximidade de AGENTS.md**: Cada AGENTS.md no mesmo diretório do elemento que documenta
2. **BDD com proximidade**: Arquivos .feature no nível do módulo
3. **Links BDD↔Testes**: Tags @integration-test em todos os cenários

## Affected Areas

- `components/admin/header/AGENTS.md`
- `components/admin/sidebar/AGENTS.md`
- `components/ui/button/AGENTS.md`
- `components/ui/input/AGENTS.md`
- `components/ui/card/AGENTS.md`
- `context/cart-context/AGENTS.md`
- `lib/supabase/client/AGENTS.md`
- `lib/supabase/server/AGENTS.md`
- `lib/whatsapp/AGENTS.md`
- `lib/utils/AGENTS.md`
- `app/admin/settings/settings.feature`

## Risks

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Muitos arquivos para criar | Alta | Baixo | Dividir em tarefas menores |

## Success Criteria

- [ ] Todos os AGENTS.md de components criados
- [ ] Todos os AGENTS.md de context/lib criados
- [ ] settings.feature criado
- [ ] AGENTS.md pai atualizados com visão geral