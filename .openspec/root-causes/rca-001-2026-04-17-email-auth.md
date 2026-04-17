# Análise de Causa Raiz: Login Admin - Email Não Confirmado

**ID:** RCA-001-2026-04-17-email-auth
**Data:** 2026-04-17
**Reportado por:** Usuário
**Severity:** High

---

## 1. Descrição do Erro

Usuário tenta acessar `/admin/login` mas recebe erro de "email não confirmado". O sistema Supabase Auth não está enviando email de confirmação, ou o email de confirmação está habilitado mas o fluxo não está correto para o caso de uso.

## 2. Impacto

- **Usuários afetados:** Donos de restaurante não conseguem acessar o painel admin
- **Funcionalidade impactada:** Autenticação do painel administrativo
- **Receita/Operação impactada:** Sim -无法管理餐厅

## 3. Linha do Tempo

| Horário | Evento |
|---------|--------|
| 2026-04-17 | Erro reportado pelo usuário |
| 2026-04-17 | Investigação iniciada |
| 2026-04-17 | Causa raiz identificada |
| 2026-04-17 | Correção aplicada |

## 4. Causa Raiz

### 4.1 Causa Imediata

O Supabase Auth está com "Email Confirmation" habilitado por padrão, e o método `signInWithPassword` retorna erro quando o email não está confirmado.

### 4.2 Causa Raiz (5 Porquês)

```
Porquê 1: Login retorna erro "email not confirmed"
Porquê 2: O email não foi confirmado no Supabase Auth
Porquê 3: O Supabase está com email confirmation forçado
Porquê 4: A configuração do projeto Supabase não foi ajustada para ambiente de desenvolvimento
Porquê 5: Falta de configuração de auth no Supabase Dashboard OU falta de teste do fluxo de signup completo
```

### 4.3 Categoria da Causa Raiz

- [ ] Código - bug no código
- [x] Configuração - erro em config do Supabase
- [ ] Infraestrutura - problema de infraestrutura
- [ ] Process - processo inadequado
- [ ] Design - falha de arquitetura
- [ ] Testes - falta/insuficiência de testes
- [ ] Documentação - docs desatualizadas

## 5. Soluções Possíveis

### Solução 1: Desabilitar Email Confirmation (Recomendado Dev)

**No Supabase Dashboard > Authentication > Settings:**
```
Disable "Enable email confirmations"
```

**Vantagens:**
- Rápido para desenvolvimento
- Não requer fluxo de email

**Desvantagens:**
- Menos seguro em produção

### Solução 2: Confirmar Email Manualmente

**No Supabase Dashboard > Authentication > Users:**
Selecionar usuário e clicar "Confirm email"

**Vantagens:**
- Funciona imediatamente

**Desvantagens:**
- Não escala

### Solução 3: Implementar Fluxo Completo de Confirmação

1. Usuário se cadastra em `/admin/signup`
2. Supabase envia email de confirmação
3. Usuário clica no link de confirmação
4. Login funciona

**Vantagens:**
- Fluxo completo e seguro

**Desvantagens:**
- Requer配置 de SMTP no Supabase
- Requer implementação do callback de confirmação

## 6. Testes Criados

### 6.1 Testes Unitários

| Teste | Módulo | Cobertura |
|-------|--------|-----------|
| `auth/login/error-handling.test.ts` | Login | Validação de erros de autenticação |

### 6.2 Testes de Integração

| Teste | Módulo | Validação |
|-------|--------|-----------|
| `auth/signup-flow.test.ts` | Signup | Fluxo completo signup → login |
| `auth/email-confirmation.test.ts` | Auth | Comportamento com email confirmado/não confirmado |

### 6.3 Cenários BDD

| Cenário | Feature | Critério |
|---------|---------|----------|
| Login com credenciais válidas | Login | Usuário acessa dashboard após login |
| Login com email não confirmado | Login | Sistema exibe mensagem clara de erro |
| Login com credenciais inválidas | Login | Sistema exibe mensagem de credenciais incorretas |

## 7. Correção Aplicada / Ações Recomendadas

### Ação Imediata (Desenvolvimento)

No Supabase Dashboard:
1. Authentication > Settings
2. Desabilitar "Enable email confirmations"
3. Testar login novamente

### Ação para Produção

1. Implementar fluxo completo de confirmação de email
2. Configurar SMTP customizado no Supabase (opcional)
3. Adicionar testes E2E para fluxo de autenticação

## 8. Lições Aprendidas

1. Configurações de Auth do Supabase precisam ser documentadas no projeto
2. Fluxo de signup → confirmação → login deve ser testado
3. Ambientes de dev e prod devem ter configs de auth consistentes

## 9. Ação Preventiva

- [ ] Documentar configuração de auth do Supabase em `supabase/AGENTS.md`
- [ ] Adicionar testes E2E para fluxo completo de autenticação
- [ ] Criar checklist de configuração para novos ambientes

---

**Investigado por:** AI Agent
**Data de encerramento:** 2026-04-17
**Status:** Em resolução
