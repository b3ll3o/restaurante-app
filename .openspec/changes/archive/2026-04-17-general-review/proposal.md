# Proposta: general-review

## Problema

O projeto MenuLink apresenta several issues de documentação e qualidade que comprometem a manutenibilidade:

1. **Duplicações**: 3_AGENTS.md duplicados em `tests/` com estruturas inconsistentes
2. **Inconsistências**: `lib/AGENTS.md` referencia estrutura antiga (`client.ts`, `server.ts`) vs atual (`client/index.ts`, `server/index.ts`)
3. **Cobertura de testes insuficiente**: cart-context com 0% coverage, whatsapp com ~70%
4. **Templates ausentes**: Falta padronização de AGENTS.md, componentes e testes
5. **Difficulty to navigate**: IAs e humanos têm dificuldade de encontrar informação correta

## Solução Proposta

1. **Analisar** todos os AGENTS.md e identificar duplicações
2. **Criar templates padrão** para AGENTS.md, componentes, e testes
3. **Corrigir** referências desatualizadas (lib/supabase)
4. **Unificar** AGENTS.md duplicados em tests/
5. **Criar testes unitários** para cart-context (0% → 80%+)
6. **Completar testes** de whatsapp para atingir 80%+
7. **Verificar** todos os imports e cobertura

## Impacto
- [ ] Breaking changes? **Não**
- [ ] Migração necessária? **Sim** - correção de documentação e imports
- [ ] Novos dependencies? **Não**

## Alternativas Consideradas

| Alternativa | Por que Descartada |
|-------------|-------------------|
| Manter como está | Issues pioram com tempo |
| Reescrever tudo | Risco muito alto, tempo excessivo |
| Contratar revisão externa | Não resolve padrões internos |

## Urgência
- [x] Crítica

## Scope

### In
- Analisar e corrigir todos os AGENTS.md
- Criar templates de documentação (AGENTS.md, componente, teste)
- Corrigir imports desatualizados em `lib/`
- Unificar documentação de testes
- Criar testes unitários para cart-context
- Completar testes de whatsapp
- Verificação de build, lint e cobertura

### Out
- Não criar novas funcionalidades
- Não alterar lógica de negócio
- Não modificar APIs públicas
- Não alterar código de produção desnecessariamente

## Affected Areas

| Área | Impacto |
|------|---------|
| `lib/` | Correção de imports e documentação |
| `tests/` | Unificação e novos testes |
| `context/cart-context` | Novos testes unitários |
| `.openspec/specs/` | Atualização de specs se necessário |

## Approach

### Fase 1: Análise e Diagnóstico
1. Mapear todos os AGENTS.md com `find . -name "AGENTS.md"`
2. Identificar duplicações com grep
3. Verificar imports com grep -r
4. Analisar cobertura atual com `npm run test:coverage`

### Fase 2: Padronização
1. Criar `template-agents.md` em `.openspec/templates/`
2. Criar `template-component.tsx` em `.openspec/templates/`
3. Criar `template-test.ts` em `.openspec/templates/`
4. Documentar padrões em `menulink-quality-rules.md`

### Fase 3: Correção
1. Corrigir `lib/AGENTS.md` (client.ts → client/index.ts)
2. Unificar `tests/AGENTS.md` (remover duplicações)
3. Criar `tests/unit/context/cart-context.test.tsx`
4. Completar `tests/unit/lib/whatsapp.test.ts`

### Fase 4: Verificação
1. `npm run build` - validar build
2. `npm run lint` - validar lint
3. `npm run test:coverage` - validar cobertura ≥80%

## Risks

| Risco | Probabilidade | Mitigação |
|-------|---------------|-----------|
| Breaking de imports | Média | Verificar todos antes de mudar |
| Perda de informação | Baixa | Git backup antes de modificar |
| Testes quebrando | Média | Commits incrementais |

## Rollback Plan

```bash
# Se AGENTS.md corrompido:
git checkout HEAD~1 -- .openspec/ tests/AGENTS.md lib/AGENTS.md

# Se testes falharem:
git bisect para identificar commit problemático
```

## Success Criteria

| Critério | Target | Atual |
|----------|--------|-------|
| AGENTS.md duplicados | 0 | 3+ |
| Cobertura cart-context | ≥80% | 0% |
| Cobertura whatsapp | ≥80% | ~70% |
| Templates documentados | 4 | 0 |
| Inconsistências de imports | 0 | 5+ |

## Status

Proposta
