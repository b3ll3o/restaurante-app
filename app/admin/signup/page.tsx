"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
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

export default function SignupPage() {
  useRouter(); // Mantido para garantir que Next.js não remova o hook
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            restaurant_name: restaurantName,
            whatsapp_number: whatsappNumber,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError("Não foi possível criar a conta. Tente novamente.");
        setLoading(false);
        return;
      }

      // Mostrar tela de confirmação pendente - restaurante será criado depois
      setPendingConfirmation(true);
    } catch (err) {
      console.error("Erro no signup:", err);
      setError("Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    setResending(true);
    setResendMessage("");

    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (resendError) {
      setResendMessage("Erro ao reenviar email. Tente novamente.");
    } else {
      setResendMessage("Email reenviado com sucesso!");
    }

    setResending(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Criar Conta de Administrador</CardTitle>
          <CardDescription>
            Preencha seus dados para criar uma conta de administrador
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            {pendingConfirmation ? (
              <div className="flex flex-col items-center text-center space-y-4 py-4">
                <div className="rounded-full bg-green-100 p-3">
                  <svg
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">Conta criada!</h3>
                  <p className="text-sm text-muted-foreground">
                    Verifique seu email para confirmar seu cadastro.
                  </p>
                </div>
                {resendMessage && (
                  <div
                    className={`text-sm ${
                      resendMessage.includes("sucesso")
                        ? "text-green-600"
                        : "text-destructive"
                    }`}
                  >
                    {resendMessage}
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendConfirmation}
                  disabled={resending}
                  className="min-h-[44px]"
                >
                  {resending ? "Reenviando..." : "Reenviar email de confirmação"}
                </Button>
                <p className="text-sm text-muted-foreground">
                  Já confirmou?{" "}
                  <Link
                    href="/admin/login"
                    className="text-primary hover:underline"
                  >
                    Fazer login
                  </Link>
                </p>
              </div>
            ) : (
              <>
              <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
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
                minLength={6}
                className="min-h-[44px] text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restaurantName">Nome do Restaurante</Label>
              <Input
                id="restaurantName"
                type="text"
                placeholder="Meu Restaurante"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                required
                className="min-h-[44px] text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">Número do WhatsApp</Label>
              <Input
                id="whatsappNumber"
                type="tel"
                placeholder="+5511999999999"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                required
                className="min-h-[44px] text-base"
              />
            </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full min-h-[44px]" disabled={loading}>
              {loading ? "Criando conta..." : "Criar Conta"}
            </Button>
            <p className="text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link href="/admin/login" className="text-primary hover:underline">
                Faça login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}