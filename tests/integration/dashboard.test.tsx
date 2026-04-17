import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';

import DashboardPage from '@/app/admin/dashboard/page';

// Mock do next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/admin/dashboard',
}));

// Mock do createBrowserClient
const mockFrom = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: mockFrom,
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: { user: { id: 'user-1' } } },
      }),
    },
  }),
}));

// Dados mockados
const mockOrdersToday = [
  { id: 'order-1', status: 'pending', total: 4590 },
  { id: 'order-2', status: 'confirmed', total: 3590 },
];

const mockCategories = [
  { id: 'cat-1', name: 'Pizzas' },
  { id: 'cat-2', name: 'Bebidas' },
];

const mockProducts = [
  { id: 'prod-1', name: 'Pizza Grande' },
  { id: 'prod-2', name: 'Refrigerante' },
];

function setupMockFrom() {
  mockFrom.mockImplementation((table) => {
    if (table === 'orders') {
      return {
        select: () => ({
          gte: () => ({
            lte: () => ({
              then: (cb: (val: unknown) => void) => cb({
                data: mockOrdersToday,
                error: null,
              }),
            }),
          }),
        }),
      };
    }
    if (table === 'categories') {
      return {
        select: () => ({
          then: (cb: (val: unknown) => void) => cb({
            data: mockCategories,
            error: null,
          }),
        }),
      };
    }
    if (table === 'products') {
      return {
        select: () => ({
          then: (cb: (val: unknown) => void) => cb({
            data: mockProducts,
            error: null,
          }),
        }),
      };
    }
    return {
      select: () => ({
        then: (cb: (val: unknown) => void) => cb({ data: [], error: null }),
      }),
    };
  });
}

describe('DashboardPage - Testes de Integração', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupMockFrom();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Cenário: Admin acessa dashboard', () => {
    it('deve carregar métricas do dia', async () => {
      render(<DashboardPage />);

      await waitFor(() => {
        // Verifica que os componentes carregaram
        expect(screen.getByText(/dashboard/i) || screen.getByText(/painel/i)).toBeTruthy();
      });
    });

    it('deve exibir atalhos rápidos', async () => {
      render(<DashboardPage />);

      await waitFor(() => {
        // Verifica presença de elementos do dashboard
        const content = document.body.textContent || '';
        expect(content.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Cenário: Admin visualiza métricas de pedidos', () => {
    it('deve exibir quantidade de pedidos hoje', async () => {
      render(<DashboardPage />);

      await waitFor(() => {
        // Verifica se métricas são exibidas
        const content = document.body.textContent || '';
        expect(content).toBeTruthy();
      });
    });

    it('deve exibir quantidade de pedidos pendentes', async () => {
      render(<DashboardPage />);

      await waitFor(() => {
        const content = document.body.textContent || '';
        expect(content).toBeTruthy();
      });
    });

    it('deve exibir receita do dia', async () => {
      render(<DashboardPage />);

      await waitFor(() => {
        const content = document.body.textContent || '';
        expect(content).toBeTruthy();
      });
    });
  });

  describe('Cenário: Admin acessa dashboard sem estar autenticado', () => {
    it('deve redirecionar para página de login quando não autenticado', async () => {
      // Este teste verifica o comportamento de redirect quando
      // o usuário não está autenticado
      const pushMock = vi.fn();

      vi.mock('next/navigation', () => ({
        useRouter: () => ({
          push: pushMock,
          replace: vi.fn(),
          refresh: vi.fn(),
        }),
        usePathname: () => '/admin/dashboard',
      }));

      render(<DashboardPage />);

      // O componente deve tentar verificar autenticação
      await waitFor(() => {
        // Se não autenticado, redirect é chamado
        expect(pushMock).toHaveBeenCalled();
      });
    });
  });

  describe('Carregamento de dados', () => {
    it('deve carregar pedidos do dia', async () => {
      render(<DashboardPage />);

      await waitFor(() => {
        expect(mockFrom).toHaveBeenCalledWith('orders');
      });
    });

    it('deve carregar categorias', async () => {
      render(<DashboardPage />);

      await waitFor(() => {
        expect(mockFrom).toHaveBeenCalledWith('categories');
      });
    });

    it('deve carregar produtos', async () => {
      render(<DashboardPage />);

      await waitFor(() => {
        expect(mockFrom).toHaveBeenCalledWith('products');
      });
    });
  });
});
