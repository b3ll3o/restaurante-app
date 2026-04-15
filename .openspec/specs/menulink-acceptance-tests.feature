# MenuLink - Acceptance Tests (BDD/ATDD)

## Fonte da Verdade

Este arquivo contém os cenários de comportamento em sintaxe Gherkin (Dado/Quando/Então), derivados da `menulink-specification.md`.

---

## Funcionalidade: Gestão de Restaurante

### Cenário: Cadastro de novo restaurante

**Dado** que o usuário está na página de cadastro
**E** preencheu email "joao@exemplo.com" e senha "SenhaForte123"
**Quando** clicar no botão "Cadastrar"
**Então** o sistema deve criar uma conta no Supabase Auth
**E** criar um Restaurant associado ao usuário
**E** gerar um slug único baseado no nome do restaurante
**E** redirecionar para o dashboard

### Cenário: Geração automática de slug

**Dado** que o restaurante tem nome "Bar do João"
**Quando** o Restaurant for criado
**Então** o slug deve ser "bar-do-joao"
**E** deve ser único no banco de dados

### Cenário: Atualização de dados do restaurante

**Dado** que o owner está logado na página de configurações
**Quando** alterar o nome para "Bar do João 2" e WhatsApp para "5511999999999"
**E** clicar em "Salvar"
**Então** os dados devem ser atualizados no banco
**E** o slug não deve ser alterado

---

## Funcionalidade: Gestão de Categorias

### Cenário: Criar categoria

**Dado** que o owner está logado na página de categorias
**Quando** preencher o nome "Bebidas" com ordem 1
**E** clicar em "Adicionar"
**Então** a categoria deve ser criada no banco
**E** deve aparecer na listagem

### Cenário: Editar categoria

**Dado** que existe uma categoria "Bebidas" no restaurante
**Quando** o owner clicar em "Editar" na categoria
**E** alterar o nome para "Bebidas Geladas"
**E** clicar em "Salvar"
**Então** a categoria deve ser atualizada

### Cenário: Deletar categoria com cascade

**Dado** que existe uma categoria "Porções" com produtos asociados
**Quando** o owner clicar em "Deletar" na categoria
**Então** a categoria deve ser removida
**E** todos os produtos associados devem ser removidos (cascade)

### Cenário: Ordenação de categorias

**Dado** que existem categorias na ordem: "Entradas", "Principais", "Sobremesas"
**Quando** o owner acessar a listagem de categorias
**Então** devem aparecer na ordem definida por display_order
**E** a mesma ordem deve ser refletida no cardápio público

---

## Funcionalidade: Gestão de Produtos

### Cenário: Criar produto com todos os campos

**Dado** que o owner está na página de produtos
**Quando** preencher nome "Esfiha de Carne", preço "12.90", descrição "Deliciosa esfiha"
**E** selecionar a categoria "Esfihas"
**E** fazer upload de uma imagem
**E** clicar em "Adicionar"
**Então** o produto deve ser criado no banco
**E** a imagem deve ser armazenada no Supabase Storage
**E** o produto deve aparecer na listagem

### Cenário: Criar produto apenas com campos obrigatórios

**Dado** que o owner está na página de produtos
**Quando** preencher apenas nome "Refrigerante" e preço "5.00"
**E** selecionar a categoria "Bebidas"
**E** clicar em "Adicionar"
**Então** o produto deve ser criado com imagem nula
**E** description deve ser null
**E** is_available deve ser true por padrão

### Cenário: Toggle disponibilidade do produto

**Dado** que existe um produto "Pastel" disponível
**Quando** o owner clicar no switch de disponibilidade
**Então** o produto deve ficar indisponível
**E** não deve aparecer no cardápio público

### Cenário: Produto indisponível não aparece no cardápio público

**Dado** que existe um produto "Suco de Laranja" com is_available = false
**Quando** um customer acessar o cardápio público
**Então** o produto "Suco de Laranja" não deve ser exibido

### Cenário: Upload de imagem

**Dado** que o owner está criando um produto
**Quando** selecionar um arquivo de imagem válido (jpg, png, webp)
**E** clicar em "Adicionar"
**Então** a imagem deve ser enviada para o bucket "product-images" do Supabase Storage
**E** o campo image_url deve conter a URL pública

### Cenário: Ordenação de produtos

**Dado** que existem produtos na ordem: "Coca-Cola", "Guaraná", "Sprite"
**Quando** o customer acessar o cardápio público
**Então** devem aparecer na ordem definida por display_order dentro de cada categoria

---

## Funcionalidade: Cardápio Público

### Cenário: Acessar cardápio público sem autenticação

**Dado** que existe um restaurante com slug "bar-do-joao"
**Quando** qualquer pessoa acessar "/menu/bar-do-joao"
**Então** o cardápio deve ser exibido
**E** não deve ser necessário login

### Cenário: Exibição de categorias em accordion

**Dado** que o restaurante tem categorias "Entradas", "Principais", "Bebidas"
**Quando** o customer acessar o cardápio
**Então** as categorias devem aparecer como accordion
**E** cada categoria deve mostrar seus produtos ao ser expandida

### Cenário: Adicionar produto ao carrinho

**Dado** que o customer está visualizando o cardápio
**Quando** clicar no botão "+" de um produto
**Então** o produto deve ser adicionado ao carrinho
**E** o badge do carrinho deve mostrar a quantidade

### Cenário: Remover produto do carrinho

**Dado** que o customer tem itens no carrinho
**Quando** clicar no botão "-" de um item
**Então** a quantidade deve diminuir
**E** se quantidade for 0, o item deve ser removido

### Cenário: Persistência do carrinho na sessão

**Dado** que o customer adicionou produtos ao carrinho
**Quando** navegar entre categorias do cardápio
**Então** o carrinho deve manter os itens
**E** o total deve ser recalculado corretamente

---

## Funcionalidade: Checkout e Finalização de Pedido

### Cenário: Preencher dados do cliente

**Dado** que o customer tem itens no carrinho
**Quando** clicar em "Continuar" no carrinho
**Então** deve aparecer o formulário de checkout
**E** deve pedir nome, WhatsApp e forma de pagamento

### Cenário: Validação de campos obrigatórios

**Dado** que o customer está no formulário de checkout
**Quando** deixar nome em branco
**E** clicar em "Confirmar e Enviar"
**Então** deve aparecer mensagem de erro "Nome é obrigatório"

### Cenário: Validação de WhatsApp

**Dado** que o customer está no formulário de checkout
**Quando** informar um WhatsApp inválido como "abc"
**E** clicar em "Confirmar e Enviar"
**Então** deve aparecer mensagem de erro "WhatsApp inválido"

### Cenário: Escolha de forma de pagamento

**Dado** que o customer está no formulário de checkout
**Quando** selecionar "PIX" como forma de pagamento
**Então** a opção PIX deve ser armazenada no pedido

### Cenário: Confirmação de pedido com sucesso

**Dado** que o customer preencheu todos os dados corretamente
**E** tem itens no carrinho
**Quando** clicar em "Confirmar e Enviar"
**Então** o pedido deve ser criado no banco com status "pending"
**E** os OrderItems devem ser criados
**E** deve aparecer mensagem de sucesso
**E** deve redirecionar para WhatsApp do restaurante

### Cenário: Redirecionamento para WhatsApp

**Dado** que o pedido foi confirmado com sucesso
**Quando** a resposta do servidor for recebida
**Então** o customer deve ser redirecionado para `https://wa.me/5511999999999?text=...`
**E** a mensagem deve conter os detalhes do pedido

### Cenário: Notificação via WhatsApp Business API

**Dado** que WHATSAPP_TOKEN e WHATSAPP_PHONE_NUMBER_ID estão configurados
**Quando** um pedido for criado
**Então** uma notificação deve ser enviada para o proprietário via WhatsApp Business API

---

## Funcionalidade: Gestão de Pedidos (Admin)

### Cenário: Listar pedidos mais recentes primeiro

**Dado** que o owner está logado na página de pedidos
**Quando** a página carregar
**Então** os pedidos devem aparecer ordenados por created_at decrescente
**E** o pedido mais recente deve ser o primeiro da lista

### Cenário: Ver detalhes do pedido

**Dado** que existe um pedido #123 do cliente "Maria"
**Quando** o owner clicar no pedido
**Então** deve mostrar os detalhes: nome, WhatsApp, forma de pagamento
**E** deve listar todos os itens com preço unitário, quantidade e total
**E** deve mostrar o valor total do pedido

### Cenário: Confirmar pedido

**Dado** que existe um pedido com status "pending"
**Quando** o owner clicar em "Confirmar Pedido"
**Então** o status deve mudar para "confirmed"
**E** a UI deve ser atualizada

### Cenário: Cancelar pedido

**Dado** que existe um pedido com status "pending"
**Quando** o owner clicar em "Cancelar Pedido"
**Então** o status deve mudar para "cancelled"
**E** a UI deve ser atualizada

### Cenário: Acessar WhatsApp do cliente

**Dado** que existe um pedido do cliente com WhatsApp "5511888888888"
**Quando** o owner clicar no ícone do WhatsApp
**Então** deve abrir o WhatsApp com a conversa do cliente

### Cenário: Tentativa de transição inválida de status

**Dado** que existe um pedido com status "confirmed"
**Quando** tentar cancelar o pedido
**Então** a transição não deve ser permitida
**E** o status deve permanecer "confirmed"

---

## Versionamento

| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 1.0 | 2026-04-15 | AI Agent | Versão inicial |