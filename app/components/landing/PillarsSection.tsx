import { Smartphone, MessageCircle, QrCode } from "lucide-react";

interface Pillar {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

/**
 * PillarsSection - Seção de pilares/benefícios
 * REQ-LP-02: Exatamente 3 pilares: Setup 2min, Zero comissão, WhatsApp
 */
export function PillarsSection() {
  // Exactly 3 pillars per REQ-LP-02
  const pillars: Pillar[] = [
    {
      icon: Smartphone,
      title: "Setup em 2 minutos",
      description: "Sem integração complexa. Crie seu cardápio digital sem conhecimento técnico.",
    },
    {
      icon: MessageCircle,
      title: "Zero comissão",
      description: "Não cobramos por pedido. Você recebe 100% do valor diretamente.",
    },
    {
      icon: QrCode,
      title: "WhatsApp nativo",
      description: "Pedidos chegam direto no seu WhatsApp. Sem apps para instalar.",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Por que escolher o PediAi?
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            A solução completa para digitalizar seu restaurante sem pagar comissão
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <pillar.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{pillar.title}</h3>
              <p className="text-sm text-muted-foreground">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
