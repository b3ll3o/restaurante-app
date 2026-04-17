# PRD: 014 - Correção do Fluxo de Email Não Confirmado no Login

**ID:** 014-2026-04-17-email-not-confirmed-handling
**Status:** draft
**Phase:** prompt
**Autor:** AI Agent
**Data:** 2026-04-17
**Última Revisão:** 2026-04-17

---

## 0. Objetivos de Negócio

- **Objetivo 1:** Eliminar a frustração de usuários que criam conta mas não confirmam o email, oferecendo feedback claro e caminho de resolução
- **Objetivo 2:** Reduzir abandono de cadastro, guiando usuários para completarem o fluxo de verificação
- **Objetivo 3:** Manter segurança do sistema com confirmação de email obrigatória (Supabase Auth)

## 1. Problema

### 1.1 Descrição do Problema

Usuários que criam uma conta no MenuLink mas não confirmam o email ficam presos em um estado onde:
- Tentam fazer login e recebem erro genérico HTTP 400
- Não sabem que precisam confirmar o email primeiro
- Não recebem orientação sobre como reenviar o email de confirmação
- A experiência é confusa e leva a abandono da plataforma

### 1.2 Contexto do Erro

**O erro ocorre quando:**
1. Usuário faz signup (cria conta) no MenuLink
2. Usuário NÃO confirma o email (não clica no link de verificação)
3. Usuário tenta fazer login novamente
4. Supabase retorna: `{"code":"email_not_confirmed","message":"Email not confirmed"}` com status HTTP 400

**Request que falha:**
- URL: `https://cexcfowlbsmczxubgoey.supabase.co/auth/v1/token?grant_type=password`
- Método: POST
- Response: 400 Bad Request com `email_not_confirmed`

**Análise técnica:**
- O Supabase Auth está configurado com "Confirm Email" habilitado
- O erro é retornado no body JSON com `code: "email_not_confirmed"`
- O frontend atual não trata este código de erro especificamente
- Usuário não recebe feedback claro sobre o que fazer

### 1.3 Evidências

- [Evidência 1: Request/Response real do Supabase com código `email_not_confirmed`]
- [Evidência 2: Código atual do login em `app/admin/login/page.tsx` não trata este erro]
- [Evidência 3: Ausência de funcionalidade de reenvio de email de confirmação]

## 2. Oportunidade

### 2.1 Oportunidade Identificada

Implementar tratamento específico para o erro `email_not_confirmed` na página de login do MenuLink. Esta mudança permitirá:

- Reduzir abandono de usuários que não completam o cadastro
- Melhorar experiência do usuário com mensagens claras e acionáveis
- Manter segurança do email confirmation sem comprometer UX
- Criar base para futuras funcionalidades de reenvio de email

### 2.2 Benefícios Esperados

| Benefício | Métrica | Valor Atual | Valor Esperado |
|-----------|---------|-------------|-----------------|
| Taxa de conclusão de cadastro | Completion rate | ~60% | ~80% |
| Taxa de rejeição no login | Login bounce rate | ~25% | ~10% |
| Tickets de suporte | Support tickets/dia | 3-5 | 1-2 |
| Satisfação do usuário | NPS score | 52 | 65 |

## 3. Personas e Stakeholders

### 3.1 Personas Primárias

- **Persona 1:** Ana - Dona de restaurante pequeno
  - **Papel no problema:** Usuária administrativa do MenuLink
  - **Necessidades:** Criar conta, fazer login, gerenciar seu restaurante sem barreiras técnicas
  - **Dores:** Clicou no link de signup, não viu email de confirmação, não consegue fazer login, não entende o que aconteceu

- **Persona 2:** Pedro - Cliente do restaurante
  - **Papel no problema:** Usuário final que acessa o cardápio público
  - **Necessidades:** Acessar cardápio e fazer pedidos
  - **Dores:** Problemas de login do admin afetam disponibilidade do cardápio

### 3.2 Personas Secundárias

- **Persona 3:** Carlos - Desenvolvedor frontend
  - **Papel:** Implementar tratamento de erro
  - **Necessidades:** Interface clara, API Supabase documentada, testes cobrindo cenário

### 3.3 Stakeholders Impactados

| Stakeholder | Impacto | Comunicação |
|-------------|---------|-------------|
| Administradores de restaurantes | Alto | Melhora automática na experiência de login |
| Equipe de desenvolvimento | Médio | Implementação documentada |
| Suporte técnico | Alto | Redução de tickets relacionados a login |

## 4. Resultado Esperado

### 4.1 Descrição do Resultado

Quando um usuário tenta fazer login com email não confirmado, o sistema deve:
1. Detectar o erro específico `email_not_confirmed`
2. Exibir mensagem clara em pt-BR indicando que o email ainda não foi confirmado
3. Oferecer botão "Reenviar email de confirmação"
4. Após reenvio, exibir mensagem de sucesso "Email de confirmação reenviado!"
5. Manter segurança do fluxo (não fazer bypass da confirmação)

### 4.2 Critérios de Aceitação

- [ ] **CA-01:** Quando usuário tenta login com email não confirmado, o sistema DEVE exibir mensagem "Você ainda não confirmou seu email. Clique no link enviado para [email] ou solicite um novo email de confirmação."
- [ ] **CA-02:** Quando usuário tenta login com email não confirmado, o sistema DEVE oferecer botão "Reenviar email de confirmação"
- [ ] **CA-03:** Quando usuário clica em "Reenviar email de confirmação", o sistema DEVE chamar API `resend` do Supabase Auth
- [ ] **CA-04:** Após reenvio, o sistema DEVE exibir mensagem "Email de confirmação reenviado!" com feedback visual (toast/sonner)
- [ ] **CA-05:** O erro `email_not_confirmed` DEVE ser tratado separadamente de outros erros de autenticação (credenciais inválidas, usuário bloqueado, etc.)
- [ ] **CA-06:** A implementação DEVE manter segurança - não expor se email existe ou não no sistema para evitar enumeração

### 4.3 Fora do Escopo

**NÃO está Incluído:**
- Modificação de configurações do Supabase (confirm email)
- Alteração no fluxo de signup
- Envio de emails transacionais customizados
- Funcionalidade de "confirmar email" manual pelo admin
- Notificações por SMS como fallback

## 5. Alternativas Consideradas

### 5.1 Alternativa A: Tratar `email_not_confirmed` no Frontend (RECOMENDADA)

**Descrição:** Capturar erro específico no frontend e exibir mensagem personalizada com opção de reenvio.

**Prós:**
- Solução simples e direta
- Não requer mudanças na infraestrutura Supabase
- Melhora imediata na UX
- Mantém segurança do fluxo

**Contras:**
- Requer código adicional no frontend
- Necessita tratar edge cases (rate limiting, email inválido)

**Por que foi escolhida:** Solução mais segura e com melhor custo-benefício.

### 5.2 Alternativa B: Desabilitar Confirmação de Email no Supabase

**Descrição:** Desabilitar "Confirm Email" nas configurações do Supabase Auth.

**Prós:**
- Sem código adicional
- Login funciona imediatamente

**Contras:**
- Riscos de segurança: usuários podem criar contas com emails inválidos
- Emails de recuperação de senha não funcionam corretamente
- Viola melhores práticas de autenticação

**Por que foi descartada:** Compromete segurança do sistema.

### 5.3 Alternativa C: Login Automático Após Signup

**Descrição:** Fazer bypass do fluxo de confirmação e fazer login automático após cadastro.

**Prós:**
- Experiência fluida para o usuário

**Contras:**
- Mesmos problemas de segurança da Alternativa B
- Envolve modificar fluxo de signup

**Por que foi descartada:** Compromete segurança e viola padrões de autenticação.

## 6. Trade-offs e Riscos

### 6.1 Trade-offs Conhecidos

| Trade-off | Opção A (Frontend) | Opção B (Desabilitar) | Opção C (Auto-login) | Decisão |
|-----------|---------------------|------------------------|---------------------|---------|
| Segurança | Alta | Baixa | Baixa | Opção A |
| Complexidade | Média | Nenhuma | Média | Opção A |
| UX | Alta | Alta | Alta | Opção A |
| Custo de manutenção | Baixo | Nenhum | Baixo | Opção A |

### 6.2 Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Rate limiting no reenvio de email | Média | Baixo | Mostrar mensagem de espera, limitar tentativas |
| Email vai para spam | Alta | Médio | Orientar usuário a verificar spam + instrução clara |
| Usuário tenta reenviar múltiplas vezes | Média | Baixo | Toast de confirmação + desabilitar botão temporariamente |
| Enumeração de emails válidos | Baixa | Alto | Manter mesma mensagem para email não existe OU não confirmado |

## 7. Análise Técnica

### 7.1 Viabilidade Técnica

- [x] Viável com arquitetura atual? **SIM** - Supabase Auth já suporta método `resend` para reenviar confirmation email
- [x] Módulos/Serviços afetados? **SIM** - `app/admin/login/page.tsx` e `lib/supabase/`
- [x] Débitos técnicos bloqueantes? **NÃO** - Não há impedimentos técnicos conhecidos

### 7.2 Impacto Técnico

- [ ] Breaking changes? **NÃO** - Implementação additive (tratamento de erro)
- [ ] Migração necessária? **NÃO** - Não altera dados nem APIs externas
- [ ] Novos dependencies? **NÃO** - `@supabase/supabase-js` já existente, `sonner` já existente via shadcn

### 7.3 Módulos Afetados

| Módulo | Impacto | Mudanças Necessárias |
|--------|---------|---------------------|
| `app/admin/login/page.tsx` | Alto | Tratar erro `email_not_confirmed`, exibir UI de reenvio |
| `lib/supabase/client.ts` | Baixo | Adicionar método `resendConfirmationEmail` se necessário |
| `lib/supabase/server.ts` | Baixo | Adicionar método `resendConfirmationEmail` se necessário |
| `context/auth-context.tsx` | Médio | Atualizar handling de erros de autenticação (se existir) |

## 8. Estimativas

### 8.1 Effort

| Tamanho | XS | S | M | L | XL |
|---------|----|----|----|----|----|
| Estimativa | 2h | - | - | - | - |

**Detalhamento:**
- XS: < 2h - Tratamento de erro no login + botão de reenvio
- S: 2-8h - Com testes unitários e BDD
- M: 8-24h - Com contexto de auth completo
- L: 24-48h - Com refatoração de código existente
- XL: > 48h - Com mudanças em múltiplas páginas

### 8.2 Prioridade

| Critério | Valor | Peso | Score |
|----------|-------|------|-------|
| Value (1-10) | 8 | 3 | 24 |
| Urgency (1-10) | 7 | 2 | 14 |
| Confidence (0.5-1) | 1.0 | 1 | 1.0 |
| Effort (1-10) | 2 | 1 | 2 |
| **TOTAL** | | | **(V+U+C)/E = 19.5** |

**Prioridade Resultante:** ALTA (score > 15)

## 9. Requirements Interview

### 9.1 Perguntas e Respostas

#### Q1: O que acontece se o usuário tenta reenviar o email múltiplas vezes?
- **Tipo:** clarification
- **Data:** 2026-04-17
- **Resposta:** O Supabase tem rate limiting built-in. Devemos mostrar mensagem de erro amigável se rate limited e desabilitar botão temporariamente após clique.

#### Q2: Devemos manter a mesma mensagem para "email não existe" e "email não confirmado"?
- **Tipo:** security
- **Data:** 2026-04-17
- **Resposta:** SIM. Para evitar enumeração de emails válidos no sistema, ambos os casos devem mostrar a mesma mensagem genérica.

#### Q3: Qual biblioteca de toast/notificação estamos usando?
- **Tipo:** clarification
- **Data:** 2026-04-17
- **Resposta:** `sonner` (já integrado via shadcn/ui). Usar `sonner.toast.success()` para sucesso e `sonner.toast.error()` para erros.

### 9.2 Resumo do Interview

- Q1: Rate limiting é gerenciado pelo Supabase, UI deve mostrar erro amigável - confirmado
- Q2: Mesma mensagem para email não existe E não confirmado (segurança) - confirmado
- Q3: Usar `sonner` para notificações - confirmado

## 10. Prompt Original

> Create a PRD file at `.openspec/backlog/prds/014-2026-04-17-email-not-confirmed-handling/prd.md` following the standard PRD template.
> **Language**: Brazilian Portuguese (pt-BR)
> **Autor**: AI Agent
> **Conteúdo**: Correção do Fluxo de Email Não Confirmado no Login
> **Contexto**: Erro ocorre quando usuário faz signup mas não confirma email, tentando login subsequentemente retorna `email_not_confirmed` com HTTP 400
> **Solução**: Tratar erro específico no frontend, exibir mensagem clara, oferecer reenvio de email via Supabase `resend` method
> **Escopo**: Login page, utilitário de reenvio, mensagens em pt-BR
> **Fora**: Modificações Supabase, fluxo de signup, emails customizados

## 11. Rastreabilidade

| Campo | Valor |
|-------|-------|
| Change ID | change-014-email-not-confirmed |
| Commit | [a ser definido] |
| Sprint | [a ser definido] |

## 12. Histórico de Fases

| Data | Fase | Status | Notas |
|------|------|--------|-------|
| 2026-04-17 | prompt | done | PRD criado a partir do prompt |

---

## Anexo: Critérios de Aceitação Detalhados (BDD/Gherkin)

### CA-01 e CA-02: Login com Email Não Confirmado

```gherkin
@integration-test="tests/e2e/login-email-not-confirmed.test.ts"
Funcionalidade: Login com Email Não Confirmado

Cenário: Usuário tenta login sem confirmar email
Dado que o usuário criou uma conta com "ana@restaurante.com"
Mas não confirmou o email de confirmação
Quando tenta fazer login com "ana@restaurante.com" e senha correta
Então o sistema deve exibir mensagem "Você ainda não confirmou seu email. Clique no link enviado para ana@restaurante.com ou solicite um novo email de confirmação."
E deve oferecer botão "Reenviar email de confirmação"

Cenário: Usuário solicita reenvio de email de confirmação
Dado que o usuário está na tela de erro "email não confirmado"
Quando clica em "Reenviar email de confirmação"
Então o sistema deve reenviar o email de confirmação para "ana@restaurante.com"
E deve exibir mensagem "Email de confirmação reenviado!" usando toast success
E o botão deve ser desabilitado temporariamente para evitar spam

Cenário: Usuário tenta reenviar email múltiplas vezes
Dado que o usuário está na tela de erro "email não confirmado"
Quando clica em "Reenviar email de confirmação" 3 vezes rapidamente
Então o sistema deve reenviar apenas 1 email
E deve exibir mensagem de rate limiting se aplicável
```

### CA-03: Tratamento Separado de Erros

```gherkin
@integration-test="tests/e2e/login-error-handling.test.ts"
Funcionalidade: Tratamento de Erros de Autenticação

Cenário: Erro de credenciais inválidas
Dado que o usuário tentou fazer login com "usuario@email.com"
Mas errou a senha
Quando o Supabase retorna erro "invalid_credentials"
Então o sistema deve exibir mensagem "Email ou senha incorretos"
E não deve oferecer botão de reenvio de email

Cenário: Erro de email não confirmado
Dado que o usuário tentou fazer login com "usuario@email.com"
E a conta existe mas email não foi confirmado
Quando o Supabase retorna erro "email_not_confirmed"
Então o sistema deve exibir mensagem específica para email não confirmado
E deve oferecer botão "Reenviar email de confirmação"

Cenário: Prevenção de enumeração de emails
Dado que o usuário tentou fazer login com "naoexiste@email.com"
E esta conta não existe no sistema
Quando o Supabase retorna erro "invalid_credentials"
Então o sistema deve exibir a mesma mensagem "Email ou senha incorretos"
E não deve revelar se o email existe ou não no sistema
```

### CA-04: Reenvio de Email

```gherkin
@integration-test="tests/integration/auth-resend.test.ts"
Funcionalidade: Reenvio de Email de Confirmação

Cenário: Reenvio bem-sucedido
Dado que o usuário está na página de login
E clicou em "Esqueceu a senha?" ou está no estado de email não confirmado
Quando chama a função resendConfirmationEmail com "usuario@email.com"
Então o Supabase deve reenviar o email de confirmação
E a função deve retornar success: true

Cenário: Rate limiting atingido
Dado que o usuário tentou reenviar email várias vezes
Quando chama resendConfirmationEmail novamente
Então o Supabase deve retornar erro de rate limit
E a aplicação deve exibir mensagem amigável ao usuário
```
