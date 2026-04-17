import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CheckoutPage from '@/app/menu/[slug]/checkout/page';

// Mock do next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
  }),
  useParams: () => ({ slug: 'pizza-hut' }),
}));

// Mock do CartContext
const mockCartItems = [
  {
    product: {
      id: 'prod-1',
      name: 'Pizza Grande',
      price: 4590,
      description: 'Pizza grande',
    },
    quantity: 2,
  },
];

const mockClearCart = vi.fn();

vi.mock('@/context/cart-context', async () => {
  return {
    CartProvider: ({ children }: { children: React.ReactNode }) => children,
    useCart: () => ({
      items: mockCartItems,
      addItem: vi.fn(),
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: mockClearCart,
      totalItems: 2,
      totalPrice: 9180,
    }),
  };
});

// Mock do createBrowserClient
const mockInsert = vi.fn();
const mockFrom = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: mockFrom,
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
    },
  }),
}));

// Mock do WhatsApp
vi.mock('@/lib/whatsapp', () => ({
  buildWhatsAppURL: vi.fn(() => 'https://wa.me/5511999999999?text=Pedido'),
}));

// Mock global fetch
global.fetch = vi.fn();

const mockRestaurant = {
  id: 'restaurant-1',
  slug: 'pizza-hut',
  name: 'Pizza Hut',
  owner_whatsapp: '5511999999999',
};

function setupMockFrom() {
  mockFrom.mockImplementation((table) => {
    if (table === 'restaurants') {
      return {
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: mockRestaurant, error: null }),
          }),
        }),
      };
    }
    if (table === 'orders') {
      return {
        insert: mockInsert.mockResolvedValue({
          data: { id: 'order-1' },
          error: null,
        }),
      };
    }
    return {
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
    };
  });
}

describe('CheckoutPage - Testes de Integração', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupMockFrom();
    mockInsert.mockResolvedValue({ data: { id: 'order-1' }, error: null });
  });

  afterEach(() => {
    cleanup();
  });

  describe('Cenário: Cliente acessa formulário de checkout', () => {
    it('deve exibir lista de itens no carrinho', async () => {
      render(<CheckoutPage />);

      await waitFor(() => {
        expect(screen.getByText('Pizza Grande')).toBeInTheDocument();
      });
    });

    it('deve exibir campos do formulário', async () => {
      render(<CheckoutPage />);

      await waitFor(() => {
        expect(screen.getByLabelText(/nome/i) || screen.getByPlaceholderText(/nome/i)).toBeTruthy();
        expect(screen.getByLabelText(/whatsapp/i) || screen.getByPlaceholderText(/whatsapp/i)).toBeTruthy();
      });
    });

    it('deve exibir opções de pagamento', async () => {
      render(<CheckoutPage />);

      await waitFor(() => {
        const pixOption = screen.getByLabelText(/pix/i) || screen.getByText(/pix/i);
        expect(pixOption).toBeTruthy();
      });
    });
  });

  describe('Cenário: Cliente preenche dados corretamente', () => {
    it('deve aceitar nome válido', async () => {
      render(<CheckoutPage />);

      await waitFor(() => {
        expect(screen.getByText('Pizza Grande')).toBeInTheDocument();
      });

      const nameInput = screen.getByLabelText(/nome/i) || screen.getByPlaceholderText(/nome/i);
      if (nameInput) {
        await userEvent.type(nameInput, 'Maria Silva');
        expect(nameInput).toHaveValue('Maria Silva');
      }
    });

    it('deve aceitar WhatsApp válido', async () => {
      render(<CheckoutPage />);

      await waitFor(() => {
        expect(screen.getByText('Pizza Grande')).toBeInTheDocument();
      });

      const whatsappInput = screen.getByLabelText(/whatsapp/i) || screen.getByPlaceholderText(/whatsapp/i);
      if (whatsappInput) {
        await userEvent.type(whatsappInput, '5511888888888');
        expect(whatsappInput).toHaveValue('5511888888888');
      }
    });

    it('deve selecionar forma de pagamento PIX', async () => {
      render(<CheckoutPage />);

      await waitFor(() => {
        expect(screen.getByText('Pizza Grande')).toBeInTheDocument();
      });

      const pixOption = screen.getByLabelText(/pix/i);
      if (pixOption) {
        await userEvent.click(pixOption);
      }

      await waitFor(() => {
        expect(pixOption).toBeChecked();
      });
    });
  });

  describe('Cenário: Cliente tenta confirmar com nome vazio', () => {
    it('deve exibir mensagem de erro "Nome é obrigatório"', async () => {
      render(<CheckoutPage />);

      await waitFor(() => {
        expect(screen.getByText('Pizza Grande')).toBeInTheDocument();
      });

      // Deixa nome vazio e tenta enviar
      const submitButton = screen.getByRole('button', { name: /confirmar|enviar/i });
      if (submitButton) {
        await userEvent.click(submitButton);
      }

      await waitFor(() => {
        const errorMessage = screen.getByText(/nome.*obrigatório/i);
        expect(errorMessage).toBeInTheDocument();
      });
    });
  });

  describe('Cenário: Cliente tenta confirmar com WhatsApp inválido', () => {
    it('deve exibir mensagem de erro para WhatsApp inválido', async () => {
      render(<CheckoutPage />);

      await waitFor(() => {
        expect(screen.getByText('Pizza Grande')).toBeInTheDocument();
      });

      const nameInput = screen.getByLabelText(/nome/i) || screen.getByPlaceholderText(/nome/i);
      const whatsappInput = screen.getByLabelText(/whatsapp/i) || screen.getByPlaceholderText(/whatsapp/i);

      if (nameInput) {
        await userEvent.type(nameInput, 'Maria Silva');
      }
      if (whatsappInput) {
        await userEvent.type(whatsappInput, 'abc');
      }

      const submitButton = screen.getByRole('button', { name: /confirmar|enviar/i });
      if (submitButton) {
        await userEvent.click(submitButton);
      }

      await waitFor(() => {
        const errorMessage = screen.getByText(/whatsapp.*inválido/i);
        expect(errorMessage).toBeInTheDocument();
      });
    });
  });

  describe('Cenário: Cliente seleciona forma de pagamento', () => {
    it('deve armazenar método de pagamento selecionado', async () => {
      render(<CheckoutPage />);

      await waitFor(() => {
        expect(screen.getByText('Pizza Grande')).toBeInTheDocument();
      });

      const pixOption = screen.getByLabelText(/pix/i);
      if (pixOption) {
        await userEvent.click(pixOption);
      }

      expect(pixOption).toBeChecked();
    });

    it('deve permitir selecionar dinheiro', async () => {
      render(<CheckoutPage />);

      await waitFor(() => {
        expect(screen.getByText('Pizza Grande')).toBeInTheDocument();
      });

      const dinheiroOption = screen.getByLabelText(/dinheiro/i);
      if (dinheiroOption) {
        await userEvent.click(dinheiroOption);
        expect(dinheiroOption).toBeChecked();
      }
    });
  });

  describe('Cenário: Cliente confirma pedido com sucesso', () => {
    it('deve criar pedido com status pending', async () => {
      render(<CheckoutPage />);

      await waitFor(() => {
        expect(screen.getByText('Pizza Grande')).toBeInTheDocument();
      });

      // Preenche dados
      const nameInput = screen.getByLabelText(/nome/i) || screen.getByPlaceholderText(/nome/i);
      const whatsappInput = screen.getByLabelText(/whatsapp/i) || screen.getByPlaceholderText(/whatsapp/i);

      if (nameInput) await userEvent.type(nameInput, 'Maria Silva');
      if (whatsappInput) await userEvent.type(whatsappInput, '5511888888888');

      const pixOption = screen.getByLabelText(/pix/i);
      if (pixOption) await userEvent.click(pixOption);

      // Confirma
      const submitButton = screen.getByRole('button', { name: /confirmar|enviar/i });
      if (submitButton) await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockInsert).toHaveBeenCalled();
      });
    });

    it('deve limpar carrinho após confirmar', async () => {
      render(<CheckoutPage />);

      await waitFor(() => {
        expect(screen.getByText('Pizza Grande')).toBeInTheDocument();
      });

      // Preenche e confirma
      const nameInput = screen.getByLabelText(/nome/i) || screen.getByPlaceholderText(/nome/i);
      const whatsappInput = screen.getByLabelText(/whatsapp/i) || screen.getByPlaceholderText(/whatsapp/i);

      if (nameInput) await userEvent.type(nameInput, 'Maria Silva');
      if (whatsappInput) await userEvent.type(whatsappInput, '5511888888888');

      const submitButton = screen.getByRole('button', { name: /confirmar|enviar/i });
      if (submitButton) await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockClearCart).toHaveBeenCalled();
      });
    });
  });

  describe('Cenário: Cliente é redirecionado para WhatsApp após pedido', () => {
    it('deve construir URL do WhatsApp com detalhes do pedido', async () => {
      const { buildWhatsAppURL } = await import('@/lib/whatsapp');

      render(<CheckoutPage />);

      await waitFor(() => {
        expect(screen.getByText('Pizza Grande')).toBeInTheDocument();
      });

      // Preenche e confirma
      const nameInput = screen.getByLabelText(/nome/i) || screen.getByPlaceholderText(/nome/i);
      const whatsappInput = screen.getByLabelText(/whatsapp/i) || screen.getByPlaceholderText(/whatsapp/i);

      if (nameInput) await userEvent.type(nameInput, 'Maria Silva');
      if (whatsappInput) await userEvent.type(whatsappInput, '5511888888888');

      const submitButton = screen.getByRole('button', { name: /confirmar|enviar/i });
      if (submitButton) await userEvent.click(submitButton);

      await waitFor(() => {
        expect(buildWhatsAppURL).toHaveBeenCalled();
      });
    });
  });

  describe('Cálculo de total', () => {
    it('deve exibir total correto', async () => {
      render(<CheckoutPage />);

      await waitFor(() => {
        expect(screen.getByText(/91,80|r\$ 91/i)).toBeTruthy();
      });
    });
  });
});
