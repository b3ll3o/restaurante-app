# Design: email-conf-auth-issue

**Change ID:** email-conf-auth-issue
**Pipeline:** Acelerado
**Data:** 2026-04-17

---

## Abordagem Técnica

Esta mudança é **exclusivamente uma configuração no Supabase Dashboard**. Nenhum arquivo de código será modificado.

### Configuração Necessária

No **Supabase Dashboard** → **Authentication** → **Settings**:

| Setting | Valor Atual | Valor Necessário |
|---------|-------------|------------------|
| Enable email confirmations | Enabled (provável) | **Disabled** |

### Impacto

- **Nenhum arquivo criado/modificado/deletado** no codebase
- **Nenhum novo dependency** adicionado
- **Nenhum teste necessário** para esta mudança

### Justificativa

O Supabase Auth por padrão requer confirmação de email antes do login. Isso bloqueia o fluxo de desenvolvimento onde não há SMTP configurado. Desabilitar esta opção permite que owners façam login imediatamente após o cadastro.

---

## Decisões de Arquitetura

### Decisão: Desabilitar Email Confirmation no Supabase Auth

**Escolha:** Configuração via Supabase Dashboard (UI)

**Alternativas consideredas:**
1. Configurar SMTP real (complexo, fora do escopo)
2. Usar magic links (requer código adicional)
3. Configuração via environment variable (Supabase não suporta para este setting)

**Rationale:** A única forma de desabilitar email confirmation no Supabase é via Dashboard. Esta é uma configuração do provedor de autenticação, não do código da aplicação.

---

## Fluxo de Configuração

```
Desenvolvedor acessa Supabase Dashboard
    ↓
Navega para Authentication → Settings
    ↓
Desabilita "Enable email confirmations"
    ↓
Salva configurações
    ↓
Testa login em /admin/login
```

---

## Verificação

A verificação será realizada via teste manual:

1. Acessar `/admin/login`
2. Fazer login com credenciais de owner recém-cadastrado
3. **PASS**: Redirecionamento para `/admin/dashboard` sem erro "Email not confirmed"
4. **FAIL**: Erro "Email not confirmed" exibido

---

## Status

**Design criado** - aguardando aplicação da configuração no Supabase Dashboard.