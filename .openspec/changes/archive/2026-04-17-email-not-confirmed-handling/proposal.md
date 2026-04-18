# Proposal: Tratamento de Erro email_not_confirmed no Login

## Problema

Usuários que criam conta no MenuLink mas não confirmam o email ficam presos em estado onde tentam fazer login e recebem erro genérico HTTP 400 com código `email_not_confirmed`. O frontend atual não trata este código especificamente, deixando usuário sem orientação sobre como resolver.

## Solução Proposta

Implementar tratamento específico para o erro `email_not_confirmed` na página de login (`app/admin/login/page.tsx`):
1. Capturar erro específico `email_not_confirmed` retornado pelo Supabase Auth
2. Exibir mensagem clara em pt-BR indicando que o email ainda não foi confirmado
3. Oferecer botão "Reenviar email de confirmação" usando Supabase `resend()`
4. Após reenvio, exibir mensagem de sucesso com toast (sonner)

## Impacto

- [ ] Breaking changes? **NÃO** — Implementação aditiva (tratamento de erro)
- [ ] Migração necessária? **NÃO** — Não altera dados nem APIs externas
- [ ] Novos dependencies? **NÃO** — `@supabase/supabase-js` já existente, `sonner` já existente via shadcn

## Scope

### In Scope
- `app/admin/login/page.tsx`: Tratar erro `email_not_confirmed`, exibir UI de reenvio
- `lib/supabase/auth.ts`: Nova utilidade `resendConfirmationEmail(email)`
- Mensagens em português brasileiro (pt-BR)
- Toast de confirmação via `sonner`

### Out of Scope
- Modificação de configurações Supabase (confirm email)
- Alteração no fluxo de signup
- Envio de emails transacionais customizados
- Funcionalidade "confirmar email" manual pelo admin
- Notificações SMS como fallback

## Alternativas Consideradas

| Alternativa | Por que foi descartada |
|-------------|------------------------|
| Desabilitar confirmação de email no Supabase | Riscos de segurança — usuários podem criar contas com emails inválidos |
| Login automático após signup | Mesmos problemas de segurança + modifica fluxo de signup |
| Mesma UI para todos os erros | Não oferece caminho de resolução para email não confirmado |

## Riscos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Rate limiting no reenvio de email | Média | Baixo | Mostrar mensagem de espera, botão desabilitado temporariamente |
| Email vai para spam | Alta | Médio | Orientar usuário a verificar spam + instrução clara |
| Enumeração de emails válidos | Baixa | Alto | Manter mesma mensagem para email não existe OU não confirmado |
| Usuário tenta reenviar múltiplas vezes | Média | Baixo | Desabilitar botão temporariamente após clique |

## Rollback Plan

1. Reverter modificações em `app/admin/login/page.tsx`
2. Remover `lib/supabase/auth.ts` (se não houver outros usos)
3. Descartar changes do git

## Success Criteria

- [ ] CA-ENC-01: Mensagem "Você ainda não confirmou seu email..." exibida quando erro `email_not_confirmed` ocorre
- [ ] CA-ENC-02: Botão "Reenviar email de confirmação" oferecido ao usuário
- [ ] CA-ENC-03: Clique no botão chama `resendConfirmationEmail` do Supabase
- [ ] CA-ENC-04: Toast "Email de confirmação reenviado!" exibido após reenvio
- [ ] CA-ENC-05: Erro `email_not_confirmed` tratado separadamente de outros erros (invalid_credentials)
- [ ] CA-ENC-06: Mensagem genérica para evitar enumeração de emails

## Status

Proposta