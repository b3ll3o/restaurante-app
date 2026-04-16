# Design: Extrair Serviço WhatsApp

## Fonte da Verdade

Este documento detalha as decisões arquiteturais para o serviço WhatsApp.

---

## 1. Interface do Serviço

### 1.1 Tipos

```typescript
export interface WhatsAppResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}
```

### 1.2 Funções Exportadas

```typescript
// Envia mensagem via WhatsApp Business API
export async function sendWhatsAppMessage(
  phoneNumberId: string,
  token: string,
  to: string,
  message: string
): Promise<WhatsAppResponse>

// Formata mensagem de pedido
export function formatOrderMessage(
  order: { id: string; customer_name: string; customer_whatsapp: string; total: number; payment_method: string },
  items: { quantity: number; product_name: string; total_price: number }[]
): string

// Gera URL para wa.me
export function generateWhatsAppUrl(
  whatsapp: string,
  message: string
): string
```

---

## 2. Implementação de sendWhatsAppMessage

```typescript
export async function sendWhatsAppMessage(
  phoneNumberId: string,
  token: string,
  to: string,
  message: string
): Promise<WhatsAppResponse> {
  // Validação de token
  if (!token || !phoneNumberId) {
    console.log("WhatsApp Business API not configured. Skipping notification.");
    return { success: false, error: "WhatsApp não configurado" };
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: to.replace(/\D/g, ""),
          type: "text",
          text: { body: message },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("WhatsApp API error:", error);
      return { success: false, error: "Erro ao enviar mensagem" };
    }

    const data = await response.json();
    return { success: true, messageId: data.messages[0].id };
  } catch (error) {
    console.error("Failed to send WhatsApp notification:", error);
    return { success: false, error: "Falha ao enviar mensagem" };
  }
}
```

---

## 3. Implementação de formatOrderMessage

```typescript
export function formatOrderMessage(
  order: { id: string; customer_name: string; customer_whatsapp: string; total: number; payment_method: string },
  items: { quantity: number; product_name: string; total_price: number }[]
): string {
  const itemsList = items
    .map((item) => `${item.quantity}x ${item.product_name} - R$ ${item.total_price.toFixed(2)}`)
    .join(", ");

  const paymentLabel = order.payment_method === "pix" ? "PIX" : "Dinheiro";

  return `*NOVO PEDIDO #${order.id.slice(0, 8).toUpperCase()}*

*Cliente:* ${order.customer_name}
*WhatsApp:* ${order.customer_whatsapp}
*Pagamento:* ${paymentLabel}

*Itens:* ${itemsList}

*Total:* R$ ${order.total.toFixed(2)}

Acesse o painel para confirmar ou cancelar.`;
}
```

---

## 4. Implementação de generateWhatsAppUrl

```typescript
export function generateWhatsAppUrl(whatsapp: string, message: string): string {
  const cleaned = whatsapp.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleaned}?text=${encodedMessage}`;
}
```

---

## 5. Arquivos a Modificar

| Arquivo | Ação |
|---------|------|
| `lib/whatsapp.ts` | Criar com serviço completo |
| `app/api/orders/route.ts` | Modificar para usar `lib/whatsapp.ts` |

---

## 6. Tradeoffs

| Decisão | Tradeoff |
|---------|----------|
| Serviço com try-catch interno | Retorna erro estruturado, não lança exceções |
| Validação de token no serviço | Não tenta chamada se não configurado |
| console.log para token não configurado | Visível no console, não bloqueia fluxo |

---

## 7. Testes Necessários (conforme menulink-unit-tests-checklist.md)

- Unitários: `formatOrderMessage()` com casos válidos
- Unitários: `generateWhatsAppUrl()` com telefone válido e inválido
- Unitários: `sendWhatsAppMessage()` com token configurado e não configurado

---

## Status

Design