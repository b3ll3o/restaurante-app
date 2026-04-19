# Orders API - PediAi

## Visão Geral

**Rota**: `app/api/orders/route.ts`
**Responsabilidade**: Endpoint de criação de pedidos
**Idioma**: Português Brasileiro (pt-BR)

---

## Estrutura de Diretórios

```
app/api/orders/
├── route.ts       # Endpoint POST /api/orders
├── orders.feature # Cenários BDD
└── AGENTS.md      # Esta documentação
```

---

## Endpoint

### POST /api/orders

Cria um novo pedido para um restaurante.

#### Request Body

```typescript
interface CreateOrderRequest {
  restaurant_id: string;
  customer_name: string;
  customer_whatsapp: string;
  payment_method: 'PIX' | 'dinheiro' | 'cartao';
  items: {
    product_id: string;
    product_name: string;
    unit_price: number;
    quantity: number;
  }[];
}
```

#### Response (201 Created)

```typescript
interface OrderResponse {
  id: string;
  restaurant_id: string;
  customer_name: string;
  customer_whatsapp: string;
  total: number;
  status: 'pending';
  payment_method: string;
  items: OrderItem[];
  created_at: string;
}
```

#### Response (400 Bad Request)

```typescript
interface ErrorResponse {
  error: string;
  code: string;
  details?: Record<string, string>;
}
```

---

## Validações

| Campo | Regra |
|-------|-------|
| `restaurant_id` | Obrigatório, deve existir |
| `customer_name` | Obrigatório, máx 100 caracteres |
| `customer_whatsapp` | Obrigatório, formato brasileiro |
| `payment_method` | Obrigatório, um de: PIX, dinheiro, cartao |
| `items` | Obrigatório, mínimo 1 item |
| `items[].product_id` | Obrigatório |
| `items[].quantity` | Obrigatório, ≥ 1 |

---

## Cálculo do Total

O total é calculado automaticamente:

```typescript
total = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0)
```

---

## Fluxo de Criação

1. Validar request body
2. Buscar restaurante para verificar existência
3. Calcular total a partir dos itens
4. Inserir pedido no banco
5. Inserir itens do pedido
6. Enviar notificação WhatsApp (assíncrono)
7. Retornar pedido criado

---

## Integração WhatsApp

Após criar o pedido, **DEVE** enviar mensagem para o WhatsApp do restaurante:

```
📋 Novo Pedido!

Cliente: {customer_name}
WhatsApp: {customer_whatsapp}
Pagamento: {payment_method}

Itens:
- {quantity}x {product_name} - R$ {unit_price * quantity}

Total: R$ {total_formatado}
```

---

## Códigos de Erro

| Código | HTTP Status | Descrição |
|--------|-------------|-----------|
| `VALIDATION_ERROR` | 400 | Dados inválidos |
| `RESTAURANT_NOT_FOUND` | 404 | Restaurante não existe |
| `PRODUCT_NOT_FOUND` | 404 | Produto não existe |
| `INTERNAL_ERROR` | 500 | Erro interno |

---

## Autenticação

- **Não requer**: Endpoint público

---

## Rate Limiting

- **Limite**: 100 requests por minuto por IP
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`

---

## Arquivos Relacionados

| Arquivo | Relação |
|---------|---------|
| `lib/whatsapp.ts` | Serviço de envio WhatsApp |
| `lib/supabase/server.ts` | Cliente Supabase server |
| `app/menu/[slug]/checkout/page.tsx` | Página que chama esta API |

---

## Cenários BDD

```gherkin
@integration-test="tests/integration/orders-api.test.ts"
Funcionalidade: Criação de Pedidos via API

Cenário: Criar pedido com dados válidos
Dado que o restaurante "pizza-hut" existe
Quando faço POST /api/orders com dados válidos
Então o pedido deve ser criado com status "pending"
E o total deve ser calculado corretamente
E deve retornar 201 Created

Cenário: Criar pedido com dados inválidos
Dado que o restaurante "pizza-hut" existe
Quando faço POST /api/orders sem customer_name
Então deve retornar 400 Bad Request
E deve indicar erro de validação

Cenário: Criar pedido para restaurante inexistente
Quando faço POST /api/orders com restaurant_id inválido
Então deve retornar 404 Not Found
```

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura unitária | ≥80% | Alta |
| Testes de integração | Cenários BDD cobertos | Alta |

---

**Versão**: 1.0
**Última Atualização**: 2026-04-16
**Autor**: AI Agent