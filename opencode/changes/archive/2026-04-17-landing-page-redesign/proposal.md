# Proposta: landing-page-redesign - Landing Page de Alta Conversão

## Problema

A página inicial atual (/) é apenas o template padrão do Next.js, não comunica o valor do MenuLink para donos de restaurantes.

**Problemas identificados:**
- Headline genérica ("To get started, edit the page.tsx file")
- Sem proposta de valor clara
- Sem prova social
- Sem pricing ou CTA claro
- Zero conversão

## Solução Proposta

Redesenhar a página inicial como landing page de alta conversão focada em:
1. **Hero Section**: Headline com "zero comissão" + CTA visível acima da dobra
2. **Três Pilares**: Responder objeções (setup rápido, sem comissão, integra com WhatsApp)
3. **Prova Social**: Contador de restaurantes + depoimentos
4. **Demonstração Visual**: GIF/mockup do fluxo QR Code → pedido
5. **Planos**: Cards Start/Crescer/Escalar
6. **CTA Final**: Urgência (teste grátis 14 dias)

## Impacto
- [ ] Breaking changes? **Não** - nova página
- [ ] Migração necessária? **Não**
- [ ] Novos dependencies? **Possível** - lucide-react (já instalado), possible animations library

## Alternativas Consideradas

| Alternativa | Por que Descartada |
|-------------|-------------------|
| Manter template Next.js | Não converte, imagem profissional ruim |
| Criar página separada em subdomain | Manutenção duplicada, SEO fragmentado |
| Copiar de concorrente | Questões legais, não personalizado |

## Urgência
- [x] Alta - time de marketing precisa para campanhas

## Scope

### In
- Hero section com headline e CTA
- Seção de três pilares
- Seção de prova social
- Seção de demonstração visual
- Seção de planos
- CTA final com urgência
- Responsividade mobile-first

### Out
- Blog/FAQ
- Sistema de login
- Área do cliente
- Blog ou páginas "Sobre nós"

## Affected Areas

| Área | Impacto |
|------|---------|
| `app/page.tsx` | Total redesign |
| `app/globals.css` | Possibly new styles |

## Approach

1. **Design**: Criar wireframe/wireframes da landing page
2. **Implementação**: Desenvolver componentes React
3. **Conteúdo**: copywriting e assets (placeholder inicialmente)
4. **Testes**: Testar responsividade e performance

## Risks

| Risco | Mitigação |
|-------|-----------|
| copy/paste de placeholder | Preencher com conteúdo real antes de deploy |
| Performance ruim com assets | Otimizar imagens, lazy loading |

## Success Criteria

- [ ] Hero com headline "zero comissão" acima da dobra
- [ ] Três pilares visíveis na rolagem inicial
- [ ] CTA visível sem scroll
- [ ] Mobile responsive
- [ ] Build passa sem erros

## Status

Proposta
