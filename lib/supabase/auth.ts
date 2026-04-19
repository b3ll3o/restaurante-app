import { createBrowserClient } from "@supabase/ssr";

/**
 * Reenvia email de confirmação para o usuário
 */
export async function resendConfirmationEmail(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Erro ao reenviar email:", err);
    return { success: false, error: "Erro ao reenviar email" };
  }
}
