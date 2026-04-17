# WhatsApp Service - MenuLink

## Visão Geral

**Módulo**: `lib/whatsapp`
**Responsabilidade**: Integração com WhatsApp API para envio de notificações de pedidos
**Idioma**: Português Brasileiro (pt-BR)
**Stack**: Next.js 16.2.3 + TypeScript

---

## Estrutura de Diretórios

```
lib/whatsapp/
├── whatsapp.ts       # Funções de integração WhatsApp
└── AGENTS.md         # Esta documentação
```

---

## Responsabilidade

Formatar mensagens de pedido e gerar URLs do WhatsApp para envio de notificações aos restaurantes.

### Interface Pública

```typescript
function formatOrderMessage(order: Order, items: OrderItem[]): string;
function generateWhatsAppUrl(whatsapp: string, message: string): string;
```

---

## Arquitetura

```typescript
// lib/whatsapp.ts

interface Order {
  id: string;
  customer_name: string;
  customer_whatsapp: string;
  total: number;
  payment_method: "pix" | "dinheiro" | "cartao";
  created_at: string;
}

interface OrderItem {
  product_name: string;
  unit_price: number;
  quantity: number;
  total_price: number;
}

export function formatOrderMessage(order: Order, items: OrderItem[]): string {
  const itemsList = items
    .map(item => `• ${item.product_name} x${item.quantity} - R$ ${item.total_price.toFixed(2)}`)
    .join("\n");

  return `🍔 *Novo Pedido*

👤 Cliente: ${order.customer_name}
📱 WhatsApp: ${order.customer_whatsapp}
💳 Pagamento: ${order.payment_method.toUpperCase()}

*Itens:*
${itemsList}

*Total: R$ ${order.total.toFixed(2)}*

📅 ${new Date(order.created_at).toLocaleString("pt-BR")}`;
}

export function generateWhatsAppUrl(whatsapp: string, message: string): string {
  const cleanWhatsapp = whatsapp.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanWhatsapp}?text=${encodedMessage}`;
}
```

---

## Uso

```typescript
import { formatOrderMessage, generateWhatsAppUrl } from "@/lib/whatsapp";

// Em API route de criação de pedido
const message = formatOrderMessage(order, orderItems);
const whatsappUrl = generateWhatsAppUrl(restaurant.owner_whatsapp, message);

// Redirecionar ou retornar URL
return NextResponse.json({
  id: order.id,
  whatsappUrl,
  // ...
});
```

---

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `WHATSAPP_TOKEN` | Token da API WhatsApp Business |
| `WHATSAPP_PHONE_NUMBER_ID` | ID do número de telefone |

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura unitária | ≥80% | Alta |

---

## Arquivos Relacionados

| Arquivo | Relação |
|---------|---------|
| `app/api/orders/route.ts` | Usa estas funções |
| `app/admin/orders/page.tsx` | Exibe link do WhatsApp |

---

**Versão**: 1.0
**Última Atualização**: 2026-04-16
**Autor**: AI Agent