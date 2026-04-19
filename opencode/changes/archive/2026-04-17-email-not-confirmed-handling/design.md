# Design: Email Not Confirmed Handling

## Technical Approach

Tratar erro `email_not_confirmed` no frontend com captura do código de erro específico e UI de reenvio via Supabase `resend()`.

## Architecture Decisions

### Decision: Nova utilidade `lib/supabase/auth.ts`

**Choice**: Criar `lib/supabase/auth.ts` com função `resendConfirmationEmail(email)`
**Alternatives considered**:
- Adicionar método ao cliente existente (`lib/supabase/client/index.ts`) — poluiria interface
- Chamar Supabase diretamente na página — violaria DRY
**Rationale**: Separação de responsabilidades, reutilizável em outros pontos do app se necessário

### Decision: Estado `emailNotConfirmed` separado do estado `error`

**Choice**: Manter `emailNotConfirmed: boolean` para controlar UI específica
**Alternatives considered**:
- Usar `error.code === 'email_not_confirmed'` diretamente no render — menos legível
- criar estado `errorType: 'credentials' | 'not_confirmed' | 'unknown'` — mais complexo
**Rationale**: Simplicidade e clareza no fluxo condicional

### Decision: Usar `sonner` para toast de sucesso

**Choice**: `sonner.toast.success()` para feedback após reenvio
**Alternatives considered**:
- Alert customizado — menos elegante
- Estado local de "mensagem enviada" — mais código boilerplate
**Rationale**: Já integrado via shadcn/ui, feedback visual padronizado

---

## Data Flow

```
[Login Form Submit]
    │
    ▼
[Supabase signInWithPassword]
    │
    ├─── Sucesso ──▶ [Redirect /admin/dashboard]
    │
    └─── Erro ──▶ [Verificar error.code]
                       │
                       ├─── "email_not_confirmed" ──▶ [Mostrar UI específica + Email preservado]
                       │                                   │
                       │                                   ▼
                       │                          [Botão "Reenviar email"]
                       │                                   │
                       │                                   ▼
                       │                          [resendConfirmationEmail(email)]
                       │                                   │
                       │                                   ├─── Sucesso ──▶ [toast.success + disable botão]
                       │                                   │
                       │                                   └─── Erro (rate limit) ──▶ [toast.error]
                       │
                       └─── "invalid_credentials" ──▶ [Mensagem genérica "Email ou senha incorretos"]
```

---

## File Changes

| Ação | Arquivo | Mudança |
|------|---------|---------|
| **Criar** | `lib/supabase/auth.ts` | Função `resendConfirmationEmail(email)` |
| **Modificar** | `app/admin/login/page.tsx` | Capturar erro `email_not_confirmed`, UI de reenvio |
| **Criar** | `tests/unit/auth.test.ts` | Testes unitários para `resendConfirmationEmail` |
| **Criar** | `tests/e2e/login-email-not-confirmed.test.ts` | Teste E2E do fluxo completo |

---

## Interfaces / Contracts

### `lib/supabase/auth.ts`

```typescript
/**
 * Reenvia email de confirmação de cadastro
 * @param email - Email do usuário que não confirmou
 * @returns Promise<{ success: boolean; error?: string }>
 */
export async function resendConfirmationEmail(email: string): Promise<{
  success: boolean;
  error?: string;
}>;
```

### `app/admin/login/page.tsx` — Estados Adicionados

| Estado | Tipo | Descrição |
|--------|------|-----------|
| `emailNotConfirmed` | `boolean` | Indica que erro é de email não confirmado |
| `resending` | `boolean` | Indica que reenvio está em andamento |
| `resendSuccess` | `boolean` | Indica que email foi reenviado com sucesso |

---

## Testing Strategy

### TDD (Unit Tests)
- `resendConfirmationEmail` — sucesso, rate limit, email inválido
- Validação de input do email

### BDD (Integration Tests)
- `tests/integration/auth-resend.test.ts` — fluxo de reenvio

### ATDD (E2E Tests)
- `tests/e2e/login-email-not-confirmed.test.ts` — cenário completo Gherkin

---

## Migration / Rollback

1. **Rollback**: Remover `lib/supabase/auth.ts`, reverter modificações em `app/admin/login/page.tsx`
2. **Sem breaking changes**: Implementação inteiramente aditiva

---

## Open Questions

Nenhuma.

---

**Versão**: 1.0
**Última Atualuração**: 2026-04-17
**Autor**: AI Agent