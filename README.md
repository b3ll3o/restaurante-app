# PediAi - Cardápio Digital para Restaurantes

> Transforme o cardápio do seu restaurante em uma experiência digital moderna e receba pedidos diretamente pelo WhatsApp.

---

## O que é o PediAi?

O PediAi é um **sistema de cardápio digital** que permite restaurantes criarem seus cardápios online de forma simples, sem mensalidades caras ou apps complexos.

**Problema que resolve:** Muitos restaurantes ainda trabalham com cardápios físicos ou precisam pagar comissões altas para apps de delivery. o PediAi oferece uma alternativa simples onde o cliente acessa o cardápio pelo link, escolhe os itens e faz o pedido - tudo via WhatsApp, sem intermediários.

---

## Para quem é?

- **Restaurantes pequenos e médios** que querem digitalizar o cardápio
- **Bares, lanchonetes, pizzarias** que recebem pedidos por WhatsApp
- **Donos de restaurante** que não querem pagar comissões de delivery

---

## O que o PediAi faz hoje (Versão Atual)

### Para o Dono do Restaurante (Painel Admin)

- ✅ **Criar conta e gerenciar seu restaurante** em minutos
- ✅ **Cadastrar categorias** (ex: Bebidas, Pratos Principais, Sobremesas)
- ✅ **Cadastrar produtos** com nome, preço, descrição e foto
- ✅ **Ativar/desativar produtos** sem deletar (ex: produto do dia)
- ✅ **Ver todos os pedidos** recebidos em tempo real
- ✅ **Confirmar ou cancelar pedidos** com um clique
- ✅ **Editar informações** do restaurante (nome, WhatsApp)
- ✅ **Copiar link do cardápio** para compartilhar com clientes

### Para o Cliente (Cardápio Público)

- ✅ **Acessar o cardápio** pelo link sem precisar instalar nada
- ✅ **Ver produtos organizados por categoria** (ex: Bebidas, Pratos)
- ✅ **Ver foto, nome, preço e descrição** de cada produto
- ✅ **Adicionar itens ao carrinho** e escolher quantidade
- ✅ **Fazer o pedido** preenchendo nome e WhatsApp
- ✅ **Escolher forma de pagamento** (PIX ou Dinheiro)
- ✅ **Receber confirmação** e ser redirecionado para o WhatsApp do restaurante

### Integração com WhatsApp

- ✅ **Notificação automática** para o dono quando recebe pedido
- ✅ **Redirecionamento do cliente** para WhatsApp com pedido formatado
- ✅ Funciona mesmo se o WhatsApp Business não estiver configurado

---

## O que o PediAi vai fazer (Em breve)

As seguintes funcionalidades estão planejadas para versões futuras:

### 1. Bot de Atendimento Automático (Bot Handover)

**Problema:** O dono do restaurante precisa responder manualmente cada mensagem de pedido.

**Solução planejada:**
- 🤖 Um bot automático responde o cliente quando ele faz um pedido
- 👤 O dono pode assumir a conversa a qualquer momento (troca bot → humano)
- 🔄 Se o dono não responder em 24h, o bot continua o atendimento
- 📊 Painel mostra o status de cada conversa (bot ativo / humano atendendo)

**Benefício:** O dono economiza tempo respondendo pedidos automáticos, mas pode assumir quando quiser.

### 2. Gestão de Mesas

- 🪑 Atribuir número de mesa ao pedido
- 📍 Identificar de onde veio o pedido (mesa, delivery, balcão)

### 3. Histórico de Pedidos

- 📈 Gráficos de vendas por dia/semana/mês
- 🏆 Produtos mais vendidos
- 👥 Clientes mais frequentes

### 4. Múltiplos Usuários

- 👥 Equipe pode ajudar a atender pedidos
- 🔐 Diferentes níveis de acesso (admin, atendente)

---

## Como funciona (Fluxo Simples)

```
Dono do Restaurante                    Cliente
─────────────────                      ────────
1. Cria conta no admin                 │
2. Cadastra categorias                  │
3. Cadastra produtos                    │
4. Copia link do cardápio               │
        │                              │
        └──────────────────────────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │  Cliente acessa     │
        │  /menu/bar-do-joao  │
        └─────────────────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │  Vê o cardápio      │
        │  escolhe produtos   │
        └─────────────────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │  Preenche nome,     │
        │  WhatsApp e paga    │
        └─────────────────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │  Pedido criado!     │
        │  Notificação no     │
        │  WhatsApp do dono   │
        └─────────────────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │  Cliente vai para   │
        │  WhatsApp confirmar │
        └─────────────────────┘
```

---

## Tecnologias

O PediAi foi construído com:

- **Next.js** - Tecnologia moderna para sites rápidos
- **React** - Interface interativa e responsiva
- **Supabase** - Banco de dados seguro na nuvem
- **Tailwind CSS** - Design bonito em qualquer tamanho de tela
- **WhatsApp Business API** - Envio automático de notificações

---

## Como começar

### Para desenvolvedores

```bash
# Clone o projeto
git clone <url-do-repositorio>
cd restaurante

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Execute o schema do banco de dados no Supabase
# (Copie o conteúdo de supabase/schema.sql para o SQL Editor do Supabase)

# Inicie o servidor
npm run dev
```

### Variáveis de ambiente necessárias

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do seu projeto no Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave pública do Supabase |
| `WHATSAPP_TOKEN` | Token do WhatsApp Business (opcional) |
| `WHATSAPP_PHONE_NUMBER_ID` | ID do telefone WhatsApp (opcional) |

### Sem configuração do WhatsApp

O sistema funciona **sem** configurar o WhatsApp Business. O cliente será redirecionado para o WhatsApp do restaurante, mas a notificação automática não será enviada.

---

## Estrutura do Projeto

```
restaurante/
├── app/                    # Páginas da aplicação
│   ├── admin/             # Painel do dono do restaurante
│   │   ├── login/         # Página de login
│   │   ├── signup/        # Página de cadastro
│   │   ├── dashboard/     # Página inicial do admin
│   │   ├── categories/    # Gerenciar categorias
│   │   ├── products/      # Gerenciar produtos
│   │   ├── orders/        # Ver pedidos
│   │   └── settings/      # Configurações do restaurante
│   ├── menu/[slug]/       # Cardápio público (ex: /menu/bar-do-joao)
│   └── api/               # Conexões com banco de dados
├── components/            # Componentes visuais
├── lib/                   # Funções técnicas
│   ├── whatsapp.ts        # Integração com WhatsApp
│   └── supabase/          # Conexão com banco de dados
├── context/               # Gerenciamento de estado (carrinho)
├── types/                 # Definições de dados
└── supabase/              # Schema do banco de dados
```

---

## FAQ - Perguntas Frequentes

**Preciso pagar para usar?**
Não. O PediAi é código aberto e gratuito. Você só paga pela hospedagem (ex: Vercel) e pelo banco de dados (ex: Supabase - plano gratuito disponível).

**O cliente precisa instalar algo?**
Não. O cliente acessa o cardápio pelo link e faz o pedido pelo WhatsApp, sem instalar apps.

**Posso personalizar o visual?**
Sim. O design usa cores e fontes configuráveis via CSS.

**É seguro?**
Sim. Os dados são protegidos por autenticação e criptografia. O WhatsApp Business usa tokens de acesso seguros.

---

## Status do Projeto

| Funcionalidade | Status |
|----------------|--------|
| Cardápio digital | ✅ Completo |
| Carrinho de compras | ✅ Completo |
| Checkout com WhatsApp | ✅ Completo |
| Painel admin | ✅ Completo |
| Gestão de pedidos | ✅ Completo |
| Bot Handover | 🔜 Em breve |
| Gestão de mesas | 🔜 Em breve |
| Histórico e gráficos | 🔜 Em breve |

---

## Licença

Este projeto é livre para uso e modificação.

---

**PediAi** - Cardápio digital simples, moderno e sem complicações.