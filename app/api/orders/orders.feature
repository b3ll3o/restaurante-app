@integration-test="tests/integration/orders-api.test.ts"
Funcionalidade: API de Pedidos

Cenário: Criar pedido com dados válidos
Dado que o restaurante "pizza-hut" existe
Quando faço POST /api/orders com:
"""
{
  "restaurant_id": "uuid-do-restaurante",
  "customer_name": "Maria Silva",
  "customer_whatsapp": "5511888888888",
  "payment_method": "PIX",
  "items": [
    {"product_id": "uuid-produto", "product_name": "Pizza Grande", "unit_price": 4500, "quantity": 1}
  ]
}
"""
Então o pedido deve ser criado com status "pending"
E o total deve ser 4500 (R$ 45,00)
E deve retornar 201 Created

Cenário: Criar pedido com dados inválidos
Dado que o restaurante "pizza-hut" existe
Quando faço POST /api/orders sem customer_name
Então deve retornar 400 Bad Request
E deve indicar erro de validação

Cenário: Criar pedido para restaurante inexistente
Quando faço POST /api/orders com restaurant_id inválido
Então deve retornar 404 Not Found
E deve indicar "Restaurante não encontrado"

Cenário: Criar pedido sem itens
Dado que o restaurante "pizza-hut" existe
Quando faço POST /api/orders com items vazio
Então deve retornar 400 Bad Request
E deve indicar "Pelo menos um item é obrigatório"

Cenário: Criar pedido e verificar notificação WhatsApp
Dado que o restaurante "pizza-hut" existe
Quando faço POST /api/orders com dados válidos
Então deve enviar mensagem WhatsApp para o restaurante
E a mensagem deve conter nome do cliente e total do pedido