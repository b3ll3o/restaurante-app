# Settings - PediAi

## Visão Geral

**Rota**: `app/admin/settings/page.tsx`
**Responsabilidade**: Configurações do restaurante e conta
**Idioma**: Português Brasileiro (pt-BR)

---

## Estrutura de Diretórios

```
app/admin/settings/
├── page.tsx    # Página de configurações
└── AGENTS.md   # Esta documentação
```

---

## Funcionalidade

### Propósito

Interface para gerenciar configurações do restaurante e da conta do administrador.

### Seções de Configuração

#### 1. Dados do Restaurante

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `name` | `string` | Nome do restaurante |
| `slug` | `string` | URL do cardápio público |
| `owner_whatsapp` | `string` | WhatsApp para pedidos |

#### 2. Conta do Administrador

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `email` | `string` | Email da conta |
| `name` | `string` | Nome do proprietário |

#### 3. Preferências

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `notifications` | `boolean` | Ativar notificações |
| `auto_confirm` | `boolean` | Auto-confirmar pedidos |

### Fluxo de Usuário

1. Admin acessa `/admin/settings`
2. Sistema carrega dados atuais
3. Admin modifica campos desejados
4. Admin clica em "Salvar Alterações"
5. Sistema valida e salva
6. Exibe mensagem de sucesso/erro

---

## Validações

| Campo | Regra |
|-------|-------|
| Nome restaurante | Obrigatório, máx 100 caracteres |
| Slug | Único, formato URL válido (a-z, 0-9, -) |
| WhatsApp | Formato brasileiro (+55XX...) |

---

## Autenticação

- **Requerida**: Sim
- **Operações**: Update de perfil via Supabase Auth

---

## Arquivos Relacionados

| Arquivo | Relação |
|---------|---------|
| `app/admin/layout.tsx` | Layout com sidebar |
| `lib/supabase/client.ts` | Cliente Supabase |
| `app/menu/[slug]/page.tsx` | Cardápio público usa slug |

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura unitária | ≥80% | Alta |

---

**Versão**: 1.0
**Última Atualização**: 2026-04-16
**Autor**: AI Agent