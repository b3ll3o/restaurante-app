# Tasks: Email Not Confirmed Handling

## Pré-condições

- [x] Spec aprovada (REQ-ENC-01 a REQ-ENC-05)
- [x] Design aprovado
- [x] Codebase analisada (`lib/supabase/client/index.ts`, `app/admin/login/page.tsx`)

## Tarefas

### Fase 1: Infraestrutura de Autenticação

- [x] 1.1: Criar `lib/supabase/auth.ts` com função `resendConfirmationEmail(email: string)`
- [x] 1.2: Implementar chamada `supabase.auth.resend({ type: 'signup', email })` dentro de try/catch
- [x] 1.3: Retornar `{ success: boolean; error?: string }` para fácil tratamento
- [x] 1.4: Documentar função com JSDoc

### Fase 2: Interface de Login - Tratamento de Erro

- [x] 2.1: Adicionar estados `emailNotConfirmed`, `resending`, `resendSuccess` em `app/admin/login/page.tsx`
- [x] 2.2: Modificar `handleSubmit` para verificar `error.code === 'email_not_confirmed'`
- [x] 2.3: Condicionar `setEmailNotConfirmed(true)` quando erro for de email não confirmado
- [x] 2.4: Preservar email no campo quando `emailNotConfirmed` for true

### Fase 3: UI de Reenvio de Email

- [x] 3.1: Criar Alert/warning com mensagem "Você ainda não confirmou seu email. Clique no link enviado para [email] ou solicite um novo email de confirmação."
- [x] 3.2: Adicionar botão "Reenviar email de confirmação" dentro do Alert
- [x] 3.3: Implementar `handleResend` chamando `resendConfirmationEmail(email)`
- [x] 3.4: Desabilitar botão durante `resending`
- [x] 3.5: Desabilitar botão após `resendSuccess`
- [x] 3.6: Exibir toast `sonner.toast.success('Email de confirmação reenviado!')` após sucesso

### Fase 4: Testes

- [x] 4.1: Criar teste unitário `tests/unit/lib/auth.test.ts` para `resendConfirmationEmail` (sucesso, rate limit, email inválido)
- [x] 4.2: Criar teste E2E `tests/e2e/login-email-not-confirmed.spec.ts` com cenário Gherkin completo
- [x] 4.3: Verificar que todos os testes passam

### Fase 5: Documentação

- [x] 5.1: Criar `lib/supabase/auth.ts` com AGENTS.md (função implementada com JSDoc)
- [x] 5.2: Criar `app/admin/login/email-not-confirmed.feature` com cenários BDD
- [x] 5.3: Atualizar `app/admin/login/AGENTS.md` com novo fluxo

## Progresso

██████████ 100%

## Status

Implementação Completa