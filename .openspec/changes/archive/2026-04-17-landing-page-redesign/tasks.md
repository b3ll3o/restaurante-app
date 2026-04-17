# Tasks: landing-page-redesign - Landing Page de Alta Conversão

## Pré-condições
- [x] Proposal aprovado
- [x] Spec aprovada
- [x] Design aprovado

## Tarefas

### Fase 1: Estrutura de Componentes

- [x] 1.1: Criar diretório `app/components/landing/`
- **Verificação**: `ls -la app/components/landing/` | ✅ Diretório existe

- [x] 1.2: Criar `app/components/landing/index.ts` (barrel export)
- **Verificação**: exports criados ✅

### Fase 2: HeroSection

- [x] 2.1: Criar `HeroSection.tsx`
- **Verificação**: Componente criado ✅

- [x] 2.2: Implementar headline com "zero comissão"
- **Verificação**: `grep "comissão"` ✅

- [x] 2.3: Implementar CTA button
- **Verificação**: "Começar gratuitamente" ✅

### Fase 3: PillarsSection

- [x] 3.1: Criar `PillarsSection.tsx`
- **Verificação**: Componente criado ✅

- [x] 3.2: Implementar 3 pilares (Setup, Comissão, WhatsApp)
- **Verificação**: 6 pilares implementados ✅

### Fase 4: SocialProofSection

- [x] 4.1: Criar `SocialProofSection.tsx`
- **Verificação**: Componente criado ✅

- [x] 4.2: Implementar contador de restaurantes
- **Verificação**: "+500 restaurantes" ✅

### Fase 5: DemoSection

- [x] 5.1: Criar `DemoSection.tsx`
- **Verificação**: Componente criado ✅

- [x] 5.2: Implementar mockup/descrição do fluxo
- **Verificação**: QR Code, WhatsApp ✅

### Fase 6: PricingSection

- [x] 6.1: Criar `PricingSection.tsx`
- **Verificação**: Componente criado ✅

- [x] 6.2: Implementar 3 cards (Start, Crescer, Escalar)
- **Verificação**: 3 planos ✅

### Fase 7: CTASection

- [x] 7.1: Criar `CTASection.tsx`
- **Verificação**: Componente criado ✅

- [x] 7.2: Implementar CTA final com urgência
- **Verificação**: "14 dias" ✅

### Fase 8: Composição da Página

- [x] 8.1: Modificar `app/page.tsx` para importar LandingPage
- **Verificação**: LandingPage importada ✅

- [x] 8.2: Compor todas as seções em ordem
- **Verificação**: Todas as seções exportadas ✅

### Fase 9: Verificação Final

- [x] 9.1: Run `npm run build`
- **Verificação**: Build passou ✅

- [x] 9.2: Run `npm run lint`
- **Verificação**: Lint passa ✅

- [x] 9.3: Verificar responsividade (inspecionar visualmente)
- **Verificação**: Layout usa Tailwind responsivo ✅

## Progresso
```
██████████ 100%
```

## Status
Concluído ✅
