# Delta: Landing Page (landing-page)

## Fonte da Verdade

Este documento é parte das especificações do MenuLink. Artefato de mudança
`.openspec/changes/landing-page-redesign/`.

## Dominínio Afetado

- **Domínio**: Landing Page
- **Tipo de mudança**: Criação (nova landing page de alta conversão)
- **Pipeline**: Full

---

## ADDED Requirements

### REQ-LP-01: Hero Section com Proposta de Valor

A landing page DEVE conter uma hero section com headline principal que comunique
"zero comissão" ou similar, posicionada acima da dobra (above the fold). O headline
DEVE ser "Aumente suas vendas diretas sem pagar comissão" ou texto equivalente que
transmita a mesma proposta de valor.

#### Cenário: Visitante visualiza hero section com proposta de valor

- **GIVEN** o visitante acessa a URL da landing page
- **WHEN** a página carrega completamente
- **THEN** a hero section é exibida imediatamente
- **AND** o headline contém a expressão "zero comissão" ou mensagem equivalente
- **AND** existe um subtítulo explicativo abaixo do headline

#### Cenário: CTA visível acima da dobra

- **GIVEN** o visitante está na hero section
- **WHEN** ele visualiza a seção sem precisar rolar a página
- **THEN** o botão de CTA "Começar teste gratuito" está visível
- **AND** o botão possui cor de destaque (laranja/vermelho)

---

### REQ-LP-02: Três Pilares Respondendo Objeções

A landing page DEVE exibir exatamente três pilares que respondam às principais
objeções dos donos de restaurantes: (1) setup rápido, (2) sem comissão, (3)
integração com POS/WhatsApp. Cada pilar DEVE ter ícone visual, título curto
e frase de benefício.

#### Cenário: Três pilares exibidos corretamente

- **GIVEN** o visitante está na landing page
- **WHEN** ele rola a página até a seção de pilares
- **THEN** exatamente três cards/pílares são exibidos
- **AND** cada pilar contém: ícone, título e descrição de benefício

#### Cenário: Pilares respondem objeções específicas

- **GIVEN** o visitante visualiza a seção de pilares
- **WHEN** ele lê o conteúdo
- **THEN** um pilar menciona "setup" ou "minutos" (rapidez)
- **AND** um pilar menciona "zero comissão" ou "sem comissão" (custo)
- **AND** um pilar menciona "POS", "WhatsApp" ou "integração" (compatibilidade)

---

### REQ-LP-03: Formulário CTA Visível Above the Fold

O formulário de captura de leads OU o botão CTA principal DEVE estar visível
na hero section sem necessidade de rolagem. O formulário DEVE capturar:
nome, email e WhatsApp do potencial cliente.

#### Cenário: Formulário visível sem rolagem

- **GIVEN** o visitante acessa a landing page
- **WHEN** a hero section é renderizada
- **THEN** o formulário de CTA ou botão está visível na tela
- **AND** não requer ação de scroll para ser visualizado

#### Cenário: Formulário captura dados necessários

- **GIVEN** o visitante deseja se cadastrar
- **WHEN** ele interage com o formulário de CTA
- **THEN** o formulário contém campos para: nome, email, WhatsApp
- **AND** existe um botão de envio com texto "Começar" ou "Enviar"

---

### REQ-LP-04: Seção de Prova Social com Contador e Logos

A landing page DEVE conter uma seção de prova social que exiba um contador
dinâmico de restaurantes (ex: "+2.500 restaurantes") e logos de parceiros ou
clientes conhecidos. O contador DEVE ser numérico e destacado.

#### Cenário: Contador de restaurantes exibido

- **GIVEN** o visitante acessa a landing page
- **WHEN** ele rola até a seção de prova social
- **THEN** um contador numérico é exibido com formato "+X restaurantes"
- **AND** o número é maior que 1.000

#### Cenário: Logos de parceiros visíveis

- **GIVEN** o visitante está na seção de prova social
- **WHEN** ele visualiza os elementos
- **THEN** logos de pelo menos 3 parceiros/marcas conhecidas são exibidos
- **AND** os logos estão em formato legível

---

### REQ-LP-05: Depoimento em Vídeo com Modal

A landing page DEVE conter pelo menos um depoimento em vídeo de um dono de
restaurante real. O vídeo DEVE abrir em um modal ao ser clicado. O modal DEVE
conter botão de fechar e área para pausar/retomar o vídeo.

#### Cenário: Depoimento em vídeo disponível

- **GIVEN** o visitante está na seção de prova social
- **WHEN** ele visualiza os depoimentos
- **THEN** pelo menos um card de depoimento possui thumbnail de vídeo
- **AND** o card indica "Depoimento em vídeo" ou similar

#### Cenário: Modal abre ao clicar no vídeo

- **GIVEN** o visitante clicou no card de depoimento em vídeo
- **WHEN** a ação de clique é executada
- **THEN** um modal é aberto com o player de vídeo
- **AND** o modal contém botão para fechar
- **AND** o vídeo pode ser pausado/retomado

---

### REQ-LP-06: Demonstração Visual do App (Mockup/GIF)

A landing page DEVE conter uma demonstração visual do app funcionando,
exibida como mockup de celular e/ou GIF animado. A demonstração DEVE mostrar
o fluxo completo: QR Code → cardápio → pedido → cozinha.

#### Cenário: Mockup do app exibido

- **GIVEN** o visitante está na seção de demonstração
- **WHEN** a seção carrega
- **THEN** um mockup de celular/interface é exibido
- **AND** o mockup contém imagem ou GIF representando o app

#### Cenário: GIF demonstra fluxo completo

- **GIVEN** o visitante visualiza o mockup/GIF
- **WHEN** a animação é reproduzida
- **THEN** o fluxo mostrado inclui: QR Code sendo escaneado → cardápio
  sendo exibido → pedido sendo feito → confirmação para cozinha
- **AND** a animação é contínua ou reinicia automaticamente

---

### REQ-LP-07: Planos de Preço Start/Crescer/Escalar

A landing page DEVE exibir três planos de preço claramente separados por
estágio do restaurante: Start, Crescer e Escalar. Cada plano DEVE conter:
nome do plano, preço mensal e lista de recursos principais.

#### Cenário: Três planos exibidos com preços

- **GIVEN** o visitante rola até a seção de preços
- **WHEN** ele visualiza os cards de planos
- **THEN** exatamente três planos são exibidos: Start, Crescer, Escalar
- **AND** cada plano tem seu preço mensal claramente visível

#### Cenário: Planos diferenciados por estágio

- **GIVEN** o visitante está na seção de planos
- **WHEN** ele compara os planos
- **THEN** o plano "Start" aparece como opção inicial/básica
- **AND** o plano "Crescer" aparece como opção intermediária
- **AND** o plano "Escalar" aparece como opção premium

#### Cenário: Recursos principais listados

- **GIVEN** o visitante visualiza um card de plano
- **WHEN** ele lê as informações do plano
- **THEN** uma lista de recursos principais está visível
- **AND** o preço está destacado e legível

---

### REQ-LP-08: CTA Final com Urgência e Teste Grátis

A landing page DEVE conter um CTA final com elemento de urgência. O botão
DEVE incluir texto "Teste grátis 14 dias" ou similar, e um elemento adicional
de urgência (ex: "Ative hoje e ganhe 1 mês grátis").

#### Cenário: CTA final com urgência

- **GIVEN** o visitante está no final da landing page
- **WHEN** ele visualiza a seção de CTA final
- **THEN** um botão de CTA grande é exibido
- **AND** o texto do botão contém "teste grátis" e "14 dias"

#### Cenário: Elemento de urgência adicional

- **GIVEN** o visitante visualiza o CTA final
- **WHEN** ele observa os elementos de urgência
- **THEN** existe um texto adicional como "Ganhe 1 mês grátis" ou similar
- **AND** o texto está posicionado próximo ao botão de CTA

#### Cenário: Botão redireciona para formulário de cadastro

- **GIVEN** o visitante clicou no CTA final
- **WHEN** a ação de clique é executada
- **THEN** ele é redirecionado para um formulário curto de cadastro
- **AND** o formulário solicita apenas: nome, email, telefone, nome do restaurante

---

## MODIFIED Requirements

Nenhum requisito existente foi modificado nesta mudança.

---

## REMOVED Requirements

Nenhum requisito existente foi removido nesta mudança.

---

## Critérios de Aceitação Derivados

### CA-LP-01: Hero Section Carrega em menos de 2 segundos

O headline da hero section DEVE ser renderizado em menos de 2 segundos após
o carregamento da página, medido como LCP (Largest Contentful Paint).

**Evidência**: Lighthouse CI com threshold LCP < 2.5s

---

### CA-LP-02: Headline Contém "Zero Comissão"

O headline principal da hero section DEVE conter explicitamente a expressão
"zero comissão" ou sinônimo equivalente que comunique a mesma ideia.

**Evidência**: Teste E2E verificando texto do headline

---

### CA-LP-03: Três Pilares Visíveis Above the Fold ou Imediatamente Após Hero

Os três pilares DEVEM ser visíveis ao usuário sem necessidade de navegação
adicional além do scroll natural da hero section.

**Evidência**: Teste E2E em viewport mobile (375px) e desktop (1280px)

---

### CA-LP-04: Formulário Captura Nome, Email e WhatsApp

O formulário de CTA DEVE ter exatamente os campos: nome (texto), email (email),
WhatsApp (telefone), e botão de envio.

**Evidência**: Teste unitário verificando campos do formulário

---

### CA-LP-05: Contador Exibe Número Maior que 2.000

O contador de proof social DEVE exibir valor maior que 2.000.

**Evidência**: Teste E2E verificando valor do contador

---

### CA-LP-06: Modal de Vídeo Abre e Fecha Corretamente

O modal de depoimento em vídeo DEVE abrir ao clicar no card e fechar ao
clicar no botão de fechar ou fora do modal.

**Evidência**: Teste E2E verificando open/close do modal

---

### CA-LP-07: Mockup/GIF Exibe Fluxo Completo

O mockup ou GIF DEVE exibir as 4 etapas do fluxo: QR Code → Cardápio →
Pedido → Cozinha.

**Evidência**: Teste E2E verificando elementos visíveis no mockup

---

### CA-LP-08: Planos Start, Crescer e Escalar Têm Preços Distintos

Os três planos DEVEM ter preços mensais distintos e claramente visíveis.

**Evidência**: Teste E2E verificando preços dos três planos

---

### CA-LP-09: CTA Final Contém "Teste Grátis 14 Dias"

O botão de CTA final DEVE ter texto contendo "teste grátis" e "14 dias".

**Evidência**: Teste E2E verificando texto do botão

---

### CA-LP-10: Página Não Tem Menu de Navegação Principal

A landing page NÃO DEVE ter menu de navegação no header que desvie o foco do
CTA principal. Apenas links de rodapé essenciais são permitidos.

**Evidência**: Teste E2E verificando ausência de nav principal

---

## Dependências

| Dependência | Tipo | Descrição |
|-------------|------|-----------|
| React 19 | Framework | Componentes React |
| Next.js 16.2.3 | Framework | App Router, SSG/SSR |
| Tailwind CSS 4 | Styling | CSS-based config |
| TypeScript strict | Type safety | Strict mode enabled |
| Playwright | Testing | Testes E2E responsivos |

---

## Restrições

1. A página DEVE ser mobile-first (media queries padrão)
2. A página NÃO DEVE ter menu de navegação header
3. O LCP DEVE ser < 2.5 segundos
4. Testes E2E DEVEM passar em Chrome, Safari, Android
5. A página NÃO pode ter blog, FAQ completo, ou área do cliente

---

## Status

Especificação

---

**Versão**: 1.0
**Criação**: 2026-04-17
**Autor**: AI Agent (sdd-spec skill)
**Change**: landing-page-redesign