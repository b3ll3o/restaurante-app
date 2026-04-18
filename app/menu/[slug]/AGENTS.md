# Menu (Cardápio Público) - MenuLink

## Visão Geral

**Rota**: `app/menu/[slug]/page.tsx`
**Responsabilidade**: Exibição pública do cardápio do restaurante
**Idioma**: Português Brasileiro (pt-BR)

---

## Estrutura de Diretórios

```
app/menu/[slug]/
├── page.tsx       # Página do cardápio
├── menu.feature   # Cenários BDD
└── AGENTS.md      # Esta documentação
```

---

## Funcionalidade

### Propósito

Página pública que exibe o cardápio de um restaurante específico via slug.

### Parâmetros de URL

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `slug` | `string` | Identificador único do restaurante |

### Fluxo de Usuário

1. Cliente acessa `/menu/[slug]`
2. Sistema busca restaurante pelo slug
3. Se encontrado: exibe cardápio com categorias e produtos
4. Se não encontrado: exibe página 404
5. Cliente pode:
   - Visualizar categorias e produtos
   - Adicionar produtos ao carrinho
   - Ver detalhes de produto (modal)
   - Ir para checkout

### Dados Carregados

1. Restaurante (por slug)
2. Categorias (ordenadas por `display_order`)
3. Produtos (por categoria, ordenados por `display_order`)
4. Apenas produtos `is_available = true`

---

## Interface Pública

### Estrutura Visual

```
┌─────────────────────────────────┐
│ 🍕 Nome do Restaurante          │
│ 📱 WhatsApp                     │
├─────────────────────────────────┤
│ [Categoria 1] [Categoria 2] ... │ ← Tabs/Filtros
├─────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐        │
│ │ Produto │ │ Produto │        │
│ │  🍕     │ │  🍔     │        │
│ │ R$ 25   │ │ R$ 30   │        │
│ │ [Add]   │ │ [Add]   │        │
│ └─────────┘ └─────────┘        │
└─────────────────────────────────┘
│ 🛒 Carrinho (X itens) R$ YY    │ ← FAB Cart (mobile)
└─────────────────────────────────┘
```

### Layout Responsivo

| Breakpoint | Categorias | Produtos | Carrinho |
|------------|------------|----------|----------|
| Mobile (<768px) | Grid 2 cols | Lista vertical | FAB + Sheet |
| Tablet (768-1023px) | Grid 2-3 cols | Grid 2 cols | Sheet |
| Desktop (≥1024px) | Grid 3-4 cols | Grid 3 cols | Sheet |

**Implementação**:
```tsx
{/* Categorias */}
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

{/* Produtos */}
<div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3">
```

### FAB Cart (Floating Action Button)

Em mobile, o carrinho é acessível via FAB posicionado no canto inferior direito:
- `fixed bottom-6 right-6`
- `pb-24` para não sobrepor o conteúdo
- Abre Sheet com carrinho e checkout

### Touch Targets

Todos os botões interativos têm `min-height: 44px` e `min-width: 44px`:
- Botão adicionar/remover produto (`+/-`)
- Botão do FAB carrinho
- Botão "Confirmar Pedido" no checkout

### Input WhatsApp Numérico

O campo de WhatsApp usa `inputmode="numeric"` para mostrar teclado numérico em mobile.

### Componentes Utilizados

- `Card` (shadcn/ui) - Card de produto
- `Button` (shadcn/ui) - Botão adicionar com touch-target
- `Badge` (shadcn/ui) - Preço, badges
- `Dialog` (shadcn/ui) - Detalhes do produto
- `Sheet` (shadcn/ui) - Carrinho (drawer lateral)
- `FAB` (custom) - Floating Action Button para carrinho em mobile

---

## Carrinho (Client-side)

O carrinho é gerenciado pelo `CartContext` com persistência em localStorage.

### Estrutura do Carrinho

```typescript
interface CartItem {
  product: Product;
  quantity: number;
}

interface Cart {
  restaurantId: string;
  items: CartItem[];
  total: number;
}
```

### Operações

| Operação | Descrição |
|----------|-----------|
| `addItem(product)` | Adiciona produto ao carrinho |
| `removeItem(productId)` | Remove produto do carrinho |
| `updateQuantity(productId, qty)` | Atualiza quantidade |
| `clearCart()` | Limpa carrinho |
| `getTotal()` | Calcula total |

---

## Regras de Negócio

1. **DEVE** buscar apenas produtos com `is_available = true`
2. **DEVE** agrupar produtos por categoria
3. **DEVE** ordenar categorias e produtos por `display_order`
4. **DEVE** exibir preço formatado em BRL
5. **DEVE** permitir adicionar ao carrinho apenas de um restaurante por vez

---

## Autenticação

- **Não requer**: Página pública

---

## Tratamento de Erros

| Situação | Comportamento |
|----------|---------------|
| Restaurante não existe | Página 404 |
| Sem categorias | Mensagem "Cardápio vazio" |
| Sem produtos | Não exibe categoria |

---

## Arquivos Relacionados

| Arquivo | Relação |
|---------|---------|
| `context/cart-context.tsx` | Gerenciamento do carrinho |
| `app/menu/[slug]/checkout/page.tsx` | Checkout |
| `lib/supabase/client.ts` | Busca de dados |

---

## Cenários BDD

```gherkin
@integration-test="tests/integration/menu.test.ts"
Funcionalidade: Visualização de Cardápio

Cenário: Cliente acessa cardápio válido
Dado que existe restaurante com slug "pizza-hut"
Quando acesso "/menu/pizza-hut"
Então devo ver o nome do restaurante
E devo ver as categorias
E devo ver os produtos disponíveis

Cenário: Cliente adiciona produto ao carrinho
Dado que estou no cardápio "pizza-hut"
Quando clico em "Adicionar" no produto "Pizza Grande"
Então o carrinho deve ter 1 item
E o total deve ser atualizado

Cenário: Cliente acessa restaurante inexistente
Quando acesso "/menu/inexistente"
Então devo ver página 404

Cenário: Cardápio em smartphone
Dado que o cliente está acessando o cardápio
E a janela do navegador está abaixo de 768px
Quando visualiza as categorias
Então as categorias devem estar em grid
E o carrinho deve ser acessível via FAB

Cenário: Carrinho funcional em mobile
Dado que o cliente está no cardápio
E adicionou itens ao carrinho
E a janela do navegador está abaixo de 768px
Quando clica no FAB do carrinho
Então o drawer do carrinho deve abrir
```

---

## Responsividade

### Requisitos de Responsividade

| Requisito | Descrição | Ref |
|-----------|-----------|-----|
| REQ-RESP-07 | Public menu com carrinho FAB em mobile | spec.md |
| REQ-RESP-08 | Touch targets mínimo 44x44px | spec.md |
| REQ-RESP-09 | Nenhum overflow horizontal | spec.md |
| REQ-RESP-10 | Texto legível sem zoom (16px mínimo) | spec.md |

### Breakpoints

| Breakpoint | Largura | Tailwind Prefix |
|------------|---------|-----------------|
| Mobile | < 768px | Default (mobile-first) |
| Tablet | 768px - 1023px | `md:` |
| Desktop | ≥ 1024px | `lg:` |

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura unitária | ≥80% | Alta |
| Testes E2E | Fluxo completo coberto | Alta |
| Responsividade | Todos breakpoints | Alta |

---

**Versão**: 1.1
**Última Atualização**: 2026-04-17
**Autor**: AI Agent