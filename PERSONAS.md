# MenuLink - Personas de Cliente

## Visão Geral

Este documento identifica e documenta as personas de cliente do MenuLink, suas dores, motivações e como o produto atende cada uma. **Este arquivo é fonte de contexto para todas as decisões de produto, backlog items e landing pages.**

**Última Atualização**: 2026-04-17
**Versão**: 1.0
**Idioma**: Português Brasileiro (pt-BR)

---

## Índice

1. [Contexto de Mercado](#1-contexto-de-mercado)
2. [Personas Primárias](#2-personas-primárias)
3. [Personas Secundárias](#3-personas-secundárias)
4. [Anti-Personas](#4-anti-personas)
5. [Matriz de Dores e Soluções](#5-matriz-de-dores-e-soluções)
6. [Critérios de Decisão por Persona](#6-critérios-de-decisão-por-persona)
7. [Mapeamento para Landing Pages](#7-mapeamento-para-landing-pages)

---

## 1. Contexto de Mercado

### 1.1 O Problema Universal

Todo restaurante pequeno/médio no Brasil enfrenta estes desafios:

| Desafio | Descrição | Impacto |
|---------|-----------|---------|
| **Comissões caras** | Apps de delivery cobram 15-30% por pedido | Margem reduzida ou negativada |
| **Gargalo no atendimento** | Cliente espera garçom para pedir | Perde vendas em horários de pico |
| **Gestão manual** | Anotar pedidos no papel, risco de erro | Retrabalho e reclamações |
| **Fila no balcão** | Muitos clientes, poucos atendentes | Experiência ruim, desiste de pedir |
| **Fidelização frágil** | Cliente não tem como pedir direto | Depende de app ou ida ao balcão |
| **Visibilidade** | Não aparece no Google | Perde clientes novos |

### 1.2 Segmentos de Mercado Alvo

```
┌─────────────────────────────────────────────────────────────┐
│                    MERCADO BRASILEIRO DE RESTAURANTES        │
├─────────────┬───────────────┬───────────────┬───────────────┤
│  PIZZARIAS  │ HAMBURGUERIAS │ BARES/RESTOS  │ REST. POPULAR │
│             │               │               │               │
│  ~60.000    │   ~100.000    │   ~150.000    │   ~200.000    │
│  estabs.    │   estabs.     │   estabs.     │   estabs.     │
├─────────────┼───────────────┼───────────────┼───────────────┤
│ QR mesa     │ Delivery      │ Sem garçon    │ Praticidade   │
│ Pedidos 24h │ Direto        │ Zero papel    │ Baixo custo   │
│ Compartilha │ Sem iFood     │ Jogo lotado   │ Marmitex      │
└─────────────┴───────────────┴───────────────┴───────────────┘
```

### 1.3 Mercado Endereçável

| Segmento | Tamanho Aproximado | Dor Principal | Fit com MenuLink |
|----------|-------------------|---------------|------------------|
| Pizzarias | ~60.000 | Pedidos sem parar (24h), comissões | Alto |
| Hamburguerias artesanais | ~100.000 | Gestão de delivery, comissão iFood | Alto |
| Bares com comida | ~150.000 | Sem garçon, pedidos durante jogo | Alto |
| Restaurantes populares | ~200.000 | Custo baixo, praticidade | Médio-Alto |
| Lanchonetes | ~150.000 | Fila no balcão, rapidez | Alto |
| Sorveterias | ~30.000 | Pedidos por telefone confusos | Médio |
| Docerias/Confeitarias | ~50.000 | Encomendas complexas | Médio |
| Food trucks | ~20.000 | Mobilidade, gestão de pedidos | Médio |
| Churrascarias | ~25.000 | Volume alto, comissões | Médio |

**Total endereçável**: ~785.000 estabelecimentos no Brasil
**TAM (Total Addressable Market)**: R$ 15 bi/ano (comissão média 20% sobre pedidos)
**SAM (Serviceable Addressable Market)**: Brasil, restaurantes com WhatsApp

---

## 2. Personas Primárias

São os clientes com maior fit, dor mais aguda e propensão a pagar.

---

### PERSONA 1: "Dona Maria" — Dono de Pizzaria Tradicional

```
┌──────────────────────────────────────────────────────────────┐
│  DONA MARIA                                                  │
├──────────────────────────────────────────────────────────────┤
│  Idade: 48 anos                                              │
│  Local: Interior de São Paulo                                │
│  Escolaridade: Ensino Médio completo                         │
│  Renda: R$ 8.000 - R$ 15.000/mês (do negócio)             │
│  Tempo no negócio: 12 anos                                   │
│  Equipe: 4 funcionários (2 na cozinha, 2 atendimento)       │
│  Tecnologia: Usa WhatsApp, não usa app de delivery          │
└──────────────────────────────────────────────────────────────┘
```

**Perfil Comportamental**
- Não entende de tecnologia profundamente, mas aprende rápido
- Toma decisões baseadas em resultados concretos, não em "modinhas"
- Tem medo de depender de terceiros (apps de delivery)
- Orgulhosa da tradição da família na receita

**Dores (Job-to-be-Done)**

| # | Dor | Severidade | Evidência |
|---|-----|-----------|-----------|
| D1 | Perda de vendas durante telefonemas | 🔴 Alta | "Duas linhas telefônicas e ainda perde pedido" |
| D2 | Erros nas anotações de pedido | 🔴 Alta | "Já mandei pizza errada 3x esta semana" |
| D3 | Comissão do iFood come o lucro | 🔴 Alta | "30% no iFood não vale a pena, prefiro não entregar" |
| D4 | Pedidos de madrugada que ocupam linha | 🟡 Média | "Acordo às 2h pra atender pedido de pizza" |
| D5 | Precisa competir com redes grandes | 🟡 Média | "Rede cobra menos porque não paga comissão" |

**Motivadores de Compra**
1. Zero comissão — não quero mais dar 30% pro iFood
2. QR Code na mesa — cliente pede sozinho, não preciso de garçon
3. Pedidos no WhatsApp — já uso WhatsApp, é natural pra mim
4. Funciona offline — internet do meu bairro cai muito

**Objeções Previstas**

| Objeção | Resposta |
|---------|----------|
| "Não sei usar tecnologia" | "É só criar o cardápio uma vez. Cliente escaneia QR Code e pede. Você só confirma." |
| "Minha internet é ruim" | "Funciona offline. Cliente vê o cardápio mesmo sem internet, pedido vai quando conectar." |
| "Quanto tempo demora pra fazer?" | "10 minutos. Você me diz o que tem no cardápio, eu monto." |
| "E se cliente não tiver WhatsApp?" | "Todo mundo tem WhatsApp hoje. E se não tiver, pode ligar normal." |

**Landing Page**: `/lp/pizzaria`
**CTA**: "Criar cardápio para minha pizzaria"

---

### PERSONA 2: "Carlos" — Hamburgueiro Artesanal

```
┌──────────────────────────────────────────────────────────────┐
│  CARLOS                                                      │
├──────────────────────────────────────────────────────────────┤
│  Idade: 32 anos                                              │
│  Local: Belo Horizonte                                       │
│  Escolaridade: Ensino Superior incompleto                   │
│  Renda: R$ 12.000 - R$ 20.000/mês (do negócio)             │
│  Tempo no negócio: 3 anos (hamburgueria artesanal)          │
│  Equipe: 3 funcionários + ele                                │
│  Tecnologia: Usa Instagram, iFood, Discord do delivery       │
└──────────────────────────────────────────────────────────────┘
```

**Perfil Comportamental**
- Conhece tecnologia, usa redes sociais para marketing
- Sabe que iFood come margem, mas precisa de visibilidade
- Quer ser independente, não depender de plataforma
- Orgulha-se da qualidade do hambúrguer artesanal
- Quer crescer sem perder controle

**Dores (Job-to-be-Done)**

| # | Dor | Severidade | Evidência |
|---|-----|-----------|-----------|
| D1 | iFood cobra 25% de comissão | 🔴 Alta | "Faço R$ 10mil no iFood e recebo R$ 7.500. Dói." |
| D2 | Gestão de pedidos do iFood é caótica | 🔴 Alta | "3 plataformas diferentes, perco pedido no Discord" |
| D3 | Hamburgueria lotada, fila no balcão | 🔴 Alta | "Cliente desiste de pedir porque a fila tá grande" |
| D4 | Precisa aparecer no Google | 🟡 Média | "Ranking no iFood é por relevância, não por qualidade" |
| D5 | Fotos ruins no cardápio impresso | 🟡 Média | "Fotógrafo é caro, cardápio fica feio" |

**Motivadores de Compra**
1. Zero comissão — minha margem é apertada, não aguento mais iFood
2. Pedidos direto no WhatsApp — já tenho clientes no WhatsApp, quero direto pra lá
3. Meus clientes pedem pelo celular — QR Code no balcão resolve a fila
4. Cardápio com foto — posso colocar foto do meu burger artesanal

**Objeções Previstas**

| Objeção | Resposta |
|---------|----------|
| "Já tenho iFood, por que pagar mais?" | "MenuLink não é pra substituir cliente novo. É pra cliente que já te conhece pedir direto, sem comissão." |
| "Preciso de entrega com logistics" | "Começa com QR Code na mesa ou retirada. Entrega é próximo passo." |
| "Meu público é jovem, usa app" | "Jovem também tem WhatsApp. E prefere pedir sem baixar app." |
| " quanto sai por mês?" | "Plano começa em R$ 49/mês. Se fizer 2 pedidos a mais por dia, já pagou." |

**Landing Page**: `/lp/hamburgueria`
**CTA**: "Abrir minha hamburgueria no WhatsApp"

---

### PERSONA 3: "João" — Dono de Bar Esportivo

```
┌──────────────────────────────────────────────────────────────┐
│  JOÃO                                                        │
├──────────────────────────────────────────────────────────────┤
│  Idade: 40 anos                                              │
│  Local: Rio de Janeiro                                       │
│  Escolaridade: Ensino Médio completo                         │
│  Renda: R$ 10.000 - R$ 18.000/mês (do negócio)             │
│  Tempo no negócio: 8 anos                                    │
│  Equipe: 6 funcionários (2厨房, 4 atendimento)              │
│  Tecnologia: Usa WhatsApp, tem TV para jogos                 │
└──────────────────────────────────────────────────────────────┘
```

**Perfil Comportamental**
- Gosta de futebol, Bar é ponto de encontro pra assistir jogos
- Sabe que dias de jogo são caóticos em pedido
- Tem experiência com problemas de garçom em horário de pico
- Quer maximizar vendas nos dias de jogo
- Pragmático — quer resultado, não complicação

**Dores (Job-to-be-Done)**

| # | Dor | Severidade | Evidência |
|---|-----|-----------|-----------|
| D1 | Caos total durante jogo grande | 🔴 Alta | "Final de campeonato, 100 pessoas pedindo junto. Meu garçon trava." |
| D2 | Perde venda durante jogo | 🔴 Alta | "Cliente desiste de pedir porque não aguenta esperar" |
| D3 | Taxa de serviço que cliente reclama | 🔴 Alta | "Tiro a taxa, perco margem. Coloco, perco cliente." |
| D4 | Conta no iFood, mas delivery é lento | 🟡 Média | "Cerveja chega morna. Não faz sentido delivery pra bar." |
| D5 | Garçons pedem errado | 🟡 Média | "Pedido errado = briga com cliente = ambiente ruim" |

**Motivadores de Compra**
1. QR Code na mesa — cliente pede durante o jogo sem chamar garçon
2. Zero comissão — sem taxa de serviço, cliente fica feliz
3. Pedidos chegam no WhatsApp — já tem WhatsApp aberto o tempo todo
4. Funciona offline — internet cai durante jogo? Pedido não para

**Objeções Previstas**

| Objeção | Resposta |
|---------|----------|
| "Meu bar é diferente, cliente gosta de interagir" | "QR Code não tira interação. Cliente pode pedir direto ou chamar garçon pra Drink especial." |
| "Internet do meu bar é instável" | "Funciona offline. Pedido fica na fila e manda quando a internet voltar." |
| "Jogador de futebol não sabe escanear QR" | "Todo mundo escaneia QR Code hoje. É mais fácil que pedir pelo app." |
| "Funcionários vão ficar sem trabalho?" | "Funcionário foca em servir, não em anotar pedido. Produtividade sobe." |

**Landing Page**: `/lp/esportivo`
**CTA**: "Nunca mais perder venda no dia do jogo"

---

### PERSONA 4: "Ana" — Dona de Restaurante Popular

```
┌──────────────────────────────────────────────────────────────┐
│  ANA                                                         │
├──────────────────────────────────────────────────────────────┤
│  Idade: 55 anos                                              │
│  Local: Brasília                                             │
│  Escolaridade: Ensino Fundamental completo                  │
│  Renda: R$ 5.000 - R$ 8.000/mês (do negócio)               │
│  Tempo no negócio: 15 anos                                   │
│  Equipe: 2 funcionários + ela                              │
│  Tecnologia: Celular básico, usa WhatsApp (mas pouco)       │
└──────────────────────────────────────────────────────────────┘
```

**Perfil Comportamental**
- Gestão financeira apertada — cada centavo conta
- Não tem dinheiro pra investir em tecnologia cara
- Foca em volume — muitos clientes, preço acessível
- Sabe que precisa digitalizar, mas não sabe por onde começar
- Preocupada com retorno sobre investimento

**Dores (Job-to-be-Done)**

| # | Dor | Severidade | Evidência |
|---|-----|-----------|-----------|
| D1 | Margem muito apertada | 🔴 Alta | "Com iFood 20%, não sobra nada no almoço popular" |
| D2 | Precisa de solução barata | 🔴 Alta | "Já pago luz, aluguel, funcionários. Não tenho mais nada." |
| D3 | Cliente não tem dinheiro pra app | 🟡 Média | "Meu cliente é de escritório, não tem iFood" |
| D4 | Pedidos por telefone confundem | 🟡 Média | "10 marmitex, 2 sem sal, 1 sem cebola. Como anoto?" |
| D5 | Tempo de almoço é corrido | 🟡 Média | "12h lota. Não consigo atender todo mundo direito." |

**Motivadores de Compra**
1. Zero comissão — "R$ 0 de taxa. Só cobra quando eu crescer."
2. Preço acessível — "R$ 29/mês? Consigo pagar isso."
3. Simples de usar — "Não preciso ser experts em tecnologia."
4. Funciona offline — "Internet do prédio é instável."

**Objeções Previstas**

| Objeção | Resposta |
|---------|----------|
| "Não tenho dinheiro pra mais despesa" | "Custa menos que um almoço por dia. E se evitar 1 pedido errado, já pagou o mês." |
| "É difícil de mexer?" | "É tão fácil quanto enviar foto no WhatsApp. Eu monto pra você." |
| "Meus clientes são antigos, não usam celular" | "QR Code na parede. Cliente escaneia e vê. Não precisa pedir por ali se não quiser." |
| "Funciona no celular simples?" | "Funciona em qualquer celular. Só precisa ter WhatsApp." |

**Landing Page**: `/lp/restaurante-popular`
**CTA**: "Digitalizar meu restaurante sem gastar fortune"

---

### PERSONA 5: "Rafael" — Food Truck Owner

```
┌──────────────────────────────────────────────────────────────┐
│  RAFAEL                                                      │
├──────────────────────────────────────────────────────────────┤
│  Idade: 28 anos                                              │
│  Local: Curitiba                                              │
│  Escolaridade: Ensino Superior completo                      │
│  Renda: R$ 8.000 - R$ 15.000/mês (do negócio)               │
│  Tempo no negócio: 2 anos (food truck)                       │
│  Equipe: 1 (ele) + 1 ajudante                                │
│  Tecnologia: Usa Instagram, PicPay, Notion pra gestão        │
└──────────────────────────────────────────────────────────────┘
```

**Perfil Comportamental**
- Nômade digital, entende de tecnologia
- Quer construir marca, não só vender comida
- Mobilidade é essencial — não tem estrutura fixa
- Gerencia tudo sozinho — tempo é recurso escasso
- Usa Instagram e redes para营销

**Dores (Job-to-be-Done)**

| # | Dor | Severidade | Evidência |
|---|-----|-----------|-----------|
| D1 | Pedidos por DM no Instagram são caóticos | 🔴 Alta | "10 DMs pedindo pedido, 5 no WhatsApp. Perco a conta." |
| D2 | Cliente não sabe o cardápio | 🔴 Alta | "Fico explicando o que tem pelo direct" |
| D3 | Sem presença online fixa | 🟡 Média | "Não tenho endereço fixo, cliente não me encontra" |
| D4 | Gestão de eventos e festas | 🟡 Média | "Encomendas perdem porque não tem sistema" |
| D5 | Troco, pagamento é sempre problema | 🟡 Média | "A maioria quer Pix, mas tem que ficar explicando" |

**Motivadores de Compra**
1. Cardápio online sempre acessível — QR Code no caminhão, cliente vê cardápio
2. Pedidos via WhatsApp — "Já uso WhatsApp pra vender, só preciso organizar"
3. Location-agnostic — "Funciona onde eu estiver"
4. Preço justo — "Não preciso pagar iFood pra ter visibilidade"

**Objeções Previstas**

| Objeção | Resposta |
|---------|----------|
| "Não tenho endereço fixo" | "O MenuLink é baseado no seu slug. Onde quer que você esteja, seu cardápio é o mesmo." |
| "Já uso Instagram pra vender" | "Instagram é pra descoberta. MenuLink é pra conversão — pedido direto." |
| "Preciso de delivery" | "Começa com retirada e encomendas. Delivery é próximo passo." |

**Landing Page**: `/lp/food-truck` (futuro)
**CTA**: "Monte seu cardápio e receba pedidos onde estiver"

---

## 3. Personas Secundárias

### PERSONA 6: "Fernanda" — Dona de Lanchonete de Bairro

```
┌──────────────────────────────────────────────────────────────┐
│  FERNANDA                                                    │
├──────────────────────────────────────────────────────────────┤
│  Idade: 35 anos                                              │
│  Local: Porto Alegre                                         │
│  Escolaridade: Ensino Médio completo                         │
│  Renda: R$ 6.000 - R$ 10.000/mês (do negócio)               │
│  Tempo no negócio: 5 anos                                    │
│  Equipe: 3 funcionários                                      │
│  Tecnologia: Usa WhatsApp Business, caixa registradora       │
└──────────────────────────────────────────────────────────────┘
```

**Perfil Comportamental**
- Comunidade local forte — cliente é do bairro
- Não tem iFood ainda, medo de começar
- Quer crescer organicamente
- Preocupada com competição de grandes redes

**Dores**

| # | Dor | Severidade | Evidência |
|---|-----|-----------|-----------|
| D1 | Fila no balcão durante rush | 🔴 Alta | "12h às 13h, fila até na porta" |
| D2 | iFood cobra demais | 🔴 Alta | "Minha margem não aguenta 25%" |
| D3 | Pedidos por telefone errados | 🟡 Média | "Já anotei errado, já mandei errado" |

**Motivadores de Compra**
1. QR Code no balcão — "fila reduz porque cliente já pediu"
2. Zero comissão — "posso competir com iFood sem taxa"
3. Simples — "consigo mexer sozinha"

---

### PERSONA 7: "Pedro e Paula" — Casal dono de Churrascaria

```
┌──────────────────────────────────────────────────────────────┐
│  PEDRO E PAULA                                               │
├──────────────────────────────────────────────────────────────┤
│  Idade: 45 anos (ambos)                                      │
│  Local: Goiânia                                               │
│  Escolaridade: Ensino Superior (Pedro), Ensino Médio (Paula) │
│  Renda: R$ 20.000 - R$ 35.000/mês (do negócio)              │
│  Tempo no negócio: 10 anos                                   │
│  Equipe: 12 funcionários                                     │
│  Tecnologia: Sistema de gestão, mas cardápio ainda no papel   │
└──────────────────────────────────────────────────────────────┘
```

**Perfil Comportamental**
- Negócio mais estruturado, já tem sistema
- Quer modernizar sem trocar tudo
- Faturamento alto, comissões também
- Prestígio na comunidade — marca estabelecida

**Dores**

| # | Dor | Severidade | Evidência |
|---|-----|-----------|-----------|
| D1 | Comissão de delivery come margem em volume | 🔴 Alta | "R$ 50mil/mês em delivery = R$ 10mil de comissão" |
| D2 | Cardápio físico precisa atualizar sempre | 🔴 Alta | "Mudei preço do rodízio, tenho que reimprimir" |
| D3 | Pedidos de eventoходят por WhatsApp | 🟡 Média | "Encomenda de churrasco por WhatsApp, perde informação" |

**Motivadores de Compra**
1. Zero comissão em pedidos diretos
2. Atualizar cardápio em tempo real
3. Encomendas organizadas pelo sistema

---

## 4. Anti-Personas

São perfis que **NÃO são nosso cliente ideal**:

| Anti-Persona | Por Que Não | O Que Oferecer |
|-------------|-------------|----------------|
| **Restaurante fast-food de rede** (McDonald's, Burger King) | Já tem sistema próprio, app próprio, não precisa | Não é fit |
| **Restaurante 5 estrelas** (alta gastronomia) | Experiência é personalizada, garçon é parte do serviço | Não é fit |
| **Restaurante sem WhatsApp** | Pré-requisito é ter WhatsApp | Ajudar a criar primeiro |
| **Dono que quer só delivery com logística** | MenuLink não tem entregador próprio | RecomendariFood/ Rappi |
| **Cliente que quer gestão completa** (estoque, financeiro) | Funcionalidade futura ou não é escopo | Escalar para ERP depois |

---

## 5. Matriz de Dores e Soluções

| Dor | Pizzaria | Hamburgueria | Bar | Rest. Popular | Food Truck | Lanchonete |
|-----|----------|-------------|-----|---------------|------------|------------|
| Comissão alta | ✅ QR mesa | ✅ Sem iFood | ✅ Sem garçon | ✅ R$ 0 | ✅ Sem iFood | ✅ Sem iFood |
| Perda de vendas | ✅ 24h pedidos | ✅ Direto WhatsApp | ✅ Durante jogo | ✅ Rush almoço | ✅ Sempre acessível | ✅ QR balcão |
| Erro de pedido | ✅ Digital | ✅ Digital | ✅ Digital | ✅ Digital | ✅ Digital | ✅ Digital |
| Filas | ✅ QR mesa | ✅ QR balcão | ✅ QR mesa | ✅ QR autoatendimento | ✅ QR truck | ✅ QR balcão |
| Visibilidade | ✅ Cardápio online | ✅ Sem iFood | ✅ Sem iFood | ⚠️ Menos urgente | ✅ Location-agnostic | ⚠️ Menos urgente |

**Legenda**: ✅ Solução direta | ⚠️ Solução parcial

---

## 6. Critérios de Decisão por Persona

| Persona | Critério #1 | Critério #2 | Critério #3 | Preço Sensível? |
|---------|------------|------------|------------|----------------|
| Dona Maria | Simplicidade | Zero comissão | Funciona offline | Sim (R$ 29-49) |
| Carlos | Margem/Comissão | Crescimento | Marca própria | Médio (R$ 49-99) |
| João | Resultado no jogo | Sem complicações | Zero comissão | Médio (R$ 49-99) |
| Ana | Preço baixo | Simplicidade | ROI claro | Sim (R$ 29) |
| Rafael | Mobilidade | Preço justo | Integração Instagram | Médio (R$ 49) |
| Fernanda | Simplicidade | Fila reduz | Zero comissão | Sim (R$ 29-49) |

---

## 7. Mapeamento para Landing Pages

| Landing Page | Persona Principal | Persona Secundária | Headline | CTA Principal |
|-------------|------------------|-------------------|----------|---------------|
| `/lp/pizzaria` | Dona Maria | Pedro & Paula | "Sua pizzaria merece pedidos mesmo quando você está ocupado" | "Criar cardápio para pizzaria" |
| `/lp/hamburgueria` | Carlos | Fernanda | "Hamburgueria lotada? Deixe os pedidos no automático" | "Abrir minha hamburgueria no WhatsApp" |
| `/lp/esportivo` | João | — | "Nunca mais perca uma venda no dia do jogo" | "Nunca mais perder venda no dia do jogo" |
| `/lp/restaurante-popular` | Ana | Fernanda | "Digitalize seu restaurante sem gastar fortune" | "Digitalizar meu restaurante sem gastar fortune" |
| `/lp/food-truck` | Rafael | — | "Monte seu cardápio e receba pedidos onde estiver" | "Abrir meu food truck no WhatsApp" |
| `/` (principal) | Genérico | — | "Cardápio digital para restaurantes sem pagar comissão" | "Criar cardápio gratis" |

---

## 8. Como Usar Este Documento

### Backlog Items
Antes de criar um backlog item, verificar:
- [ ] Qual persona este item atende?
- [ ] Qual dor ele resolve?
- [ ] Qual critério de decisão é afetado?
- [ ] Qual landing page faz sentido?

### Landing Pages Segmentadas
Antes de criar landing page:
- [ ] Qual persona é o alvo primário?
- [ ] Qual linguagem esta persona usa?
- [ ] Qual dor é o âncora principal?
- [ ] Qual CTA ressoa com esta persona?

### Features
Antes de implementar feature:
- [ ] Qual persona precisa desta feature?
- [ ] Esta feature resolve dor ou cria feature-request?
- [ ] Compatível com offline-first?
- [ ] Funciona em celular básico?

---

## 9. Revisões

| Data | Versão | Mudanças |
|------|--------|----------|
| 2026-04-17 | 1.0 | Criação inicial com 7 personas |

---

**Versão**: 1.0
**Última Atualização**: 2026-04-17
**Autor**: AI Agent
**Próxima Revisão**: A cada 30 dias ou quando novo segmento for identificado
