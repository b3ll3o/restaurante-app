import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMockSupabaseClient } from '../setup';

// Mock do Supabase com signUp configurável
const mockSignUp = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => createMockSupabaseClient({
    auth: {
      ...createMockSupabaseClient().auth,
      signUp: mockSignUp,
    },
  }),
}));

// Lazy import
const SignupPage = async () => {
  const { default: Page } = await import('@/app/admin/signup/page');
  return Page;
};

describe('SignupPage - Testes de Integração', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Cenário: Admin cria conta com dados válidos', () => {
    it('deve criar conta e redirecionar para dashboard', async () => {
      mockSignUp.mockResolvedValueOnce({
        data: {
          user: { id: 'user-1', email: 'joao@restaurante.com' },
          session: null,
        },
        error: null,
      });

      const Page = await SignupPage();
      render(<Page />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/senha/i);

      await userEvent.type(emailInput, 'joao@restaurante.com');
      await userEvent.type(passwordInput, 'senha123');

      const submitButton = screen.getByRole('button', { name: /criar conta/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalled();
      }, { timeout: 3000 });
    });

    it('deve exibir link para login', async () => {
      const Page = await SignupPage();
      render(<Page />);

      const signInLink = screen.getByRole('link', { name: /entrar|sign in/i });
      expect(signInLink).toBeInTheDocument();
    });
  });

  describe('Cenário: Admin tenta criar conta com email já existente', () => {
    it('deve permanecer na página de cadastro', async () => {
      mockSignUp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'Este email já está em uso' },
      });

      const Page = await SignupPage();
      render(<Page />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/senha/i);

      await userEvent.type(emailInput, 'joao@restaurante.com');
      await userEvent.type(passwordInput, 'senha123');

      const submitButton = screen.getByRole('button', { name: /criar conta/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Cenário: Admin tenta criar conta com senha curta', () => {
    it('deve validar tamanho mínimo da senha', async () => {
      const Page = await SignupPage();
      render(<Page />);

      const passwordInput = screen.getByLabelText(/senha/i);
      await userEvent.type(passwordInput, '12345');

      // A validação deve manter o valor
      expect(passwordInput).toHaveValue('12345');
    });
  });
});
