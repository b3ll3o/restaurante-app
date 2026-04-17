# Proposta: email-conf-auth-issue

**ID:** email-conf-auth-issue  
**PRD de Origem:** `001-2026-04-17-email-conf-auth-issue`  
**Pipeline:** Acelerado (correção de configuração)  
**Data:** 2026-04-17  
**Urgência:** Crítica  

---

## Problema

Donos de restaurante não conseguem fazer login em `/admin/login` porque o Supabase Auth está com a confirmação de e-mail habilitada, mas os e-mails de confirmação **não chegam** aos usuários (sem SMTP configurado ou em ambiente de desenvolvimento).

O erro retornado pelo `supabase.auth.signInWithPassword()` é:

```
"Email not confirmed"
```

Isso torna o painel admin completamente inacessível para qualquer usuário recém-cadastrado.

---

## Solução Proposta

Desabilitar a confirmação de e-mail no Supabase Auth para o ambiente de desenvolvimento, permitindo login imediato após o cadastro.

**Passos:**

1. Acessar o **Supabase Dashboard** do projeto
2. Navegar em **Authentication → Settings**
3. Desabilitar a opção **"Enable email confirmations"**
4. Salvar as configurações
5. Testar login em `/admin/login` com as credenciais existentes

> **Nota:** Para produção, a solução recomendada é configurar um provedor SMTP (SendGrid, Resend, etc.) e manter a confirmação de e-mail ativa por segurança. Isso está fora do escopo desta change.

---

## Escopo

### Dentro do escopo

- Desabilitar confirmação de e-mail no Supabase Dashboard (configuração)
- Documentar o passo a passo para replicar em outros ambientes
- Testar fluxo de login e cadastro após a mudança

### Fora do escopo

- Configurar provedor SMTP para envio de e-mails (change futura)
- Implementar sistema de e-mail customizado
- Alterar o fluxo de autenticação no código da aplicação

---

## Impacto

| Item | Impacto |
|------|---------|
| Breaking changes | Não |
| Migração de dados | Não |
| Novos packages/dependências | Não |
| Mudança de código | Não (apenas configuração no Supabase Dashboard) |
| Segurança | Redução marginal em dev (aceitável); produção não afetada |
| Usuários existentes com e-mail não confirmado | Passarão a conseguir fazer login imediatamente |

---

## Alternativas Consideradas

### Alternativa 1: Configurar SMTP no Supabase *(descartada para agora)*

Configurar um provedor SMTP (ex.: Resend, SendGrid) para que os e-mails de confirmação sejam entregues corretamente.

**Por que descartada:** Requer configuração de serviço externo e credenciais adicionais. É a solução correta para produção, mas não resolve o problema imediato em desenvolvimento.

### Alternativa 2: Confirmar e-mail manualmente pelo Dashboard *(descartada)*

Acessar **Supabase Dashboard → Authentication → Users** e confirmar o e-mail do usuário manualmente.

**Por que descartada:** Não é escalável — cada novo usuário precisaria de intervenção manual. Serve como paliativo de emergência, não como solução.

### Alternativa 3: Usar Supabase Admin SDK para confirmar usuários via API *(descartada)*

Expor um endpoint interno que chama `supabase.auth.admin.updateUserById()` para confirmar o e-mail programaticamente.

**Por que descartada:** Adiciona complexidade desnecessária para um problema de configuração. Introduz risco de segurança se o endpoint não for devidamente protegido.

---

## Plano de Rollback

Caso a mudança cause problemas inesperados:

1. Acessar **Supabase Dashboard → Authentication → Settings**
2. Reabilitar **"Enable email confirmations"**
3. Configurar SMTP para garantir entrega dos e-mails

---

## Critérios de Sucesso

- [ ] Usuário consegue fazer login em `/admin/login` com e-mail e senha válidos
- [ ] Usuário recém-cadastrado via `/admin/signup` consegue logar sem precisar confirmar e-mail
- [ ] Nenhum erro `"Email not confirmed"` é retornado pelo Supabase Auth
- [ ] Fluxo de redirecionamento pós-login funciona corretamente (`/admin/dashboard`)

---

## Rastreabilidade

| Campo | Valor |
|-------|-------|
| PRD | `.openspec/backlog/prds/001-2026-04-17-email-conf-auth-issue/prd.md` |
| Requisito afetado | REQ-001 (login do dono do restaurante) |
| Componente afetado | Supabase Auth (configuração) |

---

## Status

**Proposta**
