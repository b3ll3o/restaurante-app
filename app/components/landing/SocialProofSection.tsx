import type { SegmentType } from "@/lib/analytics";

interface SocialProofSectionProps {
  segment?: SegmentType;
}

interface Stat {
  value: string;
  label: string;
}

const segmentStats: Record<NonNullable<SegmentType>, Stat[]> = {
  pizzaria: [
    { value: "+500", label: "Pizzarias artesanais" },
    { value: "+50K", label: "Pizzas entregues" },
    { value: "4.8", label: "Avaliação média" },
    { value: "R$ 0", label: "Comissão" },
  ],
  hamburgueria: [
    { value: "+300", label: "Hamburguerias boutique" },
    { value: "+30K", label: "Hambúrgueres vendidos" },
    { value: "4.9", label: "Avaliação média" },
    { value: "R$ 0", label: "Comissão" },
  ],
  bar: [
    { value: "+200", label: "Bares badalados" },
    { value: "+20K", label: "Comandas divididas" },
    { value: "4.7", label: "Avaliação média" },
    { value: "R$ 0", label: "Comissão" },
  ],
  restaurante: [
    { value: "+150", label: "Restaurantes fine dining" },
    { value: "+10K", label: "Reservas" },
    { value: "4.9", label: "Avaliação média" },
    { value: "R$ 0", label: "Comissão" },
  ],
};

const defaultStats: Stat[] = [
  { value: "+500", label: "Restaurantes" },
  { value: "+50K", label: "Pedidos processados" },
  { value: "4.8", label: "Avaliação média" },
  { value: "R$ 0", label: "Comissão" },
];

/**
 * SocialProofSection - Seção de prova social
 * Mostra números e estatísticas
 */
export function SocialProofSection({ segment }: SocialProofSectionProps) {
  const stats = segment ? segmentStats[segment] : defaultStats;

  return (
    <section className="bg-muted/50 py-16">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
