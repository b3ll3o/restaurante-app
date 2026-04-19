# Spec: email-conf-auth-issue

**Change ID:** email-conf-auth-issue  
**Source Proposal:** `.openspec/changes/email-conf-auth-issue/proposal.md`  
**Pipeline:** Acelerado (configuração Supabase)  
**Data:** 2026-04-17  
**Urgência:** Crítica  

---

## Fonte da Verdade

Este documento é parte das especificações do MenuLink e serve como registro da mudança de configuração do Supabase Auth.

---

## ADDED Requirements

### Requirement: REQ-AUTH-001 — Login sem Confirmação de Email

O sistema **DEVE** permitir que o owner faça login em `/admin/login` utilizando email e senha **sem** necessidade de confirmar o email previamente, quando a configuração "Enable email confirmations" estiver desabilitada no Supabase Dashboard.

#### Cenário: Owner realiza login com credenciais válidas
- **GIVEN** o owner está na página `/admin/login`
- **WHEN** insere email e senha válidos
- **THEN** o sistema **DEVE** autenticar o owner e redirecionar para `/admin/dashboard`
- **AND** nenhum erro "Email not confirmed" **DEVE** ser exibido

#### Cenário: Owner recém-cadastrado realiza login
- **GIVEN** um novo owner se cadastrou em `/admin/signup`
- **AND** não confirmou seu email
- **WHEN** o owner tenta fazer login em `/admin/login` com as mesmas credenciais
- **THEN** o sistema **DEVE** autenticar o owner e redirecionar para `/admin/dashboard`
- **AND** nenhum erro **DEVE** ser exibido

---

### Requirement: REQ-AUTH-002 — Configuração de Email Confirmation

O ambiente de desenvolvimento **DEVE** ter a opção "Enable email confirmations" desabilitada no Supabase Dashboard para permitir login imediato.

#### Cenário: Verificação de configuração no Supabase Dashboard
- **GIVEN** o desenvolvedor acessa o Supabase Dashboard do projeto
- **WHEN** navega para **Authentication → Settings**
- **THEN** a opção **"Enable email confirmations"** **DEVE** estar desabilitada (off)
- **AND** as alterações **DEVEM** estar salvas

---

## MODIFIED Requirements

### Requirement: REQ-001 — Login do Dono do Restaurante (Modificado)

**Texto Original:**
> O sistema **DEVE** permitir que um usuário crie uma conta e registre seu restaurante

**Texto Atualizado:**
> O sistema **DEVE** permitir que um usuário crie uma conta e registre seu restaurante
> **E** o usuário **DEVE** conseguir fazer login imediatamente após o cadastro, sem necessidade de confirmar email, quando a configuração de email confirmation estiver desabilitada no Supabase.

---

## Critérios de Aceitação

### CA-AUTH-001: Login Funcional
- [ ] Usuário consegue fazer login em `/admin/login` com email e senha válidos
- [ ] Erro "Email not confirmed" **NÃO** é retornado pelo Supabase Auth
- [ ] Redirecionamento para `/admin/dashboard` ocorre corretamente

### CA-AUTH-002: Configuração Documentada
- [ ] Passo a passo de configuração documentado no README do projeto
- [ ] Orientação sobre diferença entre ambiente dev e produção documentada

---

## Orientação de Configuração (Fora do Escopo de Código)

### Passos para Desabilitar Email Confirmation

1. Acessar **Supabase Dashboard** do projeto
2. Navegar em **Authentication → Settings**
3. Desabilitar a opção **"Enable email confirmations"**
4. Salvar as configurações

### Ambientes

| Ambiente | Email Confirmation | Motivo |
|----------|-------------------|--------|
| Desenvolvimento | Disabled | Não há SMTP configurado; emails não chegam |
| Produção | Enabled (recomendado) | Segurança; requer SMTP configurado |

---

## Dependências

- **Supabase Auth**: Configuração via Dashboard (não há mudança de código)
- **REQ-001**: Afetado indiretamente (fluxo de login simplificado)

---

## Restrições

- **REQAUTH-R01**: Esta mudança **NÃO** inclui configuração de SMTP (sempre outside scope)
- **REQAUTH-R02**: Para produção, **DEVE-SE** configurar SMTP e reabilitar email confirmation

---

## Status

**Especificação**
