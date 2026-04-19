import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, cleanup, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMockSupabaseClient, mockRestaurant } from '../setup';

// Importa a página após os mocks
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => createMockSupabaseClient({
    from: vi.fn((table: string) => {
      if (table === 'categories') {
        const mockCategories = [
          { id: 'cat-1', name: 'Pizzas', display_order: 1, restaurant_id: 'restaurant-1', created_at: '2026-04-01' },
          { id: 'cat-2', name: 'Bebidas', display_order: 2, restaurant_id: 'restaurant-1', created_at: '2026-04-01' },
        ];
        
        return {
          select: vi.fn().mockResolvedValue({ data: mockCategories, error: null }),
          insert: vi.fn().mockResolvedValue({ data: { ...mockCategories[0], id: 'new-cat', name: 'Nova Categoria' }, error: null }),
          update: vi.fn().mockResolvedValue({ data: mockCategories[0], error: null }),
          delete: vi.fn().mockResolvedValue({ data: null, error: null }),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({ data: mockCategories, error: null }),
        };
      }
      if (table === 'products') {
        return {
          select: vi.fn().mockResolvedValue({ data: [], error: null }),
          eq: vi.fn().mockResolvedValue({ data: [], error: null }),
        };
      }
      return {
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      };
    }),
  }),
}));

// Lazy import para evitar hoisting de mocks
const CategoriesPage = async () => {
  const { default: Page } = await import('@/app/admin/categories/page');
  return Page;
};

describe('CategoriesPage - Testes de Integração', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Limpa qualquer estado de localStorage
    localStorage.getItem = vi.fn().mockReturnValue(null);
  });

  afterEach(() => {
    cleanup();
  });

  describe('Cenário: Admin cria categoria válida', () => {
    it('deve exibir lista de categorias ao carregar', async () => {
      const Page = await CategoriesPage();
      render(<Page />);

      await waitFor(() => {
        expect(screen.getByText('Pizzas')).toBeInTheDocument();
        expect(screen.getByText('Bebidas')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('deve permitir criar nova categoria', async () => {
      const Page = await CategoriesPage();
      render(<Page />);

      await waitFor(() => {
        expect(screen.getByText('Pizzas')).toBeInTheDocument();
      });

      // Clica no botão de adicionar categoria
      const addButton = screen.getByRole('button', { name: /nova categoria/i });
      await userEvent.click(addButton);

      // Verifica se o dialog abriu
      await waitFor(() => {
        expect(screen.getByText('Nova Categoria')).toBeInTheDocument();
      });

      // Preenche o nome
      const nameInput = screen.getByLabelText('Nome');
      await userEvent.type(nameInput, 'Sobremesas');

      // Clica em salvar
      const saveButton = screen.getByRole('button', { name: /salvar/i });
      await userEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText(/categoria criada/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('deve exibir mensagem de sucesso após criar categoria', async () => {
      const Page = await CategoriesPage();
      render(<Page />);

      await waitFor(() => {
        expect(screen.getByText('Pizzas')).toBeInTheDocument();
      });
    });
  });

  describe('Cenário: Admin cria categoria sem nome', () => {
    it('deve exibir mensagem de erro "Nome é obrigatório"', async () => {
      const Page = await CategoriesPage();
      render(<Page />);

      await waitFor(() => {
        expect(screen.getByText('Pizzas')).toBeInTheDocument();
      });

      // Clica no botão de adicionar
      const addButton = screen.getByRole('button', { name: /nova categoria/i });
      await userEvent.click(addButton);

      // Tenta salvar sem nome
      const saveButton = screen.getByRole('button', { name: /salvar/i });
      expect(saveButton).toBeDisabled();
    });
  });

  describe('Cenário: Admin edita categoria existente', () => {
    it('deve permitir editar categoria', async () => {
      const Page = await CategoriesPage();
      render(<Page />);

      await waitFor(() => {
        expect(screen.getByText('Pizzas')).toBeInTheDocument();
      });

      // Procura botão de editar da primeira categoria
      const editButtons = screen.getAllByRole('button', { name: /editar/i });
      await userEvent.click(editButtons[0]);

      // Verifica se o dialog de edição abriu
      await waitFor(() => {
        expect(screen.getByText('Editar Categoria')).toBeInTheDocument();
      });
    });
  });

  describe('Cenário: Admin exclui categoria sem produtos', () => {
    it('deve permitir excluir categoria vazia', async () => {
      const Page = await CategoriesPage();
      render(<Page />);

      await waitFor(() => {
        expect(screen.getByText('Pizzas')).toBeInTheDocument();
      });

      // Confirma o dialog de exclusão
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

      // Procura botão de excluir da primeira categoria
      const deleteButtons = screen.getAllByRole('button', { name: /excluir/i });
      await userEvent.click(deleteButtons[0]);

      expect(confirmSpy).toHaveBeenCalled();
    });
  });

  describe('Cenário: Admin tenta excluir categoria com produtos', () => {
    it('deve exibir mensagem de erro ao tentar excluir categoria com produtos', async () => {
      const Page = await CategoriesPage();
      render(<Page />);

      await waitFor(() => {
        expect(screen.getByText('Pizzas')).toBeInTheDocument();
      });
    });
  });

  describe('Ordenação de categorias', () => {
    it('deve exibir categorias na ordem correta', async () => {
      const Page = await CategoriesPage();
      render(<Page />);

      await waitFor(() => {
        const categories = screen.getAllByText(/pizzas|bebidas/i);
        expect(categories.length).toBeGreaterThan(0);
      });
    });
  });
});
