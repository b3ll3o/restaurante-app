# Delta: Email Not Confirmed Handling

## ADDED Requirements

### Requirement: REQ-ENC-01 — Captura do Erro `email_not_confirmed`

A página de login **DEVE** capturar o código de erro `email_not_confirmed` retornado pelo Supabase Auth quando um usuário tenta fazer login com email não confirmado.

#### Cenário: Erro `email_not_confirmed` retornado pelo Supabase

- **GIVEN** que o usuário criou uma conta com "ana@restaurante.com"
- **AND** não confirmou o email de confirmação
- **WHEN** o usuário tenta fazer login com "ana@restaurante.com" e senha correta
- **THEN** o Supabase Auth **DEVE** retornar erro com código `email_not_confirmed`
- **AND** a página de login **DEVE** capturar este erro específico

---

### Requirement: REQ-ENC-02 — Mensagem de Erro clara para Email Não Confirmado

Quando o erro `email_not_confirmed` for capturado, o sistema **DEVE** exibir mensagem clara em português brasileiro indicando que o email ainda não foi confirmado.

A mensagem **DEVE** seguir o formato: "Você ainda não confirmou seu email. Clique no link enviado para [email] ou solicite um novo email de confirmação."

#### Cenário: Exibição de mensagem para email não confirmado

- **GIVEN** que o usuário tentou fazer login
- **AND** o Supabase retornou erro `email_not_confirmed`
- **WHEN** a página processa a resposta de erro
- **THEN** o sistema **DEVE** exibir alert/mensagem com texto "Você ainda não confirmou seu email. Clique no link enviado para [email] ou solicite um novo email de confirmação."
- **AND** o campo de email **DEVE** ser preservado no formulário

---

### Requirement: REQ-ENC-03 — Botão "Reenviar email de confirmação"

Quando o erro `email_not_confirmed` for exibido, o sistema **DEVE** oferecer botão "Reenviar email de confirmação" que permite ao usuário solicitar reenvio do email de verificação.

#### Cenário: Botão de reenvio disponível após erro

- **GIVEN** que o usuário está na tela de erro "email não confirmado"
- **WHEN** a mensagem de erro é exibida
- **THEN** o sistema **DEVE** exibir botão rotulado "Reenviar email de confirmação"
- **AND** o botão **DEVE** estar visível e habilitável

#### Cenário: Clique no botão dispara reenvio

- **GIVEN** que o usuário está na tela de erro "email não confirmado"
- **WHEN** o usuário clica em "Reenviar email de confirmação"
- **THEN** o sistema **DEVE** chamar a função `resendConfirmationEmail(email)`
- **AND** o email a ser reenviado **DEVE** ser o email preenchido no campo de login

---

### Requirement: REQ-ENC-04 — Feedback de Sucesso Após Reenvio

Após o reenvio do email de confirmação, o sistema **DEVE** exibir mensagem de sucesso usando toast (sonner) indicando que o email foi reenviado.

A mensagem **DEVE** ser: "Email de confirmação reenviado!"

#### Cenário: Toast de sucesso após reenvio

- **GIVEN** que o usuário está na tela de erro "email não confirmado"
- **WHEN** o usuário clica em "Reenviar email de confirmação"
- **AND** a função `resendConfirmationEmail` retorna sucesso
- **THEN** o sistema **DEVE** exibir toast de sucesso com mensagem "Email de confirmação reenviado!"
- **AND** o botão **DEVE** ser desabilitado temporariamente para evitar spam

#### Cenário: Rate limiting tratado adequadamente

- **GIVEN** que o usuário está na tela de erro "email não confirmado"
- **WHEN** o usuário clica em "Reenviar email de confirmação"
- **AND** o Supabase retorna erro de rate limit
- **THEN** o sistema **DEVE** exibir toast de erro com mensagem amigável
- **AND** o botão **DEVE** permanecer desabilitado até que o rate limit expire

---

### Requirement: REQ-ENC-05 — Tratamento Separado de Erros

O erro `email_not_confirmed` **DEVE** ser tratado separadamente de outros erros de autenticação para evitar enumeração de emails válidos no sistema.

#### Cenário: Erro de credenciais inválidas não mostra opção de reenvio

- **GIVEN** que o usuário tentou fazer login com "usuario@email.com"
- **AND** a senha está incorreta
- **WHEN** o Supabase retorna erro `invalid_credentials`
- **THEN** o sistema **DEVE** exibir mensagem "Email ou senha incorretos"
- **AND** o sistema **NÃO DEVE** oferecer botão de reenvio de email

#### Cenário: Prevenção de enumeração de emails

- **GIVEN** que o usuário tentou fazer login com "naoexiste@email.com"
- **AND** esta conta não existe no sistema
- **WHEN** o Supabase retorna erro `invalid_credentials`
- **THEN** o sistema **DEVE** exibir a mesma mensagem "Email ou senha incorretos"
- **AND** o sistema **NÃO DEVE** revelar se o email existe ou não no sistema

---

## MODIFIED Requirements

Nenhum requisito existente foi modificado por esta change.

## REMOVED Requirements

Nenhum requisito foi removido por esta change.

---

## Critérios de Aceitação

| ID | Critério | Evidência |
|----|----------|-----------|
| CA-ENC-01 | Quando usuário tenta login com email não confirmado, o sistema DEVE exibir mensagem "Você ainda não confirmou seu email. Clique no link enviado para [email] ou solicite um novo email de confirmação." | Teste `login-email-not-confirmed.test.ts` |
| CA-ENC-02 | Quando usuário tenta login com email não confirmado, o sistema DEVE oferecer botão "Reenviar email de confirmação" | Teste `login-email-not-confirmed.test.ts` |
| CA-ENC-03 | Quando usuário clica em "Reenviar email de confirmação", o sistema DEVE chamar API `resend` do Supabase Auth | Teste `auth-resend.test.ts` |
| CA-ENC-04 | Após reenvio, o sistema DEVE exibir mensagem "Email de confirmação reenviado!" com feedback visual (toast sonner) | Teste `login-email-not-confirmed.test.ts` |
| CA-ENC-05 | O erro `email_not_confirmed` DEVE ser tratado separadamente de outros erros de autenticação | Teste `login-error-handling.test.ts` |
| CA-ENC-06 | A implementação DEVE manter segurança - não expor se email existe ou não no sistema para evitar enumeração | Teste `login-error-handling.test.ts` |

---

## Status

Especificação