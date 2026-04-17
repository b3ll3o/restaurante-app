# Checkout - MenuLink

## Visão Geral

**Rota**: `app/menu/[slug]/checkout/page.tsx`
**Responsabilidade**: Formulário de finalização de pedido e integração com WhatsApp
**Idioma**: Português Brasileiro (pt-BR)
**Stack**: Next.js 16.2.3 + React 19 + TypeScript (strict) + Tailwind CSS 4 + Supabase

---

## Estrutura de Diretórios

```
app/menu/[slug]/checkout/
├── page.tsx           # Página de checkout (futuro)
├── checkout.feature   # Cenários BDD
└── AGENTS.md          # Esta documentação
```

---

## Funcionalidade

### Propósito

Módulo de checkout que exibe formulário para coleta de dados do cliente e criação do pedido.

### Parâmetros de URL

| Parâmetro | Tipo   | Descrição                          |
|-----------|--------|------------------------------------
| `slug`    | `string` | Identificador único do restaurante |

### Fluxo de Usuário

1. Cliente acessa `/menu/[slug]/checkout` (após adicionar itens ao carrinho)
2. Sistema exibe formulário com campos:
   - Nome do cliente
   - WhatsApp do cliente
   - Forma de pagamento (PIX, Dinheiro, Cartão)
3. Cliente preenche dados e confirma pedido
4. Sistema cria pedido com status `pending`
5. Sistema redireciona cliente para WhatsApp do restaurante

### Dados do Pedido

| Campo           | Tipo     | Descrição                        |
|-----------------|----------|----------------------------------|
| `customer_name` | `string` | Nome do cliente                  |
| `customer_whatsapp` | `string` | WhatsApp do cliente        |
| `payment_method` | `string` | Forma de pagamento selecionada |
| `total`         | `number` | Total calculado do carrinho      |
| `status`        | `string` | Status inicial: `pending`        |
| `order_items`   | `array`  | Itens do carrinho                |

---

## Validações

### Regras de Validação

1. **DEVE** validar que nome não está vazio
2. **DEVE** validar formato de WhatsApp (mínimo 10 dígitos)
3. **DEVE** validar que forma de pagamento foi selecionada
4. **DEVE** calcular total automaticamente do carrinho
5. **DEVE** armazenar método de pagamento no pedido

---

## Interface Pública

### Estrutura Visual

```
┌─────────────────────────────────────┐
│        Confirmar Pedido             │
├─────────────────────────────────────┤
│  Seu pedido (X itens)               │
│  ┌─────────────────────────────┐    │
│  │ Pizza Grande      x2  R$50  │    │
│  │ Refrigerante      x1  R$5   │    │
│  └─────────────────────────────┘    │
│  Total: R$ 55,00                    │
├─────────────────────────────────────┤
│  Nome:                              │
│  [____________________________]     │
│                                     │
│  WhatsApp:                          │
│  [____________________________]     │
│                                     │
│  Forma de pagamento:                │
│  (•) PIX  ( ) Dinheiro  ( ) Cartão  │
│                                     │
│  [    Confirmar e Enviar    ]       │
└─────────────────────────────────────┘
```

### Componentes Utilizados

- `Card` (shadcn/ui) - Container do pedido e formulário
- `Button` (shadcn/ui) - Botão de confirmação
- `Input` (shadcn/ui) - Campos de texto
- `RadioGroup` (shadcn/ui) - Seleção de pagamento

---

## Integração com WhatsApp

### Fluxo de Redirecionamento

1. Pedido criado com sucesso (status `pending`)
2. Sistema constrói mensagem com detalhes do pedido
3. Cliente redirecionado para `wa.me/{whatsapp_restaurante}?text={mensagem}`

### Formato da Mensagem

```
🍕 Pedido #{order_id}
━━━━━━━━━━━━━━━━━━━━
👤 Cliente: {nome}
📱 WhatsApp: {whatsapp}
💳 Pagamento: {forma_pagamento}
━━━━━━━━━━━━━━━━━━━━
📦 Itens:
- {produto1} x{qty1} = R$ {total1}
- {produto2} x{qty2} = R$ {total2}
━━━━━━━━━━━━━━━━━━━━
💰 Total: R$ {total_pedido}
━━━━━━━━━━━━━━━━━━━━
```

---

## Arquivos Relacionados

| Arquivo                       | Relação                          |
|-------------------------------|----------------------------------|
| `context/cart-context.tsx`    | Acesso ao carrinho               |
| `app/menu/[slug]/AGENTS.md`   | Módulo pai (cardápio)            |
| `lib/supabase/client.ts`      | Criação do pedido                |
| `lib/whatsapp.ts`             | Construção da URL de redirecionamento |

---

## Cenários BDD

```gherkin
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
```

---

## Métricas de Qualidade

| Métrica            | Target | Prioridade |
|--------------------|--------|------------|
| Cobertura unitária | ≥80%   | Alta       |
| Testes E2E         | Fluxo completo coberto | Alta |

---

## Dependências

| Dependência          | Versão       | Uso                        |
|----------------------|--------------|----------------------------|
| @supabase/supabase-js | ^2.103.0     | Criação do pedido          |
| lucide-react         | ^1.8.0       | Ícones                     |
| tailwindcss          | ^4           | Estilização                |

---

## Referências

- [menulink-specification.md](../../../.openspec/specs/menulink-specification.md)
- [menulink-technical-plan.md](../../../.openspec/specs/menulink-technical-plan.md)

---

**Versão**: 1.0
**Última Atualização**: 2026-04-17
**Autor**: AI Agent