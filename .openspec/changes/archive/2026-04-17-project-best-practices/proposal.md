# Proposal: Project Best Practices Adoption

## Intent

Aplicar melhores práticas de desenvolvimento de forma incremental ao projeto MenuLink, introduzindo utilitários TypeScript avançados (Result type), validação runtime com Zod, documentação ADR e error boundary global, **sem rewrite do código existente**.

## Scope

### In Scope

- Criar `lib/result.ts` com tipo Result/Either para error handling funcional
- Criar `lib/schemas/` com schemas Zod para validação de entidades de domínio (Restaurant, Category, Product, Order)
- Criar `components/error-boundary.tsx` para error handling global
- Criar diretório `docs/adr/` com template ADR e primeiro ADR "Why Result Type"
- Adicionar Zod como dependência (se não presente)
- Atualizar AGENTS.md relevantes para refletir novas convenções

### Out of Scope

- **NÃO** fazer refactoring de código existente para usar os novos padrões
- **NÃO** migrar estrutura de pastas (feature-based)
- **NÃO** implementar logging estruturado (lib/logger.ts)
- **NÃO** reescrever componentes existentes
- **NÃO** implementar testes E2E ou cobertura ≥80% (manter estrutura, não implementar agora)
- **NÃO** modificar configurações de build ou bundler

## Approach

**Incremental + Additive Only**: Criar novos arquivos/utilitários sem modificar código existente. O código novo pode usar os utilitários, mas o código existente permanece inalterado até que uma mudança específica demande atualização.

### Estratégia de Adoção

1. **Fase 1 - Utilitários**: Criar `lib/result.ts` e `lib/schemas/`
2. **Fase 2 - Error Boundary**: Criar `components/error-boundary.tsx`
3. **Fase 3 - ADR**: Criar estrutura de documentação ADR
4. **Fase 4 - Integração**: Atualizar AGENTS.md para documentar novos padrões

## Affected Areas

| Área | Impacto | Tipo |
|------|---------|------|
| `lib/result.ts` | Novo arquivo | Adição |
| `lib/schemas/` | Novo diretório | Adição |
| `components/error-boundary.tsx` | Novo arquivo | Adição |
| `docs/adr/` | Novo diretório | Adição |
| `package.json` | Adicionar Zod | Modificação |
| `AGENTS.md` | Atualizar documentação | Modificação |

## Risks

| Risco | Severidade | Mitigação |
|-------|------------|-----------|
| Zod adiciona ~30kb ao bundle | Baixa | Tree-shaking é automático com ESM; validar necessidade real |
| Result type pode ser mal utilizado | Média | Documentação clara em AGENTS.md + JSDoc |
| Breaking change em tipos | Baixa | Additive only - não modifica código existente |

## Rollback Plan

1. Remover arquivos criados (`lib/result.ts`, `lib/schemas/`, `components/error-boundary.tsx`, `docs/adr/`)
2. Remover Zod do `package.json`
3. Reverter AGENTS.md ao estado anterior
4. Executar `npm install` para atualizar lockfile

**Critical**: Rollback não afeta código que não foi modificado.

## Success Criteria

| ID | Critério | Evidência |
|----|----------|-----------|
| SC-01 | `lib/result.ts` existe com tipo Either/Result completo | Arquivo criado com testes unitários |
| SC-02 | `lib/schemas/` contém schemas para Restaurant, Category, Product, Order | 4 arquivos de schema criados |
| SC-03 | `components/error-boundary.tsx` funciona como React error boundary | Componente implementa getDerivedStateFromError |
| SC-04 | `docs/adr/0001-why-result-type.md` criado | ADR com contexto e decisão documentados |
| SC-05 | Zod adicionado como dependência | `npm list zod` mostra pacote instalado |
| SC-06 | Build passa com `npm run build` | Zero erros de compilação |
| SC-07 | Lint passa com `npm run lint` | Zero erros/warnings |

## Dependencies

- Zod (runtime validation)
- TypeScript strict mode (já configurado)

## Urgência

**Alta** - Melhora qualidade e manutenibilidade do projeto sem risco de breaking changes.

## Status

Proposta