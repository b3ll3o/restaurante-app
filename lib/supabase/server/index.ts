import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Flag para deduplicar warning
let warningShown = false;

function createFallbackClient(): SupabaseClient {
  // Mock client que não faz nada - apenas para build não quebrar
  return {
    from: () => ({
      select: () => ({ data: null, error: new Error("Supabase não configurado") }),
      insert: () => ({ data: null, error: new Error("Supabase não configurado") }),
      update: () => ({ data: null, error: new Error("Supabase não configurado") }),
      delete: () => ({ data: null, error: new Error("Supabase não configurado") }),
    }),
    auth: {
      getSession: () => ({ data: { session: null }, error: null }),
    },
  } as unknown as SupabaseClient;
}

export async function createClient(): Promise<SupabaseClient> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Graceful fallback para build sem env vars
  if (!supabaseUrl || !supabaseAnonKey) {
    if (!warningShown) {
      console.warn(
        "[MenuLink] Variáveis de ambiente do Supabase não configuradas. " +
          "NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY são obrigatórias. " +
          "Em build CI/CD, isso é esperado - usando fallback null client."
      );
      warningShown = true;
    }
    return createFallbackClient();
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Component - ignora
        }
      },
    },
  });
}