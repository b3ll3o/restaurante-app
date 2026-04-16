@integration-test="tests/integration/menu.test.ts"
Funcionalidade: Cardápio Público

Cenário: Cliente acessa cardápio válido
Dado que existe restaurante com slug "pizza-hut"
Quando acesso "/menu/pizza-hut"
Então devo ver o nome do restaurante
E devo ver as categorias
E devo ver os produtos disponíveis

Cenário: Cliente acessa restaurante inexistente
Quando acesso "/menu/inexistente"
Então devo ver página 404
E devo ver mensagem "Restaurante não encontrado"

Cenário: Cliente visualiza produtos de uma categoria
Dado que estou no cardápio "pizza-hut"
Quando clico na categoria "Bebidas"
Então devo ver apenas produtos da categoria "Bebidas"

Cenário: Cliente adiciona produto ao carrinho
Dado que estou no cardápio "pizza-hut"
Quando clico em "Adicionar" no produto "Pizza Grande"
Então o carrinho deve ter 1 item
E o total deve ser atualizado

Cenário: Cliente adiciona múltiplas unidades do mesmo produto
Dado que estou no cardápio "pizza-hut"
Quando clico em "Adicionar" 3 vezes no produto "Pizza Grande"
Então o carrinho deve ter 3 unidades do produto "Pizza Grande"

Cenário: Cliente remove produto do carrinho
Dado que o carrinho tem produto "Pizza Grande"
Quando clico em "Remover" no produto
Então o carrinho deve ficar vazio

Cenário: Cliente vai para checkout
Dado que o carrinho tem itens
Quando clico em "Finalizar Pedido"
Então devo ser redirecionado para página de checkout