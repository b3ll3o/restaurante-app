# Design: landing-page-redesign - Landing Page de Alta Conversão

## Decisões de Arquitetura

### 1. Componentes vs Página Única

**Decisão**: Criar componentes reutilizáveis para cada seção

**Rationale**: Separa responsabilidades, facilita testes e manutenção.

**Estrutura proposta:**
```
app/page.tsx (compõe LandingPage)
└── components/landing/
    ├── HeroSection.tsx
    ├── PillarsSection.tsx
    ├── SocialProofSection.tsx
    ├── DemoSection.tsx
    ├── PricingSection.tsx
    └── CTASection.tsx
```

### 2. Imagens e Assets

**Decisão**: Usar placeholder para assets externos (imagens, vídeos)

**Rationale**: Permite desenvolvimento antes de ter assets finais.

**Placeholders:**
- Imagens: next/image com placeholder
- Vídeos: iframe YouTube placeholder ou descrição
- Logos: texto ou Placeholder gradient

### 3. Estilização

**Decisão**: Tailwind CSS + CSS custom properties para cores do tema

**Rationale**: Já configurado no projeto, mobile-first nativamente.

---

## Arquitetura

### Estrutura de Componentes

```
app/
├── page.tsx                      # Landing page (Server Component)
└── components/
    └── landing/
        ├── HeroSection.tsx      # Hero + CTA (Client se precisar)
        ├── PillarsSection.tsx   # 3 pilares
        ├── SocialProofSection.tsx  # Prova social
        ├── DemoSection.tsx      # Demonstração visual
        ├── PricingSection.tsx   # Planos
        ├── CTASection.tsx      # CTA final
        └── index.ts            # Barrel export
```

### Layout da Página

```
LandingPage
├── <main>
│   ├── <HeroSection />
│   ├── <PillarsSection />
│   ├── <SocialProofSection />
│   ├── <DemoSection />
│   ├── <PricingSection />
│   └── <CTASection />
└── <footer> (opcional)
```

---

## Design Visual

### Paleta de Cores (Base Tailwind 4)

```css
/* CTA colors - laranja/vermelho para contraste */
--cta-primary: #f97316;     /* orange-500 */
--cta-hover: #ea580c;        /* orange-600 */

/* Backgrounds */
--bg-primary: #ffffff;
--bg-secondary: #fafafa;
--bg-dark: #09090b;         /* zinc-950 */

/* Text */
--text-primary: #18181b;    /* zinc-900 */
--text-muted: #71717a;      /* zinc-500 */
```

### Tipografia

- **Headline**: text-4xl/tight font-semibold
- **Subheadline**: text-lg text-muted
- **Body**: text-base
- **CTA**: font-semibold uppercase tracking-wide

### Espaçamento

- **Section padding**: py-16 md:py-24
- **Container max-width**: max-w-6xl mx-auto px-4
- **Gap between sections**: gap-12 md:gap-16

---

## Componentes Detalhados

### HeroSection

```tsx
export function HeroSection() {
  return (
    <section className="py-24 text-center">
      <h1 className="text-4xl font-semibold">
        Aumente suas vendas diretas sem pagar comissão
      </h1>
      <p className="text-lg text-muted mt-4">
        O cardápio digital que conecta você direto ao cliente.
        Sem intermediários, sem taxas.
      </p>
      <CTAButton className="mt-8">
        Começar teste gratuito
      </CTAButton>
    </section>
  );
}
```

### PillarsSection

```tsx
export function PillarsSection() {
  const pillars = [
    {
      icon: Zap,
      title: 'Setup em minutos',
      description: 'Crie seu cardápio digital em 3 passos',
    },
    {
      icon: Percent,
      title: 'Zero comissão',
      description: 'Sem taxas por pedido. Seu lucro é seu.',
    },
    {
      icon: MessageCircle,
      title: 'Integra com WhatsApp',
      description: 'Pedidos chegam direto no seu WhatsApp',
    },
  ];

  return (
    <section className="py-16 bg-secondary">
      <div className="grid md:grid-cols-3 gap-8">
        {pillars.map((pillar) => (
          <div key={pillar.title} className="text-center">
            <pillar.icon className="w-12 h-12 mx-auto text-cta" />
            <h3 className="mt-4 font-semibold">{pillar.title}</h3>
            <p className="mt-2 text-muted">{pillar.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

---

## Arquivos a Modificar

### Criar

| Arquivo | Descrição |
|---------|-----------|
| `app/components/landing/HeroSection.tsx` | Hero + headline + CTA |
| `app/components/landing/PillarsSection.tsx` | 3 pilares |
| `app/components/landing/SocialProofSection.tsx` | Prova social |
| `app/components/landing/DemoSection.tsx` | Demonstração visual |
| `app/components/landing/PricingSection.tsx` | Planos |
| `app/components/landing/CTASection.tsx` | CTA final |
| `app/components/landing/index.ts` | Barrel export |

### Modificar

| Arquivo | Mudança |
|---------|---------|
| `app/page.tsx` | Importar e compor LandingPage |
| `app/globals.css` | Adicionar variáveis de cor se necessário |

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| lucide-react | ^1.8.0 | Ícones (já instalado) |
| tailwindcss | ^4 | Estilização (já instalado) |

---

## Riscos e Mitigações

| Risco | Mitigação |
|-------|-----------|
| Assets placeholder ruins | Substituir com assets reais antes de produção |
| Performance com imagens | Usar next/image com lazy loading |
| Conteúdo fraco | copywriting junto com design |

---

## TDD/BDD/ATDD

### TDD (Testes Unitários)

Não aplicável diretamente (UI pura). Testar via:
- Storybook (se configurado)
- Playwright E2E

### BDD (Testes de Comportamento)

```gherkin
Funcionalidade: Landing Page de Conversão

Cenário: Visitante visualiza proposta de valor
  Dado que o visitante acessa "/"
  Quando a página carrega
  Então a hero section exibe headline sobre "zero comissão"
  E o CTA "Começar teste gratuito" está visível

Cenário: Visitante vê três pilares
  Dado que o visitante está na página
  Quando rola para seção de pilares
  Então vê "Setup em minutos", "Zero comissão", "Integra com WhatsApp"

Cenário: Visitante visualiza planos
  Dado que o visitante rola até seção de planos
  Quando os cards aparecem
  Então vê 3 planos (Start, Crescer, Escalar)
```

### ATDD (Testes E2E)

```typescript
test('landing page loads hero section', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('comissão');
});

test('cta button is visible above fold', async ({ page }) => {
  await page.goto('/');
  const cta = page.locator('button:has-text("teste gratuito")');
  await expect(cta).toBeVisible();
});
```

---

## Status

Design
