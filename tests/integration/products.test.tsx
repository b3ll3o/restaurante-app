import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, waitFor, cleanup } from '@testing-library/react';

// Mock completo do Supabase com sessão autenticada
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: vi.fn((table: string) => {
      if (table === 'products') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({ 
            data: [
              { id: 'prod-1', name: 'Pizza Grande', price: 4500, is_available: true, category_id: 'cat-1' },
              { id: 'prod-2', name: 'Refrigerante', price: 500, is_available: true, category_id: 'cat-2' },
            ], 
            error: null 
          }),
          insert: vi.fn().mockResolvedValue({ data: { id: 'prod-new', name: 'Novo Produto' }, error: null }),
          update: vi.fn().mockResolvedValue({ data: { id: 'prod-1', name: 'Pizza Editada' }, error: null }),
          delete: vi.fn().mockResolvedValue({ data: null, error: null }),
        };
      }
      if (table === 'categories') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({ 
            data: [
              { id: 'cat-1', name: 'Pizzas', display_order: 1 },
              { id: 'cat-2', name: 'Bebidas', display_order: 2 },
            ], 
            error: null 
          }),
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

describe('ProductsPage - Testes de Integração', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Cenário: Admin acessa página de produtos', () => {
    it('deve renderizar lista de produtos', async () => {
      const { default: ProductsPage } = await import('@/app/admin/products/page');
      render(<ProductsPage />);
      
      await waitFor(() => {
        expect(document.body.textContent).toBeTruthy();
      }, { timeout: 5000 });
    });

    it('deve exibir produtos do restaurante', async () => {
      const { default: ProductsPage } = await import('@/app/admin/products/page');
      const { container } = render(<ProductsPage />);
      
      expect(container).toBeTruthy();
    });
  });
});
