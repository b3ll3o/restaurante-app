# Auth Callback - MenuLink

## Visão Geral

**Rota**: `app/admin/auth/callback/route.ts`
**Responsabilidade**: Callback de autenticação Supabase
**Idioma**: Português Brasileiro (pt-BR)

---

## Estrutura de Diretórios

```
app/admin/auth/callback/
├── route.ts    # Endpoint de callback
└── AGENTS.md   # Esta documentação
```

---

## Funcionalidade

### Propósito

Endpoint que processa o callback após autenticação OAuth/Email do Supabase.

### Fluxo

1. Usuário tenta login via OAuth (Google, GitHub, etc.) ou magic link
2. Supabase redireciona para `/admin/auth/callback`
3. Este endpoint:
   - Extrai tokens da URL
   - Troca code/token por sessão
   - Redireciona para `/admin/dashboard` ou `/admin/login?error=...`

### Query Parameters

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `code` | `string` | Código de autorização (OAuth) |
| `token_hash` | `string` | Hash do magic link |
| `type` | `string` | Tipo: "oauth" ou "magiclink" |
| `error` | `string` | Erro, se houver |

### HTTP Methods

- **GET**: Processa callback e redireciona

### Response

| Status | Redirect para |
|--------|---------------|
| 302 | `/admin/dashboard` (sucesso) |
| 302 | `/admin/login?error=...` (erro) |

---

## Autenticação

- **Não requer**: Autenticação prévia (é o callback)
- **Cria**: Sessão do usuário no Supabase

---

## Erros Comuns

| Erro | Causa | Solução |
|------|-------|---------|
| `invalid_code` | Código expirado ou inválido | Tentar login novamente |
| `oauth_error` | Erro no provedor OAuth | Verificar configuração |
| `network_error` | Erro de conexão | Tentar novamente |

---

## Segurança

1. **DEVE** validar origin do callback
2. **DEVE** trocar code por sessão apenas uma vez
3. **NÃO DEVE** logar tokens em console
4. **DEVE** limpar URL após processar

---

## Arquivos Relacionados

| Arquivo | Relação |
|---------|---------|
| `app/admin/login/page.tsx` | Inicia fluxo OAuth |
| `app/admin/dashboard/page.tsx` | Destino após sucesso |
| `lib/supabase/client.ts` | Cliente Supabase |

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura unitária | ≥80% | Alta |

---

**Versão**: 1.0
**Última Atualização**: 2026-04-16
**Autor**: AI Agent