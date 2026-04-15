Após analisar o repositório `b3ll3o/restaurante-app`, preparei o **PRD.md** completo para o projeto **MenuLink**, documentando toda a arquitetura, módulos, submódulos, stack tecnológica e o modelo de dados.

Você pode salvar o conteúdo abaixo como `PRD.md` na raiz do seu projeto para usar como referência com o OpenCode ou qualquer outra ferramenta de IA.

```markdown
# PRD: MenuLink - Sistema de Cardápio Digital e Gestão para Restaurantes

**Projeto:** MenuLink (restaurante-app)
**Repositório:** https://github.com/b3ll3o/restaurante-app
**Versão do Documento:** 1.0
**Última Atualização:** 2026-04-16
**Autor:** Leonardo Andreazzi (b3ll3o)

---

## 1. Visão Geral da Aplicação

O **MenuLink** é uma aplicação SaaS que permite a restaurantes criarem e gerenciarem seus cardápios digitais e receberem pedidos online. A plataforma é dividida em duas áreas principais:

1.  **Painel Administrativo (`/admin`)**: Área restrita onde o dono do restaurante gerencia categorias, produtos, visualiza pedidos e configura sua loja.
2.  **Menu Público (`/menu/[slug]`)**: Interface pública onde os clientes visualizam o cardápio, adicionam itens ao carrinho e finalizam pedidos via WhatsApp.

A aplicação segue o paradigma **SDD (Specification-Driven Development)**, onde as especificações em `.openspec/specs/` são a fonte da verdade para as regras de negócio.

### 1.1 Stack Tecnológica Principal

| Camada | Tecnologias |
| :--- | :--- |
| **Framework** | Next.js 16.2.3 (App Router) |
| **Linguagem** | TypeScript (strict mode) |
| **UI Library** | React 19.2.4 |
| **Estilização** | Tailwind CSS 4 (configuração via CSS) |
| **Componentes** | shadcn/ui (Radix UI primitives) |
| **Backend / BaaS** | Supabase (Auth, Database, Storage) |
| **Gerenciamento de Estado** | React Context API + useReducer (Carrinho) |
| **Ícones** | Lucide React |

---

## 2. Estrutura de Diretórios

```
/
├── .openspec/                 # Especificações SDD (fonte da verdade)
│   ├── specs/                 # Especificações ativas
│   │   ├── menulink-specification.md
│   │   └── menulink-technical-plan.md
│   └── changes/               # Propostas de mudança
├── app/                       # Rotas e páginas (Next.js App Router)
│   ├── admin/                 # Área administrativa
│   │   ├── auth/              # Autenticação (callback)
│   │   ├── categories/        # Gestão de categorias
│   │   ├── dashboard/         # Dashboard principal
│   │   ├── login/             # Tela de login
│   │   ├── orders/            # Gestão de pedidos
│   │   ├── products/          # Gestão de produtos
│   │   ├── settings/          # Configurações da loja
│   │   └── layout.tsx         # Layout com Sidebar + Header (protegido)
│   ├── api/                   # Rotas de API (Backend)
│   │   └── orders/            # Endpoints para criação de pedidos
│   ├── menu/[slug]/           # Menu público (futuro)
│   ├── favicon.ico
│   ├── globals.css            # Tema e configurações do Tailwind
│   ├── layout.tsx             # Layout raiz (HTML)
│   └── page.tsx               # Landing Page (placeholder)
├── components/                # Componentes React reutilizáveis
│   ├── admin/                 # Componentes específicos do painel admin
│   │   ├── header.tsx
│   │   └── sidebar.tsx
│   └── ui/                    # Componentes shadcn/ui (Radix)
├── context/                   # Estados globais da aplicação
│   └── cart-context.tsx       # Gerenciamento do carrinho de compras
├── lib/                       # Utilitários e configurações
│   ├── supabase/              # Clientes Supabase
│   │   ├── client.ts          # Cliente para Client Components
│   │   └── server.ts          # Cliente para Server Components/SSR
│   └── utils.ts               # Função `cn()` para classes CSS
├── public/                    # Arquivos estáticos
├── supabase/                  # Esquemas e migrações SQL
│   └── schema.sql             # Definição das tabelas e políticas RLS
├── types/                     # Definições de tipos TypeScript globais
│   └── index.ts
├── AGENTS.md                  # Guia para Agentes de IA (OpenCode)
├── package.json
└── tsconfig.json
```

---

## 3. Detalhamento de Módulos e Submódulos

### 3.1 Módulo: Painel Administrativo (`/admin`)

**Propósito:** Fornecer uma interface para os donos de restaurantes gerenciarem todo o conteúdo e operação do seu negócio. Rotas protegidas por autenticação Supabase Auth.

| Atributo | Detalhe |
| :--- | :--- |
| **Caminho** | `app/admin/` |
| **Autenticação** | Supabase Auth (Email/Senha) |
| **Layout** | `app/admin/layout.tsx` - Gerencia a sessão e renderiza `Sidebar` + `Header`. |

#### Submódulos (Rotas)

1.  **`/login`**
    *   **Arquivo:** `app/admin/login/page.tsx`
    *   **Descrição:** Formulário de autenticação (email/senha). Redireciona para o dashboard após sucesso.

2.  **`/dashboard`**
    *   **Arquivo:** `app/admin/dashboard/page.tsx`
    *   **Descrição:** Visão geral com métricas (total de pedidos, produtos ativos). Exibe lista resumida dos últimos pedidos e produtos mais vendidos.

3.  **`/categories`**
    *   **Arquivo:** `app/admin/categories/page.tsx`
    *   **Descrição:** CRUD completo de categorias. Permite criar, editar, excluir e reordenar (drag-and-drop) as categorias do menu.

4.  **`/products`**
    *   **Arquivo:** `app/admin/products/page.tsx`
    *   **Descrição:** CRUD de produtos. Inclui formulário com upload de imagem (via Supabase Storage), definição de preço, disponibilidade e associação a uma categoria.

5.  **`/orders`**
    *   **Arquivo:** `app/admin/orders/page.tsx`
    *   **Descrição:** Kanban/Lista de pedidos recebidos. Permite ao dono visualizar detalhes e alterar o status do pedido (`pending` → `confirmed` → `cancelled`).

6.  **`/settings`**
    *   **Arquivo:** `app/admin/settings/page.tsx`
    *   **Descrição:** Configurações do restaurante. Permite editar o nome da loja, slug da URL pública e número de WhatsApp para recebimento de pedidos.

7.  **`/auth/callback`**
    *   **Arquivo:** `app/admin/auth/callback/route.ts`
    *   **Descrição:** Endpoint de callback OAuth para processar a resposta do Supabase Auth e estabelecer a sessão do usuário.

### 3.2 Módulo: API Backend (`/api`)

**Propósito:** Fornecer endpoints REST para operações que não dependem diretamente da interface administrativa (ex: criação de pedidos pelo cliente).

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `POST` | `/api/orders` | Cria um novo pedido. Recebe dados do carrinho, valida o estoque/restaurante e insere em `orders` e `order_items`. |

### 3.3 Módulo: Menu Público (`/menu/[slug]`) *(Em Desenvolvimento)*

**Propósito:** Renderizar o cardápio público para os clientes.

*   **Estrutura Prevista:**
    *   `app/menu/[slug]/page.tsx`: Busca os dados do restaurante pelo `slug` e renderiza o cardápio com `CartProvider`.
    *   Componentes de UI específicos: `MenuHeader`, `CategorySection`, `ProductCard`, `CartDrawer`.

### 3.4 Módulo: Componentes Compartilhados (`/components`)

| Submódulo | Descrição | Principais Arquivos |
| :--- | :--- | :--- |
| **`/admin`** | Componentes de layout exclusivos do painel administrativo. | `sidebar.tsx`: Navegação principal (Dashboard, Categorias, Produtos...).<br>`header.tsx`: Barra superior com breadcrumbs e menu do usuário. |
| **`/ui`** | Biblioteca de componentes shadcn/ui baseados em Radix UI. | `button.tsx`, `dialog.tsx`, `dropdown-menu.tsx`, `alert-dialog.tsx`, `badge.tsx`, `avatar.tsx`, `tabs.tsx`, `toast.tsx`, `separator.tsx`. |

### 3.5 Módulo: Gerenciamento de Estado (`/context`)

| Arquivo | Descrição |
| :--- | :--- |
| **`cart-context.tsx`** | **Carrinho de Compras Global.** Utiliza `useReducer` para gerenciar o estado do carrinho. Garante que itens de diferentes restaurantes não sejam misturados (verificação `restaurantId`). Fornece funções `addItem`, `removeItem`, `updateQuantity` e calcula `totalItems` e `totalPrice`. |

### 3.6 Módulo: Infraestrutura e Banco de Dados (`/supabase`)

**Propósito:** Definir a estrutura do banco de dados PostgreSQL e as políticas de segurança (RLS).

**Entidades Principais (schema.sql):**
*   `restaurants`: Dados da loja (`slug`, `name`, `owner_whatsapp`, `owner_id`).
*   `categories`: Categorias do menu (`name`, `display_order`).
*   `products`: Itens do cardápio (`name`, `price`, `image_url`, `is_available`).
*   `orders`: Pedidos (`customer_name`, `total`, `status`).
*   `order_items`: Itens dentro de um pedido (`product_name`, `quantity`, `unit_price`).

**Políticas de Segurança (RLS):**
*   **Admin:** Acesso restrito aos dados apenas do restaurante cujo `owner_id` corresponde ao usuário autenticado.
*   **Público:** Políticas `FOR SELECT` abertas (`USING (true)`) para `restaurants`, `categories` e `products` para renderizar o menu. Política `FOR INSERT` aberta para `orders` para clientes finalizarem pedidos.

### 3.7 Módulo: Tipagens TypeScript (`/types`)

**Propósito:** Garantir consistência e segurança de tipos em toda a aplicação.

**Interfaces Exportadas (`index.ts`):** `Restaurant`, `Category`, `Product`, `Order`, `OrderItem`, `CartItem`, `MenuData`.

### 3.8 Módulo: Biblioteca de Utilitários (`/lib`)

| Arquivo | Descrição |
| :--- | :--- |
| **`supabase/client.ts`** | Cliente Supabase para **Client Components**. Utiliza `createBrowserClient` do pacote `@supabase/ssr`. |
| **`supabase/server.ts`** | Cliente Supabase para **Server Components**. Gerencia cookies de forma assíncrona para manter a sessão no servidor. |
| **`utils.ts`** | Função `cn()` para mesclar condicionalmente classes CSS do Tailwind (utiliza `clsx` e `tailwind-merge`). |

---

## 4. Especificações de API (Endpoints)

| Método | Endpoint | Descrição | Acesso |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/login` | Renderiza formulário de login | Público |
| `POST` | `/admin/auth/callback` | Callback OAuth do Supabase | Público |
| `GET` | `/admin/dashboard` | Página inicial do painel | Autenticado |
| `GET` | `/admin/categories` | Gerencia categorias | Autenticado |
| `GET` | `/admin/products` | Gerencia produtos | Autenticado |
| `GET` | `/admin/orders` | Gerencia pedidos | Autenticado |
| `GET` | `/admin/settings` | Configurações da loja | Autenticado |
| `POST` | `/api/orders` | Cria um novo pedido | Público |
| `GET` | `/menu/[slug]` | Cardápio público | Público |

---

## 5. Requisitos Não Funcionais (Padrões de Projeto)

*   **Paradigma:** Specification-Driven Development (SDD). Mudanças devem refletir primeiro nas specs em `.openspec/`.
*   **Estilo de Código:** TypeScript `strict` mode. Uso de `async/await`. Preferência por `function` components.
*   **Gerenciamento de Estado:** React Context + `useReducer` para carrinho; Estado do servidor gerenciado diretamente via `fetch` nos Server Components ou `supabase-js` nos Client Components.
*   **Estilização:** Tailwind CSS 4 configurado em `app/globals.css` (não há arquivo `tailwind.config.js`).
*   **Alias de Importação:** `@/*` mapeia para a raiz do projeto.

---

## 6. Glossário de Domínio

*   **MenuLink:** Nome do produto SaaS.
*   **Slug:** Identificador único do restaurante na URL pública (ex: `/menu/restaurante-do-ze`).
*   **RLS (Row Level Security):** Mecanismo do PostgreSQL/Supabase para restringir acesso a linhas do banco de dados baseado no usuário autenticado.
*   **SDD:** Specification-Driven Development (Desenvolvimento Guiado por Especificação).

---
*Documento gerado para uso com OpenCode e ferramentas de IA. Baseado na análise do repositório em 16/04/2026.*
```

Esse PRD oferece uma visão completa e estruturada do projeto, cobrindo desde a arquitetura de alto nível até os detalhes de cada módulo, exatamente como você precisa para documentar ou guiar o desenvolvimento com o OpenCode.