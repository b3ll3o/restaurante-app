import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { resendConfirmationEmail } from "@/lib/supabase/auth";

// Mock do módulo @supabase/ssr ANTES de qualquer import que use o auth
const mockResend = vi.fn();

vi.mock("@supabase/ssr", () => ({
  createBrowserClient: vi.fn(() => ({
    auth: {
      resend: mockResend,
    },
  })),
}));

// Mock das variáveis de ambiente
const originalEnv = process.env;
beforeEach(() => {
  process.env = {
    ...originalEnv,
    NEXT_PUBLIC_SUPABASE_URL: "https://test.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-key",
  };
  mockResend.mockClear();
});

afterEach(() => {
  process.env = originalEnv;
  vi.restoreAllMocks();
});

describe("resendConfirmationEmail", () => {
  describe("quando a chamada é bem-sucedida", () => {
    it("então deve retornar success: true", async () => {
      mockResend.mockResolvedValueOnce({ error: null });

      const result = await resendConfirmationEmail("usuario@test.com");

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
      expect(mockResend).toHaveBeenCalledWith({
        type: "signup",
        email: "usuario@test.com",
      });
    });
  });

  describe("quando ocorre rate limiting", () => {
    it("então deve retornar mensagem amigável quando mensagem contém 'rate limit'", async () => {
      mockResend.mockResolvedValueOnce({
        error: { message: "Rate limit exceeded. Please wait." },
      });

      const result = await resendConfirmationEmail("usuario@test.com");

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        "Aguarde alguns minutos antes de solicitar outro email de confirmação."
      );
    });

    it("então deve retornar mensagem amigável quando mensagem contém 'too many'", async () => {
      mockResend.mockResolvedValueOnce({
        error: { message: "You have made too many requests" },
      });

      const result = await resendConfirmationEmail("usuario@test.com");

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        "Aguarde alguns minutos antes de solicitar outro email de confirmação."
      );
    });
  });

  describe("quando ocorre outro erro", () => {
    it("então deve retornar a mensagem de erro do Supabase", async () => {
      mockResend.mockResolvedValueOnce({
        error: { message: "Invalid email address" },
      });

      const result = await resendConfirmationEmail("invalid-email");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid email address");
    });
  });

  describe("quando ocorre exceção inesperada", () => {
    it("então deve retornar mensagem genérica de erro", async () => {
      mockResend.mockRejectedValueOnce(new Error("Network error"));

      const result = await resendConfirmationEmail("usuario@test.com");

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        "Falha ao reenviar email de confirmação. Tente novamente."
      );
    });
  });
});
