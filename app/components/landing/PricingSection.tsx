import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Start",
    description: "Para quem está começando",
    price: "R$ 0",
    period: "para sempre",
    features: [
      "Cardápio com até 20 produtos",
      "1 restaurante",
      "QR Code por mesa",
      "Pedidos via WhatsApp",
      "Funciona offline",
    ],
    cta: "Começar gratuitamente",
    highlighted: false,
  },
  {
    name: "Crescer",
    description: "Para restaurantes em crescimento",
    price: "R$ 49",
    period: "por mês",
    features: [
      "Produtos ilimitados",
      "Até 3 restaurantes",
      "QR Codes personalizados",
      "Histórico de pedidos",
      "Estatísticas básicas",
      "Suporte por email",
    ],
    cta: "Testar grátis por 14 dias",
    highlighted: true,
  },
  {
    name: "Escalar",
    description: "Para redes de restaurantes",
    price: "R$ 149",
    period: "por mês",
    features: [
      "Restaurantes ilimitados",
      "QR Codes personalizados",
      "Histórico avançado",
      "Estatísticas completas",
      "Suporte prioritário",
      "API de integração",
      "White-label",
    ],
    cta: "Falar com vendas",
    highlighted: false,
  },
];

/**
 * PricingSection - Seção de preços
 */
export function PricingSection() {
  return (
    <section className="bg-muted/50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Preços simples e transparentes
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Comece grátis e escale quando precisar. Sem surpresas.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-lg border p-6 ${
                plan.highlighted
                  ? "border-primary bg-card shadow-lg ring-2 ring-primary"
                  : "bg-card"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Mais popular
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-sm text-muted-foreground">/{plan.period}</span>
              </div>

              <ul className="mb-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.highlighted ? "default" : "outline"}
                className="w-full"
                asChild
              >
                <a href={plan.name === "Start" ? "/admin/signup" : "/admin/signup?plan=crescer"}>
                  {plan.cta}
                </a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
