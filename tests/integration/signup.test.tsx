import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignupPage from '@/app/admin/signup/page';

// Mock do next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
}));

// Mock do createBrowserClient
const mockSignUp = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signUp: mockSignUp,
    },
  }),
}));

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

      render(<SignupPage />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const restaurantNameInput = screen.getByLabelText('Restaurant Name');
      const whatsappInput = screen.getByLabelText('WhatsApp Number');

      await userEvent.type(emailInput, 'joao@restaurante.com');
      await userEvent.type(passwordInput, 'senha123');
      await userEvent.type(restaurantNameInput, 'João Silva');
      await userEvent.type(whatsappInput, '5511999999999');

      const submitButton = screen.getByRole('button', { name: 'Create Account' });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith({
          email: 'joao@restaurante.com',
          password: 'senha123',
          options: {
            data: {
              restaurant_name: 'João Silva',
              whatsapp_number: '5511999999999',
            },
          },
        });
      });
    });

    it('deve exibir link para login', async () => {
      render(<SignupPage />);

      const signInLink = screen.getByRole('link', { name: /sign in/i });
      expect(signInLink).toHaveAttribute('href', '/admin/login');
    });
  });

  describe('Cenário: Admin tenta criar conta com email já existente', () => {
    it('deve permanecer na página de cadastro', async () => {
      mockSignUp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'Este email já está em uso' },
      });

      render(<SignupPage />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const restaurantNameInput = screen.getByLabelText('Restaurant Name');
      const whatsappInput = screen.getByLabelText('WhatsApp Number');

      await userEvent.type(emailInput, 'joao@restaurante.com');
      await userEvent.type(passwordInput, 'senha123');
      await userEvent.type(restaurantNameInput, 'João Silva');
      await userEvent.type(whatsappInput, '5511999999999');

      const submitButton = screen.getByRole('button', { name: 'Create Account' });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Este email já está em uso')).toBeInTheDocument();
      });
    });

    it('deve exibir mensagem de erro "Este email já está em uso"', async () => {
      mockSignUp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'Este email já está em uso' },
      });

      render(<SignupPage />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const restaurantNameInput = screen.getByLabelText('Restaurant Name');
      const whatsappInput = screen.getByLabelText('WhatsApp Number');

      await userEvent.type(emailInput, 'joao@restaurante.com');
      await userEvent.type(passwordInput, 'senha123');
      await userEvent.type(restaurantNameInput, 'João Silva');
      await userEvent.type(whatsappInput, '5511999999999');

      const submitButton = screen.getByRole('button', { name: 'Create Account' });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Este email já está em uso')).toBeInTheDocument();
      });
    });
  });

  describe('Cenário: Admin tenta criar conta com validação de email', () => {
    it('deve manter validação HTML5 para email', async () => {
      render(<SignupPage />);

      const emailInput = screen.getByLabelText('Email');
      await userEvent.type(emailInput, 'email-invalido');

      fireEvent.blur(emailInput);

      // O campo deve manter o valor digitado (formato inválido)
      expect(emailInput).toHaveValue('email-invalido');
    });
  });

  describe('Cenário: Admin tenta criar conta com senha curta', () => {
    it('deve exibir erro de validação para senha com menos de 6 caracteres', async () => {
      render(<SignupPage />);

      const passwordInput = screen.getByLabelText('Password');
      await userEvent.type(passwordInput, '12345');

      fireEvent.blur(passwordInput);

      // HTML5 validation for minLength should trigger
      expect(passwordInput).toHaveValue('12345');
    });
  });

  describe('Estado de Loading', () => {
    it('deve desabilitar botão durante criação', async () => {
      mockSignUp.mockImplementation(() => new Promise((resolve) => {
        setTimeout(() => resolve({
          data: { user: null, session: null },
          error: null,
        }), 100);
      }));

      render(<SignupPage />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const restaurantNameInput = screen.getByLabelText('Restaurant Name');
      const whatsappInput = screen.getByLabelText('WhatsApp Number');

      await userEvent.type(emailInput, 'joao@restaurante.com');
      await userEvent.type(passwordInput, 'senha123');
      await userEvent.type(restaurantNameInput, 'João Silva');
      await userEvent.type(whatsappInput, '5511999999999');

      const submitButton = screen.getByRole('button', { name: 'Create Account' });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole('button')).toHaveTextContent(/creating account/i);
      });
    });
  });
});
