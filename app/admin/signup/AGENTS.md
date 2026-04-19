# Signup - PediAi

## Visão Geral

**Rota**: `app/admin/signup/page.tsx`
**Responsabilidade**: Cadastro de novos administradores
**Idioma**: Português Brasileiro (pt-BR)

---

## Estrutura de Diretórios

```
app/admin/signup/
├── page.tsx    # Página de cadastro
└── AGENTS.md   # Esta documentação
```

---

## Funcionalidade

### Propósito

Página para criação de novas contas de administrador. Usada quando um restaurante ainda não tem conta.

### Fluxo de Usuário

1. Usuário acessa `/admin/signup`
2. Preenche: nome, email, senha, confirmação de senha
3. Clica em "Criar Conta"
4. Sistema cria conta via Supabase Auth
5. Se válido: redireciona para `/admin/dashboard`
6. Se inválido: exibe erros de validação

### Estados da Página

| Estado | Descrição |
|--------|-----------|
| `idle` | Formulário vazio |
| `loading` | Criação em andamento |
| `error` | Erro de validação ou criação |
| `success` | Conta criada com sucesso |

---

## Interface Pública

### Estados Locais

| Estado | Tipo | Descrição |
|--------|------|-----------|
| `name` | `string` | Nome do proprietário |
| `email` | `string` | Email para login |
| `password` | `string` | Senha (mín. 6 caracteres) |
| `confirmPassword` | `string` | Confirmação de senha |
| `isLoading` | `boolean` | Loading durante criação |
| `error` | `string \| null` | Mensagem de erro |

### Validações

| Campo | Regra |
|-------|-------|
| Nome | Não vazio, mínimo 2 caracteres |
| Email | Formato válido de email |
| Senha | Mínimo 6 caracteres |
| Confirmação | Deve ser igual à senha |

## Responsividade

| Elemento | Mobile (<768px) | Tablet+ (≥768px) |
|----------|------------------|-------------------|
| Card | Full-width | Centralizado max-w-md |
| Padding | px-4 | px-4 |
| Inputs | Full-width | Full-width |
| Botão submit | touch-target 44x44px | touch-target 44x44px |

### Breakpoints

- **Mobile**: <768px - Card full-width, same responsive pattern as login
- **Tablet**: 768-1023px - Card centralizado
- **Desktop**: ≥1024px - Card centralizado max-w-md

---

## Autenticação

### Método

Supabase Auth com email/password.

### Fluxo de Criação

1. Validar todos os campos
2. Verificar se email já existe
3. Criar usuário com `signUp({ email, password })`
4. Criar registro do restaurante (se aplicável)

---

## Erros Comuns

| Código | Mensagem | Solução |
|--------|----------|---------|
| `EMAIL_TAKEN` | Este email já está em uso | Usar outro email |
| `WEAK_PASSWORD` | Senha muito fraca | Usar senha mais forte |
| `NETWORK_ERROR` | Erro de conexão | Tentar novamente |

---

## Arquivos Relacionados

| Arquivo | Relação |
|---------|---------|
| `app/admin/login/page.tsx` | Login para usuários existentes |
| `app/admin/dashboard/page.tsx` | Destino após cadastro |
| `lib/supabase/client.ts` | Cliente Supabase |

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura unitária | ≥80% | Alta |
| Testes E2E | Fluxo completo coberto | Alta |

---

**Versão**: 1.0
**Última Atualização**: 2026-04-16
**Autor**: AI Agent