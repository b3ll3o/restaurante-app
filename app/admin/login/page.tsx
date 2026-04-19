"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { resendConfirmationEmail } from "@/lib/supabase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { UtensilsCrossed } from "lucide-react";

export default function LoginPage() {
  useRouter(); // Mantido para garantir que Next.js não remova o hook
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setEmailNotConfirmed(false);
    setResendSuccess(false);
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (signInError.code === "email_not_confirmed") {
          setEmailNotConfirmed(true);
        } else if (signInError.message.includes("Invalid login")) {
          setError("Email ou senha incorretos");
        } else {
          setError(signInError.message);
        }
        setLoading(false);
        return;
      }

      // Login bem-sucedido - redirecionar
      window.location.href = "/admin/dashboard";
    } catch (err) {
      console.error("Erro no login:", err);
      setError("Erro ao fazer login. Tente novamente.");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const result = await resendConfirmationEmail(email);
      if (result.success) {
        setResendSuccess(true);
        toast.success("Email de confirmação reenviado!");
      } else {
        toast.error(result.error || "Falha ao reenviar email");
      }
    } catch (err) {
      console.error("Erro ao reenviar:", err);
      toast.error("Falha ao reenviar email");
    }
    setResending(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header com logo e link para home */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <UtensilsCrossed className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">PediAi</span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/signup">Cadastre-se</Link>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login do Administrador</CardTitle>
          <CardDescription>
            Insira suas credenciais para acessar o painel administrativo
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {emailNotConfirmed && !resendSuccess && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive space-y-3">
                <p>Você ainda não confirmou seu email. Clique no link enviado para {email} ou solicite um novo email de confirmação.</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResend}
                  disabled={resending}
                  className="w-full"
                >
                  {resending ? "Reenviando..." : "Reenviar email de confirmação"}
                </Button>
              </div>
            )}

            {resendSuccess && (
              <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
                Email de confirmação reenviado! Verifique sua caixa de entrada.
              </div>
            )}

            {error && !emailNotConfirmed && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
<div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="min-h-[44px] text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="min-h-[44px] text-base"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full min-h-[44px]" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
            <p className="text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <Link href="/admin/signup" className="text-primary hover:underline">
                Cadastre-se
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
      </div>
    </div>
  );
}
