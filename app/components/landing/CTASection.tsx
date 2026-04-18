"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Zap } from "lucide-react";
import { useState } from "react";

interface LeadFormData {
  nome: string;
  email: string;
  whatsapp: string;
}

/**
 * CTASection - Seção de chamada para ação final
 * REQ-LP-03: Lead capture form (nome, email, WhatsApp)
 * REQ-LP-08: CTA "Teste grátis 14 dias" com urgência
 */
export function CTASection() {
  const [formData, setFormData] = useState<LeadFormData>({
    nome: "",
    email: "",
    whatsapp: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    // In production, this would call /api/leads
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setSubmitted(true);

    // Redirect to signup after short delay
    setTimeout(() => {
      window.location.href = "/admin/signup";
    }, 1500);
  };

  const handleChange = (field: keyof LeadFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // If already submitted, show success message
  if (submitted) {
    return (
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl bg-primary p-8 text-center text-primary-foreground md:p-12">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Obrigado! Entraremos em contato em breve.
            </h2>
            <p className="text-lg opacity-90">
              Redirecionando você para criar sua conta...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl rounded-2xl bg-primary p-8 text-center text-primary-foreground md:p-12">
          {/* Urgência adicional - REQ-LP-08 */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-foreground/20 px-4 py-2 text-sm font-medium">
            <Zap className="h-4 w-4" />
            <span>Ative hoje e ganhe 1 mês grátis!</span>
          </div>

          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Comece a receber pedidos hoje mesmo
          </h2>
          <p className="mb-8 text-lg opacity-90">
            Configure sua conta em menos de 2 minutos. Sem cartão de crédito.
          </p>

          {/* Formulário de Lead Capture - REQ-LP-03 */}
          <form onSubmit={handleSubmit} className="mx-auto mb-8 max-w-md space-y-4">
            <div>
              <label htmlFor="nome" className="mb-1 block text-sm font-medium">Nome completo</label>
              <input
                id="nome"
                type="text"
                placeholder="Seu nome completo"
                value={formData.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
                required
                className="w-full rounded-lg px-4 py-3 text-foreground"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                className="w-full rounded-lg px-4 py-3 text-foreground"
              />
            </div>
            <div>
              <label htmlFor="whatsapp" className="mb-1 block text-sm font-medium">WhatsApp</label>
              <input
                id="whatsapp"
                type="tel"
                placeholder="(11) 99999-9999"
                value={formData.whatsapp}
                onChange={(e) => handleChange("whatsapp", e.target.value)}
                required
                className="w-full rounded-lg px-4 py-3 text-foreground"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              variant="secondary"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Teste grátis 14 dias"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm opacity-80">
            <Clock className="h-4 w-4" />
            <span>Teste gratuito por 14 dias</span>
            <span>•</span>
            <span>Sem compromisso</span>
            <span>•</span>
            <span>Cancele quando quiser</span>
          </div>
        </div>
      </div>
    </section>
  );
}
