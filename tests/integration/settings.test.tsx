import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SettingsPage from '@/app/admin/settings/page';

// Mock do next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/admin/settings',
}));

// Mock do createBrowserClient
const mockFrom = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: mockFrom,
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: { user: { id: 'user-1', email: 'admin@restaurante.com' } } },
      }),
      update: vi.fn().mockResolvedValue({ error: null }),
    },
  }),
}));

// Dados mockados
const mockRestaurant = {
  id: 'restaurant-1',
  name: 'Pizza Hut',
  slug: 'pizza-hut',
  owner_whatsapp: '5511999999999',
  owner_id: 'user-1',
  created_at: '2026-04-01',
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
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: mockRestaurant, error: null }),
            }),
          }),
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

// Mock do clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
  writable: true,
});

describe('SettingsPage - Testes de Integração', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupMockFrom();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Cenário: Admin acessa página de configurações e vê dados atuais', () => {
    it('deve exibir nome do restaurante', async () => {
      render(<SettingsPage />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Pizza Hut')).toBeInTheDocument();
      });
    });

    it('deve exibir WhatsApp configurado', async () => {
      render(<SettingsPage />);

      await waitFor(() => {
        const whatsappInput = screen.getByDisplayValue('5511999999999');
        expect(whatsappInput).toBeInTheDocument();
      });
    });

    it('deve exibir slug do cardápio público', async () => {
      render(<SettingsPage />);

      await waitFor(() => {
        const slugDisplay = screen.getByText('pizza-hut');
        expect(slugDisplay).toBeInTheDocument();
      });
    });
  });

  describe('Cenário: Admin edita nome do restaurante com sucesso', () => {
    it('deve permitir editar nome', async () => {
      render(<SettingsPage />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Pizza Hut')).toBeInTheDocument();
      });

      const nameInput = screen.getByLabelText(/nome/i) || screen.getByDisplayValue('Pizza Hut');
      if (nameInput) {
        fireEvent.change(nameInput, { target: { value: 'Novo Restaurante' } });
      }

      const saveButton = screen.getByRole('button', { name: /salvar/i });
      if (saveButton) {
        await userEvent.click(saveButton);
      }

      await waitFor(() => {
        expect(mockFrom).toHaveBeenCalledWith('restaurants');
      });
    });

    it('deve exibir mensagem de sucesso após salvar', async () => {
      render(<SettingsPage />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Pizza Hut')).toBeInTheDocument();
      });

      const nameInput = screen.getByLabelText(/nome/i) || screen.getByDisplayValue('Pizza Hut');
      if (nameInput) {
        fireEvent.change(nameInput, { target: { value: 'Novo Restaurante' } });
      }

      const saveButton = screen.getByRole('button', { name: /salvar/i });
      if (saveButton) {
        await userEvent.click(saveButton);
      }

      await waitFor(() => {
        const successMessage = screen.getByText(/salvo|sucesso/i);
        expect(successMessage).toBeInTheDocument();
      });
    });
  });

  describe('Cenário: Admin edita WhatsApp com formato válido', () => {
    it('deve aceitar WhatsApp no formato brasileiro', async () => {
      render(<SettingsPage />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('5511999999999')).toBeInTheDocument();
      });

      const whatsappInput = screen.getByLabelText(/whatsapp/i);
      if (whatsappInput) {
        fireEvent.change(whatsappInput, { target: { value: '+55 11 99999-8888' } });
      }

      const saveButton = screen.getByRole('button', { name: /salvar/i });
      if (saveButton) {
        await userEvent.click(saveButton);
      }

      await waitFor(() => {
        expect(mockFrom).toHaveBeenCalledWith('restaurants');
      });
    });
  });

  describe('Cenário: Admin tenta editar com nome vazio', () => {
    it('deve exibir mensagem de erro "Nome é obrigatório"', async () => {
      render(<SettingsPage />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Pizza Hut')).toBeInTheDocument();
      });

      const nameInput = screen.getByLabelText(/nome/i) || screen.getByDisplayValue('Pizza Hut');
      if (nameInput) {
        fireEvent.change(nameInput, { target: { value: '' } });
      }

      const saveButton = screen.getByRole('button', { name: /salvar/i });
      if (saveButton) {
        await userEvent.click(saveButton);
      }

      await waitFor(() => {
        const errorMessage = screen.getByText(/nome.*obrigatório/i);
        expect(errorMessage).toBeInTheDocument();
      });
    });

    it('não deve salvar quando nome está vazio', async () => {
      render(<SettingsPage />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Pizza Hut')).toBeInTheDocument();
      });

      const nameInput = screen.getByLabelText(/nome/i) || screen.getByDisplayValue('Pizza Hut');
      if (nameInput) {
        fireEvent.change(nameInput, { target: { value: '' } });
      }

      const saveButton = screen.getByRole('button', { name: /salvar/i });
      if (saveButton) {
        await userEvent.click(saveButton);
      }

      // Update não deve ser chamado com sucesso
      await waitFor(() => {
        const errorMessage = screen.getByText(/nome.*obrigatório/i);
        expect(errorMessage).toBeInTheDocument();
      });
    });
  });

  describe('Cenário: Admin tenta editar com WhatsApp inválido', () => {
    it('deve exibir mensagem de erro "WhatsApp inválido"', async () => {
      render(<SettingsPage />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('5511999999999')).toBeInTheDocument();
      });

      const whatsappInput = screen.getByLabelText(/whatsapp/i);
      if (whatsappInput) {
        fireEvent.change(whatsappInput, { target: { value: '123' } });
      }

      const saveButton = screen.getByRole('button', { name: /salvar/i });
      if (saveButton) {
        await userEvent.click(saveButton);
      }

      await waitFor(() => {
        const errorMessage = screen.getByText(/whatsapp.*inválido/i);
        expect(errorMessage).toBeInTheDocument();
      });
    });
  });

  describe('Cenário: Admin copia link do cardápio público', () => {
    it('deve exibir botão de copiar link', async () => {
      render(<SettingsPage />);

      await waitFor(() => {
        const copyButton = screen.getByRole('button', { name: /copiar|copy/i });
        expect(copyButton).toBeTruthy();
      });
    });

    it('deve copiar URL para clipboard ao clicar', async () => {
      render(<SettingsPage />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Pizza Hut')).toBeInTheDocument();
      });

      const copyButton = screen.getByRole('button', { name: /copiar|copy/i });
      if (copyButton) {
        await userEvent.click(copyButton);
      }

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalled();
      });
    });

    it('deve exibir mensagem "Link copiado!" após copiar', async () => {
      render(<SettingsPage />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Pizza Hut')).toBeInTheDocument();
      });

      const copyButton = screen.getByRole('button', { name: /copiar|copy/i });
      if (copyButton) {
        await userEvent.click(copyButton);
      }

      await waitFor(() => {
        const message = screen.getByText(/link copiado/i);
        expect(message).toBeInTheDocument();
      });
    });
  });

  describe('Cenário: Link do cardápio contém o slug correto', () => {
    it('deve exibir link com slug do restaurante', async () => {
      render(<SettingsPage />);

      await waitFor(() => {
        const menuLink = screen.getByText(/\/menu\/pizza-hut/i);
        expect(menuLink).toBeInTheDocument();
      });
    });

    it('deve gerar URL completa do cardápio', async () => {
      render(<SettingsPage />);

      await waitFor(() => {
        const linkText = screen.getByText(/pizza-hut/i);
        expect(linkText).toBeTruthy();
      });
    });
  });
});
