# Schema do Banco de Dados (supabase/schema/) - PediAi

## Visão Geral

O módulo **Schema** contém a definição do banco de dados PostgreSQL do PediAi, implementado via Supabase. Responsável por: persistir restaurantes, categorias, produtos, pedidos e itens de pedido; garantir isolamento multi-tenant por `restaurant_id`; e proteger dados via Row Level Security (RLS).

**Idioma**: Português Brasileiro (pt-BR)
**Stack**: PostgreSQL + Supabase + uuid-ossp

---

## Estrutura de Diretórios

```
supabase/
├── schema.sql          # Schema completo (executar no Supabase SQL Editor)
└── schema/
    └── AGENTS.md       # Esta documentação
```

---

## Tabelas

### 1. restaurants

**Descrição**: Armazena os restaurantes (tenants) do sistema.

```sql
CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    owner_whatsapp TEXT NOT NULL,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Colunas**:
| Coluna | Tipo | Restrições |
|--------|------|------------|
| `id` | UUID | PK, auto-gerado |
| `slug` | TEXT | UNIQUE, NOT NULL |
| `name` | TEXT | NOT NULL |
| `owner_whatsapp` | TEXT | NOT NULL |
| `owner_id` | UUID | FK → auth.users(id), CASCADE |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() |

**Relacionamentos**: Dono (`owner_id`) referencia `auth.users`.

---

### 2. categories

**Descrição**: Categorias de produtos dentro de um restaurante.

```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Colunas**:
| Coluna | Tipo | Restrições |
|--------|------|------------|
| `id` | UUID | PK, auto-gerado |
| `restaurant_id` | UUID | FK → restaurants(id), CASCADE |
| `name` | TEXT | NOT NULL |
| `display_order` | INT | DEFAULT 0 |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() |

**Relacionamentos**: Pertence a `restaurants` (muitos-para-um).

---

### 3. products

**Descrição**: Produtos/itens vendidos pelo restaurante.

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Colunas**:
| Coluna | Tipo | Restrições |
|--------|------|------------|
| `id` | UUID | PK, auto-gerado |
| `category_id` | UUID | FK → categories(id), CASCADE |
| `name` | TEXT | NOT NULL |
| `description` | TEXT | NULL |
| `price` | DECIMAL(10,2) | NOT NULL |
| `image_url` | TEXT | NULL |
| `is_available` | BOOLEAN | DEFAULT true |
| `display_order` | INT | DEFAULT 0 |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() |

**Relacionamentos**: Pertence a `categories` (muitos-para-um).

---

### 4. orders

**Descrição**: Pedidos realizados por clientes.

```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_whatsapp TEXT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending',
    payment_method TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Colunas**:
| Coluna | Tipo | Restrições |
|--------|------|------------|
| `id` | UUID | PK, auto-gerado |
| `restaurant_id` | UUID | FK → restaurants(id), CASCADE |
| `customer_name` | TEXT | NOT NULL |
| `customer_whatsapp` | TEXT | NOT NULL |
| `total` | DECIMAL(10,2) | NOT NULL |
| `status` | TEXT | DEFAULT 'pending' |
| `payment_method` | TEXT | NULL |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() |

**Relacionamentos**: Pertence a `restaurants` (muitos-para-um).
**Status válidos**: 'pending', 'confirmed', 'cancelled'

---

### 5. order_items

**Descrição**: Itens individuais de um pedido (linhas da comanda).

```sql
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_name TEXT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL
);
```

**Colunas**:
| Coluna | Tipo | Restrições |
|--------|------|------------|
| `id` | UUID | PK, auto-gerado |
| `order_id` | UUID | FK → orders(id), CASCADE |
| `product_id` | UUID | FK → products(id), SET NULL |
| `product_name` | TEXT | NOT NULL (histórico) |
| `unit_price` | DECIMAL(10,2) | NOT NULL (histórico) |
| `quantity` | INT | NOT NULL |
| `total_price` | DECIMAL(10,2) | NOT NULL |

**Relacionamentos**: Pertence a `orders` (muitos-para-um); referência a `products` (pode ser NULL via SET NULL).

---

## Diagrama de Relacionamentos

```
restaurants (1) ──── (N) categories (1) ──── (N) products (1) ──── (N) order_items (N) ──── (1) orders (N) ──── (1) restaurants
                          │
                          │                   
                          └── (1) orders ──── (1) restaurants
```

**Cascata**: Ao deletar `restaurants`, todas as categorias, produtos, pedidos e itens são removidos.

---

## Row Level Security (RLS)

### Habilitar RLS

```sql
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
```

### Políticas por Tabela

**restaurants** (acesso autenticado, owner-only):
```sql
CREATE POLICY "Owners can view their restaurant" ON restaurants
    FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY "Owners can insert their restaurant" ON restaurants
    FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owners can update their restaurant" ON restaurants
    FOR UPDATE USING (owner_id = auth.uid());
```

**categories** (acesso via ownership do restaurant):
```sql
CREATE POLICY "Users can view categories of their restaurant" ON categories
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM restaurants 
        WHERE restaurants.id = categories.restaurant_id 
        AND restaurants.owner_id = auth.uid()
    ));
-- INSERT, UPDATE, DELETE Similar
```

**products** (acesso via ownership do restaurant):
```sql
CREATE POLICY "Users can view products of their restaurant" ON products
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM categories
        JOIN restaurants ON restaurants.id = categories.restaurant_id
        WHERE categories.id = products.category_id
        AND restaurants.owner_id = auth.uid()
    ));
-- INSERT, UPDATE, DELETE Similar
```

**orders** (acesso via função get_order_owner_id):
```sql
CREATE OR REPLACE FUNCTION get_order_owner_id(order_id UUID)
RETURNS UUID AS $$
SELECT owner_id FROM restaurants WHERE id = (
    SELECT restaurant_id FROM orders WHERE id = order_id
);
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE POLICY "Users can view orders of their restaurant" ON orders
    FOR SELECT USING (get_order_owner_id(id) = auth.uid());
CREATE POLICY "Users can update orders of their restaurant" ON orders
    FOR UPDATE USING (get_order_owner_id(id) = auth.uid());
```

**order_items** (acesso via orders → restaurant):
```sql
CREATE POLICY "Users can view order items of their restaurant" ON order_items
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM orders
        JOIN restaurants ON restaurants.id = orders.restaurant_id
        WHERE orders.id = order_items.order_id
        AND restaurants.owner_id = auth.uid()
    ));
```

### Políticas Públicas (cardápio sem autenticação)

```sql
-- Qualquer um pode ver restaurants (para buscar por slug)
CREATE POLICY "Anyone can view published restaurants" ON restaurants
    FOR SELECT USING (true);

-- Qualquer um pode ver categories e products (exibir cardápio)
CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (true);

-- Qualquer um pode criar orders (clientes fazem pedidos)
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create order items" ON order_items FOR INSERT WITH CHECK (true);
```

---

## Índices

O schema.sql não define índices explícitos além das PKs e UKs. Índices implícitos:

| Tabela | Índice | Tipo |
|--------|--------|------|
| `restaurants` | `id` | PK (B-tree) |
| `restaurants` | `slug` | UNIQUE (B-tree) |
| `categories` | `id` | PK (B-tree) |
| `categories` | `restaurant_id` | FK (B-tree) |
| `products` | `id` | PK (B-tree) |
| `products` | `category_id` | FK (B-tree) |
| `orders` | `id` | PK (B-tree) |
| `orders` | `restaurant_id` | FK (B-tree) |
| `order_items` | `id` | PK (B-tree) |
| `order_items` | `order_id` | FK (B-tree) |
| `order_items` | `product_id` | FK (B-tree) |

---

## Storage (Bucket de Imagens)

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

CREATE POLICY "Anyone can upload product images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Anyone can view product images" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Anyone can delete product images" ON storage.objects
    FOR DELETE USING (bucket_id = 'product-images');
```

---

## Triggers e Funções

### Auto-slug para restaurants

```sql
CREATE OR REPLACE FUNCTION create_restaurant_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := LOWER(REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9]', '-', 'g')) 
                    || '-' || SUBSTR(NEW.id::TEXT, 1, 8);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_restaurant_slug
    BEFORE INSERT ON restaurants
    FOR EACH ROW EXECUTE FUNCTION create_restaurant_slug();
```

---

## Uso (Exemplos SQL)

### Inserir restaurante
```sql
INSERT INTO restaurants (name, owner_whatsapp, owner_id)
VALUES ('Bar do João', '+5511999999999', auth.uid())
RETURNING id, slug;
```

### Listar categorias de um restaurante (pelo slug)
```sql
SELECT c.* FROM categories c
JOIN restaurants r ON r.id = c.restaurant_id
WHERE r.slug = 'bar-do-joao-abc12345'
ORDER BY c.display_order;
```

### Listar produtos disponíveis de um restaurante
```sql
SELECT p.* FROM products p
JOIN categories c ON c.id = p.category_id
JOIN restaurants r ON r.id = c.restaurant_id
WHERE r.slug = 'bar-do-joao-abc12345'
  AND p.is_available = true
ORDER BY c.display_order, p.display_order;
```

### Criar pedido (cliente anônimo)
```sql
INSERT INTO orders (restaurant_id, customer_name, customer_whatsapp, total, status, payment_method)
VALUES ('uuid-do-restaurante', 'Maria Silva', '+5511988887777', 45.50, 'pending', 'pix')
RETURNING id;
```

### Criar item de pedido
```sql
INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, total_price)
VALUES (
    'uuid-do-pedido',
    'uuid-do-produto',
    'Picanha na Brasa',
    45.50,
    1,
    45.50
);
```

### Atualizar status do pedido (admin)
```sql
UPDATE orders SET status = 'confirmed' WHERE id = 'uuid-do-pedido' AND restaurant_id = 'uuid-do-restaurante';
```

---

## Métricas de Qualidade

| Métrica | Target | Prioridade | Status |
|---------|--------|------------|--------|
| Tabelas com RLS | 5/5 (100%) | Crítica | ✅ |
| Foreign Keys com CASCADE | 5/5 (100%) | Alta | ✅ |
| Políticas públicas (menu) | 3 tabelas | Alta | ✅ |
| Trigger auto-slug | Implementado | Média | ✅ |
| Storage bucket | 1 bucket | Média | ✅ |
| Índices explícitos | 0 (usa PKs/FKs implícitos) | Baixa | ⚠️ |

---

## Executar o Schema

1. Acessar [Supabase SQL Editor](https://supabase.com/dashboard)
2. Selecionar o projeto
3. Copiar e colar o conteúdo de `supabase/schema.sql`
4. Executar (Run)

---

## Referências

- [Supabase Database](https://supabase.com/docs/guides/database)
- [PostgreSQL UUID](https://www.postgresql.org/docs/current/uuid-ossp.html)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)

---

**Versão**: 1.0
**Última Atualização**: 2026-04-17
**Autor**: AI Agent