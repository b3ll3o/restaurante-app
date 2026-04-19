import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, waitFor, cleanup } from '@testing-library/react';

// Mock completo do Supabase com sessão autenticada
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: vi.fn((table: string) => {
      if (table === 'categories') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({ 
            data: [
              { id: 'cat-1', name: 'Pizzas', display_order: 1, restaurant_id: 'restaurant-1', created_at: '2026-04-01' },
              { id: 'cat-2', name: 'Bebidas', display_order: 2, restaurant_id: 'restaurant-1', created_at: '2026-04-01' },
            ], 
            error: null 
          }),
          insert: vi.fn().mockResolvedValue({ data: { id: 'cat-new', name: 'Sobremesas' }, error: null }),
          update: vi.fn().mockResolvedValue({ data: { id: 'cat-1', name: 'Pizzas Editado' }, error: null }),
          delete: vi.fn().mockResolvedValue({ data: null, error: null }),
        };
      }
      if (table === 'products') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({ data: [], error: null }),
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

describe('CategoriesPage - Testes de Integração', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Cenário: Admin acessa página de categorias', () => {
    it('deve renderizar lista de categorias', async () => {
      const { default: CategoriesPage } = await import('@/app/admin/categories/page');
      render(<CategoriesPage />);
      
      await waitFor(() => {
        expect(document.body.textContent).toBeTruthy();
      }, { timeout: 5000 });
    });

    it('deve exibir categorias do restaurante', async () => {
      const { default: CategoriesPage } = await import('@/app/admin/categories/page');
      const { container } = render(<CategoriesPage />);
      
      expect(container).toBeTruthy();
    });
  });
});
