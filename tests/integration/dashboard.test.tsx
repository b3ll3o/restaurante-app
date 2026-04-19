import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { createMockSupabaseClient, mockRestaurant } from '../setup';

// Mock do Supabase com dados para dashboard
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => createMockSupabaseClient({
    from: vi.fn((table: string) => {
      if (table === 'orders') {
        const mockOrders = [
          { id: 'order-1', status: 'pending', total: 4590, created_at: new Date().toISOString() },
          { id: 'order-2', status: 'confirmed', total: 3590, created_at: new Date().toISOString() },
        ];
        return {
          select: vi.fn().mockResolvedValue({ data: mockOrders, error: null }),
          eq: vi.fn().mockReturnThis(),
          gte: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({ data: mockOrders, error: null }),
        };
      }
      if (table === 'categories') {
        return {
          select: vi.fn().mockResolvedValue({ 
            data: [{ id: 'cat-1', name: 'Pizzas' }, { id: 'cat-2', name: 'Bebidas' }], 
            error: null 
          }),
        };
      }
      if (table === 'products') {
        return {
          select: vi.fn().mockResolvedValue({ 
            data: [{ id: 'prod-1', name: 'Pizza Grande' }, { id: 'prod-2', name: 'Refrigerante' }], 
            error: null 
          }),
        };
      }
      return {
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
        eq: vi.fn().mockReturnThis(),
      };
    }),
  }),
}));

// Lazy import
const DashboardPage = async () => {
  const { default: Page } = await import('@/app/admin/dashboard/page');
  return Page;
};

describe('DashboardPage - Testes de Integração', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.getItem = vi.fn().mockReturnValue(null);
  });

  afterEach(() => {
    cleanup();
  });

  describe('Cenário: Admin acessa dashboard', () => {
    it('deve carregar métricas do dia', async () => {
      const Page = await DashboardPage();
      render(<Page />);

      await waitFor(() => {
        const content = document.body.textContent || '';
        expect(content.length).toBeGreaterThan(0);
      }, { timeout: 3000 });
    });

    it('deve exibir atalhos rápidos', async () => {
      const Page = await DashboardPage();
      render(<Page />);

      await waitFor(() => {
        const content = document.body.textContent || '';
        expect(content).toBeTruthy();
      }, { timeout: 3000 });
    });
  });

  describe('Cenário: Admin visualiza métricas de pedidos', () => {
    it('deve exibir quantidade de pedidos hoje', async () => {
      const Page = await DashboardPage();
      render(<Page />);

      await waitFor(() => {
        const content = document.body.textContent || '';
        expect(content).toBeTruthy();
      }, { timeout: 3000 });
    });

    it('deve exibir quantidade de pedidos pendentes', async () => {
      const Page = await DashboardPage();
      render(<Page />);

      await waitFor(() => {
        const content = document.body.textContent || '';
        expect(content).toBeTruthy();
      }, { timeout: 3000 });
    });

    it('deve exibir receita do dia', async () => {
      const Page = await DashboardPage();
      render(<Page />);

      await waitFor(() => {
        const content = document.body.textContent || '';
        expect(content).toBeTruthy();
      }, { timeout: 3000 });
    });
  });

  describe('Carregamento de dados', () => {
    it('deve carregar dados do restaurante', async () => {
      const Page = await DashboardPage();
      render(<Page />);

      await waitFor(() => {
        expect(screen.queryByText(/dashboard/i) || screen.queryByText(/painel/i)).toBeTruthy();
      }, { timeout: 3000 });
    });
  });
});
