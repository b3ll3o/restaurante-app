/**
 * Utilitários de autenticação do Supabase
 * @package PediAi
 */

import { createBrowserClient } from "@supabase/ssr";

/**
 * Reenvia email de confirmação de cadastro para o usuário
 *
 * @param email - Email do usuário que não confirmou o cadastro
 * @returns Promise<{ success: boolean; error?: string }>
 *
 * @example
 * const result = await resendConfirmationEmail('usuario@email.com');
 * if (result.success) {
 *   console.log('Email reenviado com sucesso');
 * } else {
 *   console.error(result.error);
 * }
 */
export async function resendConfirmationEmail(email: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    );

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
    });

    if (error) {
      // Tratamento de rate limiting (case-insensitive)
      const errorMsg = error.message.toLowerCase();
      if (errorMsg.includes("rate limit") || errorMsg.includes("too many")) {
        return {
          success: false,
          error: "Aguarde alguns minutos antes de solicitar outro email de confirmação.",
        };
      }

      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (err) {
    console.error("[PediAi] Erro ao reenviar email de confirmação:", err);
    return {
      success: false,
      error: "Falha ao reenviar email de confirmação. Tente novamente.",
    };
  }
}
