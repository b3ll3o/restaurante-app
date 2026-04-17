# Spec: landing-page-redesign - Landing Page de Alta Conversão

## Fonte da Verdade

Este documento é parte das especificações do MenuLink.

## Requisitos

### REQ-LP-01: Hero Section

O sistema **DEVE** exibir uma hero section acima da dobra com:
- Headline com "zero comissão" ou "aumente vendas diretas"
- Subtítulo explicativo
- CTA button "Começar teste gratuito" visível sem scroll
- Background ou imagem de suporte

### REQ-LP-02: Seção de Três Pilares

O sistema **DEVE** exibir três pilares respondendo objeções:
- **Pilar 1**: "Setup em minutos" - configuração rápida
- **Pilar 2**: "Zero comissão" - sem taxas por pedido
- **Pilar 3**: "Integra com WhatsApp" - notificação direta

Cada pilar deve ter:
- Ícone representativo
- Título curto
- Frase de benefício

### REQ-LP-03: Seção de Prova Social

O sistema **DEVE** exibir seção de prova social com:
- Contador: "+X restaurantes" (placeholder: "2.500 restaurantes")
- Logos de parceiros/marcas (placeholder)
- Depoimento(s) de clientes (textual inicialmente)

### REQ-LP-04: Seção de Demonstração

O sistema **DEVE** exibir demonstração visual do fluxo:
- Mockup de celular com cardápio
- GIF ou descrição do fluxo: QR Code → Cardápio → Pedido → Cozinha
- Legenda explicativa

### REQ-LP-05: Seção de Planos

O sistema **DEVE** exibir três planos:
- **Start**: Para restaurantes iniciando (R$ XX/mês)
- **Crescer**: Para restaurantes em crescimento (R$ XX/mês)
- **Escalar**: Para restaurantes estabelecidos (R$ XX/mês)

Cada card deve ter:
- Nome do plano
- Preço
- Lista de funcionalidades principais

### REQ-LP-06: CTA Final

O sistema **DEVE** exibir CTA final com:
- Botão "Teste grátis por 14 dias"
- Texto de urgência: "Cancele a qualquer momento"
- Elemento bonus: "Ative hoje e ganhe 1 mês grátis"

### REQ-LP-07: Responsividade

O sistema **DEVE** ser totalmente responsivo:
- Mobile-first design
- Testado em 375px, 768px, 1024px
- Sem quebra de layout

### REQ-LP-08: Performance

O sistema **DEVE** carregar em < 2.5 segundos (LCP).

---

## Critérios de Aceitação

### CA-LP-01: Hero Section
- [ ] Headline contém "zero comissão" ou similar
- [ ] CTA visível acima da dobra (sem scroll)
- [ ] Botão com cor destacada (laranja/vermelho)

### CA-LP-02: Três Pilares
- [ ] Três cards visíveis
- [ ] Cada card tem ícone, título e descrição
- [ ] Conteúdo responde objeções comuns

### CA-LP-03: Prova Social
- [ ] Contador de restaurantes exibido
- [ ] Pelo menos 1 depoimento textual

### CA-LP-04: Demonstração
- [ ] Mockup ou GIF do app
- [ ] Legenda explicativa do fluxo

### CA-LP-05: Planos
- [ ] Três cards de preço
- [ ] Preço visível
- [ ] Lista de features

### CA-LP-06: CTA Final
- [ ] Texto de urgência presente
- [ ] Botão clicável

### CA-LP-07: Responsividade
- [ ] Layout adapta para mobile (375px)
- [ ] Layout adapta para tablet (768px)
- [ ] Layout adapta para desktop (1024px+)

### CA-LP-08: Build
- [ ] `npm run build` passa sem erros
- [ ] `npm run lint` passa sem errors

---

## Casos de Uso

### CU-LP-01: Visualizar Hero Section

**Ator**: Visitante (dono de restaurante)
**Pré-condições**: Página carrega
**Fluxo**:
1. Visitante acessa `/`
2. Hero section carrega acima da dobra
3. Headline e CTA são visíveis
**Pós-condições**: Visitante vê proposta de valor

### CU-LP-02: Navegar pelos Pilares

**Ator**: Visitante
**Pré-condições**: Hero section visível
**Fluxo**:
1. Visitante rola a página
2. Seção de três pilares aparece
3. Visitante lê objeções respondidas
**Pós-condições**: Visitante entende benefícios

### CU-LP-03: Ver Preços

**Ator**: Visitante
**Pré-condições**: Visitou seções anteriores
**Fluxo**:
1. Visitante rola até seção de planos
2. Visualiza três cards de preço
3. Compara funcionalidades
**Pós-condições**: Visitante decide se quer testar

---

## Dependências

- lucide-react (ícones)
- tailwindcss (estilização - já instalado)
- next (framework - já instalado)

---

## Restrições

- Mobile-first: styles devem funcionar em 375px primeiro
- Performance: LCP < 2.5s
- Acessibilidade: contraste adequado, labels em botões

---

## Status

Especificação
