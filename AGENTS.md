# MenuLink

## Visão Geral

SaaS multi-tenant para restaurantes com cardápio digital e pedidos via WhatsApp.

**Idioma**: Português Brasileiro (pt-BR)
**Versão**: 5.0
**Última Atualização**: 2026-04-19

---

## Stack

| Tecnologia | Versão |
|------------|--------|
| Next.js | 16.2.3 |
| React | 19 |
| TypeScript | strict |
| Tailwind CSS | 4 |
| Supabase | - |

---

## Arquitetura

- **Multi-tenant**: isolado por `restaurant_id`
- **Mobile-first**: otimizado para dispositivos móveis
- **Offline-first**: carrinho persiste em localStorage

---

## Estrutura de Diretórios

```
app/              # Rotas (admin/, menu/[slug]/, api/)
components/       # Componentes UI e admin
lib/              # Utils, Supabase, WhatsApp
context/          # CartContext
hooks/            # Custom hooks
types/            # Definições TypeScript
tests/            # unit/, integration/, e2e/
supabase/         # Schema SQL
opencode/         # Documentação IA centralizada
  └── rules/      # Regras centralizadas (FONTE CENTRALIZADA)
```

---

## Regras do Projeto

**ATENÇÃO**: Todas as regras estão em `opencode/rules/AGENTS.md`. Este arquivo é apenas visão geral.

---

## Glossário

| Termo | Definição |
|-------|-----------|
| **Tenant** | Restaurante individual no sistema multi-tenant |
| **Slug** | Identificador único do restaurante na URL |
| **Order** | Pedido com itens, cliente e status |

---

**Versão**: 5.0
**Última Atualização**: 2026-04-19
