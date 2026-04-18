@integration-test="tests/integration/landing.test.ts"
Funcionalidade: Landing Page - Alta Conversão

O sistema deve apresentar uma landing page de alta conversão para atrair donos de restaurantes,
com hero section impactante, três pilares de benefícios, prova social, vídeo testimonial,
demonstração do fluxo, planos de preço e CTA final com formulário de captura de leads.

@integration-test="tests/integration/landing.test.ts"
Cenário: Visitante visualiza hero section com proposta de valor

Dado que o visitante acessa a URL da landing page
Quando a página carrega completamente
Então a hero section é exibida imediatamente
E o headline contém "Aumente suas vendas diretas sem pagar comissão"
E existe badge "Zero comissão nos seus pedidos"
E existe um subtítulo explicativo abaixo do headline

@integration-test="tests/integration/landing.test.ts"
Cenário: Três pilares exibidos corretamente

Dado que o visitante está na landing page
Quando ele rola a página até a seção de pilares
Então exatamente três cards/pílares são exibidos
E os pilares são: Setup em 2 minutos, Zero comissão, WhatsApp nativo

@integration-test="tests/integration/landing.test.ts"
Cenário: Pilares respondem objeções específicas

Dado que o visitante visualiza a seção de pilares
Quando ele lê o conteúdo
Então um pilar menciona "setup" ou "minutos" (rapidez)
E um pilar menciona "zero comissão" (custo)
E um pilar menciona "WhatsApp" (compatibilidade)

@integration-test="tests/integration/landing.test.ts"
Cenário: Contador de restaurantes exibido (>2.000)

Dado que o visitante acessa a landing page
Quando ele rola até a seção de prova social
Então um contador numérico é exibido com valor maior que 2.000

@integration-test="tests/integration/landing.test.ts"
Cenário: Logos de parceiros visíveis (≥3)

Dado que o visitante está na seção de prova social
Quando ele visualiza os elementos
Então pelo menos 3 logos de parceiros/marcas são exibidos

@integration-test="tests/integration/landing.test.ts"
Cenário: Depoimento em vídeo disponível

Dado que o visitante está na seção de prova social
Quando ele visualiza os depoimentos
Então pelo menos um card de depoimento possui thumbnail de vídeo
E o card indica "Depoimento em vídeo"

@integration-test="tests/integration/landing.test.ts"
Cenário: Modal de vídeo abre ao clicar

Dado que o visitante clicou no card de depoimento em vídeo
Quando a ação de clique é executada
Então um modal é aberto com o player de vídeo
E o modal contém botão para fechar

@integration-test="tests/integration/landing.test.ts"
Cenário: Três planos exibidos com preços

Dado que o visitante rola até a seção de preços
Quando ele visualiza os cards de planos
Então exatamente três planos são exibidos: Start, Crescer, Escalar
E o plano Start tem preço R$0
E o plano Crescer tem preço R$49/mês
E o plano Escalar tem preço R$149/mês

@integration-test="tests/integration/landing.test.ts"
Cenário: CTA final com urgência e teste grátis 14 dias

Dado que o visitante está no final da landing page
Quando ele visualiza a seção de CTA final
Então um botão de CTA grande é exibido
E o texto do botão contém "Teste grátis" e "14 dias"
E existe elemento de urgência adicional

@integration-test="tests/integration/landing.test.ts"
Cenário: Formulário de lead capture visível

Dado que o visitante está na seção de CTA final
Quando ele interage com o formulário
Então o formulário contém campos para: nome, email, WhatsApp
E existe um botão de envio

@integration-test="tests/integration/landing.test.ts"
Cenário: Página não tem menu de navegação header

Dado que o visitante acessa a landing page
Quando ele observa o header
Então não existe menu de navegação principal com links do topo
E a página mantém foco no CTA principal
