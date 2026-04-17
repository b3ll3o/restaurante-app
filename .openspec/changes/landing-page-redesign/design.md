# Design: landing-page-redesign

## Fonte da Verdade

Este documento é parte do artefato `.openspec/changes/landing-page-redesign/`.
Baseado em: `proposal.md` e `spec.md` (REQ-LP-01 a REQ-LP-08, CA-LP-01 a CA-LP-10).

---

## 1. Arquitetura Geral

### 1.1 Server vs Client Components

| Seção | Tipo | Justificativa |
|-------|------|---------------|
| `LandingPage` | Server Component | Container estático, composição de sections |
| `HeroSection` | Client Component | Interatividade (CTA clicks, analytics tracking) |
| `PillarsSection` | Client Component | Animação de entrada dos pilares |
| `SocialProofSection` | Client Component | Contador animado (useEffect) |
| `VideoSection` (nova) | Client Component | Modal de vídeo com estado aberto/fechado |
| `DemoSection` | Client Component | GIF/mockup com playback controls |
| `PricingSection` | Client Component | Hover states, seleção de plano |
| `CTASection` | Client Component | Formulário de leads com validação |

### 1.2 Arquitetura de Diretórios

```
app/
├── page.tsx                    # Server Component (raiz, mantém SSG)
├── components/landing/
│   ├── index.ts                 # Exportações públicas
│   ├── LandingPage.tsx          # Componente compositor
│   ├── HeroSection.tsx          # Hero com headline "zero comissão"
│   ├── PillarsSection.tsx       # 3 pilares (não 6)
│   ├── SocialProofSection.tsx  # Contador >2000 + logos
│   ├── VideoSection.tsx         # NOVO: Modal de depoimento
│   ├── DemoSection.tsx          # Mockup/GIF do fluxo
│   ├── PricingSection.tsx      # Planos Start/Crescer/Escalar
│   └── CTASection.tsx           # CTA final + formulário
├── landing/
│   └── AGENTS.md
└── landing.feature             # BDD (REGRA PROXIMIDADE)
tests/
├── unit/
│   └── landing.test.ts         # Unitários ≥80% cobertura
├── integration/
│   └── landing.test.ts         # Integração BDD
└── e2e/
    └── landing.spec.ts         # E2E Playwright
```

---

## 2. Decisões de Arquitetura

### 2.1 Decisão: Headline Unificado (HeroSection)

**Choice**: Usar headline fixo "Aumente suas vendas diretas sem pagar comissão" para a landing page principal (`/`), removendo segmentação dinâmica por prop.

**Alternatives considered**:
- Manter prop `segment` para personalização por tipo de restaurante
- Criar rotas `/landing/[segment]` separadas

**Rationale**: A landing page principal (`/`) é uma landing de alta conversão para todos os segmentos. A segmentação será trabalhada via UTM params nos CTAs, não via conteúdo personalizado. Rotas segmentadas já existem em `/landing/pizzaria`, `/landing/hamburgueria`, etc.

---

### 2.2 Decisão: 3 Pilares (REQ-LP-02)

**Choice**: PillsarsSection exibe exatamente 3 pilares conforme spec.

**Alternatives considered**:
- Manter 6 pilares existentes
- Criar carrossel/tabs para 3 pilares

**Rationale**: A spec (REQ-LP-02) exige exatamente 3 pilares respondendo objeções específicas: (1) setup rápido, (2) sem comissão, (3) integração POS/WhatsApp. Os 3 pilares atuais da seção serão substituídos.

**Pilares novos**:
1. **Setup em 2 minutos** — Sem integração complexa
2. **Zero comissão** — Não cobramos por pedido
3. **WhatsApp nativo** — Pedidos chegam direto no seu WhatsApp

---

### 2.3 Decisão: VideoSection com Modal

**Choice**: Criar `VideoSection` como Client Component com Dialog do shadcn/ui.

**Alternatives considered**:
- Embed YouTube direto na página
- Lightbox customizado

**Rationale**: Usar `Dialog` do shadcn/ui (`components/ui/dialog.tsx`) para consistência com o design system. O modal permite pausar/retomar e fecha com botão X ou click fora.

**Estrutura**:
```tsx
<VideoSection /> → Card com thumbnail → onClick abre <Dialog>
```

---

### 2.4 Decisão: Formulário CTA (REQ-LP-03)

**Choice**: HeroSection permanece sem formulário. CTASection adiciona formulário de lead capture.

**Alternativas considered**:
- Adicionar formulário na HeroSection above the fold
- Criar seção dedicada "Comece agora" com formulário

**Rationale**: A hero section deve ser limpa e focada em conversão visual (headline + CTA). O formulário de lead capture será placed no CTASection final, onde o usuário já está engajado. Fields: nome, email, WhatsApp.

---

### 2.5 Decisão: Contador >2000 (CA-LP-05)

**Choice**: SocialProofSection exibe contador "+2.500 restaurantes" (valor hardcoded, maior que 2000).

**Alternatives considered**:
- Contador animado com valor real da API
- Contador counting up animation

**Rationale**: O contador dinâmico com animation de contagem será implementado via `useEffect` com `requestAnimationFrame`. Valor inicial hardcoded ">2000" para garantir que CA-LP-05 seja satisfeito. Pode ser conectado a API posteriormente.

---

### 2.6 Decisão: PricingSection — Texto CA-LP-09

**Choice**: CTASection CTA botão contém "Teste grátis 14 dias".

**Alternatives considered**:
- "Começar gratuitamente" (texto atual)
- "Experimentar grátis"

**Rationale**: CA-LP-09 exige explicitamente "teste grátis" e "14 dias". O PricingSection plano "Crescer" já tem CTA "Testar grátis por 14 dias" — o CTASection final usará o mesmo texto.

---

## 3. Fluxo de Dados

### 3.1 Page Load (SSG)

```
GET / → Static HTML generated at build time
  ↓
<LandingPage> (Server Component)
  ↓
<HeroSection> (Client, hydration)
<SocialProofSection> (Client, counter animation)
<PillarsSection> (Client, entrance animation)
<VideoSection> (Client, modal state)
<DemoSection> (Client, GIF playback)
<PricingSection> (Client, plan selection)
<CTASection> (Client, form submission)
```

### 3.2 Analytics Tracking

```
page_view event → analytics.page_view({ segment: 'landing', url: '/' })
CTA click → analytics.page_view({ segment: 'landing', url: '/', cta_id: 'hero-cta' })
Form submit → analytics.page_view({ segment: 'landing', url: '/', conversion: 'lead_form' })
```

---

## 4. Arquitetura de Testes

### 4.1 TDD (Testes Unitários)

**Ferramenta**: Vitest
**Cobertura mínima**: ≥80%

| Componente | Test Files | Cobertura Target |
|------------|------------|------------------|
| HeroSection | `tests/unit/landing/hero.test.ts` | 80% |
| PillarsSection | `tests/unit/landing/pillars.test.ts` | 80% |
| SocialProofSection | `tests/unit/landing/social-proof.test.ts` | 80% |
| VideoSection | `tests/unit/landing/video.test.ts` | 80% |
| CTASection | `tests/unit/landing/cta.test.ts` | 80% |

### 4.2 BDD (Testes de Integração)

**Ferramenta**: Vitest + Gherkin
**Formato**: `.feature` files no nível do módulo

| Arquivo BDD | Tests Integration |
|-------------|-------------------|
| `app/landing/landing.feature` | `tests/integration/landing.test.ts` |

**Tag**: `@integration-test="tests/integration/landing.test.ts"`

### 4.3 ATDD (Testes E2E)

**Ferramenta**: Playwright
**Viewport**: mobile (375px), tablet (768px), desktop (1280px)

| Test | Descrição |
|------|-----------|
| `tests/e2e/landing.spec.ts` | Fluxo completo: hero → pillars → pricing → CTA |

---

## 5. Arquivo de Mudanças

### 5.1 Novos Arquivos

```
app/components/landing/VideoSection.tsx    # Modal de depoimento
app/components/landing/index.ts           # Exportações atualizadas
app/landing/landing.feature              # BDD scenarios (REGRA PROXIMIDADE)
tests/unit/landing/                      # Suite de unitários
tests/unit/landing/hero.test.ts
tests/unit/landing/pillars.test.ts
tests/unit/landing/social-proof.test.ts
tests/unit/landing/video.test.ts
tests/unit/landing/cta.test.ts
tests/integration/landing.test.ts         # Teste BDD
tests/e2e/landing.spec.ts                # E2E Playwright
```

### 5.2 Arquivos Modificados

```
app/components/landing/HeroSection.tsx       # Headline unificado, remove segment prop
app/components/landing/PillarsSection.tsx    # 3 pilares (não 6)
app/components/landing/SocialProofSection.tsx # Contador >2000, logos
app/components/landing/PricingSection.tsx    # CA-LP-09: texto "14 dias"
app/components/landing/CTASection.tsx         # Urgência + formulário leads
app/components/landing/LandingPage.tsx        # Adiciona VideoSection
app/components/landing/AGENTS.md            # Atualiza docs
app/AGENTS.md                                # Referência landing
```

### 5.3 Arquivos Deletados

Nenhum (arquitetura aditiva).

---

## 6. Interfaces e Contratos

### 6.1 HeroSection Props

```typescript
// Antes (com segmentação):
interface HeroSectionProps {
  segment?: SegmentType;
}

// Depois (unificado):
interface HeroSectionProps {
  // Sem props - conteúdo fixo para landing page principal
}
```

### 6.2 VideoSection Props

```typescript
interface VideoSectionProps {
  videoUrl?: string;        // URL do vídeo (YouTube embed ou arquivo)
  thumbnailUrl?: string;   // Thumbnail do card
  testimonialName?: string; // Nome do entrevistado
  testimonialRole?: string; // Cargo/empresa
}
```

### 6.3 CTASection Props

```typescript
interface CTASectionProps {
  onLeadCapture?: (data: LeadFormData) => void; // Callback opcional
}

interface LeadFormData {
  nome: string;
  email: string;
  whatsapp: string;
}
```

---

## 7. SEO e Metadata

### 7.1 Metadata para `app/page.tsx`

```typescript
export const metadata: Metadata = {
  title: "MenuLink — Cardápio digital sem comissão",
  description: "Aumente suas vendas diretas sem pagar comissão. Crie seu cardápio digital e receba pedidos no WhatsApp em 2 minutos.",
  openGraph: {
    title: "MenuLink — Cardápio digital sem comissão",
    description: "Aumente suas vendas diretas sem pagar comissão.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "MenuLink — Cardápio digital sem comissão",
    description: "Aumente suas vendas diretas sem pagar comissão.",
  },
};
```

---

## 8. Dependências

Nenhuma nova dependência. Stack existente:
- Next.js 16.2.3
- React 19
- Tailwind CSS 4
- shadcn/ui (Dialog, Button)
- lucide-react (ícones)
- Playwright (E2E)
- Vitest (unitário/integração)

---

## 9. Migração/Rollback

### Rollback (comando reversível)

```bash
# Reverter modificações
git checkout HEAD~1 -- app/components/landing/

# Se novos arquivos precisam ser removidos
rm -f app/components/landing/VideoSection.tsx
```

### Plano de Migração

1. **Fase 1**: Criar `VideoSection.tsx` (isolado, sem modificar outros)
2. **Fase 2**: Modificar `HeroSection.tsx` e `PillarsSection.tsx` em paralelo
3. **Fase 3**: Modificar `SocialProofSection.tsx`, `PricingSection.tsx`, `CTASection.tsx`
4. **Fase 4**: Atualizar `LandingPage.tsx` (adicionar VideoSection)
5. **Fase 5**: Criar testes unitários e E2E
6. **Fase 6**: Documentação (AGENTS.md, landing.feature)

---

## 10. Perguntas Abertas

| # | Pergunta | Decisão Sugerida |
|---|----------|-----------------|
| 1 | O GIF do DemoSection será um arquivo local ou externo? | Usar placeholder externo (unsplash/giphy) até assets definitivos |
| 2 | O vídeo do testimonial será YouTube embed ou MP4? | YouTube embed para economia de banda |
| 3 | O formulário de leads vai para qual endpoint? | `/api/leads` (criar futuramente) |
| 4 | Contador usa animação de contagem? | Sim, via `requestAnimationFrame` para efeito visual |

---

**Versão**: 1.0
**Criação**: 2026-04-17
**Autor**: AI Agent (sdd-design skill)
