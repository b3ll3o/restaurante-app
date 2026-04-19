# Login - PediAi

## Visão Geral

**Rota**: `app/admin/login/page.tsx`
**Responsabilidade**: Autenticação de administradores do painel
**Idioma**: Português Brasileiro (pt-BR)

---

## Estrutura de Diretórios

```
app/admin/login/
├── page.tsx    # Página de login
└── AGENTS.md   # Esta documentação
```

---

## Funcionalidade

### Propósito

Página de autenticação para administradores do restaurante. Permite que proprietários façam login para acessar o painel de gestão.

### Fluxo de Usuário

1. Usuário acessa `/admin/login`
2. Insere email e senha
3. Sistema valida credenciais via Supabase Auth
4. Se válido: redireciona para `/admin/dashboard`
5. Se inválido: exibe mensagem de erro

### Estados da Página

| Estado | Descrição | Comportamento |
|--------|-----------|---------------|
| `idle` | Formulário vazio | Exibe campos vazios |
| `loading` | Submissão em andamento | Botão desabilitado, spinner |
| `error` | Credenciais inválidas | Mensagem de erro abaixo do form |
| `success` | Login bem-sucedido | Redirect para dashboard |

### Parâmetros de URL

Nenhum parâmetro.required.

---

## Interface Pública

### Props (PageProps)

Nenhuma prop obrigatória.

### Estados Locais

| Estado | Tipo | Descrição |
|--------|------|-----------|
| `email` | `string` | Email do usuário |
| `password` | `string` | Senha do usuário |
| `isLoading` | `boolean` | Indica loading durante autenticação |
| `error` | `string \| null` | Mensagem de erro, se houver |

### Componentes Utilizados

- `Button` (shadcn/ui) - com `touch-target` (min 44x44px)
- `Input` (shadcn/ui) - com `min-h-[44px]` e `text-base` (16px)
- `Card` (shadcn/ui) - responsivo com `w-full max-w-md`
- `Label` (shadcn/ui)

## Responsividade

| Elemento | Mobile (<768px) | Tablet+ (≥768px) |
|----------|------------------|-------------------|
| Card | Full-width | Centralizado max-w-md |
| Padding | px-4 | px-4 (mesmo) |
| Inputs | Full-width | Full-width |
| Botão submit | touch-target 44x44px | touch-target 44x44px |

### Breakpoints

- **Mobile**: <768px - Card full-width, inputs 100% width
- **Tablet**: 768-1023px - Card centralizado, mesmo layout
- **Desktop**: ≥1024px - Card centralizado max-w-md

---

## Autenticação

### Método

Supabase Auth com email/password.

### Validações

- Email: formato válido, não vazio
- Senha: mínimo 6 caracteres

### Erros Comuns

| Código | Mensagem | Solução |
|--------|----------|---------|
| `INVALID_CREDENTIALS` | Email ou senha incorretos | Verificar credenciais |
| `USER_NOT_FOUND` | Usuário não encontrado | Verificar email |
| `NETWORK_ERROR` | Erro de conexão | Verificar internet |

---

## Integrações

### Supabase

- **Cliente**: `lib/supabase/client.ts`
- **Método**: `signInWithPassword({ email, password })`

### Redirect

- **Sucesso**: `/admin/dashboard`
- **Erro**: Permanece na página de login

---

## Regras de Implementação

1. **NÃO** armazenar senhas em texto claro
2. **DEVE** validar formato de email antes de enviar
3. **DEVE** exibir mensagens de erro amigáveis
4. **DEVE** desabilitar botão durante loading
5. **DEVE** limpar campos após logout

---

## Arquivos Relacionados

| Arquivo | Relação |
|---------|---------|
| `app/admin/layout.tsx` | Layout que envolve esta página |
| `app/admin/dashboard/page.tsx` | Destino após login |
| `lib/supabase/client.ts` | Cliente Supabase |
| `app/admin/auth/callback/route.ts` | Callback de autenticação |

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