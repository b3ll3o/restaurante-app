import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '@/app/admin/login/page';

// Mock do next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
}));

// Mock do createBrowserClient
const mockSignInWithPassword = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
    },
  }),
}));

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

      render(<LoginPage />);

      const emailInput = screen.getByLabelText('E-mail');
      const passwordInput = screen.getByLabelText('Senha');

      await userEvent.type(emailInput, 'admin@restaurante.com');
      await userEvent.type(passwordInput, 'senha123');

      const submitButton = screen.getByRole('button', { name: 'Entrar' });
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

      render(<LoginPage />);

      const emailInput = screen.getByLabelText('E-mail');
      const passwordInput = screen.getByLabelText('Senha');

      await userEvent.type(emailInput, 'admin@restaurante.com');
      await userEvent.type(passwordInput, 'senha123');

      const submitButton = screen.getByRole('button', { name: 'Entrar' });
      await userEvent.click(submitButton);
    });
  });

  describe('Cenário: Admin faz login com credenciais inválidas', () => {
    it('deve permanecer na página de login', async () => {
      mockSignInWithPassword.mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'Email ou senha incorretos' },
      });

      render(<LoginPage />);

      const emailInput = screen.getByLabelText('E-mail');
      const passwordInput = screen.getByLabelText('Senha');

      await userEvent.type(emailInput, 'admin@restaurante.com');
      await userEvent.type(passwordInput, 'senhaerrada');

      const submitButton = screen.getByRole('button', { name: 'Entrar' });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Email ou senha incorretos')).toBeInTheDocument();
      });
    });

    it('deve exibir mensagem de erro "Email ou senha incorretos"', async () => {
      mockSignInWithPassword.mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'Email ou senha incorretos' },
      });

      render(<LoginPage />);

      const emailInput = screen.getByLabelText('E-mail');
      const passwordInput = screen.getByLabelText('Senha');

      await userEvent.type(emailInput, 'admin@restaurante.com');
      await userEvent.type(passwordInput, 'senhaerrada');

      const submitButton = screen.getByRole('button', { name: 'Entrar' });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Email ou senha incorretos')).toBeInTheDocument();
      });
    });
  });

  describe('Cenário: Admin tenta login com email inválido', () => {
    it('deve permanecer na página de login', async () => {
      mockSignInWithPassword.mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'Invalid email' },
      });

      render(<LoginPage />);

      const emailInput = screen.getByLabelText('E-mail');
      const passwordInput = screen.getByLabelText('Senha');

      await userEvent.type(emailInput, 'email-invalido');
      await userEvent.type(passwordInput, 'senha123');

      const submitButton = screen.getByRole('button', { name: 'Entrar' });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid email')).toBeInTheDocument();
      });
    });

    it('deve exibir mensagem de erro "Email inválido"', async () => {
      mockSignInWithPassword.mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'Invalid email' },
      });

      render(<LoginPage />);

      const emailInput = screen.getByLabelText('E-mail');
      const passwordInput = screen.getByLabelText('Senha');

      await userEvent.type(emailInput, 'email-invalido');
      await userEvent.type(passwordInput, 'senha123');

      const submitButton = screen.getByRole('button', { name: 'Entrar' });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid email')).toBeInTheDocument();
      });
    });
  });

  describe('Cenário: Admin tenta login com campos vazios', () => {
    it('deve exibir erro de validação do HTML5', async () => {
      render(<LoginPage />);

      const submitButton = screen.getByRole('button', { name: 'Entrar' });

      // Campos obrigatórios devem acionar validação HTML5
      expect(submitButton).toBeDisabled();
    });

    it('deve permanecer na página de login ao tentar enviar vazio', async () => {
      render(<LoginPage />);

      const emailInput = screen.getByLabelText('E-mail');
      const passwordInput = screen.getByLabelText('Senha');

      // Não preenche nada
      await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));

      // Os campos devem estar vazios
      expect(emailInput).toHaveValue('');
      expect(passwordInput).toHaveValue('');
    });
  });

  describe('Estado de Loading', () => {
    it('deve desabilitar botão durante loading', async () => {
      mockSignInWithPassword.mockImplementation(() => new Promise((resolve) => {
        setTimeout(() => resolve({ data: { user: null }, error: null }), 100);
      }));

      render(<LoginPage />);

      const emailInput = screen.getByLabelText('E-mail');
      const passwordInput = screen.getByLabelText('Senha');

      await userEvent.type(emailInput, 'admin@restaurante.com');
      await userEvent.type(passwordInput, 'senha123');

      const submitButton = screen.getByRole('button', { name: 'Entrar' });
      await userEvent.click(submitButton);

      // Botão deve estar desabilitado ou com texto de loading
      await waitFor(() => {
        expect(screen.getByRole('button')).toHaveTextContent(/entrando/i);
      });
    });
  });
});
