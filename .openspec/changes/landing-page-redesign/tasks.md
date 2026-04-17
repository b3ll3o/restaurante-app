# Tasks: landing-page-redesign

## Fonte da Verdade

Este documento é parte do artefato `.openspec/changes/landing-page-redesign/`.
Baseado em: `proposal.md`, `spec.md` (REQ-LP-01 a REQ-LP-08, CA-LP-01 a CA-LP-10) e `design.md`.

---

## Pré-condições

- [x] Proposal aprovada
- [x] Spec aprovada (REQ-LP-01 a REQ-LP-08, CA-LP-01 a CA-LP-10)
- [x] Design aprovado

---

## Progresso

```
░░░░░░░░░░ 0%
```

---

## Tarefas

### Fase 1: Infraestrutura de Testes

- [ ] 1.1: Configurar suíte de unit tests com Vitest em `tests/unit/landing/`
- [ ] 1.2: Criar `tests/unit/landing/hero.test.ts` (≥80% cobertura, Vitest)
- [ ] 1.3: Criar `tests/unit/landing/pillars.test.ts` (≥80% cobertura, Vitest)
- [ ] 1.4: Criar `tests/unit/landing/social-proof.test.ts` (≥80% cobertura, Vitest)
- [ ] 1.5: Criar `tests/unit/landing/video.test.ts` (≥80% cobertura, Vitest)
- [ ] 1.6: Criar `tests/unit/landing/cta.test.ts` (≥80% cobertura, Vitest)
- [ ] 1.7: Criar `tests/integration/landing.test.ts` (BDD Gherkin, tag `@integration-test`)
- [ ] 1.8: Criar `tests/e2e/landing.spec.ts` (Playwright, multi-viewport)

---

### Fase 2: Hero e CTAs

- [ ] 2.1: Modificar `HeroSection.tsx` — Headline unificado "Aumente suas vendas diretas sem pagar comissão" (REQ-LP-01)
- [ ] 2.2: Modificar `HeroSection.tsx` — Badge "Zero comissão" (REQ-LP-01)
- [ ] 2.3: Modificar `HeroSection.tsx` — Remover prop `segment` (design 2.1)
- [ ] 2.4: Modificar `HeroSection.tsx` — Adicionar analytics tracking em CTA clicks
- [ ] 2.5: Modificar `CTASection.tsx` — Texto "Teste grátis 14 dias" no botão (CA-LP-09)
- [ ] 2.6: Modificar `CTASection.tsx` — Elemento de urgência adicional (REQ-LP-08)
- [ ] 2.7: Modificar `CTASection.tsx` — Formulário de lead capture (nome, email, WhatsApp) (REQ-LP-03)

---

### Fase 3: Conteúdo (Pilares, Prova Social, Vídeo, Demo)

- [ ] 3.1: Criar `VideoSection.tsx` — Card com thumbnail de vídeo (REQ-LP-05)
- [ ] 3.2: Criar `VideoSection.tsx` — Dialog modal com player de vídeo (REQ-LP-05)
- [ ] 3.3: Criar `VideoSection.tsx` — Botão de fechar + pausar/retomar (REQ-LP-05)
- [ ] 3.4: Modificar `PillarsSection.tsx` — Exibir exatamente 3 pilares (REQ-LP-02)
- [ ] 3.5: Modificar `PillarsSection.tsx` — Pilares: Setup 2min, Zero comissão, WhatsApp (REQ-LP-02)
- [ ] 3.6: Modificar `SocialProofSection.tsx` — Contador >2.000 restaurantes (CA-LP-05)
- [ ] 3.7: Modificar `SocialProofSection.tsx` — Logos de parceiros (≥3) (REQ-LP-04)
- [ ] 3.8: Modificar `DemoSection.tsx` — Verificar que exibe fluxo QR→cardápio→pedido→cozinha (CA-LP-07)

---

### Fase 4: Preços

- [ ] 4.1: Modificar `PricingSection.tsx` — Plano "Start" com preço R$0 (REQ-LP-07)
- [ ] 4.2: Modificar `PricingSection.tsx` — Plano "Crescer" com preço R$49/mês (REQ-LP-07)
- [ ] 4.3: Modificar `PricingSection.tsx` — Plano "Escalar" com preço R$149/mês (REQ-LP-07)
- [ ] 4.4: Modificar `PricingSection.tsx` — Planos diferenciados: Start(básico), Crescer(intermediário), Escalar(premium) (REQ-LP-07)
- [ ] 4.5: Modificar `PricingSection.tsx` — Recursos principais listados por plano (REQ-LP-07)

---

### Fase 5: SEO e Metadata

- [ ] 5.1: Adicionar `metadata` export em `app/page.tsx` com title "MenuLink — Cardápio digital sem comissão" (design 7.1)
- [ ] 5.2: Adicionar Open Graph metadata (design 7.1)
- [ ] 5.3: Adicionar Twitter Card metadata (design 7.1)
- [ ] 5.4: Verificar que landing page NÃO tem menu de navegação header (CA-LP-10)

---

### Fase 6: LandingPage Composer

- [ ] 6.1: Modificar `LandingPage.tsx` — Importar `VideoSection` (design 1.2)
- [ ] 6.2: Modificar `LandingPage.tsx` — Adicionar `VideoSection` na ordem de renderização (design 1.1)
- [ ] 6.3: Modificar `app/components/landing/index.ts` — Exportar `VideoSection`

---

### Fase 7: Documentação

- [ ] 7.1: Criar `app/landing/landing.feature` — Cenários BDD (Gherkin, proximity rule) (design 4.2)
- [ ] 7.2: Tag `@integration-test="tests/integration/landing.test.ts"` em todos os cenários (design 4.2)
- [ ] 7.3: Atualizar `app/components/landing/AGENTS.md` — Documentar VideoSection (design 1.2)
- [ ] 7.4: Atualizar `app/components/landing/AGENTS.md` — 3 pilares (REQ-LP-02)
- [ ] 7.5: Atualizar `app/AGENTS.md` — Referência a `landing-page-redesign`

---

### Fase 8: Verificação e Compliance

- [ ] 8.1: Executar `npm run lint` — Verificar 0 erros
- [ ] 8.2: Executar `npm run build` — Verificar build passa
- [ ] 8.3: Executar `npm run test:unit` — Verificar ≥80% cobertura
- [ ] 8.4: Executar `npm run test:e2e` — Verificar testes Playwright passam
- [ ] 8.5: Criar `verify-report.md` — Mapear CA-LP-01 a CA-LP-10 à evidência

---

## Critério de Conclusão de Tarefa

Uma tarefa só é `[x]` quando:
1. ✅ Código de produção escrito
2. ✅ Testes unitários/integração obrigatórios passam
3. ✅ Testes E2E referentes passam localmente
4. ✅ AGENTS.md do módulo atualizado com proximidade
5. ✅ Cenários BDD criados com tag `@integration-test`

---

## Status

Em Andamento

---

**Versão**: 1.0
**Criação**: 2026-04-17
**Autor**: AI Agent (sdd-tasks skill)
