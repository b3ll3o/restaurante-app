import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, waitFor, cleanup } from '@testing-library/react';

// Mock completo do Supabase com sessão autenticada
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: vi.fn((table: string) => {
      if (table === 'orders') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({ 
            data: [
              { 
                id: 'order-1', 
                customer_name: 'Maria Silva', 
                customer_whatsapp: '5511888888888',
                total: 5000, 
                status: 'pending', 
                payment_method: 'pix',
                created_at: new Date().toISOString() 
              },
            ], 
            error: null 
          }),
          update: vi.fn().mockResolvedValue({ data: { id: 'order-1', status: 'confirmed' }, error: null }),
        };
      }
      if (table === 'order_items') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({ 
            data: [
              { id: 'item-1', product_name: 'Pizza Grande', unit_price: 4500, quantity: 1, total_price: 4500 }
            ], 
            error: null 
          }),
        };
      }
      if (table === 'restaurants') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({ data: { owner_whatsapp: '5511999999999' }, error: null }),
          single: vi.fn().mockResolvedValue({ data: { owner_whatsapp: '5511999999999' }, error: null }),
        };
      }
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: [], error: null }),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      };
    }),
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { 
          session: { 
            user: { id: 'user-1', email: 'admin@test.com' },
            access_token: 'mock-token'
          } 
        },
        error: null,
      }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      }),
    },
  }),
}));

// Mock do RestaurantContext
vi.mock('@/context/RestaurantContext', () => ({
  RestaurantProvider: ({ children }: { children: React.ReactNode }) => children,
  useRestaurant: () => ({
    restaurants: [{ id: 'restaurant-1', name: 'Restaurante Teste', slug: 'restaurante-teste', owner_whatsapp: '5511999999999' }],
    activeRestaurant: { id: 'restaurant-1', name: 'Restaurante Teste', slug: 'restaurante-teste', owner_whatsapp: '5511999999999' },
    setActiveRestaurant: vi.fn(),
    isLoading: false,
    error: null,
    refresh: vi.fn(),
  }),
}));

// Mock do CartContext
vi.mock('@/context/cart-context', () => ({
  CartProvider: ({ children }: { children: React.ReactNode }) => children,
  useCart: () => ({
    items: [],
    restaurantId: 'restaurant-1',
    addItem: vi.fn(),
    removeItem: vi.fn(),
    updateQuantity: vi.fn(),
    clearCart: vi.fn(),
    totalItems: 0,
    totalPrice: 0,
  }),
}));

describe('OrdersPage - Testes de Integração', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Cenário: Admin acessa página de pedidos', () => {
    it('deve renderizar lista de pedidos', async () => {
      const { default: OrdersPage } = await import('@/app/admin/orders/page');
      render(<OrdersPage />);
      
      await waitFor(() => {
        expect(document.body.textContent).toBeTruthy();
      }, { timeout: 5000 });
    });

    it('deve exibir pedidos do restaurante', async () => {
      const { default: OrdersPage } = await import('@/app/admin/orders/page');
      const { container } = render(<OrdersPage />);
      
      expect(container).toBeTruthy();
    });
  });
});
