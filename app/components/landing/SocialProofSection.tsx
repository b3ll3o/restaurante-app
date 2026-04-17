/**
 * SocialProofSection - Seção de prova social
 * Mostra números e estatísticas
 */
export function SocialProofSection() {
  return (
    <section className="bg-muted/50 py-16">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold text-primary">+500</div>
            <div className="text-sm text-muted-foreground">Restaurantes</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold text-primary">+50K</div>
            <div className="text-sm text-muted-foreground">Pedidos processados</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold text-primary">4.8</div>
            <div className="text-sm text-muted-foreground">Avaliação média</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold text-primary">R$ 0</div>
            <div className="text-sm text-muted-foreground">Comissão</div>
          </div>
        </div>
      </div>
    </section>
  );
}
