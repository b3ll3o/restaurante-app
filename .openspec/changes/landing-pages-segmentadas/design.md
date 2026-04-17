# Design: Landing Pages Segmentadas

## Fonte da Verdade

Este documento é parte das especificações do MenuLink, derivado de `.openspec/changes/landing-pages-segmentadas/specs/landing/spec.md`.

---

## Technical Approach

Implementar 4 landing pages segmentadas estáticas em `/landing/{segment}` que reutilizam componentes existentes em `app/components/landing/` com props segmentadas. Cada página é um Server Component que композиа componentes com dados específicos do segmento.

**Segmentos**: `pizzaria`, `hamburgueria`, `bar`, `restaurante`

---

## Architecture Decisions

### Decision: Componentes Segmentados com Props

**Choice**: Modificar componentes existentes para aceitar prop `segment?: SegmentType` ao invés de criar 4 versões de cada componente.

**Alternatives considered**:
- Criar componentes separados por segmento (Ex: `HeroSectionPizzaria`, `HeroSectionHamburgueria`) — Rejeitado: duplicação de código, manutenção difícil
- Usar arquivo de configuração com conteúdo por segmento (Ex: `content/pizzaria.ts`) — Rejeitado: fragmentação de conteúdo, menor coesão
- Componente único com switch interno — Rejeitado: viola Open/Closed principle, difícil de estender

**Rationale**: Com props segmentadas, cada componente mantém sua estrutura mas recebe conteúdo customizado. Extensível para novos segmentos sem modificar lógica existente. Manutenção centralizada.

---

### Decision: Analytics via Módulo Criado

**Choice**: Criar `lib/analytics.ts` com função `page_view({ segment })` para tracking.

**Alternatives considered**:
- Usar Google Tag Manager diretamente — Rejeitado: acoplamento forte com GTM, difícil de testar
- Console.log apenas — Rejeitado: não há implementação real de analytics na spec

**Rationale**: Abstração permite trocar provedor de analytics sem alterar componentes. Pattern consistente com resto do codebase.

---

### Decision: URL Structure

**Choice**: Rotas estáticas em `/landing/pizzaria`, `/landing/hamburgueria`, `/landing/bar`, `/landing/restaurante`.

**Alternatives considered**:
- Rotas dinâmicas `/landing/[segment]` — Rejeitado: Over-engineering para 4 segmentos fixos, overhead de renderização dinâmica
- Query params `/landing?type=pizzaria` — Rejeitado: URLs menos amigáveis para SEO

**Rationale**: Rotas fixas permitem SEO otimizado e são mais performáticas (Static Site Generation).

---

## Estratégia de Qualidade e Design de Código

### TDD (Test-Driven Development)

- **Cobertura mínima**: 80% de cobertura de linhas para `lib/analytics.ts`
- **Branches críticos**: 100% cobertura para função `page_view` com diferentes segmentos
- **Ferramentas**: Vitest
- **Estratégia de Mock/Stub**: Mock de `window` para analytics em ambiente Node.js

### BDD (Behavior-Driven Development)

- **Cenários Gherkin**: Definidos em `app/components/landing/landing.feature` (existente)
- **Ferramenta**: Playwright
- **Cobertura E2E**: 100% dos fluxos críticos (4 páginas + CTAs + analytics)
- **Localização**: `app/components/landing/landing.feature` (REGRA DE PROXIMIDADE)

### ATDD (Acceptance Test-Driven Development)

- **Critérios de aceitação**: CA-LP-01 a CA-LP-06 do spec.md
- **Checklist QA**:
  - Verificar renderização de cada landing page
  - Verificar UTM params nos CTAs
  - Verificar analytics page_view com segment

### DDD (Domain-Driven Design)

- **Bounded Context**: Landing Pages (bounded context isolado)
- **Agregados**: LandingPage (agregado raiz)
- **Entidades**: HeroSection, PillarsSection, SocialProofSection, CTASection
- **Value Objects**: `SegmentType` (tipo discriminativo)
- **Linguagem Ubíquita**: Segmento, Landing Page, UTM, Hero, CTA

---

## Data Flow

```
Usuário acessa /landing/{segment}
       │
       ▼
Server Component (app/landing/{segment}/page.tsx)
       │
       ├─► analytics.page_view({ segment })
       │
       ▼
Compositor (LandingPage com segment prop)
       │
       ├─► HeroSection(segment)
       ├─► SocialProofSection(segment)
       ├─► PillarsSection(segment)
       ├─► CTASection(segment)
       │
       ▼
Renderização HTML estático
```

---

## File Changes

### Arquivos a Criar

| Arquivo | Descrição |
|---------|-----------|
| `app/landing/pizzaria/page.tsx` | Landing page para pizzaria |
| `app/landing/hamburgueria/page.tsx` | Landing page para hamburgueria |
| `app/landing/bar/page.tsx` | Landing page para bar |
| `app/landing/restaurante/page.tsx` | Landing page para restaurante |
| `lib/analytics.ts` | Módulo de analytics com page_view |
| `app/landing/AGENTS.md` | Documentação do módulo de landing pages |
| `app/landing/landing.feature` | Cenários BDD para landing pages segmentadas |

### Arquivos a Modificar

| Arquivo | Modificação |
|---------|-------------|
| `app/components/landing/HeroSection.tsx` | Adicionar prop `segment?: SegmentType` com conteúdo por segmento |
| `app/components/landing/PillarsSection.tsx` | Adicionar prop `segment?: SegmentType` com pilares por segmento |
| `app/components/landing/SocialProofSection.tsx` | Adicionar prop `segment?: SegmentType` com casos por segmento |
| `app/components/landing/CTASection.tsx` | Adicionar prop `segment?: SegmentType` com UTM por segmento |
| `app/components/landing/index.ts` | Exportar novos tipos e componentes atualizados |
| `app/components/landing/landing.feature` | Atualizar com cenários segmentados |

### Arquivos a Deletar

Nenhum.

---

## Segment Data Structure

```typescript
// lib/analytics.ts
type SegmentType = 'pizzaria' | 'hamburgueria' | 'bar' | 'restaurante';

interface SegmentConfig {
  headline: string;
  subheadline: string;
  pillars: Array<{ icon: LucideIcon; title: string; description: string }>;
  socialProof: Array<{ value: string; label: string }>;
  ctaText: string;
  utmContent: string;
}
```

### Content by Segment

| Segmento | Headline | Pillars | Social Proof |
|----------|----------|---------|--------------|
| pizzaria | "entrega via iFood, WhatsApp e cardápio digital sem comissão" | [comissão zero, integração iFood, cardápio digital, QR code, avaliações] | [pizzarias artesanais] |
| hamburgueria | "cardápio visual com QR code para pedidos direto na mesa" | [cardápio visual, QR code, comanda digital, avaliações, delivery] | [hamburguerias boutique] |
| bar | "controle de comanda individual e divisão de conta por pessoa" | [comanda individual, divisão de conta, cardápio digital, reservas, eventos] | [bares badalados] |
| restaurante | "reservas online e carta de vinhos digital" | [reservas online, carta de vinhos, pedidos antecipados, avaliações, eventos] | [restaurantes fine dining] |

---

## Interfaces / Contratos

### Analytics Module

```typescript
// lib/analytics.ts
interface PageViewEvent {
  segment: 'pizzaria' | 'hamburgueria' | 'bar' | 'restaurante';
  url: string;
  timestamp?: number;
}

function page_view(event: PageViewEvent): void;
```

### HeroSection Component

```typescript
// app/components/landing/HeroSection.tsx
interface HeroSectionProps {
  segment?: 'pizzaria' | 'hamburgueria' | 'bar' | 'restaurante';
}
```

### PillarsSection Component

```typescript
// app/components/landing/PillarsSection.tsx
interface PillarsSectionProps {
  segment?: 'pizzaria' | 'hamburgueria' | 'bar' | 'restaurante';
}
```

### SocialProofSection Component

```typescript
// app/components/landing/SocialProofSection.tsx
interface SocialProofSectionProps {
  segment?: 'pizzaria' | 'hamburgueria' | 'bar' | 'restaurante';
}
```

### CTASection Component

```typescript
// app/components/landing/CTASection.tsx
interface CTASectionProps {
  segment?: 'pizzaria' | 'hamburgueria' | 'bar' | 'restaurante';
}
```

---

## Testing Strategy

### Testes Unitários

- `lib/analytics.test.ts`:
  - `page_view()` deve aceitar objeto com `segment` válido
  - `page_view()` deve incluir `timestamp` automaticamente
  - `page_view()` deve fazer console.log do evento (mockado em testes)

### Testes de Integração

- `tests/integration/landing-pages.test.ts` (existente com tag `@integration-test`)
- Cenários:
  - GET `/landing/pizzaria` retorna 200 com headline específico
  - GET `/landing/hamburgueria` retorna 200 com headline específico
  - GET `/landing/bar` retorna 200 com headline específico
  - GET `/landing/restaurante` retorna 200 com headline específico
  - CTAs contêm UTM params corretos

### Testes E2E (Playwright)

- `tests/e2e/landing-pages.test.ts`:
  - Navegar para cada landing page
  - Verificar headline específico do segmento
  - Clicar CTA e verificar redirect com UTM
  - Verificar analytics page_view chamado

---

## Migration / Rollout

### Fase 1: Infraestrutura de Analytics
1. Criar `lib/analytics.ts` com função `page_view`
2. Criar testes unitários para analytics

### Fase 2: Componentes Segmentados
1. Modificar `HeroSection` para aceitar prop `segment`
2. Modificar `PillarsSection` para aceitar prop `segment`
3. Modificar `SocialProofSection` para aceitar prop `segment`
4. Modificar `CTASection` para aceitar prop `segment`
5. Atualizar `index.ts` com novos tipos

### Fase 3: Landing Pages
1. Criar `app/landing/pizzaria/page.tsx`
2. Criar `app/landing/hamburgueria/page.tsx`
3. Criar `app/landing/bar/page.tsx`
4. Criar `app/landing/restaurante/page.tsx`

### Fase 4: Documentação e BDD
1. Criar `app/landing/AGENTS.md`
2. Atualizar `app/components/landing/landing.feature` com cenários segmentados

### Rollback

Remover diretórios `app/landing/{pizzaria,hamburgueria,bar,restaurante}/` e reverter modificações em componentes.

---

## Open Questions

1. **Google Analytics vs Console Log**: Analytics dispara `console.log` ou integra com GA4? — Status: Aberta (spec não especifica, usando console.log por enquanto)

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| react | 19.2.4 | UI Library |
| lucide-react | ^1.8.0 | Ícones em pilares |
| @/components/ui/button | local | Botões shadcn/ui |

Nenhuma nova dependência requerida.

---

## Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Componentes perderem estilo existing | Baixa | Alto | Verificar visual após modificação, manter estrutura CSS |
| Conflito de props em componentes | Baixa | Médio | TypeScript strict mode, interfaces bem definidas |
| SEO duplicado entre landing pages | Baixa | Médio | Usar metadata diferente em cada page.tsx |

---

**Versão**: 1.0
**Data**: 2026-04-17
**Autor**: AI Agent
**Change**: landing-pages-segmentadas
