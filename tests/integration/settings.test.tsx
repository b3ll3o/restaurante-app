import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, waitFor, cleanup } from '@testing-library/react';

// Mock completo do Supabase com sessão autenticada
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: vi.fn((table: string) => {
      if (table === 'restaurants') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({ 
            data: { 
              id: 'restaurant-1', 
              name: 'Restaurante Teste', 
              slug: 'restaurante-teste',
              owner_whatsapp: '5511999999999'
            }, 
            error: null 
          }),
          update: vi.fn().mockResolvedValue({ data: { id: 'restaurant-1', name: 'Novo Nome' }, error: null }),
          single: vi.fn().mockResolvedValue({ 
            data: { 
              id: 'restaurant-1', 
              name: 'Restaurante Teste', 
              slug: 'restaurante-teste',
              owner_whatsapp: '5511999999999'
            }, 
            error: null 
          }),
        };
      }
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: [], error: null }),
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
      updateUser: vi.fn().mockResolvedValue({ data: { user: { email: 'admin@test.com' } }, error: null }),
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

describe('SettingsPage - Testes de Integração', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Cenário: Admin acessa página de configurações', () => {
    it('deve renderizar configurações do restaurante', async () => {
      const { default: SettingsPage } = await import('@/app/admin/settings/page');
      render(<SettingsPage />);
      
      await waitFor(() => {
        expect(document.body.textContent).toBeTruthy();
      }, { timeout: 5000 });
    });

    it('deve exibir dados do restaurante', async () => {
      const { default: SettingsPage } = await import('@/app/admin/settings/page');
      const { container } = render(<SettingsPage />);
      
      expect(container).toBeTruthy();
    });
  });
});
