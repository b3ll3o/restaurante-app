# MenuLink - Specification Document (SDD)

## Fonte da Verdade (Source of Truth)

Este documento é a **Especificação Maestro** do MenuLink. Todas as implementações, testes e decisões técnicas derivam deste documento.

---

## 1. Visão Geral do Produto

**Nome do Produto:** MenuLink
**Tipo:** SaaS de Cardápio Digital para Restaurantes
**Problema:** Restaurantes precisam de uma forma simples de digitalizar seus cardápios e receber pedidos via WhatsApp
**Solução:** Cardápio público mobile-first + painel admin para gestão + integração WhatsApp para pedidos

---

## 2. Linguagem Ubíqua (DDD)

| Termo de Domínio | Definição | Sinonimos |
|------------------|-----------|-----------|
| **Restaurant** | Estabelecimento comercial que possui um cardápio digital | Loja, Restaurante, Dono de restaurante |
| **Owner** | Proprietário do restaurante que gerencia via admin | Dono, Administrador |
| **Customer** | Cliente final que acessa o cardápio e faz pedidos | Consumidor, Pedinte |
| **Category** | Agrupamento de produtos no cardápio | Seção, Grupo |
| **Product** | Item vendido pelo restaurante | Prato, Item, Mercadoria |
| **Order** | Pedido realizado por um customer | Comanda, Pedido |
| **OrderItem** | Item específico dentro de um pedido | Linha do pedido |
| **Cart** | Lista temporária de produtos que o customer está reservando | Carrinho, Cesta |
| **CartItem** | Produto adicionado ao carrinho com quantidade | Item do carrinho |
| **Slug** | Identificador URL único do restaurante | URL amigável |
| **Status** | Estado do pedido (pending, confirmed, cancelled) | Situação |

---

## 3. Regras de Negócio (RFC 2119)

### 3.1 Gestão de Restaurante

- REQ-001: O sistema **DEVE** permitir que um usuário crie uma conta e registre seu restaurante
- REQ-002: O sistema **DEVE** gerar automaticamente um slug único baseado no nome do restaurante
- REQ-003: O restaurante **DEVE** possuir um número de WhatsApp válido para receber pedidos
- REQ-004: O dono **PODE** atualizar o nome e WhatsApp do seu restaurante

### 3.2 Gestão de Categorias

- REQ-010: O sistema **DEVE** permitir que o owner crie categorias para seu restaurante
- REQ-011: Cada categoria **DEVE** pertencer a um único restaurante
- REQ-012: As categorias **DEVEM** ser ordenadas por `display_order`
- REQ-013: O owner **PODE** editar, reordenar e deletar categorias

### 3.3 Gestão de Produtos

- REQ-020: O sistema **DEVE** permitir que o owner adicione produtos às categorias
- REQ-021: Cada produto **DEVE** pertencer a uma única categoria
- REQ-022: O produto **DEVE** possuir: nome (obrigatório), preço (obrigatório), descrição (opcional), imagem (opcional)
- REQ-023: O produto **PODE** estar disponível ou indisponível (`is_available`)
- REQ-024: Produtos indisponíveis **NÃO DEVEM** aparecer no cardápio público
- REQ-025: Os produtos **DEVEM** ser ordenados por `display_order`
- REQ-026: O owner **PODE** fazer upload de imagens para produtos via Supabase Storage

### 3.4 Cardápio Público

- REQ-030: O sistema **DEVE** exibir o cardápio público via `/menu/[slug]`
- REQ-031: O cardápio **DEVE** mostrar apenas produtos com `is_available = true`
- REQ-032: O cardápio **DEVE** agrupar produtos por categoria
- REQ-033: O customer **PODE** adicionar/remover produtos do carrinho
- REQ-034: O carrinho **DEVE** persistir durante a sessão (context React)

### 3.5 Finalização de Pedido

- REQ-040: O customer **DEVE** informar nome e WhatsApp para fazer pedido
- REQ-041: O customer **DEVE** escolher forma de pagamento (PIX ou Dinheiro)
- REQ-042: O sistema **DEVE** criar o pedido no banco de dados com status "pending"
- REQ-043: O sistema **DEVE** criar os OrderItems associados ao pedido
- REQ-044: Após pedido confirmado, **DEVE** redirecionar customer para WhatsApp do restaurante
- REQ-045: O sistema **DEVE** enviar notificação via WhatsApp Business API para o owner (se configurado)

### 3.6 Gestão de Pedidos (Admin)

- REQ-050: O owner **DEVE** visualizar todos os pedidos do seu restaurante
- REQ-051: O owner **PODE** ver os detalhes de cada pedido (itens, cliente, pagamento)
- REQ-052: O owner **PODE** confirmar um pedido (status: pending → confirmed)
- REQ-053: O owner **PODE** cancelar um pedido (status: pending → cancelled)
- REQ-054: O owner **DEVE** poder acessar WhatsApp do cliente diretamente

---

## 4. Estados do Pedido

```
                    ┌──────────────┐
                    │   pending    │ (inicial)
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            │            ▼
       ┌──────────┐        │     ┌──────────┐
       │confirmed │        │     │cancelled │
       └──────────┘        │     └──────────┘
                           │
              (sem transição de volta)
```

- **pending**: Pedido recebido, aguardando confirmação do owner
- **confirmed**: Pedido confirmado pelo owner
- **cancelled**: Pedido cancelado

---

## 5. Fluxo de Checkout

```
Customer acessa /menu/[slug]
        │
        ▼
Visualiza categorias e produtos
        │
        ▼
Adiciona produtos ao carrinho
        │
        ▼
Abre carrinho (Sheet)
        │
        ▼
Clica "Continuar" → Checkout
        │
        ▼
Preenche: Nome, WhatsApp, Pagamento
        │
        ▼
Clica "Confirmar e Enviar"
        │
        ▼
POST /api/orders (cria pedido no DB)
        │
        ├── Sucesso: mostra confirmação + redireciona WhatsApp
        │
        └── Erro: mostra mensagem de erro
```

---

## 6. Critérios de Aceitação

### CA-001: Cadastro de Restaurante
- [ ] User consegue se cadastrar com email/senha
- [ ] Restaurant é criado automaticamente com owner_id
- [ ] Slug é gerado automaticamente

### CA-002: CRUD de Categorias
- [ ] Owner consegue criar categoria com nome e ordem
- [ ] Owner consegue editar categoria
- [ ] Owner consegue deletar categoria (produtos são cascade)
- [ ] Categorias aparecem em ordem no admin

### CA-003: CRUD de Produtos
- [ ] Owner consegue criar produto com nome, preço, descrição, categoria
- [ ] Owner consegue fazer upload de imagem
- [ ] Owner consegue toggle disponibilidade
- [ ] Produtos aparecem em ordem no admin e no cardápio público

### CA-004: Cardápio Público
- [ ] Qualquer pessoa acessa `/menu/[slug]` sem login
- [ ] Categorias são exibidas em accordion
- [ ] Apenas produtos disponíveis são mostrados
- [ ] Carrinho atualiza corretamente

### CA-005: Checkout
- [ ] Customer informa nome (obrigatório)
- [ ] Customer informa WhatsApp (obrigatório)
- [ ] Customer escolhe PIX ou Dinheiro
- [ ] Pedido é criado no banco
- [ ] Redirecionamento para WhatsApp funciona

### CA-006: Gestão de Pedidos
- [ ] Owner vê lista de pedidos (mais recente primeiro)
- [ ] Owner vê detalhes do pedido com itens
- [ ] Owner consegue confirmar pedido
- [ ] Owner consegue cancelar pedido

---

## 7. Glossário Técnico

| Conceito | Implementação |
|----------|---------------|
| Frontend | Next.js 16.2.3 + React 19 |
| Estilização | Tailwind CSS 4 |
| Backend | Next.js API Routes + Supabase |
| Banco de Dados | Supabase (PostgreSQL) |
| Autenticação | Supabase Auth |
| Storage | Supabase Storage (imagens de produtos) |
| Notificações | WhatsApp Business API |
| UI Components | shadcn/ui |

---

## 8. Restrições

- **REQ-R01**: O cardápio público **NÃO** requer autenticação
- **REQ-R02**: O painel admin **REQUER** autenticação Supabase
- **REQ-R03**: Um restaurante **PERTENCE** a apenas um owner
- **REQ-R04**: Um producto **PERTENCE** a apenas uma categoria
- **REQ-R05**: O total do pedido **É CALCULADO** pela soma dos OrderItems (client-side)

---

## 9. Versionamento

| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 1.0 | 2026-04-15 | AI Agent | Versão inicial |