import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { sendWhatsAppMessage, formatOrderMessage } from "@/lib/whatsapp";

interface OrderItem {
  product: { id: string; name: string; price: number };
  quantity: number;
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

    // Enviar notificação via WhatsApp
    const message = formatOrderMessage(
      {
        id: order.id,
        customer_name: customerName,
        customer_whatsapp: customerWhatsapp,
        total,
        payment_method: paymentMethod,
      },
      items.map((item: OrderItem) => ({
        quantity: item.quantity,
        product_name: item.product.name,
        total_price: item.product.price * item.quantity,
      }))
    );

    await sendWhatsAppMessage(
      process.env.WHATSAPP_PHONE_NUMBER_ID!,
      process.env.WHATSAPP_TOKEN!,
      restaurant.owner_whatsapp,
      message
    );

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}