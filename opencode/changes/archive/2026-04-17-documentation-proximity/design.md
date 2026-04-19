# Design: Documentation Proximity - AGENTS.md com Proximidade

## Technical Approach

Reorganizar documentação seguindo princípio da proximidade: AGENTS.md no mesmo diretório do elemento que documenta.

### Arquitetura da Solução

```
Estrutura de Proximidade:
app/admin/login/
├── page.tsx       ← Elemento
├── AGENTS.md      ← Documentação junto (NÍVEL CORRETO)
└── login.feature  ← BDD junto (NÍVEL CORRETO)
```

---

## Architecture Decisions

### Decision: AGENTS.md no nível mais próximo

**Choice**: Cada AGENTS.md fica no mesmo diretório do elemento que documenta

**Rationale**: Documentação colocalizada é mais fácil de manter, encontrar e atualizar.

---

## File Changes

### Arquivos a Criar

| Arquivo | Descrição |
|---------|-----------|
| `components/admin/header/AGENTS.md` | Header admin |
| `components/admin/sidebar/AGENTS.md` | Sidebar admin |
| `components/ui/button/AGENTS.md` | Button |
| `components/ui/input/AGENTS.md` | Input |
| `components/ui/card/AGENTS.md` | Card |
| `context/cart-context/AGENTS.md` | CartContext |
| `lib/supabase/client/AGENTS.md` | Cliente Supabase browser |
| `lib/supabase/server/AGENTS.md` | Cliente Supabase server |
| `lib/whatsapp/AGENTS.md` | Serviço WhatsApp |
| `lib/utils/AGENTS.md` | Utilitários |
| `app/admin/settings/settings.feature` | BDD de configurações |

---

## Testing Strategy

### Verificação
- Verificar que todos os AGENTS.md estão criados
- Verificar que settings.feature existe
- Verificar tags @integration-test

---

## Migration / Rollout

1. Criar AGENTS.md faltantes
2. Verificar consistência
3. Atualizar AGENTS.md pai se necessário

---

## Open Questions

Nenhuma.

---

## Dependências

Nenhuma nova dependência.

---

## Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Muitos arquivos | Alta | Baixo | Tarefas pequenas e focadas |