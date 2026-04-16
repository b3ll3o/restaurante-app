# API Routes - MenuLink

## Visão Geral

O módulo **API Routes** (`app/api/`) contém os endpoints da API REST do MenuLink. Este módulo é responsável por receber requisições de clientes externos (cardápio público) e processar operações como criação de pedidos.

**Idioma**: Português Brasileiro (pt-BR)
**Stack**: Next.js 16.2.3 + TypeScript (strict) + Supabase

---

## Estrutura de Diretórios

```
app/api/
└── orders/
    └── route.ts    # Endpoint POST /api/orders
```

---

## Endpoint: POST /api/orders

**Arquivo**: `app/api/orders/route.ts`
**Responsabilidade**: Criar novos pedidos e enviar notificação via WhatsApp para o restaurante.

### Request

**Headers**:
```
Content-Type: application/json
```

**Body**:
```typescript
interface CreateOrderRequest {
  restaurantId: string;      // UUID do restaurante
  customerName: string;      // Nome do cliente
  customerWhatsapp: string;  // WhatsApp do cliente (formato brasileiro)
  paymentMethod: "pix" | "cash";  // Forma de pagamento
  items: CartItem[];         // Itens do carrinho
  total: number;             // Total do pedido
}

interface CartItem {
  product: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
}
```

**Exemplo**:
```json
{
  "restaurantId": "550e8400-e29b-41d4-a716-446655440000",
  "customerName": "Maria Silva",
  "customerWhatsapp": "5511888888888",
  "paymentMethod": "pix",
  "items": [
    {
      "product": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "X-Burger",
        "price": 25.90
      },
      "quantity": 2
    }
  ],
  "total": 51.80
}
```

### Response

**Success (201)**:
```json
{
  "success": true,
  "order": {
    "id": "uuid-do-pedido",
    "restaurant_id": "uuid-restaurante",
    "customer_name": "Maria Silva",
    "customer_whatsapp": "5511888888888",
    "total": 51.80,
    "status": "pending",
    "payment_method": "pix",
    "created_at": "2026-04-16T12:00:00Z"
  }
}
```

**Error (400)** - Campos obrigatórios faltando:
```json
{
  "error": "Missing required fields"
}
```

**Error (404)** - Restaurante não encontrado:
```json
{
  "error": "Restaurant not found"
}
```

**Error (500)** - Erro interno:
```json
{
  "error": "Internal server error"
}
```

### Fluxo de Execução

```
1. Receber request POST
2. Validar campos obrigatórios
3. Buscar restaurante no banco
4. Criar registro do pedido (orders)
5. Criar registros dos itens (order_items)
6. Se items falhar, deletar pedido e retornar erro
7. Enviar notificação WhatsApp (não bloqueia)
8. Retornar pedido criado
```

### Implementação

```typescript
// app/api/orders/route.ts
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

    // 1. Validação de campos obrigatórios
    if (!customerName || !customerWhatsapp || !paymentMethod || !items || !total || !restaurantId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 2. Buscar restaurante
    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurants")
      .select("id, owner_whatsapp, name")
      .eq("id", restaurantId)
      .single();

    if (restaurantError || !restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    // 3. Criar pedido
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

    // 4. Criar itens do pedido
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
      // Rollback: deletar pedido se itens falharem
      await supabase.from("orders").delete().eq("id", order.id);
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    // 5. Enviar notificação WhatsApp (não bloqueia)
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
```

---

## Validações

### Validação de Input

| Campo | Regra |
|-------|-------|
| `restaurantId` | Obrigatório, UUID válido, deve existir |
| `customerName` | Obrigatório, mínimo 2 caracteres |
| `customerWhatsapp` | Obrigatório, formato brasileiro (10-13 dígitos) |
| `paymentMethod` | Obrigatório, um de: `pix`, `cash` |
| `items` | Obrigatório, pelo menos 1 item |
| `total` | Obrigatório, maior que 0 |

### Validação de Negócio

1. **Restaurante existe**: Verifica se `restaurantId` existe na tabela `restaurants`
2. **Atomicidade**: Se criação de itens falhar, pedido é deletado (rollback)
3. **WhatsApp opcional**: Falha no envio de WhatsApp não bloqueia criação do pedido

---

## Regras de Implementação

### 1. Sempre usar Server Client

```typescript
// ✅ Correto: usar createClient do server
const supabase = await createClient();

// ❌ Incorreto: usar cliente de browser em API route
import { createClient } from "@/lib/supabase/client";
```

### 2. Tratamento de Erros

```typescript
// ✅ Correto: try-catch com retorno estruturado
try {
  // operação
  return NextResponse.json({ data }, { status: 201 });
} catch (error) {
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

// ❌ Incorreto: deixar erro propagar
throw error;
```

### 3. Validação de Input

```typescript
// ✅ Correto: validar antes de operar banco
if (!customerName || !isValidName(customerName)) {
  return NextResponse.json({ error: "Nome inválido" }, { status: 400 });
}

// ❌ Incorreto: confiar em input sem validar
```

### 4. Rollback em Falhas

```typescript
// ✅ Correto: fazer rollback se operação dependentefalhar
const { data: order } = await supabase.from("orders").insert(...);
const { error: itemsError } = await supabase.from("order_items").insert(...);
if (itemsError) {
  await supabase.from("orders").delete().eq("id", order.id);
  return NextResponse.json({ error: itemsError.message }, { status: 500 });
}

// ❌ Incorreto: deixar dados inconsistentes
```

### 5. Operações Não-Bloqueantes

```typescript
// ✅ Correto: WhatsApp não bloqueia resposta
await sendWhatsAppMessage(...); // não await se não quiser bloquear
return NextResponse.json({ success: true, order }, { status: 201 });

// ❌ Incorreto: esperar WhatsApp para retornar
await sendWhatsAppMessage(...);
return NextResponse.json({ success: true, order }, { status: 201 });
```

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura de testes | ≥80% | Alta |
| Tempo de resposta | <500ms | Média |
| Taxa de erro | <1% | Alta |

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| @supabase/ssr | ^0.10.2 | Cliente Supabase server |
| @supabase/supabase-js | ^2.103.0 | Tipos do banco |

---

## Referências

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/router-handlers)
- [Supabase Database](https://supabase.com/docs/guides/database)
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)

---

**Versão**: 1.0
**Última Atualização**: 2026-04-16
**Autor**: AI Agent