# Orders - PediAi

## Visão Geral

**Rota**: `app/admin/orders/page.tsx`
**Responsabilidade**: Gestão de pedidos (visualização, status, ações)
**Idioma**: Português Brasileiro (pt-BR)

---

## Estrutura de Diretórios

```
app/admin/orders/
├── page.tsx       # Página de pedidos
├── orders.feature # Cenários BDD
└── AGENTS.md      # Esta documentação
```

---

## Funcionalidade

### Propósito

Interface para visualizar e gerenciar pedidos do restaurante.

### Status do Pedido

```
pending → confirmed → cancelled
```

| Status | Descrição | Ações Disponíveis |
|--------|-----------|-------------------|
| `pending` | Aguardando confirmação | Confirmar, Cancelar |
| `confirmed` | Confirmado e em preparo | Cancelar |
| `cancelled` | Cancelado | Nenhuma |

### Campos do Pedido

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `uuid` | Identificador único |
| `restaurant_id` | `uuid` | FK para restaurante |
| `customer_name` | `string` | Nome do cliente |
| `customer_whatsapp` | `string` | WhatsApp do cliente |
| `total` | `number` | Valor total (centavos) |
| `status` | `enum` | pending/confirmed/cancelled |
| `payment_method` | `enum` | PIX/dinheiro/cartão |
| `created_at` | `timestamp` | Data/hora criação |

### Campos do Item

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `product_name` | `string` | Nome do produto |
| `unit_price` | `number` | Preço unitário |
| `quantity` | `integer` | Quantidade |
| `total_price` | `number` | Preço total (qtd × preço) |

### Fluxo de Usuário

1. Admin acessa `/admin/orders`
2. Sistema carrega pedidos (mais recentes primeiro)
3. Admin pode:
   - Visualizar lista de pedidos
   - Filtrar por status
   - Ver detalhes do pedido (itens)
   - Confirmar pedido (muda para `confirmed`)
   - Cancelar pedido (muda para `cancelled`)
   - Copiar texto do pedido para WhatsApp

---

## Interface Pública

### Estados da Página

| Estado | Descrição |
|--------|-----------|
| `loading` | Carregando pedidos |
| `success` | Lista exibida |
| `error` | Erro ao carregar |
| `filtering` | Filtro aplicado |

### Componentes Utilizados

- `Table` (shadcn/ui) - Lista de pedidos (desktop ≥1024px)
- `Cards` (shadcn/ui) - Lista de pedidos (mobile <1024px)
- `Badge` (shadcn/ui) - Status do pedido
- `Button` (shadcn/ui) - Ações com touch-target 44x44px
- `Dialog` (shadcn/ui) - Detalhes do pedido (fullscreen em mobile)
- `Select` (shadcn/ui) - Filtro por status

### Layout Adaptativo (Cards em Mobile)

| Breakpoint | Visualização | Componente |
|------------|--------------|------------|
| Mobile (<768px) | Cards empilhados | `Card` com detalhes do pedido |
| Desktop (≥1024px) | Tabela completa | `Table` com colunas |

**Implementação**:
```tsx
{/* Desktop: Table */}
<Table className="hidden lg:block">
  {/* ... */}
</Table>

{/* Mobile: Cards */}
<div className="space-y-4 lg:hidden">
  {/* ... */}
</div>
```

### Botões com Touch Targets 44x44px

Os botões de ação (Confirmar, Cancelar) têm dimensões mínimas de 44x44px para atender guidelines de acessibilidade WCAG 2.1:

| Botão | Localização | Tamanho |
|-------|-------------|---------|
| Confirmar | Card/Table de pedido | `min-h-[44px] min-w-[44px]` |
| Cancelar | Card/Table de pedido | `min-h-[44px] min-w-[44px]` |
| WhatsApp | Card de pedido | `min-h-[44px] min-w-[44px]` |

### Dialog Fullscreen Mobile

Em mobile (<768px), o Dialog de detalhes do pedido abre em tela cheia:
- `className="max-w-none h-screen rounded-none"`
- Scroll vertical para lista de itens
- Ações (Confirmar/Cancelar) sempre visíveis no footer

---

## Integração WhatsApp

Ao confirmar/cancelar pedido, **DEVE** enviar mensagem via WhatsApp:

### Mensagem de Confirmação

```
✅ Pedido Confirmado!
Olá {customer_name}, seu pedido foi confirmado e está sendo preparado!
Total: R$ {total_formatado}
```

### Mensagem de Cancelamento

```
❌ Pedido Cancelado
Olá {customer_name}, lamentamos informar que seu pedido foi cancelado.
Por favor, entre em contato para mais informações.
```

---

## Regras de Negócio

1. **DEVE** atualizar status para `confirmed` ao confirmar
2. **DEVE** atualizar status para `cancelled` ao cancelar
3. **DEVE** enviar notificação WhatsApp ao mudar status
4. **NÃO DEVE** permitir reverter status `cancelled`
5. **DEVE** calcular total a partir dos itens

---

## Arquivos Relacionados

| Arquivo | Relação |
|---------|---------|
| `app/api/orders/route.ts` | API de criação |
| `lib/whatsapp.ts` | Serviço de WhatsApp |
| `lib/supabase/client.ts` | Cliente Supabase |

---

## Cenários BDD

```gherkin
@integration-test="tests/integration/orders.test.ts"
Funcionalidade: Gestão de Pedidos

Cenário: Admin confirma pedido
Dado que existe pedido com status "pending"
Quando o admin clica em "Confirmar"
Então o status deve mudar para "confirmed"
E deve aparecer mensagem de confirmação

Cenário: Admin cancela pedido
Dado que existe pedido com status "pending"
Quando o admin clica em "Cancelar"
Então o status deve mudar para "cancelled"
E deve aparecer mensagem de cancelamento

Cenário: Admin filtra pedidos por status
Dado que o admin está na página de pedidos
Quando seleciona filtro "Pendentes"
Então devem aparecer apenas pedidos com status "pending"

Cenário: Pedidos em cards em mobile
Dado que o admin está logado
E a janela do navegador está abaixo de 768px
Quando acessa a página de pedidos
Então os botões de ação (confirmar/cancelar) devem ter 44x44px mínimo
```

---

## Responsividade

### Requisitos de Responsividade

| Requisito | Descrição | Ref |
|-----------|-----------|-----|
| REQ-RESP-06 | Orders com botões 44x44px | spec.md |
| REQ-RESP-08 | Touch targets mínimo 44x44px | spec.md |
| REQ-RESP-09 | Nenhum overflow horizontal | spec.md |
| REQ-RESP-10 | Texto legível sem zoom (16px mínimo) | spec.md |

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura unitária | ≥80% | Alta |
| Testes de integração | Cenários BDD cobertos | Alta |
| Testes E2E | Fluxo completo coberto | Alta |
| Responsividade | Todos breakpoints | Alta |

---

**Versão**: 1.1
**Última Atualização**: 2026-04-17
**Autor**: AI Agent