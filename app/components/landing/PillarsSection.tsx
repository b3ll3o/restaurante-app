import { Smartphone, MessageCircle, QrCode, Clock, Star, Shield } from "lucide-react";

const pillars = [
  {
    icon: Smartphone,
    title: "Setup em 2 minutos",
    description: "Crie seu cardápio digital sem conhecimento técnico. Interface simples e intuitiva.",
  },
  {
    icon: MessageCircle,
    title: "Pedidos no WhatsApp",
    description: "Seus clientes fazem pedidos direto no WhatsApp, sem apps para instalar.",
  },
  {
    icon: QrCode,
    title: "QR Code na Mesa",
    description: "Gere QR Codes para cada mesa. Clientes escaneiam e pedem na hora.",
  },
  {
    icon: Clock,
    title: "Funciona Offline",
    description: "Cardápio funciona mesmo sem internet. Nunca mais lose pedidos.",
  },
  {
    icon: Star,
    title: "Avaliações",
    description: "收集客户评价，提升餐厅声誉。",
  },
  {
    icon: Shield,
    title: "Seguro e Confiável",
    description: "Seus dados e dos seus clientes estão protegidos.",
  },
];

/**
 * PillarsSection - Seção de pilares/benefícios
 * Mostra os 3 principais pilares: Setup, Comissão Zero, WhatsApp
 */
export function PillarsSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Por que escolher o MenuLink?
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            A solução completa para digitalizar seu restaurante sem pagar comissão
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
