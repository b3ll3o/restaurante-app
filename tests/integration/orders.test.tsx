import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import OrdersPage from '@/app/admin/orders/page';

// Mock do módulo next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/admin/orders',
  useSearchParams: () => new URLSearchParams(),
}));

// Dados de exemplo
const mockOrders = [
  {
    id: 'order-1',
    customer_name: 'Maria Silva',
    customer_whatsapp: '5511999999999',
    total: 4590,
    status: 'pending',
    payment_method: 'pix',
    created_at: '2026-04-17T10:00:00Z',
  },
  {
    id: 'order-2',
    customer_name: 'João Santos',
    customer_whatsapp: '5511888888888',
    total: 7590,
    status: 'confirmed',
    payment_method: 'cash',
    created_at: '2026-04-17T09:00:00Z',
  },
  {
    id: 'order-3',
    customer_name: 'Ana Costa',
    customer_whatsapp: '5511777777777',
    total: 3590,
    status: 'cancelled',
    payment_method: 'pix',
    created_at: '2026-04-16T18:00:00Z',
  },
];

// Configurar mock chain para Supabase
const setupSupabaseMock = () => {
  const mockFrom = vi.fn((table) => {
    if (table === 'orders') {
      return {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockOrders, error: null }),
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null }),
      };
    }
    if (table === 'order_items') {
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          data: [
            {
              id: 'item-1',
              product_name: 'Pizza Margherita',
              unit_price: 4590,
              quantity: 1,
              total_price: 4590,
            },
          ],
          error: null,
        }),
      };
    }
    return {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ data: [], error: null }),
    };
  });

  return {
    from: mockFrom,
    auth: { getSession: vi.fn() },
  };
};

const mockSupabaseClient = setupSupabaseMock();

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => mockSupabaseClient),
}));

describe('OrdersPage - Testes de Integração', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Fetch Orders List', () => {
    it('deve exibir lista de pedidos quando carrega com sucesso', async () => {
      render(<OrdersPage />);

      await waitFor(() => {
        const element = screen.getByText('Maria Silva');
        expect(element).toBeTruthy();
      });

      const joaoElement = screen.getByText('João Santos');
      expect(joaoElement).toBeTruthy();

      const anaElement = screen.getByText('Ana Costa');
      expect(anaElement).toBeTruthy();
    });
  });

  describe('Order Status Display', () => {
    it('deve exibir badge de status para cada pedido', async () => {
      render(<OrdersPage />);

      await waitFor(() => {
        const badges = screen.getAllByText('Pendente');
        expect(badges.length).toBeGreaterThan(0);
      });

      const confirmadoBadge = screen.getByText('Confirmado');
      expect(confirmadoBadge).toBeTruthy();

      const canceladoBadge = screen.getByText('Cancelado');
      expect(canceladoBadge).toBeTruthy();
    });
  });

  describe('Order Details Modal', () => {
    it('deve abrir modal ao clicar em "Ver detalhes"', async () => {
      render(<OrdersPage />);

      await waitFor(() => {
        fireEvent.click(screen.getAllByText('Ver detalhes')[0]);
      });

      const modalTitle = screen.getByText('Detalhes do Pedido');
      expect(modalTitle).toBeTruthy();
    });
  });

  describe('Update Order Status', () => {
    it('deve confirmar pedido e mostrar mensagem de sucesso', async () => {
      render(<OrdersPage />);

      await waitFor(() => {
        const confirmButton = screen.getByTitle('Confirmar pedido');
        fireEvent.click(confirmButton);
      });

      await waitFor(() => {
        const message = screen.getByText('Pedido confirmado');
        expect(message).toBeTruthy();
      });
    });

    it('deve cancelar pedido e mostrar mensagem de sucesso', async () => {
      render(<OrdersPage />);

      await waitFor(() => {
        const cancelButton = screen.getByTitle('Cancelar pedido');
        fireEvent.click(cancelButton);
      });

      await waitFor(() => {
        const message = screen.getByText('Pedido cancelado');
        expect(message).toBeTruthy();
      });
    });
  });

  describe('Price Formatting', () => {
    it('deve formatar preços corretamente em reais', async () => {
      render(<OrdersPage />);

      await waitFor(() => {
        const price = screen.getByText('R$ 4.590,00');
        expect(price).toBeTruthy();
      });

      const price2 = screen.getByText('R$ 7.590,00');
      expect(price2).toBeTruthy();

      const price3 = screen.getByText('R$ 3.590,00');
      expect(price3).toBeTruthy();
    });
  });

  describe('WhatsApp Link', () => {
    it('deve renderizar link do WhatsApp com número correto', async () => {
      render(<OrdersPage />);

      await waitFor(() => {
        const link = screen.getByText('5511999999999').closest('a');
        expect(link).toBeTruthy();
        expect(link?.getAttribute('href')).toBe('https://wa.me/5511999999999');
      });
    });
  });

  describe('Payment Method Display', () => {
    it('deve exibir método de pagamento para cada pedido', async () => {
      render(<OrdersPage />);

      await waitFor(() => {
        const pixElements = screen.getAllByText('Pix');
        expect(pixElements.length).toBe(2);
      });

      const dinheiroElement = screen.getByText('Dinheiro');
      expect(dinheiroElement).toBeTruthy();
    });
  });

  describe('Orders Count', () => {
    it('deve exibir mensagem com quantidade de pedidos', async () => {
      render(<OrdersPage />);

      await waitFor(() => {
        const countText = screen.getByText('3 pedidos encontrados');
        expect(countText).toBeTruthy();
      });
    });
  });
});