import { QrCode, MessageCircle } from "lucide-react";

/**
 * DemoSection - Seção de demonstração do fluxo
 */
export function DemoSection() {
  return (
    <section id="demo" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Como funciona
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Três passos simples para começar a receber pedidos
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Passo 1 */}
            <div className="relative">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Crie seu cardápio</h3>
              <p className="text-sm text-muted-foreground">
                Cadastre seus produtos, categorias e preços em minutos
              </p>
            </div>

            {/* Passo 2 */}
            <div className="relative">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Gere o QR Code</h3>
              <p className="text-sm text-muted-foreground">
                Imprima e coloque nas mesas do seu restaurante
              </p>
            </div>

            {/* Passo 3 */}
            <div className="relative">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Receba pedidos</h3>
              <p className="text-sm text-muted-foreground">
                Seus clientes escaneiam e pedem direto no WhatsApp
              </p>
            </div>
          </div>

          {/* Preview visual */}
          <div className="mt-12 rounded-lg border bg-card p-8 shadow-lg">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
                  <QrCode className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Cliente escaneia QR Code</h4>
                  <p className="text-sm text-muted-foreground">
                    Acessa o cardápio no celular
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
                  <MessageCircle className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Pedido chega no WhatsApp</h4>
                  <p className="text-sm text-muted-foreground">
                    Com todos os itens e valor total
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
