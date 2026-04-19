# Workflows - PediAi

## Visão Geral

Este diretório cataloga todos os fluxos (workflows) da aplicação PediAi.

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `AGENTS.md` | Catálogo completo dos 17 fluxos da aplicação |

## Estrutura dos Fluxos

| Categoria | Fluxos |
|-----------|--------|
| [Autenticação](#1-fluxos-de-autenticação) | 5 fluxos |
| [Carrinho](#2-fluxos-de-carrinho) | 3 fluxos |
| [Pedido (Checkout)](#3-fluxos-de-pedido-checkout) | 3 fluxos |
| [Administrativos](#4-fluxos-administrativos) | 5 fluxos |
| [Integração Externa](#5-fluxos-de-integração-externa) | 1 fluxo |

**Total: 17 fluxos**

---

## Índice de Fluxos

### 1. Fluxos de Autenticação

| # | Fluxo | Arquivo |
|---|-------|---------|
| 1.1 | Login Admin | `app/admin/login/page.tsx` |
| 1.2 | Logout | `components/admin/header.tsx` |
| 1.3 | Signup Admin | `app/admin/signup/page.tsx` |
| 1.4 | OAuth Callback | `app/admin/auth/callback/route.ts` |
| 1.5 | Auth Check (Proteção de Rotas) | `app/admin/layout.tsx` |

### 2. Fluxos de Carrinho

| # | Fluxo | Arquivo |
|---|-------|---------|
| 2.1 | Adicionar ao Carrinho | `context/cart-context.tsx` |
| 2.2 | Remover do Carrinho | `context/cart-context.tsx` |
| 2.3 | Persistência do Carrinho | `context/cart-context.tsx` |

### 3. Fluxos de Pedido (Checkout)

| # | Fluxo | Arquivo |
|---|-------|---------|
| 3.1 | Visualização do Cardápio | `app/menu/[slug]/page.tsx` |
| 3.2 | Checkout (Finalização de Pedido) | `app/menu/[slug]/page.tsx` |
| 3.3 | Criação do Pedido (API) | `app/api/orders/route.ts` |

### 4. Fluxos Administrativos

| # | Fluxo | Arquivo |
|---|-------|---------|
| 4.1 | Dashboard | `app/admin/dashboard/page.tsx` |
| 4.2 | CRUD de Categorias | `app/admin/categories/page.tsx` |
| 4.3 | CRUD de Produtos | `app/admin/products/page.tsx` |
| 4.4 | Gestão de Pedidos | `app/admin/orders/page.tsx` |
| 4.5 | Configurações do Restaurante | `app/admin/settings/page.tsx` |

### 5. Fluxos de Integração Externa

| # | Fluxo | Arquivo |
|---|-------|---------|
| 5.1 | Notificação WhatsApp | `lib/whatsapp.ts` |

---

## Metadados

| Campo | Valor |
|-------|-------|
| **Versão** | 1.3 |
| **Última Atualização** | 2026-04-19 |
| **Total de Fluxos** | 17 |
| **Idioma** | Português Brasileiro (pt-BR) |
