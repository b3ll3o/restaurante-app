@integration-test="tests/integration/categories.test.ts"
Funcionalidade: Gestão de Categorias

Cenário: Admin cria categoria válida
Dado que o admin está na página de categorias
Quando preenche "Bebidas" no campo nome
E clica em "Salvar"
Então a categoria "Bebidas" deve aparecer na lista
E deve aparecer mensagem de sucesso

Cenário: Admin cria categoria sem nome
Dado que o admin está na página de categorias
Quando deixa o campo nome vazio
E clica em "Salvar"
Então deve aparecer mensagem de erro "Nome é obrigatório"

Cenário: Admin edita categoria existente
Dado que existe categoria "Bebidas"
E o admin está na página de categorias
Quando clica em "Editar" na categoria "Bebidas"
E modifica o nome para "Bebidas Alcoólicas"
E clica em "Salvar"
Então a categoria deve aparecer como "Bebidas Alcoólicas"

Cenário: Admin exclui categoria sem produtos
Dado que existe categoria "Bebidas" sem produtos
E o admin está na página de categorias
Quando clica em "Excluir" na categoria "Bebidas"
E confirma a exclusão
Então a categoria não deve mais aparecer na lista

Cenário: Admin tenta excluir categoria com produtos
Dado que existe categoria "Bebidas" com produtos
E o admin está na página de categorias
Quando clica em "Excluir" na categoria "Bebidas"
Então deve aparecer mensagem de erro "Não é possível excluir categoria com produtos"