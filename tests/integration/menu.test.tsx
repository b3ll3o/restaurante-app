import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MenuPage from '@/app/menu/[slug]/page';

// Dados mockados
const mockRestaurant = {
  id: 'restaurant-1',
  slug: 'pizza-hut',
  name: 'Pizza Hut',
  owner_whatsapp: '5511999999999',
  created_at: '2026-04-01',
};

const mockCategories = [
  {
    id: 'category-1',
    restaurant_id: 'restaurant-1',
    name: 'Pizzas',
    display_order: 1,
    created_at: '2026-04-01',
  },
  {
    id: 'category-2',
    restaurant_id: 'restaurant-1',
    name: 'Bebidas',
    display_order: 2,
    created_at: '2026-04-01',
  },
];

const mockProducts = [
  {
    id: 'product-1',
    category_id: 'category-1',
    name: 'Pizza Grande',
    description: 'Pizza grande de mozzarella',
    price: 45.9,
    image_url: null,
    is_available: true,
    display_order: 1,
    created_at: '2026-04-01',
  },
  {
    id: 'product-2',
    category_id: 'category-1',
    name: 'Pizza Média',
    description: 'Pizza média de mozzarella',
    price: 35.9,
    image_url: null,
    is_available: true,
    display_order: 2,
    created_at: '2026-04-01',
  },
  {
    id: 'product-3',
    category_id: 'category-2',
    name: 'Refrigerante',
    description: 'Coca-Cola 600ml',
    price: 8.9,
    image_url: null,
    is_available: true,
    display_order: 1,
    created_at: '2026-04-01',
  },
];

// Configuração de estado dos mocks
let mockConfig: {
  restaurantData: typeof mockRestaurant | null;
  restaurantError: { message: string } | null;
  categoriesData: typeof mockCategories;
  categoriesError: null;
} = {
  restaurantData: mockRestaurant,
  restaurantError: null,
  categoriesData: mockCategories,
  categoriesError: null,
};

// Mock createClient - configurado uma vez
const mockFrom = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: mockFrom,
  }),
}));

// Função para reconfigurar o mock based no config
function setupMockFrom() {
  mockFrom.mockImplementation((table) => {
    if (table === 'restaurants') {
      return {
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({
              data: mockConfig.restaurantData,
              error: mockConfig.restaurantError,
            }),
          }),
        }),
      };
    }
    if (table === 'categories') {
      return {
        select: () => ({
          eq: () => ({
            order: () => Promise.resolve({
              data: mockConfig.categoriesData,
              error: mockConfig.categoriesError,
            }),
          }),
        }),
      };
    }
    // products
    return {
      select: () => ({
        eq: () => ({
          eq: () => ({
            order: () => Promise.resolve({ data: mockProducts, error: null }),
          }),
        }),
      }),
    };
  });
}

// Mock do CartProvider
vi.mock('@/context/cart-context', async () => {
  return {
    CartProvider: ({ children }: { children: React.ReactNode }) => children,
    useCart: () => ({
      items: [],
      addItem: vi.fn(),
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      totalItems: 0,
      totalPrice: 0,
    }),
  };
});

// Mock useParams
vi.mock('next/navigation', async () => {
  return {
    useParams: () => ({ slug: 'pizza-hut' }),
  };
});

// Mock global fetch
global.fetch = vi.fn();

// Helper para encontrar botão do carrinho (segundo botão no header)
function getCartButton(container: HTMLElement) {
  const buttons = container.querySelectorAll('button');
  // O carrinho é o segundo botão (primeiro é o menu)
  return buttons[1];
}

describe('MenuPage (Cardápio Público)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockConfig = {
      restaurantData: mockRestaurant,
      restaurantError: null,
      categoriesData: mockCategories,
      categoriesError: null,
    };
    setupMockFrom();
  });

  afterEach(() => {
    cleanup();
  });

  describe('exibição de cardápio válido', () => {
    it('deve exibir o nome do restaurante', async () => {
      render(<MenuPage />);

      await waitFor(() => {
        expect(screen.getByText('Pizza Hut')).toBeInTheDocument();
      });
    });

    it('deve listar as categorias', async () => {
      render(<MenuPage />);

      await waitFor(() => {
        expect(screen.getByText('Pizzas')).toBeInTheDocument();
        expect(screen.getByText('Bebidas')).toBeInTheDocument();
      });
    });

    it('deve exibir os produtos da categoria expandida', async () => {
      render(<MenuPage />);

      await waitFor(() => {
        expect(screen.getByText('Pizza Grande')).toBeInTheDocument();
        expect(screen.getByText('Pizza Média')).toBeInTheDocument();
      });
    });

    it('deve formatar os preços em BRL', async () => {
      render(<MenuPage />);

      await waitFor(() => {
        expect(screen.getByText('R$ 45,90')).toBeInTheDocument();
        expect(screen.getByText('R$ 35,90')).toBeInTheDocument();
      });
    });

    it('deve exibir botão Adicionar para cada produto', async () => {
      render(<MenuPage />);

      await waitFor(() => {
        expect(screen.getAllByText('Adicionar')).toHaveLength(3);
      });
    });
  });

  describe('restaurante não existe', () => {
    it('deve exibir mensagem de cardápio não encontrado', async () => {
      mockConfig = {
        restaurantData: null,
        restaurantError: { message: 'Not found' },
        categoriesData: [],
        categoriesError: null,
      };
      setupMockFrom();

      render(<MenuPage />);

      await waitFor(() => {
        expect(screen.getByText('Cardápio não encontrado')).toBeInTheDocument();
      });
    });
  });

  describe('cardápio vazio', () => {
    it('deve exibir mensagem de cardápio vazio', async () => {
      mockConfig = {
        restaurantData: mockRestaurant,
        restaurantError: null,
        categoriesData: [],
        categoriesError: null,
      };
      setupMockFrom();

      render(<MenuPage />);

      await waitFor(() => {
        expect(screen.getByText('Nenhum produto disponível no momento')).toBeInTheDocument();
      });
    });
  });

  describe('carrinho', () => {
    it('deve mostrar sheet ao clicar no ícone do carrinho', async () => {
      const { container } = render(<MenuPage />);

      await waitFor(() => {
        expect(screen.getByText('Pizza Hut')).toBeInTheDocument();
      });

      // Encontrar botão do carrinho (segundo botão na header)
      const cartButton = getCartButton(container);
      if (cartButton) {
        await userEvent.click(cartButton);
      }

      await waitFor(() => {
        expect(screen.getByText('Seu Pedido')).toBeInTheDocument();
      });
    });

    it('deve exibir mensagem de carrinho vazio', async () => {
      const { container } = render(<MenuPage />);

      await waitFor(() => {
        expect(screen.getByText('Pizza Hut')).toBeInTheDocument();
      });

      // Encontrar botão do carrinho
      const cartButton = getCartButton(container);
      if (cartButton) {
        await userEvent.click(cartButton);
      }

      await waitFor(() => {
        expect(screen.getByText('Seu carrinho está vazio')).toBeInTheDocument();
      });
    });
  });

  describe('BDD Scenarios', () => {
    it('Cenário: Cliente acessa cardápio válido', async () => {
      render(<MenuPage />);

      await waitFor(() => {
        expect(screen.getByText('Pizza Hut')).toBeInTheDocument();
        expect(screen.getByText('Pizzas')).toBeInTheDocument();
        expect(screen.getByText('Pizza Grande')).toBeInTheDocument();
      });
    });

    it('Cenário: Cliente acessa restaurante inexistente', async () => {
      mockConfig = {
        restaurantData: null,
        restaurantError: { message: 'Not found' },
        categoriesData: [],
        categoriesError: null,
      };
      setupMockFrom();

      render(<MenuPage />);

      await waitFor(() => {
        expect(screen.getByText('Cardápio não encontrado')).toBeInTheDocument();
      });
    });

    it('Cenário: Cliente visualiza produtos de uma categoria', async () => {
      render(<MenuPage />);

      await waitFor(() => {
        expect(screen.getByText('Pizza Grande')).toBeInTheDocument();
      });

      const bebidasCategory = screen.getByText('Bebidas').closest('button');
      if (bebidasCategory) {
        await userEvent.click(bebidasCategory);
      }

      expect(screen.getByText('Refrigerante')).toBeInTheDocument();
    });
  });
});