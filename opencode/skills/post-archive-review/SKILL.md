---
name: post-archive-review
description: Executa revisão obrigatória após cada change ser arquivada — código, documentação e testes.
---

# Post-Archive Review Skill

Executa verificação completa após arquivamento de change SDD.

## Quando Usar

- Após `sdd-archive` completar
- Antes de iniciar nova change
- Obrigatório antes de cada nova change

## Workflow

### 1. Verificação de Build

Executar na raiz do projeto:
```bash
npm run build && echo "✅ Build OK"
npm run lint && echo "✅ Lint OK"
npx tsc --noEmit && echo "✅ Type check OK"
```

### 2. Verificação de Testes

```bash
npm run test:unit && echo "✅ Unit tests OK"
npm run test:coverage  # Verificar cobertura ≥ 80%
npm run test:e2e && echo "✅ E2E OK"
```

### 3. Verificação de Documentação

Para cada módulo modificado na change:
- [ ] `AGENTS.md` existe no nível correto
- [ ] Arquivos `.feature` atualizados com `@integration-test`
- [ ] Documentação consolidada na spec principal

### 4. Cobertura de Rotas

Analisar se todas as rotas modificadas/addicionadas na change têm testes:

**Sem testes manuais frequentes** → Cobertura 100% automatizada é crítica.

```bash
# Listar rotas modificadas na change
# Admin: app/admin/**/page.tsx, route.ts
# API: app/api/**/route.ts
# Menu: app/menu/**/page.tsx

# Verificar cobertura:
# - Unitários: tests/unit/ cover a lógica de negócio?
# - Integração: tests/integration/ cover as API routes?
# - E2E: tests/e2e/ cover as pages críticas?
```

**Critério**: Cada rota nova/modificada deve ter pelo menos 1 tipo de teste automatizado.

### 5. Consolidação de Specs

Se a change adicionou requisitos:
- [ ] REQ-XXX adicionado à spec principal
- [ ] CA-XXX mapeado
- [ ] Testes criados

## Response Format

```markdown
## Post-Archive Review: {change-name}

### Resultado
**Status**: PASS | FAIL | PARTIAL

### Verificações
| Verificação | Resultado |
|-------------|-----------|
| Build | ✅/❌ |
| Lint | ✅/❌ |
| Type check | ✅/❌ |
| Unit tests | ✅/❌ |
| Coverage ≥80% | ✅/❌ |
| E2E | ✅/❌ |
| AGENTS.md | ✅/❌ |
| BDD scenarios | ✅/❌ |
| Spec consolidada | ✅/❌ |

### Cobertura de Rotas (Backlog Contínuo)
| Rota | Unit | Integ | E2E |
|------|------|-------|-----|
| ...  |  ✅  |   ✅  |  ✅ |

### Issues Encontrados
- [lista de problemas, se houver]

### Recomendação
- PRONTO para nova change
- OU: Criar new change para corrigir issues
```

## Regras

1. **Obrigatório**: Executar após cada archive
2. **Bloqueante**: Não iniciar nova change se review falhar
3. **Documentado**: Resultado deve ser persistido em `thoth-mem` ou como comentário no PR
4. **Sem testes manuais**: Como não há testes manuais frequentes, **100% das rotas devem ter cobertura automatizada** (unit, integração ou E2E)

---

**Versão**: 1.1
**Última Atualização**: 2026-04-17
**Mudança**: Adicionado Fase 4 - Cobertura de Rotas (Backlog Contínuo)
