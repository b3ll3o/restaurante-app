# Database (supabase/) - MenuLink

## Visão Geral

O módulo **Database** contém o schema SQL do Supabase, definindo a estrutura do banco de dados PostgreSQL para o sistema MenuLink. O projeto utiliza arquitetura multi-tenant onde cada restaurante é um tenant distinto.

**Idioma**: Português Brasileiro (pt-BR)  
**Stack**: PostgreSQL + Supabase

---

## Estrutura de Diretórios

```
supabase/
└── schema.sql              # Definição completa do schema
```

---

## Schema do Banco de Dados

### Diagrama de Entidades

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│restaurants  │       │ categories  │       │  products   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id          │──┐    │ id          │──┐    │ id          │
│ name        │  │    │ restaurant_id│──┼───│ category_id │
│ slug        │  │    │ name        │  │    │ restaurant_id│
│ owner_id    │  │    │ display_order│  │    │ name        │
│ owner_whatsapp│ │    └─────────────┘  │    │ description │
│ created_at  │  │                     │    │ price       │
│ updated_at  │  │                     │    │ image_url   │
└─────────────┘  │                     │    │ is_available│
                 │                     │    │ display_order│
                 │                     │    │ created_at  │
                 │                     │    │ updated_at  │
                 │                     │    └─────────────┘
                 │                     │
                 │                     │
                 │    ┌─────────────┐  │
                 │    │   orders    │  │
                 │    ├─────────────┤  │
                 └────│ id          │  │
                      │ restaurant_id│──┘
                      │ customer_name│
                      │ customer_whatsapp│
                      │ total        │
                      │ status       │
                      │ payment_method│
                      │ created_at   │
                      │ updated_at   │
                      └─────────────┘
                             │
                             │
                      ┌─────────────┐
                      │ order_items │
                      ├─────────────┤
                      │ id          │
                      │ order_id    │──┐
                      │ product_id  │
                      │ product_name│
                      │ unit_price  │
                      │ quantity    │
                      │ total_price │
                      │ created_at  │
                      └─────────────┘
```

---

## Tabelas

### 1. restaurants

**Descrição**: Armazena os restaurantes cadastrados no sistema.

```sql
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  owner_id TEXT NOT NULL, -- Supabase Auth user ID
  owner_whatsapp TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para busca por slug
CREATE UNIQUE INDEX idx_restaurants_slug ON restaurants(slug);

-- Índice para busca por owner
CREATE INDEX idx_restaurants_owner ON restaurants(owner_id);
```

**Campos**:
- `id`: UUID único (PK)
- `name`: Nome do restaurante
- `slug`: Identificador URL único
- `owner_id`: ID do usuário dono (Supabase Auth)
- `owner_whatsapp`: WhatsApp para receber pedidos
- `created_at`: Data de criação
- `updated_at`: Data de atualização

**Regras de Negócio**:
- `slug` deve ser único em todo o sistema
- `owner_id` referencia o usuário autenticado do Supabase

---

### 2. categories

**Descrição**: Categorias de produtos dentro de um restaurante.

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para multi-tenant
CREATE INDEX idx_categories_restaurant ON categories(restaurant_id);

-- Índice para ordenação
CREATE INDEX idx_categories_order ON categories(restaurant_id, display_order);
```

**Campos**:
- `id`: UUID único (PK)
- `restaurant_id`: FK para restaurants
- `name`: Nome da categoria
- `display_order`: Ordem de exibição
- `created_at`: Data de criação
- `updated_at`: Data de atualização

**Regras de Negócio**:
- Pertence a um único restaurante (`restaurant_id`)
- Ordenada por `display_order`
- DELETE CASCADE: ao deletar restaurante, categorias são deletadas

---

### 3. products

**Descrição**: Produtos/itens vendidos pelo restaurante.

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para multi-tenant
CREATE INDEX idx_products_restaurant ON products(restaurant_id);

-- Índice para categoria
CREATE INDEX idx_products_category ON products(category_id);

-- Índice para produtos disponíveis
CREATE INDEX idx_products_available ON products(restaurant_id, is_available);

-- Índice para ordenação
CREATE INDEX idx_products_order ON products(restaurant_id, display_order);

-- Check para preço positivo
ALTER TABLE products ADD CONSTRAINT products_price_positive CHECK (price > 0);
```

**Campos**:
- `id`: UUID único (PK)
- `category_id`: FK para categories
- `restaurant_id`: FK para restaurants (denormalizado para performance)
- `name`: Nome do produto
- `description`: Descrição opcional
- `price`: Preço (2 casas decimais, > 0)
- `image_url`: URL da imagem opcional
- `is_available`: Se está disponível para venda
- `display_order`: Ordem de exibição
- `created_at`: Data de criação
- `updated_at`: Data de atualização

**Regras de Negócio**:
- Pertence a uma categoria e restaurante
- `price` deve ser sempre maior que zero
- `is_available` controla visibilidade no cardápio público
- DELETE CASCADE: ao deletar categoria/restaurante, produtos são deletados

---

### 4. orders

**Descrição**: Pedidos realizados por clientes.

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_whatsapp TEXT NOT NULL,
  total NUMERIC(10, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('pix', 'dinheiro', 'cartao')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para multi-tenant
CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);

-- Índice para status
CREATE INDEX idx_orders_status ON orders(restaurant_id, status);

-- Índice para ordenação por data
CREATE INDEX idx_orders_created ON orders(restaurant_id, created_at DESC);

-- Check para total não negativo
ALTER TABLE orders ADD CONSTRAINT orders_total_positive CHECK (total >= 0);
```

**Campos**:
- `id`: UUID único (PK)
- `restaurant_id`: FK para restaurants
- `customer_name`: Nome do cliente
- `customer_whatsapp`: WhatsApp do cliente
- `total`: Valor total do pedido
- `status`: Status atual (pending/confirmed/cancelled)
- `payment_method`: Forma de pagamento
- `created_at`: Data de criação
- `updated_at`: Data de atualização

**Regras de Negócio**:
- `status` só pode ser: pending, confirmed, cancelled
- `payment_method` só pode ser: pix, dinheiro, cartao
- `total` é calculado a partir dos order_items
- DELETE CASCADE: ao deletar restaurante, pedidos são deletados

---

### 5. order_items

**Descrição**: Itens individuais dentro de um pedido.

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL, -- Denormalizado para histórico
  unit_price NUMERIC(10, 2) NOT NULL, -- Denormalizado para histórico
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  total_price NUMERIC(10, 2) NOT NULL, -- unit_price * quantity
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para pedido
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- Índice para produto
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- Check para quantidade positiva
ALTER TABLE order_items ADD CONSTRAINT order_items_quantity_positive CHECK (quantity > 0);

-- Check para preço total positivo
ALTER TABLE order_items ADD CONSTRAINT order_items_total_positive CHECK (total_price > 0);
```

**Campos**:
- `id`: UUID único (PK)
- `order_id`: FK para orders
- `product_id`: FK para products (pode ser NULL se produto foi deletado)
- `product_name`: Nome do produto no momento do pedido (histórico)
- `unit_price`: Preço unitário no momento do pedido (histórico)
- `quantity`: Quantidade solicitada
- `total_price`: Preço total (unit_price * quantity)
- `created_at`: Data de criação

**Regras de Negócio**:
- Dados denormalizados (`product_name`, `unit_price`) para manter histórico mesmo se produto for alterado/deletado
- `product_id` pode ser NULL (SET NULL) se produto for deletado
- `quantity` deve ser sempre maior que zero
- `total_price` = `unit_price` * `quantity`

---

## Triggers e Funções

### 1. Trigger para updated_at automático

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar em todas as tabelas com updated_at
CREATE TRIGGER update_restaurants_updated_at
  BEFORE UPDATE ON restaurants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2. Função para gerar slug único

```sql
CREATE OR REPLACE FUNCTION generate_unique_slug(restaurant_name TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 1;
BEGIN
  -- Gera slug base
  base_slug := lower(
    regexp_replace(
      regexp_replace(
        unaccent(restaurant_name),
        '[^a-zA-Z0-9\s-]', '', 'g'
      ),
      '\s+', '-', 'g'
    )
  );

  final_slug := base_slug;

  -- Verifica se já existe
  WHILE EXISTS (SELECT 1 FROM restaurants WHERE slug = final_slug) LOOP
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;

  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;
```

### 3. Função para calcular total do pedido

```sql
CREATE OR REPLACE FUNCTION calculate_order_total(order_items_data JSONB)
RETURNS NUMERIC(10, 2) AS $$
DECLARE
  total NUMERIC(10, 2) := 0;
  item JSONB;
BEGIN
  FOR item IN SELECT * FROM jsonb_array_elements(order_items_data)
  LOOP
    total := total + (item->>'unit_price')::NUMERIC * (item->>'quantity')::INTEGER;
  END LOOP;

  RETURN total;
END;
$$ LANGUAGE plpgsql;
```

---

## Row Level Security (RLS)

### Políticas de Segurança

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policies para restaurants
CREATE POLICY "Users can view own restaurant"
  ON restaurants FOR SELECT
  USING (owner_id = auth.uid());

CREATE POLICY "Users can insert own restaurant"
  ON restaurants FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update own restaurant"
  ON restaurants FOR UPDATE
  USING (owner_id = auth.uid());

-- Policies para categories (via restaurant)
CREATE POLICY "Users can manage categories of own restaurant"
  ON categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE id = categories.restaurant_id
      AND owner_id = auth.uid()
    )
  );

-- Policies para products (via restaurant)
CREATE POLICY "Users can manage products of own restaurant"
  ON products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE id = products.restaurant_id
      AND owner_id = auth.uid()
    )
  );

-- Policies para orders (via restaurant)
CREATE POLICY "Users can view orders of own restaurant"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE id = orders.restaurant_id
      AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update orders of own restaurant"
  ON orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE id = orders.restaurant_id
      AND owner_id = auth.uid()
    )
  );

-- Policies para order_items (via order -> restaurant)
CREATE POLICY "Users can view order items of own restaurant"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      JOIN restaurants ON orders.restaurant_id = restaurants.id
      WHERE orders.id = order_items.order_id
      AND restaurants.owner_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update order items of own restaurant"
  ON order_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM orders
      JOIN restaurants ON orders.restaurant_id = restaurants.id
      WHERE orders.id = order_items.order_id
      AND restaurants.owner_id = auth.uid()
    )
  );
```

---

## Índices de Performance

### Índices Criados

```sql
-- restaurants
CREATE UNIQUE INDEX idx_restaurants_slug ON restaurants(slug);
CREATE INDEX idx_restaurants_owner ON restaurants(owner_id);

-- categories
CREATE INDEX idx_categories_restaurant ON categories(restaurant_id);
CREATE INDEX idx_categories_order ON categories(restaurant_id, display_order);

-- products
CREATE INDEX idx_products_restaurant ON products(restaurant_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_available ON products(restaurant_id, is_available);
CREATE INDEX idx_products_order ON products(restaurant_id, display_order);

-- orders
CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX idx_orders_status ON orders(restaurant_id, status);
CREATE INDEX idx_orders_created ON orders(restaurant_id, created_at DESC);

-- order_items
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
```

---

## Views Úteis

### 1. View de Pedidos Completos

```sql
CREATE VIEW orders_complete AS
SELECT
  o.*,
  r.name as restaurant_name,
  json_agg(
    json_build_object(
      'id', oi.id,
      'product_name', oi.product_name,
      'unit_price', oi.unit_price,
      'quantity', oi.quantity,
      'total_price', oi.total_price
    )
  ) as items
FROM orders o
JOIN restaurants r ON o.restaurant_id = r.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, r.name;
```

### 2. View de Produtos com Categoria

```sql
CREATE VIEW products_with_category AS
SELECT
  p.*,
  c.name as category_name
FROM products p
JOIN categories c ON p.category_id = c.id;
```

---

## Migrations

### Versionamento de Schema

```sql
-- Versão 001: Schema inicial
-- Criado em: 2026-04-15

-- Adicionar nova migration
-- Arquivo: supabase/migrations/002_add_product_image.sql
```

---

## Regras de Multi-Tenant

### 1. Isolamento por restaurant_id

Todas as queries que acessam dados de restaurantes devem filtrar por `restaurant_id`:

```sql
-- ✅ Correto: Filtra por restaurant_id
SELECT * FROM products WHERE restaurant_id = $1;

-- ❌ Incorreto: Sem filtro (vaza dados entre tenants)
SELECT * FROM products;
```

### 2. Verificação de Proprietário

Antes de qualquer operação, verificar se o usuário é dono do restaurante:

```sql
-- Verificar ownership
SELECT 1 FROM restaurants
WHERE id = $1 AND owner_id = auth.uid();
```

### 3. Constraints de Foreign Key

Todas as tabelas com dados de restaurante devem ter FK para `restaurants`:

```sql
-- products tem restaurant_id
ALTER TABLE products ADD CONSTRAINT fk_products_restaurant
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE;
```

---

## Backup e Restore

### Backup

```bash
# Backup completo
pg_dump -h db.supabase.co -U postgres -d postgres > backup.sql

# Backup apenas estrutura
pg_dump -h db.supabase.co -U postgres -d postgres --schema-only > schema.sql
```

### Restore

```bash
# Restore
psql -h db.supabase.co -U postgres -d postgres < backup.sql
```

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Índices por tabela | ≥2 | Alta |
| Coverage de RLS | 100% | Crítica |
| Foreign Keys | 100% | Alta |
| Check constraints | Todos os campos críticos | Alta |

---

## Referências

- [Supabase Database](https://supabase.com/docs/guides/database)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Versão**: 1.0  
**Última Atualização**: 2026-04-15  
**Autor**: AI Agent