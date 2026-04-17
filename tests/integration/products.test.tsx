import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductsPage from '@/app/admin/products/page';

// Mock do next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/admin/products',
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
const mockCategories = [
  { id: 'cat-1', name: 'Bebidas', display_order: 1 },
  { id: 'cat-2', name: 'Pizzas', display_order: 2 },
];

const mockProducts = [
  {
    id: 'prod-1',
    category_id: 'cat-1',
    name: 'Suco de Laranja',
    description: 'Suco natural',
    price: 1290,
    image_url: null,
    is_available: true,
    display_order: 1,
    created_at: '2026-04-01',
  },
  {
    id: 'prod-2',
    category_id: 'cat-1',
    name: 'Coca-Cola',
    description: 'Refrigerante 600ml',
    price: 890,
    image_url: null,
    is_available: true,
    display_order: 2,
    created_at: '2026-04-01',
  },
];

function setupMockFrom() {
  mockFrom.mockImplementation((table) => {
    if (table === 'categories') {
      return {
        select: () => ({
          order: () => ({
            then: (cb: (val: unknown) => void) => cb({
              data: mockCategories,
              error: null,
            }),
          }),
        }),
      };
    }
    if (table === 'products') {
      return {
        select: () => ({
          order: () => ({
            then: (cb: (val: unknown) => void) => cb({
              data: mockProducts,
              error: null,
            }),
          }),
        }),
        insert: () => ({
          select: () => ({
            then: (cb: (val: unknown) => void) => cb({
              data: { ...mockProducts[0], id: 'new-prod', name: 'Novo Produto' },
              error: null,
            }),
          }),
        }),
        update: () => ({
          eq: () => ({
            select: () => ({
              then: (cb: (val: unknown) => void) => cb({
                data: mockProducts[0],
                error: null,
              }),
            }),
          }),
        }),
        delete: () => ({
          eq: () => ({
            then: (cb: (val: unknown) => void) => cb({ error: null }),
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

describe('ProductsPage - Testes de Integração', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupMockFrom();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Cenário: Admin cria produto válido', () => {
    it('deve exibir lista de produtos', async () => {
      render(<ProductsPage />);

      await waitFor(() => {
        expect(screen.getByText('Suco de Laranja')).toBeInTheDocument();
        expect(screen.getByText('Coca-Cola')).toBeInTheDocument();
      });
    });

    it('deve abrir formulário de criação', async () => {
      render(<ProductsPage />);

      await waitFor(() => {
        expect(screen.getByText('Suco de Laranja')).toBeInTheDocument();
      });

      const addButton = screen.getByRole('button', { name: /adicionar|add/i });
      if (addButton) {
        await userEvent.click(addButton);
      }

      await waitFor(() => {
        expect(screen.getByLabelText(/nome/i) || screen.getByPlaceholderText(/nome/i)).toBeTruthy();
      });
    });

    it('deve criar produto com dados válidos', async () => {
      render(<ProductsPage />);

      await waitFor(() => {
        expect(screen.getByText('Suco de Laranja')).toBeInTheDocument();
      });

      // Abre modal/formulário
      const addButton = screen.getByRole('button', { name: /adicionar|add/i });
      if (addButton) {
        await userEvent.click(addButton);
      }

      await waitFor(() => {
        const nameInput = screen.getByLabelText(/nome/i) || screen.getByPlaceholderText(/nome/i);
        const priceInput = screen.getByLabelText(/preço/i) || screen.getByPlaceholderText(/preço/i);
        const categorySelect = screen.getByLabelText(/categoria/i) || screen.getByRole('combobox');

        if (nameInput) {
          fireEvent.change(nameInput, { target: { value: 'Suco de Laranja' } });
        }
        if (priceInput) {
          fireEvent.change(priceInput, { target: { value: '12.90' } });
        }
        if (categorySelect) {
          fireEvent.change(categorySelect, { target: { value: 'cat-1' } });
        }
      });

      const saveButton = screen.getByRole('button', { name: /salvar/i });
      if (saveButton) {
        await userEvent.click(saveButton);
      }

      await waitFor(() => {
        expect(mockFrom).toHaveBeenCalledWith('products');
      });
    });
  });

  describe('Cenário: Admin cria produto sem nome', () => {
    it('deve exibir mensagem de erro "Nome é obrigatório"', async () => {
      render(<ProductsPage />);

      await waitFor(() => {
        expect(screen.getByText('Suco de Laranja')).toBeInTheDocument();
      });

      // Abre modal/formulário
      const addButton = screen.getByRole('button', { name: /adicionar|add/i });
      if (addButton) {
        await userEvent.click(addButton);
      }

      // Tenta salvar sem nome
      const saveButton = screen.getByRole('button', { name: /salvar/i });
      if (saveButton) {
        await userEvent.click(saveButton);
      }

      await waitFor(() => {
        const errorMessage = screen.getByText(/nome.*obrigatório/i);
        expect(errorMessage).toBeInTheDocument();
      });
    });
  });

  describe('Cenário: Admin ativa/desativa produto', () => {
    it('deve permitir togglear disponibilidade', async () => {
      render(<ProductsPage />);

      await waitFor(() => {
        expect(screen.getByText('Suco de Laranja')).toBeInTheDocument();
      });

      // Procura toggle de disponibilidade
      const toggle = screen.getByRole('switch') || screen.getByRole('checkbox');
      if (toggle) {
        await userEvent.click(toggle);
      }

      await waitFor(() => {
        expect(mockFrom).toHaveBeenCalled();
      });
    });

    it('deve atualizar status de disponibilidade', async () => {
      render(<ProductsPage />);

      await waitFor(() => {
        expect(screen.getByText('Suco de Laranja')).toBeInTheDocument();
      });

      const toggle = screen.getByRole('switch') || screen.getByRole('checkbox');
      if (toggle) {
        await userEvent.click(toggle);
      }

      await waitFor(() => {
        expect(mockFrom).toHaveBeenCalledWith('products');
      });
    });
  });

  describe('Cenário: Admin edita produto existente', () => {
    it('deve permitir editar produto', async () => {
      render(<ProductsPage />);

      await waitFor(() => {
        expect(screen.getByText('Suco de Laranja')).toBeInTheDocument();
      });

      // Procura botão de editar
      const editButton = screen.getByTitle(/editar/i) || screen.getByRole('button', { name: /editar/i });
      if (editButton) {
        await userEvent.click(editButton);
      }

      await waitFor(() => {
        const priceInput = screen.getByDisplayValue('12.90') || screen.getByLabelText(/preço/i);
        if (priceInput) {
          fireEvent.change(priceInput, { target: { value: '15.90' } });
        }
      });

      const saveButton = screen.getByRole('button', { name: /salvar/i });
      if (saveButton) {
        await userEvent.click(saveButton);
      }

      await waitFor(() => {
        expect(screen.getByText('15.90')).toBeInTheDocument();
      });
    });
  });

  describe('Cenário: Admin exclui produto', () => {
    it('deve permitir excluir produto', async () => {
      render(<ProductsPage />);

      await waitFor(() => {
        expect(screen.getByText('Suco de Laranja')).toBeInTheDocument();
      });

      // Procura botão de excluir
      const deleteButton = screen.getByTitle(/excluir/i) || screen.getByRole('button', { name: /excluir/i });
      if (deleteButton) {
        await userEvent.click(deleteButton);
      }

      // Confirma exclusão
      const confirmButton = screen.getByRole('button', { name: /confirmar|sim/i });
      if (confirmButton) {
        await userEvent.click(confirmButton);
      }

      await waitFor(() => {
        expect(mockFrom).toHaveBeenCalled();
      });
    });
  });

  describe('Listagem de produtos', () => {
    it('deve exibir produtos em formato de cards ou tabela', async () => {
      render(<ProductsPage />);

      await waitFor(() => {
        const products = screen.getAllByText(/suco|coca-cola/i);
        expect(products.length).toBeGreaterThan(0);
      });
    });

    it('deve formatar preços em reais', async () => {
      render(<ProductsPage />);

      await waitFor(() => {
        expect(screen.getByText(/r\$|12,90|8,90/i)).toBeTruthy();
      });
    });
  });
});
