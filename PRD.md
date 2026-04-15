 Especificação do Produto: MenuLink (Nome Sugerido)
Versão do Documento: 1.0
Autor: Desenvolvedor Solo (10+ anos XP)
Data: Abril/2026
Paradigma: Specification-Driven Development (SDD)

1. Visão Geral e Objetivos
1.1. Resumo Executivo
O MenuLink é um sistema SaaS B2B que permite que pequenos restaurantes, lanchonetes e food trucks ofereçam um cardápio digital acessível via WhatsApp, com capacidade de receber pedidos de forma automatizada. O diferencial competitivo é a simplicidade extrema, preço acessível e foco no mercado brasileiro, utilizando infraestrutura local para baixa latência.

1.2. Objetivos do MVP (Minimum Viable Product)
Permitir que um dono de restaurante se cadastre, configure seu cardápio (categorias e produtos) e obtenha um link público para compartilhar no WhatsApp.

Permitir que um cliente final acesse esse link, visualize o cardápio de forma otimizada para mobile e faça um pedido simples.

Permitir que o restaurante receba notificações de novos pedidos via WhatsApp e visualize os pedidos em um painel administrativo.

Validar o modelo de negócio com um período de teste gratuito e um plano de assinatura mensal acessível.

1.3. Métricas de Sucesso
10 restaurantes ativos após 30 dias do lançamento.

Taxa de conversão de teste gratuito para assinatura paga ≥ 20%.

Feedback positivo dos primeiros usuários sobre a facilidade de uso e a redução de erros em pedidos.

2. Público-Alvo e Personas
Persona	Nome Fictício	Descrição	Principais Dores
Dono de Restaurante	João da Esfiha	Proprietário de uma pequena lanchonete de bairro. Não tem equipe de TI e gerencia tudo sozinho ou com a família.	Perder vendas por erro de anotação no telefone; não ter tempo para responder WhatsApp o dia todo; quer algo barato e fácil de usar.
Cliente Final	Maria Apressada	Trabalhadora que quer almoçar rápido e sem complicação. Usa o WhatsApp para tudo.	Não quer baixar aplicativos; quer ver o cardápio com fotos e preços claros; quer fazer o pedido em 2 minutos.
3. Requisitos Funcionais (User Stories do MVP)
Aqui estão as funcionalidades essenciais para a primeira versão, priorizadas no modelo MoSCoW (Must, Should, Could, Won't).

3.1. Módulo de Administração (Painel do Restaurante)
ID	Prioridade	História de Usuário	Critérios de Aceitação
ADM-01	Must	Como João, quero me cadastrar usando meu e-mail e senha para criar minha conta.	O sistema deve validar e-mail único e senha forte.
ADM-02	Must	Como João, quero fazer login e acessar meu painel administrativo.	O sistema deve manter a sessão por pelo menos 7 dias.
ADM-03	Must	Como João, quero cadastrar, editar e excluir categorias (ex: Esfihas, Bebidas).	Cada categoria deve ter um nome e uma ordem de exibição.
ADM-04	Must	Como João, quero cadastrar, editar e excluir produtos em cada categoria.	Cada produto deve ter: Nome, Descrição (opcional), Preço, Imagem (opcional) e Status (Disponível/Indisponível).
ADM-05	Must	Como João, quero visualizar uma lista com todos os pedidos recebidos, ordenada do mais recente para o mais antigo.	A lista deve mostrar: Número do pedido, Nome do cliente, Total, Status (Pendente, Confirmado, Cancelado) e Horário.
ADM-06	Must	Como João, quero clicar em um pedido e ver todos os itens e o total para confirmá-lo ou cancelá-lo.	Ao confirmar ou cancelar, o sistema deve notificar o cliente via WhatsApp (se possível).
ADM-07	Must	Como João, quero copiar o link público do meu cardápio para compartilhar com meus clientes.	O link deve ser no formato menulink.app/minhaloja.
3.2. Módulo do Cardápio Público (Visão do Cliente)
ID	Prioridade	História de Usuário	Critérios de Aceitação
CARD-01	Must	Como Maria, quero acessar o link do cardápio e ver todas as categorias e produtos com fotos e preços.	A página deve ser responsiva (mobile-first) e carregar em menos de 2 segundos.
CARD-02	Must	Como Maria, quero adicionar produtos a um carrinho de compras e ver o total do meu pedido.	O carrinho deve permitir alterar quantidades e remover itens.
CARD-03	Must	Como Maria, quero finalizar meu pedido informando meu nome e número de WhatsApp.	O sistema deve validar se o número de WhatsApp é válido.
CARD-04	Must	Como Maria, quero receber uma confirmação do pedido com os itens e o total no meu WhatsApp após finalizar.	O restaurante também deve receber uma notificação no WhatsApp com os detalhes do pedido.
CARD-05	Should	Como Maria, quero poder escolher a forma de pagamento (Pix ou Dinheiro na entrega).	Para Pix, o sistema deve gerar um link/código e exibir para o cliente. O status do pagamento não precisa ser integrado no MVP.
3.3. Integração com WhatsApp
ID	Prioridade	História de Usuário	Critérios de Aceitação
WPP-01	Must	O sistema deve enviar uma mensagem de texto para o número do restaurante cadastrado sempre que um novo pedido for realizado.	A mensagem deve conter: Nome do cliente, itens do pedido, total e um link para o painel administrativo.
WPP-02	Must	O sistema deve enviar uma mensagem de confirmação para o cliente no WhatsApp, resumindo o pedido.	A mensagem deve conter um texto amigável e os detalhes do pedido.
4. Especificação Técnica (Arquitetura e Stack)
4.1. Diagrama de Arquitetura (Conceitual)
text
[Cliente Final] <--HTTPS--> [Vercel ou VPS BR] (Next.js App)
                                   |
                       -------------------------
                       |                       |
                 [Frontend Cardápio]    [Painel Admin]
                       |                       |
                       -------- [API Next.js] --------
                                   |
                          [Supabase (PostgreSQL)]
                                   |
                          [API WhatsApp Business]
4.2. Stack Tecnológico Definido (Considerando SP, Brasil)
Camada	Tecnologia Escolhida	Justificativa (Localização SP)
Hospedagem / Deploy	Vercel (Plano Hobby) OU Square Cloud	Vercel: Tem edge em SP, latência baixíssima (~10ms). Pagamento em USD, mas grátis para começar. Square Cloud: Servidor BR, pagamento em BRL, fácil de usar. Recomendo começar na Vercel pela velocidade de setup, migrando depois se necessário.
Frontend e Backend	Next.js 14+ (App Router) com TypeScript	Framework full-stack perfeito para um desenvolvedor solo. Permite construir a interface pública, o painel e a API no mesmo código.
Banco de Dados	Supabase (PostgreSQL)	Gratuito, serverless, com SDK fácil e integração nativa com Next.js. O projeto fica na AWS sa-east-1 (São Paulo). Latência excelente.
Autenticação	Supabase Auth (integrado)	Gerencia usuários do painel administrativo de forma simples e segura.
Armazenamento de Imagens	Supabase Storage	Já incluso no Supabase, perfeito para as fotos dos produtos.
Integração WhatsApp	WhatsApp Business Cloud API	API oficial da Meta. No MVP, usaremos apenas o envio de mensagens de texto simples (não conversacional).
Pagamentos (MVP)	Mercado Pago (Checkout Transparente)	Geração de QR Code Pix ou link de pagamento simples. Foco em BRL e ampla aceitação no Brasil.
Estilização	Tailwind CSS + shadcn/ui	Biblioteca de componentes lindos e acessíveis, acelerando a construção da UI.
4.3. Modelo de Dados (Simplificado para MVP)
sql
-- Tabela de Restaurantes (lojas)
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL, -- ex: 'minha-lanchonete'
  name TEXT NOT NULL,
  owner_whatsapp TEXT NOT NULL, -- número que receberá os pedidos
  created_at TIMESTAMP DEFAULT now()
);

-- Tabela de Categorias
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- Tabela de Produtos
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- Tabela de Pedidos
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_whatsapp TEXT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, confirmed, cancelled
  payment_method TEXT, -- 'pix', 'cash'
  created_at TIMESTAMP DEFAULT now()
);

-- Tabela de Itens do Pedido
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL, -- snapshot do nome para histórico
  unit_price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL,
  total_price DECIMAL(10,2) NOT NULL
);
4.4. Endpoints de API Principais
Método	Rota	Descrição	Autenticação
GET	/api/restaurants/[slug]/menu	Retorna o cardápio completo (categorias e produtos)	Pública
POST	/api/orders	Cria um novo pedido	Pública
GET	/api/admin/orders	Lista pedidos do restaurante logado	Sim (JWT)
PATCH	/api/admin/orders/[id]	Atualiza status do pedido	Sim
POST	/api/admin/products	Cria um novo produto	Sim
PUT	/api/admin/products/[id]	Atualiza um produto	Sim
DELETE	/api/admin/products/[id]	Remove um produto	Sim
5. Considerações de Segurança e Compliance
Dados Pessoais (LGPD): Armazenamos nome e telefone do cliente final. No cadastro, deve haver uma checkbox de consentimento com link para a política de privacidade.

Rate Limiting: Implementar limite de requisições na API pública para evitar abusos (ex: 100 req/min por IP).

Sanitização de Dados: Todo input do usuário deve ser sanitizado para prevenir XSS.

Segurança da API do WhatsApp: O token de acesso deve ser armazenado como variável de ambiente e nunca exposto no frontend.

6. Monetização e Plano de Negócios (MVP)
Modelo: Assinatura Mensal Recorrente.

Plano	Preço Sugerido	Funcionalidades
Teste Grátis	14 dias	Acesso a todas as funcionalidades do MVP.
Plano Essencial	R$ 49,90 / mês	Cardápio digital ilimitado, gestão de pedidos, notificações WhatsApp.
Processamento de Pagamentos da Assinatura: Integração com Stripe (para cartão de crédito internacional) ou Mercado Pago (para cobrança recorrente nacional via boleto/cartão). Sugiro começar com Stripe pela simplicidade da API.

7. Plano de Desenvolvimento e Lançamento (Roadmap do MVP)
Fase	Duração Estimada	Entregáveis
1. Setup do Projeto	1 dia	Repositório no GitHub, projeto Next.js configurado, deploy na Vercel.
2. Autenticação e Painel Admin	2 dias	Tela de login/cadastro com Supabase, layout básico do painel.
3. CRUD de Cardápio	3 dias	Páginas para gerenciar categorias e produtos, upload de imagens.
4. Página Pública do Cardápio	2 dias	Exibição do menu, carrinho de compras.
5. Finalização de Pedido	2 dias	Formulário de dados do cliente, criação do pedido no banco.
6. Integração WhatsApp	2 dias	Envio de mensagens de notificação (cliente e restaurante).
7. Gestão de Pedidos	1 dia	Página de listagem e detalhes do pedido no painel.
8. Testes e Polimento	2 dias	Testes de fluxo completo, ajustes de UI/UX.
9. Lançamento e Aquisição	Contínuo	Criar landing page, buscar primeiros restaurantes para teste.
Total Estimado: ~15 dias de desenvolvimento (considerando sua experiência e uso de IA como Cursor).

8. Próximos Passos e Expansão (Backlog Pós-MVP)
Won't do now (Futuro):

Chatbot conversacional via WhatsApp (receber pedidos por texto).

Múltiplos usuários por restaurante.

Relatórios de vendas e produtos mais pedidos.

Integração com impressoras térmicas (cozinha).

Aplicativo PWA para instalação no celular do cliente.

Este documento foi elaborado a partir da análise da nossa conversa e segue os princípios do SDD, fornecendo uma base clara e acionável para o desenvolvimento. Com ele em mãos, você pode iniciar a codificação com confiança, sabendo exatamente o que precisa ser construído.

Caso queira detalhar ainda mais alguma seção, como os contratos de API em OpenAPI ou as regras de negócio específicas, é só me pedir.

