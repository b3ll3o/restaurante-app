# Proposal: landing-page-redesign

## Intent

Criar uma landing page de alta conversão para o MenuLink, focada em donos de restaurantes (Carlos, 35-50 anos, médio porte; Mariana, 28-40 anos, food truck). A proposta de valor principal é **"aumente vendas diretas sem comissão"** — zero comissão, setup rápido. A urgência é Alta, com campanhas pagas planejadas em 4 semanas.

## Scope

### In Scope

- **Hero Section** (CRIT-01): Headline de alto impacto, subheadline, CTA acima da dobra
- **3 Pilares** (CRIT-02): Zero comissão, Setup rápido, Sem依依依赖 de integrções complexas
- **Formulário CTA** (CRIT-03): Captura de leads com nome, email, WhatsApp
- **Prova Social** (CRIT-04): Contador de restaurantes/empresa, vídeos de depoimento
- **Mockup/GIF Demo** (CRIT-05): Demonstração visual do produto
- **Planos de Preço** (CRIT-06 a CRIT-08): Start/Crescer/Escalar com valores claros
- **CTA Final com Urgência** (CRIT-09 e CRIT-10): Botão de CTA e contador de escassez
- **Responsividade**: Mobile-first, media queries como padrão
- **Testes E2E responsivos**: Playwright para validação em múltiplos viewports

### Out of Scope

- Blog ou artigos
- FAQ ou área de suporte
- PWA (Progressive Web App)
- Integração com gateway de pagamento na landing page
- Área do cliente (admin)
- Personalização avançada por restaurante

## Approach

**Stack tecnológico:**
- Next.js 16.2.3 (App Router) — mesma stack do projeto
- Tailwind CSS 4 — CSS-based config (sem tailwind.config.js)
- TypeScript strict mode

**Arquitetura:**
- Página estática (SSG/SSR híbrida)
- Componentes React modulares em `app/components/landing/`
- Roteamento: nova rota `/` (atual landing page existente)
- Analytics tracking (impressions, CTA clicks, form submissions)

**Estratégia de testes:**
- E2E com Playwright: responsividade, fluxos de CTA, formulários
- Cobertura unitária ≥80% para componentes de landing
- BDD scenarios em `app/landing/landing.feature` (REGRA DE PROXIMIDADE)

** SEO básico:**
- Meta tags, Open Graph, estrutura semântica HTML
- Sitemap básico (futuro)

## Affected Areas

| Área | Descrição | Tipo |
|------|-----------|------|
| `app/page.tsx` | Nova landing page (substitui existente) | Nova/Criação |
| `app/components/landing/` | Componentes modulares (Hero, Pricing, Testimonials, etc.) | Nova/Criação |
| `app/landing/AGENTS.md` | Documentação do módulo landing | Nova/Criação |
| `app/landing/landing.feature` | Cenários BDD | Nova/Criação |
| `tests/e2e/landing.spec.ts` | Testes E2E Playwright | Nova/Criação |
| `tests/unit/landing.test.ts` | Testes unitários | Nova/Criação |

## Risks

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Conteúdo (copywriting) não disponível no prazo | Alta | Alto | Preparar template com placeholder; validar copy early |
| Vídeos de depoimento não disponíveis | Alta | Alto | Usar mockups/placeholders; buscar gravações reais em paralelo |
| SEO não otimizado para conversão | Média | Médio | A/B testing; iterar com dados reais |
| Performance (LCP <2.5s) não atingida | Média | Alto | Lazy loading de imagens/video; otimizar assets |
| Dependência de equipe de marketing para copy | Alta | Médio | Levantar blockers early; envolver stakeholders no sprint 1 |

## Rollback Plan

1. **Remover rota `/`** — reverter para página placeholder ou redirect
2. **Deletar diretório `app/components/landing/`** — remover todos os componentes
3. **Deletar `app/landing/`** — remover documentação e BDD
4. **Remover referências em testes** — deletar `tests/e2e/landing.spec.ts`, `tests/unit/landing.test.ts`
5. **Reverter analytics tracking** — remover snippets de tracking

**Comando de rollback:**
```bash
rm -rf app/components/landing/ app/landing/ tests/e2e/landing.spec.ts tests/unit/landing.test.ts
```

## Success Criteria

| ID | Critério | Evidência |
|----|----------|-----------|
| SC-01 | CRIT-01: Hero section com headline e CTA visível | Teste E2E passando |
| SC-02 | CRIT-02: 3 pilares exibidos corretamente | Teste E2E passando |
| SC-03 | CRIT-03: Formulário CTA captura dados | Teste E2E + teste unitário |
| SC-04 | CRIT-04: Prova social (contador) visível | Teste E2E passando |
| SC-05 | CRIT-05: Mockup/GIF demo carrega | Teste E2E passando |
| SC-06 | CRIT-06 a CRIT-08: Planos Start/Crescer/Escalar exibidos | Teste E2E passando |
| SC-07 | CRIT-09 e CRIT-10: CTA final e urgência | Teste E2E passando |
| SC-08 | KPI: LCP < 2.5s | Lighthouse CI |
| SC-09 | KPI: Bounce rate < 40% | Analytics (pós-deploy) |
| SC-10 | KPI: Leads que agendam ≥ 30% | Analytics (pós-deploy) |
| SC-11 | Responsivo: mobile, tablet, desktop | Playwright multi-viewport |
| SC-12 | Cobertura unitária ≥ 80% | Coverage report |

## Status

Proposta