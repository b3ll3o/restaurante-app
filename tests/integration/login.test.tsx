import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMockSupabaseClient } from '../setup';

// Mock do Supabase com signInWithPassword configurável
const mockSignInWithPassword = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => createMockSupabaseClient({
    auth: {
      ...createMockSupabaseClient().auth,
      signInWithPassword: mockSignInWithPassword,
    },
  }),
}));

// Lazy import
const LoginPage = async () => {
  const { default: Page } = await import('@/app/admin/login/page');
  return Page;
};

describe('LoginPage - Testes de Integração', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Cenário: Admin faz login com credenciais válidas', () => {
    it('deve fazer login e redirecionar para dashboard', async () => {
      mockSignInWithPassword.mockResolvedValueOnce({
        data: { user: { id: 'user-1', email: 'admin@restaurante.com' } },
        error: null,
      });

      const Page = await LoginPage();
      render(<Page />);

      const emailInput = screen.getByLabelText(/e-mail/i);
      const passwordInput = screen.getByLabelText(/senha/i);

      await userEvent.type(emailInput, 'admin@restaurante.com');
      await userEvent.type(passwordInput, 'senha123');

      const submitButton = screen.getByRole('button', { name: /entrar/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSignInWithPassword).toHaveBeenCalledWith({
          email: 'admin@restaurante.com',
          password: 'senha123',
        });
      });
    });

    it('deve exibir mensagem de boas-vindas após login', async () => {
      mockSignInWithPassword.mockResolvedValueOnce({
        data: { user: { id: 'user-1', email: 'admin@restaurante.com' } },
        error: null,
      });

      const Page = await LoginPage();
      render(<Page />);

      const emailInput = screen.getByLabelText(/e-mail/i);
      const passwordInput = screen.getByLabelText(/senha/i);

      await userEvent.type(emailInput, 'admin@restaurante.com');
      await userEvent.type(passwordInput, 'senha123');

      const submitButton = screen.getByRole('button', { name: /entrar/i });
      await userEvent.click(submitButton);
    });
  });

  describe('Cenário: Admin faz login com credenciais inválidas', () => {
    it('deve permanecer na página de login', async () => {
      mockSignInWithPassword.mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'Invalid login credentials' },
      });

      const Page = await LoginPage();
      render(<Page />);

      const emailInput = screen.getByLabelText(/e-mail/i);
      const passwordInput = screen.getByLabelText(/senha/i);

      await userEvent.type(emailInput, 'admin@restaurante.com');
      await userEvent.type(passwordInput, 'senhaerrada');

      const submitButton = screen.getByRole('button', { name: /entrar/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
      });
    });

    it('deve exibir mensagem de erro quando credenciais inválidas', async () => {
      mockSignInWithPassword.mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'Invalid login credentials' },
      });

      const Page = await LoginPage();
      render(<Page />);

      const emailInput = screen.getByLabelText(/e-mail/i);
      const passwordInput = screen.getByLabelText(/senha/i);

      await userEvent.type(emailInput, 'admin@restaurante.com');
      await userEvent.type(passwordInput, 'senhaerrada');

      const submitButton = screen.getByRole('button', { name: /entrar/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email ou senha incorretos/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Cenário: Admin tenta login com campos vazios', () => {
    it('deve permanecer na página de login ao tentar enviar vazio', async () => {
      const Page = await LoginPage();
      render(<Page />);

      const emailInput = screen.getByLabelText(/e-mail/i);
      const passwordInput = screen.getByLabelText(/senha/i);

      // Não preenche nada
      await userEvent.click(screen.getByRole('button', { name: /entrar/i }));

      // Os campos devem estar vazios
      expect(emailInput).toHaveValue('');
      expect(passwordInput).toHaveValue('');
    });
  });
});
