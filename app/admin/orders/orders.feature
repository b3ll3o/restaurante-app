@integration-test="tests/integration/orders.test.ts"
Funcionalidade: Gestão de Pedidos

Cenário: Admin visualiza lista de pedidos
Dado que o admin está autenticado
Quando acessa a página de pedidos
Então deve exibir lista de pedidos
E deve mostrar status de cada pedido

Cenário: Admin filtra pedidos por status
Dado que o admin está na página de pedidos
Quando seleciona filtro "Pendentes"
Então devem aparecer apenas pedidos com status "pending"

Cenário: Admin confirma pedido
Dado que existe pedido com status "pending"
Quando o admin clica em "Confirmar"
Então o status deve mudar para "confirmed"
E deve aparecer mensagem de confirmação
E deve enviar notificação WhatsApp

Cenário: Admin cancela pedido
Dado que existe pedido com status "pending"
Quando o admin clica em "Cancelar"
Então o status deve mudar para "cancelled"
E deve aparecer mensagem de cancelamento
E deve enviar notificação WhatsApp

Cenário: Admin visualiza detalhes do pedido
Dado que existe pedido com itens
Quando o admin clica em "Ver Detalhes" no pedido
Então deve exibir modal com lista de itens
E deve exibir total do pedido

Cenário: Admin tenta confirmar pedido já cancelado
Dado que existe pedido com status "cancelled"
Então o botão "Confirmar" deve estar desabilitado