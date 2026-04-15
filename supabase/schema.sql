-- MenuLink Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Restaurantes (lojas)
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  owner_whatsapp TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Categorias
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Produtos
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

-- Tabela de Pedidos
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

-- Tabela de Itens do Pedido
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL,
  total_price DECIMAL(10,2) NOT NULL
);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Restaurants: owners can access their own restaurant
CREATE POLICY "Owners can view their restaurant" ON restaurants
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Owners can insert their restaurant" ON restaurants
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update their restaurant" ON restaurants
  FOR UPDATE USING (owner_id = auth.uid());

-- Categories: access through restaurant ownership
CREATE POLICY "Users can view categories of their restaurant" ON categories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE restaurants.id = categories.restaurant_id
      AND restaurants.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert categories for their restaurant" ON categories
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE restaurants.id = categories.restaurant_id
      AND restaurants.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update categories of their restaurant" ON categories
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE restaurants.id = categories.restaurant_id
      AND restaurants.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete categories of their restaurant" ON categories
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE restaurants.id = categories.restaurant_id
      AND restaurants.owner_id = auth.uid()
    )
  );

-- Products: access through restaurant/category ownership
CREATE POLICY "Users can view products of their restaurant" ON products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM categories
      JOIN restaurants ON restaurants.id = categories.restaurant_id
      WHERE categories.id = products.category_id
      AND restaurants.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert products for their restaurant" ON products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM categories
      JOIN restaurants ON restaurants.id = categories.restaurant_id
      WHERE categories.id = products.category_id
      AND restaurants.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update products of their restaurant" ON products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM categories
      JOIN restaurants ON restaurants.id = categories.restaurant_id
      WHERE categories.id = products.category_id
      AND restaurants.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete products of their restaurant" ON products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM categories
      JOIN restaurants ON restaurants.id = categories.restaurant_id
      WHERE categories.id = products.category_id
      AND restaurants.owner_id = auth.uid()
    )
  );

-- Orders: restaurant owners can manage orders
CREATE POLICY "Users can view orders of their restaurant" ON orders
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can update orders of their restaurant" ON orders
  FOR UPDATE USING (owner_id = auth.uid());

-- Order items: access through orders
CREATE POLICY "Users can view order items of their restaurant" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      JOIN restaurants ON restaurants.id = orders.restaurant_id
      WHERE orders.id = order_items.order_id
      AND restaurants.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert order items for their restaurant" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      JOIN restaurants ON restaurants.id = orders.restaurant_id
      WHERE orders.id = order_items.order_id
      AND restaurants.owner_id = auth.uid()
    )
  );

-- Function to get owner_id for orders policy
CREATE OR REPLACE FUNCTION get_order_owner_id(order_id UUID)
RETURNS UUID AS $$
  SELECT owner_id FROM restaurants WHERE id = (
    SELECT restaurant_id FROM orders WHERE id = order_id
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Fix orders policy to use function
DROP POLICY "Users can view orders of their restaurant" ON orders;
DROP POLICY "Users can update orders of their restaurant" ON orders;

CREATE POLICY "Users can view orders of their restaurant" ON orders
  FOR SELECT USING (get_order_owner_id(id) = auth.uid());

CREATE POLICY "Users can update orders of their restaurant" ON orders
  FOR UPDATE USING (get_order_owner_id(id) = auth.uid());

-- Public access for menu (no auth required)
-- This policy allows anyone to read restaurant data by slug
CREATE POLICY "Anyone can view published restaurants" ON restaurants
  FOR SELECT USING (true);

-- Anyone can view categories and products for menu display
CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view products" ON products
  FOR SELECT USING (true);

-- Anyone can create orders (no auth required for customers)
CREATE POLICY "Anyone can create orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Anyone can create order items
CREATE POLICY "Anyone can create order items" ON order_items
  FOR INSERT WITH CHECK (true);

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

CREATE POLICY "Anyone can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Anyone can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Anyone can delete product images" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images');

-- Trigger to create restaurant slug from name
CREATE OR REPLACE FUNCTION create_restaurant_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := LOWER(REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9]', '-', 'g')) || '-' || SUBSTR(NEW.id::TEXT, 1, 8);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_restaurant_slug
  BEFORE INSERT ON restaurants
  FOR EACH ROW
  EXECUTE FUNCTION create_restaurant_slug();