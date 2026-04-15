export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  owner_whatsapp: string;
  created_at: string;
}

export interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  display_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  display_order: number;
  created_at: string;
}

export interface Order {
  id: string;
  restaurant_id: string;
  customer_name: string;
  customer_whatsapp: string;
  total: number;
  status: "pending" | "confirmed" | "cancelled";
  payment_method: "pix" | "cash" | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  total_price: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface MenuData {
  restaurant: Restaurant;
  categories: (Category & { products: Product[] })[];
}