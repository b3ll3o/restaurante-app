# Tasks: Landing Pages Segmentadas

## Fonte da Verdade

Este documento é derivado de `.openspec/changes/landing-pages-segmentadas/design.md` e `.openspec/changes/landing-pages-segmentadas/specs/landing/spec.md`.

## Pré-condições
- [x] Spec aprovada
- [x] Design aprovado

## Tarefas

### Fase 1: Infraestrutura de Analytics
- [x] 1.1: Criar `lib/analytics.ts` com tipo `SegmentType` e interface `PageViewEvent`
- [x] 1.2: Implementar função `page_view({ segment, url })` com timestamp automático
- [x] 1.3: Criar `lib/analytics.test.ts` com cobertura ≥80%
  - Testar `page_view()` com segment válido
  - Testar `page_view()` incluir timestamp automaticamente
  - Testar `page_view()` fazer console.log do evento

### Fase 2: Componentes Segmentados
- [x] 2.1: Modificar `app/components/landing/HeroSection.tsx` para aceitar prop `segment?: SegmentType`
  - Adicionar conteúdo segmentado (headline, subheadline) para pizzaria, hamburgueria, bar, restaurante
- [x] 2.2: Modificar `app/components/landing/PillarsSection.tsx` para aceitar prop `segment?: SegmentType`
  - Adicionar pilares específicos por segmento (5 pilares cada)
- [x] 2.3: Modificar `app/components/landing/SocialProofSection.tsx` para aceitar prop `segment?: SegmentType`
  - Adicionar social proof específico por segmento
- [x] 2.4: Modificar `app/components/landing/CTASection.tsx` para aceitar prop `segment?: SegmentType`
  - Adicionar texto de CTA e UTM content específicos por segmento
- [x] 2.5: Atualizar `app/components/landing/index.ts` para exportar novos tipos

### Fase 3: Interface (Landing Pages)
- [x] 3.1: Criar `app/landing/pizzaria/page.tsx` com HeroSection, PillarsSection, SocialProofSection, CTASection (segment="pizzaria")
- [x] 3.2: Criar `app/landing/hamburgueria/page.tsx` com HeroSection, PillarsSection, SocialProofSection, CTASection (segment="hamburgueria")
- [x] 3.3: Criar `app/landing/bar/page.tsx` com HeroSection, PillarsSection, SocialProofSection, CTASection (segment="bar")
- [x] 3.4: Criar `app/landing/restaurante/page.tsx` com HeroSection, PillarsSection, SocialProofSection, CTASection (segment="restaurante")
- [x] 3.5: Adicionar metadata única em cada page.tsx para SEO

### Fase 4: Documentação e BDD
- [x] 4.1: Criar `app/landing/AGENTS.md` com documentação do módulo de landing pages
- [x] 4.2: Atualizar `app/components/landing/landing.feature` com cenários segmentados
  - Cenário: Usuário acessa landing de pizzaria
  - Cenário: Usuário acessa landing de hamburgueria
  - Cenário: Usuário acessa landing de bar
  - Cenário: Usuário acessa landing de restaurante
  - Cenário: CTA com UTM params corretos
  - Adicionar tag `@integration-test="tests/integration/landing-pages.test.ts"`

## Progresso
██████████ 100%

## Status
Concluído

## Dependências
- Vitest (testes unitários)
- Playwright (testes E2E - já configurado)

## Rollback
Remover diretórios `app/landing/{pizzaria,hamburgueria,bar,restaurante}/` e reverter modificações em componentes.

---

**Versão**: 1.0
**Data**: 2026-04-17
**Autor**: AI Agent
**Change**: landing-pages-segmentadas
