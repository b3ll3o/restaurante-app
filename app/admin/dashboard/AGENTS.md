# Dashboard - MenuLink

## Visão Geral

**Rota**: `app/admin/dashboard/page.tsx`
**Responsabilidade**: Painel principal de gestão do restaurante
**Idioma**: Português Brasileiro (pt-BR)

---

## Estrutura de Diretórios

```
app/admin/dashboard/
├── page.tsx    # Página do dashboard
└── AGENTS.md   # Esta documentação
```

---

## Funcionalidade

### Propósito

Página principal do painel administrativo. Exibe métricas, atalhos rápidos e resumo da situação do restaurante.

### Métricas Exibidas

| Métrica | Descrição | Fonte |
|---------|-----------|-------|
| Pedidos Hoje | Quantidade de pedidos do dia | `orders` table |
| Pedidos Pendentes | Pedidos com status "pending" | `orders` table |
| Receita do Dia | Soma dos pedidos confirmados | `orders` table |
| Categorias | Total de categorias | `categories` table |
| Produtos | Total de produtos | `products` table |

### Atalhos Rápidos

- Adicionar Categoria
- Adicionar Produto
- Ver Pedidos Pendentes
- Configurações

### Fluxo de Usuário

1. Admin acessa `/admin/dashboard`
2. Sistema carrega métricas e dados
3. Exibe dashboard com métricas e atalhos
4. Admin pode clicar em atalhos para navegar

---

## Interface Pública

### Componentes Utilizados

- `Card` (shadcn/ui) - Para exibir métricas
- `Button` (shadcn/ui) - Para atalhos
- `Badge` (shadcn/ui) - Para status

### Estrutura de Dados

```typescript
interface DashboardMetrics {
  ordersToday: number;
  pendingOrders: number;
  revenueToday: number;
  totalCategories: number;
  totalProducts: number;
}
```

---

## Autenticação

- **Requerida**: Sim (Supabase Auth)
- **Verificação**: Middleware de autenticação
- **Redirect**: `/admin/login` se não autenticado

---

## Carregamento de Dados

### Dados Carregados

1. Métricas de pedidos (hoje, pendentes, receita)
2. Contagem de categorias
3. Contagem de produtos

### Estado de Carregamento

| Estado | UI |
|--------|-----|
| `loading` | Skeleton/Loading spinner |
| `success` | Dados exibidos |
| `error` | Mensagem de erro com retry |

---

## Arquivos Relacionados

| Arquivo | Relação |
|---------|---------|
| `app/admin/layout.tsx` | Layout com sidebar |
| `app/admin/orders/page.tsx` | Página de pedidos |
| `app/admin/categories/page.tsx` | Página de categorias |
| `app/admin/products/page.tsx` | Página de produtos |
| `app/admin/settings/page.tsx` | Página de configurações |

---

## Regras de Implementação

1. **DEVE** verificar autenticação antes de carregar dados
2. **DEVE** exibir estado de loading durante fetch
3. **DEVE** tratar erros de forma amigável
4. **DEVE** atualizar métricas em tempo real (polling ou SSE)

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura unitária | ≥80% | Alta |
| Testes E2E | Fluxo de acesso coberto | Alta |

---

**Versão**: 1.0
**Última Atualização**: 2026-04-16
**Autor**: AI Agent