# PRD: 001 - Problema de Autenticação - Email Não Confirmado

**ID:** 001-2026-04-17-email-conf-auth-issue
**Status:** in-interview
**Phase:** prompt
**Autor:** Usuário
**Data:** 2026-04-17
**Última Revisão:** 2026-04-17

---

## 0. Objetivos de Negócio

- **Objetivo 1:** Permitir que o dono do restaurante faça login no painel admin
- **Objetivo 2:** Resolver problema de email de confirmação não recebido

---

## 1. Problema

### 1.1 Descrição do Problema

O usuário tenta acessar `/admin/login` mas recebe erro de **"email não confirmado"**. O usuário relata que **não recebeu email de confirmação** para confirmar sua conta.

### 1.2 Contexto

1. Usuário acessou `/admin/login`
2. Tentou fazer login com email e senha
3. Recebeu mensagem: "Email not confirmed" ou similar
4. Não recebeu email de confirmação na caixa de entrada

### 1.3 Evidências

- Usuário reportou: "esta dando email não confirmado e eu não recebi nada para confirmar email"
- Erro ocorre no login via `supabase.auth.signInWithPassword()`

---

## 2. Oportunidade

Identificar e resolver o problema de configuração do Supabase Auth para que:
- Usuários possam fazer login sem barreiras desnecessárias
- Email de confirmação funcione corretamente OU seja desabilitado se não necessário

---

## 3. Personas e Stakeholders

### 3.1 Personas Primárias

- **Carlos (Dono de Restaurante)**
  - Papel: Usuário tentando acessar o painel admin
  - Problema: Não consegue acessar porque email não foi confirmado
  - Necessidade: Acessar rapidamente para gerenciar seu restaurante

### 3.2 Stakeholders Impactados

| Stakeholder | Impacto |
|-------------|---------|
| Dono do restaurante | Não consegue acessar admin |
| Desenvolvimento | Precisa corrigir config do Supabase |

---

## 4. Resultado Esperado

### 4.1 Descrição

Usuário deve conseguir fazer login no painel admin com suas credenciais, seja através de:
- Confirmação de email funcionando, OU
- Desabilitando confirmação de email se não for crítica para o negócio

### 4.2 fora do Escopo

- Configurar email customizado no Supabase (por enquanto)
- Implementar sistema de email próprio

---

## 5. Requirements Interview

### 5.1 Perguntas e Respostas

#### Q1: Qual é o email que você está usando para fazer login?
- **Tipo:** clarification
- **Data:** 2026-04-17
- **Resposta:** [Aguardando resposta do usuário]

#### Q2: Você se cadastrou recentemente via `/admin/signup` ou a conta foi criada de outra forma?
- **Tipo:** clarification
- **Data:** 2026-04-17
- **Resposta:** [Aguardando resposta do usuário]

#### Q3: Você tem acesso ao dashboard do Supabase para verificar a config de email?
- **Tipo:** clarification
- **Data:** 2026-04-17
- **Resposta:** [Aguardando resposta do usuário]

#### Q4: Para este projeto, a confirmação de email é um requisito de segurança necessário?
- **Tipo:** tradeoff
- **Data:** 2026-04-17
- **Resposta:** [Aguardando resposta do usuário]

**Se SIM:** Precisamos configurar corretamente o template de email do Supabase
**Se NÃO:** Podemos desabilitar a confirmação de email no Supabase Dashboard

#### Q5: Você verificou a pasta de spam?
- **Tipo:** clarification
- **Data:** 2026-04-17
- **Resposta:** [Aguardando resposta do usuário]

---

## 6. Análise Técnica

### 6.1 Fluxo de Autenticação Atual

```
/admin/login (page.tsx)
    ↓
supabase.auth.signInWithPassword({ email, password })
    ↓
Supabase Auth
    ↓
[Se email confirmation ON] → Envia email → Erro "not confirmed"
[Se email confirmation OFF] → Login bem-sucedido
```

### 6.2 Possíveis Causas

| # | Causa | Probabilidade | Solução |
|---|-------|---------------|---------|
| 1 | Email confirmation está ON no Supabase | Alta | Desligar no dashboard OU configurar email |
| 2 | Template de email não configurado no Supabase | Alta | Configurar ou desabilitar |
| 3 | Email na pasta de spam | Baixa | Verificar spam |
| 4 | Projeto Supabase em modo de desenvolvimento | Alta | "Confirm email" pode se comportar diferente |
| 5 | Rate limiting do Supabase | Baixa | Aguardar e tentar novamente |

### 6.3 Configuração do Supabase Auth

No Supabase Dashboard > Authentication > Settings:

```
Email Confirmation: ON / OFF
SMTP Settings: Configurado / Não configurado
```

---

## 7. Soluções Possíveis

### Solução 1: Desabilitar Email Confirmation (Recomendado para Dev)

**Passos:**
1. Acessar Supabase Dashboard
2. Authentication > Settings
3. Desabilitar "Enable email confirmations"
4. Testar login novamente

**Vantagens:**
- Rápido de implementar
- Funciona imediatamente

**Desvantagens:**
- Menos seguro em produção

### Solução 2: Configurar SMTP do Supabase

**Passos:**
1. Configurar SMTP no Supabase (Email - Authentication)
2. Personalizar template de confirmação
3. Testar envio de email

**Vantagens:**
- Mais profissional
- Funciona em produção

**Desvantagens:**
- Requer configuração adicional
- Pode ter custos adicionais

### Solução 3: Usar o Admin do Supabase para Confirmar Manual

**Passos:**
1. Acessar Supabase Dashboard > Authentication > Users
2. Encontrar o usuário
3. Clicar em "Confirm email" manualmente

**Vantagens:**
- Rápido se você tem acesso

**Desvantagens:**
- Não escala para múltiplos usuários

---

## 8. Prompt Original

> [Usuário]: "estou tentando entrar na /admin/login e esta dando email não confirmado e eu n recebi nada para confirmar email"

---

## 9. Rastreabilidade

| Campo | Valor |
|-------|-------|
| Change ID | - |
| Commit | - |

## 10. Histórico de Fases

| Data | Fase | Status | Notas |
|------|------|--------|-------|
| 2026-04-17 | prompt | done | Problema reportado |
| 2026-04-17 | interview | in-progress | Aguardando respostas |

---

## 11. Próximos Passos

1. [ ] Responder às perguntas de clarification
2. [ ] Identificar causa raiz
3. [ ] Aplicar solução
4. [ ] Testar login

---

**Última Atualização:** 2026-04-17
**Status:** Em investigação
