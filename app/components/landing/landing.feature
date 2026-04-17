@integration-test="tests/integration/landing.test.ts"
Funcionalidade: Landing Page MenuLink

A landing page é a página principal de conversão do MenuLink, responsável por apresentar a solução aos restaurantes e converter visitantes em usuários registrados.

---

Cenário: Landing page carrega com todos os componentes visíveis
Dado que o usuário acessa a página inicial
Quando a página carrega completamente
Então o componente HeroSection deve estar visível
E o componente SocialProofSection deve estar visível
E o componente PillarsSection deve estar visível
E o componente DemoSection deve estar visível
E o componente PricingSection deve estar visível
E o componente CTASection deve estar visível

---

Cenário: Hero section exibe mensagem de conversão com proposta de valor
Dado que o usuário está na landing page
Quando a seção hero é renderizada
Então o badge "Zero comissão nos seus pedidos" deve estar visível
E o título principal deve conter "Cardápio digital para restaurantes"
E o subtítulo deve mencionar "receba pedidos direto no WhatsApp"
E o contador social deve mostrar "+500 restaurantes"

---

Cenário: Hero section possui botões de ação com links corretos
Dado que o usuário está na seção hero
Quando visualiza os botões de chamada para ação
Então o botão primário "Começar gratuitamente" deve linkar para "/admin/signup"
E o botão secundário "Ver demo" deve linkar para "#demo"

---

Cenário: Social proof section exibe métricas do sistema
Dado que o usuário está na landing page
Quando a seção de prova social é renderizada
Então deve exibir "+500 Restaurantes"
E deve exibir "+50K Pedidos processados"
E deve exibir "4.8 Avaliação média"
E deve exibir "R$ 0 Comissão"

---

Cenário: Pillars section exibe 6 benefícios do MenuLink
Dado que o usuário está na seção de pilares
Quando a seção é renderizada
Então o título deve ser "Por que escolher o MenuLink?"
E devem haver 6 cards de benefícios
E cada benefício deve ter ícone, título e descrição

Cenário: Pilares highlights incluem setup rápido, WhatsApp e QR Code
Dado que o usuário está na seção de pilares
Então o pilar "Setup em 2 minutos" deve estar presente
E o pilar "Pedidos no WhatsApp" deve estar presente
E o pilar "QR Code na Mesa" deve estar presente
E o pilar "Funciona Offline" deve estar presente

---

Cenário: Demo section explica fluxo em 3 passos
Dado que o usuário está na seção de demonstração
Quando a seção é renderizada
Então o título deve ser "Como funciona"
E o passo 1 deve ser "Crie seu cardápio"
E o passo 2 deve ser "Gere o QR Code"
E o passo 3 deve ser "Receba pedidos"

Cenário: Demo section mostra preview do fluxo
Dado que o usuário está na seção de demonstração
Então deve haver preview do cliente escaneando QR Code
E deve haver preview do pedido chegando no WhatsApp

---

Cenário: Pricing section exibe 3 planos de assinatura
Dado que o usuário está na seção de preços
Quando a seção é renderizada
Então o título deve ser "Preços simples e transparentes"
E devem haver exatamente 3 planos: Start, Crescer, Escalar

---

Cenário: Plano Start exibe configuração gratuita
Dado que o usuário está na seção de preços
Quando visualiza o plano Start
Então o nome deve ser "Start"
E o preço deve ser "R$ 0"
E o período deve ser "para sempre"
E o CTA deve ser "Começar gratuitamente"
E deve listar: até 20 produtos, 1 restaurante, QR Code, WhatsApp, offline

---

Cenário: Plano Crescer é destacado como mais popular
Dado que o usuário está na seção de preços
Quando visualiza o plano Crescer
Então deve ter badge "Mais popular"
E o preço deve ser "R$ 49"
E o CTA deve ser "Testar grátis por 14 dias"
E deve ter anel visual de destaque (ring-primary)

---

Cenário: Plano Escalar oferece recursos avançados
Dado que o usuário está na seção de preços
Quando visualiza o plano Escalar
Então o nome deve ser "Escalar"
E o preço deve ser "R$ 149"
E o CTA deve ser "Falar com vendas"
E deve incluir "Restaurantes ilimitados" e "API de integração"

---

Cenário: CTA buttons da pricing section linkam para signup
Dado que o usuário está na seção de preços
Quando clica no botão do plano Start
Então deve ser redirecionado para "/admin/signup"
Quando clica no botão do plano Crescer
Então deve ser redirecionado para "/admin/signup?plan=crescer"

---

Cenário: CTASection final incentivando criação de conta
Dado que o usuário está na seção CTA final
Quando a seção é renderizada
Então o título deve ser "Comece a receber pedidos hoje mesmo"
E o subtítulo deve mencionar "Configure em menos de 2 minutos"
E o botão deve ser "Criar minha conta grátis"
E deve linkar para "/admin/signup"

Cenário: CTASection exibe selos de confiança
Dado que o usuário está na seção CTA final
Então deve exibir "Teste gratuito por 14 dias"
E deve exibir "Sem compromisso"
E deve exibir "Cancele quando quiser"

---

Cenário: Botões CTA são clicáveis e navegam para destino correto
Dado que o usuário está na landing page
Quando clica em qualquer botão CTA da página
Então o clique deve triggering navegação para URL válida
E a URL deve ser uma das esperadas: "/admin/signup", "/admin/signup?plan=crescer", "#demo"
