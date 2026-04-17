@integration-test="tests/integration/checkout.test.ts"
Funcionalidade: Checkout e Finalização de Pedido

Cenário: Cliente acessa formulário de checkout
Dado que o customer tem itens no carrinho
Quando clica em "Continuar" no carrinho
Então deve aparecer o formulário de checkout
E deve pedir nome, WhatsApp e forma de pagamento

Cenário: Cliente preenche dados corretamente
Dado que o customer está no formulário de checkout
Quando preenche "Maria Silva" no campo nome
E preenche "5511888888888" no campo WhatsApp
E seleciona "PIX" como forma de pagamento
E clica em "Confirmar e Enviar"
Então o pedido deve ser criado com status "pending"

Cenário: Cliente tenta confirmar com nome vazio
Dado que o customer está no formulário de checkout
Quando deixa nome em branco
E clica em "Confirmar e Enviar"
Então deve aparecer mensagem de erro "Nome é obrigatório"

Cenário: Cliente tenta confirmar com WhatsApp inválido
Dado que o customer está no formulário de checkout
Quando informa um WhatsApp inválido como "abc"
E clica em "Confirmar e Enviar"
Então deve aparecer mensagem de erro "WhatsApp inválido"

Cenário: Cliente seleciona forma de pagamento
Dado que o customer está no formulário de checkout
Quando seleciona "PIX" como forma de pagamento
Então a opção PIX deve ser armazenada no pedido

Cenário: Cliente confirma pedido com sucesso
Dado que o customer preencheu todos os dados corretamente
E tem itens no carrinho
Quando clica em "Confirmar e Enviar"
Então o pedido deve ser criado no banco com status "pending"
E os OrderItems devem ser criados
E deve aparecer mensagem de sucesso

Cenário: Cliente é redirecionado para WhatsApp após pedido
Dado que o pedido foi confirmado com sucesso
Quando a resposta do servidor for recebida
Então o customer deve ser redirecionado para WhatsApp do restaurante
E a mensagem deve conter os detalhes do pedido