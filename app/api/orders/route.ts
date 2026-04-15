import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

interface OrderItem {
  product: { id: string; name: string; price: number };
  quantity: number;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

async function sendWhatsAppNotification(
  restaurantWhatsapp: string,
  orderId: string,
  customerName: string,
  customerWhatsapp: string,
  items: OrderItem[],
  total: number,
  paymentMethod: string
): Promise<void> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || token === "your-whatsapp-business-token" || !phoneNumberId || phoneNumberId === "your-phone-number-id") {
    console.log("WhatsApp Business API not configured. Skipping notification.");
    return;
  }

  const itemsList = items
    .map((item) => `${item.quantity}x ${item.product.name}`)
    .join(", ");

  const paymentLabel = paymentMethod === "pix" ? "PIX" : "Dinheiro";

  const message = `*NOVO PEDIDO #${orderId.slice(0, 8).toUpperCase()}*

*Cliente:* ${customerName}
*WhatsApp:* ${customerWhatsapp}
*Pagamento:* ${paymentLabel}

*Itens:* ${itemsList}

*Total:* ${formatPrice(total)}

Acesse o painel para confirmar ou cancelar.`;

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: restaurantWhatsapp.replace(/\D/g, ""),
          type: "text",
          text: {
            body: message,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("WhatsApp API error:", error);
    }
  } catch (error) {
    console.error("Failed to send WhatsApp notification:", error);
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const body = await request.json();
    const { customerName, customerWhatsapp, paymentMethod, items, total, restaurantId } = body;

    if (!customerName || !customerWhatsapp || !paymentMethod || !items || !total || !restaurantId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurants")
      .select("id, owner_whatsapp, name")
      .eq("id", restaurantId)
      .single();

    if (restaurantError || !restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        restaurant_id: restaurantId,
        customer_name: customerName,
        customer_whatsapp: customerWhatsapp,
        total,
        payment_method: paymentMethod,
        status: "pending",
      })
      .select()
      .single();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    const orderItems = items.map((item: OrderItem) => ({
      order_id: order.id,
      product_id: item.product.id,
      product_name: item.product.name,
      unit_price: item.product.price,
      quantity: item.quantity,
      total_price: item.product.price * item.quantity,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

    if (itemsError) {
      await supabase.from("orders").delete().eq("id", order.id);
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    await sendWhatsAppNotification(
      restaurant.owner_whatsapp,
      order.id,
      customerName,
      customerWhatsapp,
      items,
      total,
      paymentMethod
    );

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}