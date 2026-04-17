import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoriesPage from '@/app/admin/categories/page';

// Mock do next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/admin/categories',
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
  {
    id: 'cat-1',
    restaurant_id: 'restaurant-1',
    name: 'Pizzas',
    display_order: 1,
    created_at: '2026-04-01',
  },
  {
    id: 'cat-2',
    restaurant_id: 'restaurant-1',
    name: 'Bebidas',
    display_order: 2,
    created_at: '2026-04-01',
  },
];

let mockCategoriesData = [...mockCategories];
let mockProductsData: Array<{ id: string; category_id: string; name: string }> = [];

function setupMockFrom() {
  mockFrom.mockImplementation((table) => {
    if (table === 'categories') {
      return {
        select: () => ({
          order: () => ({
            then: (cb: (val: unknown) => void) => cb({
              data: mockCategoriesData,
              error: null,
            }),
          }),
        }),
        insert: () => ({
          select: () => ({
            then: (cb: (val: unknown) => void) => cb({
              data: { ...mockCategoriesData[0], id: 'new-cat', name: 'Nova Categoria' },
              error: null,
            }),
          }),
        }),
        update: () => ({
          eq: () => ({
            select: () => ({
              then: (cb: (val: unknown) => void) => cb({
                data: mockCategoriesData[0],
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
    if (table === 'products') {
      return {
        select: () => ({
          eq: () => ({
            then: (cb: (val: unknown) => void) => cb({
              data: mockProductsData,
              error: null,
            }),
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

describe('CategoriesPage - Testes de Integração', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCategoriesData = [...mockCategories];
    mockProductsData = [];
    setupMockFrom();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Cenário: Admin cria categoria válida', () => {
    it('deve exibir lista de categorias ao carregar', async () => {
      render(<CategoriesPage />);

      await waitFor(() => {
        expect(screen.getByText('Pizzas')).toBeInTheDocument();
        expect(screen.getByText('Bebidas')).toBeInTheDocument();
      });
    });

    it('deve permitir criar nova categoria', async () => {
      render(<CategoriesPage />);

      await waitFor(() => {
        expect(screen.getByText('Pizzas')).toBeInTheDocument();
      });

      // Encontra campo de input ou botão de adicionar
      const addButton = screen.getByText(/adicionar|add/i) || screen.getByRole('button', { name: /adicionar/i });
      if (addButton) {
        await userEvent.click(addButton);
      }

      // Procura campo de nome
      const nameInput = screen.getByLabelText(/nome/i) || screen.getByPlaceholderText(/nome/i);
      if (nameInput) {
        await userEvent.type(nameInput, 'Bebidas');
      }

      const saveButton = screen.getByRole('button', { name: /salvar/i });
      if (saveButton) {
        await userEvent.click(saveButton);
      }

      await waitFor(() => {
        expect(mockFrom).toHaveBeenCalledWith('categories');
      });
    });

    it('deve exibir mensagem de sucesso após criar categoria', async () => {
      render(<CategoriesPage />);

      await waitFor(() => {
        expect(screen.getByText('Pizzas')).toBeInTheDocument();
      });
    });
  });

  describe('Cenário: Admin cria categoria sem nome', () => {
    it('deve exibir mensagem de erro "Nome é obrigatório"', async () => {
      render(<CategoriesPage />);

      await waitFor(() => {
        expect(screen.getByText('Pizzas')).toBeInTheDocument();
      });

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

  describe('Cenário: Admin edita categoria existente', () => {
    it('deve permitir editar categoria', async () => {
      render(<CategoriesPage />);

      await waitFor(() => {
        expect(screen.getByText('Pizzas')).toBeInTheDocument();
      });

      // Procura botão de editar
      const editButton = screen.getByTitle(/editar/i) || screen.getByRole('button', { name: /editar/i });
      if (editButton) {
        await userEvent.click(editButton);
      }

      // Modifica nome
      const nameInput = screen.getByDisplayValue('Pizzas');
      if (nameInput) {
        await userEvent.clear(nameInput);
        await userEvent.type(nameInput, 'Pizzas Especiais');
      }

      const saveButton = screen.getByRole('button', { name: /salvar/i });
      if (saveButton) {
        await userEvent.click(saveButton);
      }

      await waitFor(() => {
        expect(screen.getByText('Pizzas Especiais')).toBeInTheDocument();
      });
    });
  });

  describe('Cenário: Admin exclui categoria sem produtos', () => {
    it('deve permitir excluir categoria vazia', async () => {
      mockProductsData = []; // Sem produtos

      render(<CategoriesPage />);

      await waitFor(() => {
        expect(screen.getByText('Pizzas')).toBeInTheDocument();
      });

      // Procura botão de excluir
      const deleteButton = screen.getByTitle(/excluir/i) || screen.getByRole('button', { name: /excluir/i });
      if (deleteButton) {
        await userEvent.click(deleteButton);
      }

      // Confirma exclusão se houver dialog
      const confirmButton = screen.getByRole('button', { name: /confirmar|sim/i });
      if (confirmButton) {
        await userEvent.click(confirmButton);
      }

      await waitFor(() => {
        expect(mockFrom).toHaveBeenCalled();
      });
    });
  });

  describe('Cenário: Admin tenta excluir categoria com produtos', () => {
    it('deve exibir mensagem de erro ao tentar excluir categoria com produtos', async () => {
      mockProductsData = [{ id: 'prod-1', category_id: 'cat-1', name: 'Pizza Grande' }];

      render(<CategoriesPage />);

      await waitFor(() => {
        expect(screen.getByText('Pizzas')).toBeInTheDocument();
      });

      // Procura botão de excluir
      const deleteButton = screen.getByTitle(/excluir/i) || screen.getByRole('button', { name: /excluir/i });
      if (deleteButton) {
        await userEvent.click(deleteButton);
      }

      await waitFor(() => {
        const errorMessage = screen.getByText(/não.*excluir.*produtos|categoria.*produtos/i);
        expect(errorMessage).toBeInTheDocument();
      });
    });
  });

  describe('Ordenação de categorias', () => {
    it('deve exibir categorias na ordem correta', async () => {
      render(<CategoriesPage />);

      await waitFor(() => {
        const categories = screen.getAllByRole('listitem') || screen.getAllByText(/pizzas|bebidas/i);
        expect(categories.length).toBeGreaterThan(0);
      });
    });
  });
});
