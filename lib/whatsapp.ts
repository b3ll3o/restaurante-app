/**
 * Serviço de integração com WhatsApp Business API
 * 
 * Este módulo fornece funções para envio de notificações via WhatsApp,
 * formatação de mensagens de pedido e geração de URLs para wa.me.
 */

export interface WhatsAppResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Envia mensagem via WhatsApp Business API
 * 
 * @param phoneNumberId - ID do número de telefone do WhatsApp Business
 * @param token - Token de acesso da API
 * @param to - Número de telefone do destinatário
 * @param message - Texto da mensagem
 * @returns Promise com resultado da operação
 */
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

/**
 * Formata mensagem de pedido para envio via WhatsApp
 * 
 * @param order - Dados do pedido
 * @param items - Itens do pedido
 * @returns String formatada com detalhes do pedido
 */
export function formatOrderMessage(
  order: {
    id: string;
    customer_name: string;
    customer_whatsapp: string;
    total: number;
    payment_method: string;
  },
  items: {
    quantity: number;
    product_name: string;
    total_price: number;
  }[]
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

/**
 * Gera URL para abrir WhatsApp com mensagem pré-preenchida
 * 
 * @param whatsapp - Número de telefone (com ou sem formatação)
 * @param message - Mensagem a ser pré-preenchida
 * @returns URL formatada para wa.me
 */
export function generateWhatsAppUrl(whatsapp: string, message: string): string {
  const cleaned = whatsapp.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleaned}?text=${encodedMessage}`;
}