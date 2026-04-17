import { Smartphone, MessageCircle, QrCode, Clock, Star, Shield, Utensils, Wine, Calendar, Users, MapPin, TrendingUp } from "lucide-react";
import type { SegmentType } from "@/lib/analytics";

interface PillarsSectionProps {
  segment?: SegmentType;
}

interface Pillar {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const segmentPillars: Record<NonNullable<SegmentType>, Pillar[]> = {
  pizzaria: [
    { icon: Utensils, title: "Comissão zero", description: "Receba 100% do valor dos pedidos via WhatsApp." },
    { icon: TrendingUp, title: "Integração iFood", description: "Sincronize pedidos do iFood direto no seu sistema." },
    { icon: Smartphone, title: "Cardápio digital", description: "Mantenha seu cardápio atualizado em tempo real." },
    { icon: QrCode, title: "QR Code nas mesas", description: "Clientes escaneiam e pedem sem esperar garçom." },
    { icon: Star, title: "Avaliações", description: "Colete feedbacks e melhore seu atendimento." },
  ],
  hamburgueria: [
    { icon: Smartphone, title: "Cardápio visual", description: "Fotos profissionais que valorizam seus hambúrgueres artesanais." },
    { icon: QrCode, title: "QR Code na Mesa", description: "Clientes escaneiam e pedem direto no WhatsApp." },
    { icon: Clock, title: "Comanda digital", description: "Elimine papéis e erros de interpretação." },
    { icon: Star, title: "Avaliações", description: "Colete feedbacks dos clientes em tempo real." },
    { icon: TrendingUp, title: "Delivery", description: "Gerencie pedidos de delivery em um só lugar." },
  ],
  bar: [
    { icon: Users, title: "Comanda individual", description: "Cada pessoa paga pelo que consumiu, sem dividida." },
    { icon: Wine, title: "Divisão de conta", description: "Automático por pessoa ou por consumo." },
    { icon: Smartphone, title: "Cardápio digital", description: "Monte seu cardápio de bebidas online." },
    { icon: Calendar, title: "Reservas", description: "Aceita reservas online para eventos." },
    { icon: Star, title: "Avaliações", description: "Gerencie sua reputação online." },
  ],
  restaurante: [
    { icon: Calendar, title: "Reservas online", description: "Clientes reservam direto pelo site." },
    { icon: Wine, title: "Carta de vinhos", description: "Digital e atualizada em tempo real." },
    { icon: Clock, title: "Pedidos antecipados", description: "Clientes pedem antes de chegar." },
    { icon: Star, title: "Avaliações", description: "Colete e responda avaliações." },
    { icon: MapPin, title: "Eventos", description: "Divulgue eventos especiais do restaurante." },
  ],
};

const defaultPillars: Pillar[] = [
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
    description: "Colete feedbacks e melhore seu atendimento.",
  },
  {
    icon: Shield,
    title: "Seguro e Confiável",
    description: "Seus dados e dos seus clientes estão protegidos.",
  },
];

/**
 * PillarsSection - Seção de pilares/benefícios
 * Mostra os 5 principais pilares do MenuLink
 */
export function PillarsSection({ segment }: PillarsSectionProps) {
  const pillars = segment ? segmentPillars[segment] : defaultPillars;
  const title = "Por que escolher o MenuLink?";
  const subtitle = segment
    ? `Solução completa para digitalizar seu ${segment} sem pagar comissão`
    : "A solução completa para digitalizar seu restaurante sem pagar comissão";

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            {title}
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            {subtitle}
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