@integration-test="tests/integration/products.test.ts"
Funcionalidade: Gestão de Produtos

Cenário: Admin cria produto válido
Dado que o admin está na página de produtos
E existe categoria "Bebidas"
Quando preenche "Suco de Laranja" no nome
E preenche "12.90" no preço
E seleciona categoria "Bebidas"
E clica em "Salvar"
Então o produto "Suco de Laranja" deve aparecer na lista

Cenário: Admin cria produto sem nome
Dado que o admin está na página de produtos
Quando deixa o campo nome vazio
E preenche "12.90" no preço
E clica em "Salvar"
Então deve aparecer mensagem de erro "Nome é obrigatório"

Cenário: Admin ativa/desativa produto
Dado que existe produto "Coca-Cola"
E o admin está na página de produtos
Quando clica no toggle de disponibilidade
Então o produto deve mudar seu status de disponibilidade

Cenário: Admin edita produto existente
Dado que existe produto "Suco de Laranja"
E o admin está na página de produtos
Quando clica em "Editar" no produto
E modifica o preço para "15.90"
E clica em "Salvar"
Então o produto deve aparecer com o novo preço

Cenário: Admin exclui produto
Dado que existe produto "Suco de Laranja"
E o admin está na página de produtos
Quando clica em "Excluir" no produto
E confirma a exclusão
Então o produto não deve mais aparecer na lista