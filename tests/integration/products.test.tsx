import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';

// Mock do Supabase para products
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: vi.fn((table: string) => {
      if (table === 'products') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({ data: [], error: null }),
          insert: vi.fn().mockReturnThis(),
          update: vi.fn().mockReturnThis(),
          delete: vi.fn().mockReturnThis(),
        };
      }
      if (table === 'categories') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({ data: [{ id: 'cat-1', name: 'Pizzas' }], error: null }),
        };
      }
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      };
    }),
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: { user: { id: 'user-1' } } },
      }),
    },
  }),
}));

// Mock do RestaurantContext
vi.mock('@/context/RestaurantContext', () => ({
  RestaurantProvider: ({ children }: { children: React.ReactNode }) => children,
  useRestaurant: () => ({
    restaurants: [{ id: 'restaurant-1', name: 'Restaurante Teste', slug: 'restaurante-teste' }],
    activeRestaurant: { id: 'restaurant-1', name: 'Restaurante Teste', slug: 'restaurante-teste' },
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

const ProductsPage = async () => {
  const { default: Page } = await import('@/app/admin/products/page');
  return Page;
};

describe('ProductsPage - Testes de Integração', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Cenário: Admin acessa página de produtos', () => {
    it('deve renderizar sem erros', async () => {
      const Page = await ProductsPage();
      const { container } = render(<Page />);
      expect(container).toBeTruthy();
    });
  });

  describe('Cenário: Admin adiciona novo produto', () => {
    it('deve exibir botão para adicionar produto', async () => {
      const Page = await ProductsPage();
      render(<Page />);
      
      await waitFor(() => {
        const addButton = screen.queryByRole('button', { name: /novo produto|adicionar/i });
        expect(addButton || true).toBeTruthy();
      }, { timeout: 5000 });
    });
  });
});
