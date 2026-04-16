# Cardápio Público - MenuLink

## Visão Geral

O módulo **Cardápio Público** (`app/menu/[slug]/`) é a interface que clientes finais veem para fazer pedidos. O cardápio é público e não requer autenticação, sendo acessado via URL única do restaurante (`/menu/{slug}`).

**Idioma**: Português Brasileiro (pt-BR)
**Stack**: Next.js 16.2.3 + React 19 + TypeScript (strict) + Tailwind CSS 4 + Supabase

---

## Estrutura de Diretórios

```
app/menu/
└── [slug]/
    └── page.tsx    # Cardápio dinâmico por restaurante
```

---

## Rota: `/menu/[slug]`

**Arquivo**: `app/menu/[slug]/page.tsx`
**Responsabilidade**: Exibir cardápio público de um restaurante específico.

### Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `slug` | string | Identificador único do restaurante na URL |

### Exemplo de URL

```
/menu/bar-do-joao
/menu/pizzaria-sao-paulo
/menu/restaurante-abc
```

---

## Arquitetura

### Client Component

A página é um **Client Component** (`"use client"`) porque:
- Usa estado local (carrinho, checkout)
- Integra com CartContext
- Manipula eventos de usuário
- Fetch de dados em client-side

### Fluxo de Dados

```
1. useEffect busca dados do restaurante (slug → restaurant)
2. useEffect busca categorias do restaurante
3. useEffect busca produtos (com categorias)
4. Renderiza MenuClient com dados
5. CartContext gerencia estado do carrinho
```

### Busca de Dados

```typescript
// app/menu/[slug]/page.tsx
const fetchMenu = async () => {
  // 1. Busca restaurante pelo slug
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .single();

  // 2. Busca categorias ordenadas
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .order("display_order", { ascending: true });

  // 3. Busca produtos com categorias
  const categoriesWithProducts = await Promise.all(
    categories.map(async (category) => {
      const { data: products } = await supabase
        .from("products")
        .select("*")
        .eq("category_id", category.id)
        .eq("is_available", true)  // Apenas disponíveis
        .order("display_order", { ascending: true });

      return { ...category, products: products || [] };
    })
  );

  setMenuData({ restaurant, categories: categoriesWithProducts });
};
```

---

## Interface do Usuário

### Header (Cabeçalho)

- Nome do restaurante
- Botão do carrinho com badge de quantidade
- Menu hamburger (mobile)

### Lista de Categorias

- Categorias expansíveis (accordion)
- Badge com quantidade de produtos
- Ícone de seta para expandir/recolher

### Grid de Produtos

Para cada produto:
- Imagem (se disponível)
- Nome
- Descrição (se disponível)
- Preço
- Botão Adicionar / Controles de quantidade

### Carrinho (Sheet)

**Etapas do Checkout**:

1. **Cart** (carrinho vazio ou com itens)
   - Lista de itens
   - Total
   - Botão "Continuar"
   - Botão "Limpar Carrinho"

2. **Checkout** (formulário)
   - Resumo do pedido
   - Campo nome
   - Campo WhatsApp
   - Seleção de pagamento (PIX/Dinheiro)
   - Botão "Confirmar e Enviar"

3. **Success** (pedido enviado)
   - Mensagem de sucesso
   - Redirecionamento para WhatsApp

---

## Componentes Internos

### ProductCard

**Props**:
```typescript
interface ProductCardProps {
  product: Product;
  formatPrice: (price: number) => string;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}
```

**Responsabilidade**: Exibir produto individual com controles de quantidade.

**Implementação**:
```typescript
function ProductCard({ product, formatPrice, quantity, onAdd, onRemove }) {
  return (
    <div className="flex gap-3 bg-card rounded-lg p-3 shadow-sm">
      {product.image_url && (
        <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden">
          <Image src={product.image_url} alt={product.name} fill className="object-cover" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm">{product.name}</h3>
        {product.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {product.description}
          </p>
        )}
        <span className="font-bold text-sm">{formatPrice(product.price)}</span>
      </div>
      <div className="flex items-center justify-end mt-2">
        {quantity === 0 ? (
          <Button size="sm" onClick={onAdd}>
            <Plus className="h-3 w-3 mr-1" />
            Adicionar
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={onRemove}>
              {quantity === 1 ? <Trash2 className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
            </Button>
            <span className="font-medium w-6 text-center">{quantity}</span>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={onAdd}>
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
```

### CartItemCard

**Props**:
```typescript
interface CartItemCardProps {
  item: CartItem;
  formatPrice: (price: number) => string;
  addItem: (product: Product, restaurantId: string) => void;
  removeItem: (productId: string) => void;
  restaurantId: string;
}
```

**Responsabilidade**: Exibir item no carrinho com controles.

---

## Integração com API

### Criação de Pedido

```typescript
const handlePlaceOrder = async () => {
  // Validar WhatsApp
  if (!validateWhatsApp(customerWhatsapp)) {
    setWhatsappError("Digite um WhatsApp válido");
    return;
  }

  // Enviar pedido
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customerName,
      customerWhatsapp,
      paymentMethod,
      items,
      total: totalPrice,
      restaurantId: menuData.restaurant.id,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    setOrderError(result.error);
    return;
  }

  // Sucesso - redirecionar para WhatsApp
  setCheckoutStep("success");
  clearCart();

  setTimeout(() => {
    const message = encodeURIComponent(
      `*Pedido #${result.order.id.slice(0, 8)}*\n\n*Cliente:* ${customerName}...`
    );
    window.open(
      `https://wa.me/${restaurantWhatsApp.replace(/\D/g, "")}?text=${message}`,
      "_blank"
    );
  }, 2000);
};
```

---

## Validações

### Validação de WhatsApp

```typescript
const validateWhatsApp = (whatsapp: string): boolean => {
  const cleaned = whatsapp.replace(/\D/g, "");
  return cleaned.length >= 10 && cleaned.length <= 13;
};
```

### Campos Obrigatórios no Checkout

| Campo | Regra |
|-------|-------|
| `customerName` | Obrigatório, mínimo 2 caracteres |
| `customerWhatsapp` | Obrigatório, formato brasileiro válido |
| `paymentMethod` | Obrigatório, `pix` ou `cash` |

---

## Regras de Negócio

### 1. Slug Único

Cada restaurante possui um `slug` único usado na URL. Se o slug não existir, exibe mensagem de "Cardápio não encontrado".

### 2. Produtos Disponíveis

Apenas produtos com `is_available = true` são exibidos no cardápio público.

### 3. Ordenação

- Categorias ordenadas por `display_order`
- Produtos ordenados por `display_order`

### 4. Carrinho Persistente

O carrinho é gerenciado pelo CartContext e persistido em localStorage.

### 5. Multi-Restaurante

O carrinho pode conter itens de apenas um restaurante por vez. Ao adicionar item de restaurante diferente, o carrinho é limpo.

---

## Tratamento de Estados

### Loading

```typescript
if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}
```

### Cardápio Não Encontrado

```typescript
if (!menuData) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <h1 className="text-2xl font-bold mb-2">Cardápio não encontrado</h1>
      <p className="text-muted-foreground text-center">
        Este cardápio pode ter sido removido ou ainda não está disponível.
      </p>
    </div>
  );
}
```

### Carrinho Vazio

```typescript
{items.length === 0 ? (
  <div className="flex-1 flex items-center justify-center">
    <div className="text-center">
      <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
      <p className="text-muted-foreground">Seu carrinho está vazio</p>
    </div>
  </div>
) : (...)}
```

---

## Responsividade

### Mobile First

- Grid de produtos em 1 coluna (mobile)
- Carrinho em sheet lateral
- Botão fixo "Ver Carrinho" no bottom (mobile)

### Desktop

- Layout mais espaçoso
- Sidebar do carrinho mais larga

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Tempo de carregamento | <2s | Alta |
| Lighthouse Performance | ≥90 | Alta |
| Acessibilidade | ≥95 | Alta |

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| @supabase/supabase-js | ^2.103.0 | Cliente banco |
| lucide-react | ^1.8.0 | Ícones |
| tailwindcss | ^4 | Estilização |

---

## Referências

- [Next.js Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [React Context](https://react.dev/learn/passing-data-deeply-with-context)
- [Tailwind CSS](https://tailwindcss.com)

---

**Versão**: 1.0
**Última Atualização**: 2026-04-16
**Autor**: AI Agent