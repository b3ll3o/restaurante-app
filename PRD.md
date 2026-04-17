# PRD: Página Inicial do App de Cardápio Online para Restaurantes

**Status:** Rascunho
**Autor:** Time de Produto
**Data:** 2026-04-17
**Última Revisão:** 2026-04-17
**Versão:** 2.0

## 0. Objetivos de Negócio

- **Objetivo 1:** Aumentar a taxa de conversão de visitantes (donos de restaurantes) em leads qualificados em 25% nos primeiros 3 meses.
- **Objetivo 2:** Reduzir o ciclo de vendas, permitindo que o restaurante entenda o valor do SaaS em menos de 30 segundos de visita.
- **Objetivo 3:** Estabelecer confiança e credibilidade através de prova social, demonstração visual e proposta de valor clara (zero comissão, setup rápido).

## 1. Problema

Donos de restaurantes visitam a página inicial do app, mas não se convencem a contratar porque:
- A proposta de valor não fala diretamente às suas dores (comissões altas, erros de pedido, complexidade de implementação).
- A página não responde às principais objeções (vai dar trabalho? vai custar caro? funciona com o que já uso?).
- Falta prova social relevante (depoimentos, cases, números) que gere confiança.
- O preço e o plano não são claros ou estão escondidos.
- O CTA (chamada para ação) é fraco ou compete com outros links de navegação.

## 2. Oportunidade

A oportunidade é capturar restaurantes que estão insatisfeitos com comissões de marketplaces (iFood, Uber Eats) ou que ainda usam cardápios físicos/PDF, perdendo vendas e eficiência. Ao projetar uma página inicial que:
- Comunique em segundos “aumente vendas diretas sem comissão”
- Mostre visualmente como o app funciona (QR Code, pedido direto para a cozinha)
- Exiba depoimentos em vídeo de donos reais
- Ofereça teste gratuito com baixo risco

…o SaaS pode converter um percentual significativamente maior do tráfego orgânico e pago.

## 3. Personas e Stakeholders

### 3.1 Personas Primárias

- **Persona 1:** Carlos, dono de restaurante de médio porte
  - Perfil: 35-50 anos, opera restaurante com 15-30 funcionários, vende por delivery e balcão. Paga ~28% de comissão ao iFood. Tem pouco tempo para aprender tecnologia.
  - Necessidades: Reduzir custos, manter controle do estoque, evitar erros de pedido, ter um sistema simples e confiável.

- **Persona 2:** Mariana, gerente de food truck
  - Perfil: 28-40 anos, opera food truck com 3-5 funcionários, alta rotatividade de cardápio. Usa WhatsApp para pedidos.
  - Necessidades: Atualizar cardápio rapidamente, receber pedidos organizados, não perder vendas por falta de visualização.

### 3.2 Stakeholders Impactados

- Time de marketing (precisa da página para campanhas)
- Time de vendas (precisa de leads qualificados)
- Desenvolvedores front-end (implementam a página)
- Designer de produto (UX/UI)
- Donos de restaurantes (usuários finais)

## 4. Resultado Esperado (Alto Nível)

Uma landing page de alta conversão que leva o visitante a agendar uma demonstração ou iniciar um teste gratuito. A página deve ser responsiva (mobile-first), carregar em menos de 2 segundos e seguir a estrutura definida na seção de backlog.

### 4.1 Fora do Escopo

- Blog, área “Sobre nós”, página de suporte ou FAQ completo (links mínimos apenas no rodapé)
- Integração com gateways de pagamento na página inicial (apenas CTA para teste/demo)
- Sistema de login/área do cliente (será outra página)
- Personalização avançada por tipo de restaurante (versão única para todos inicialmente)

## 5. Critérios de Sucesso

### 5.1 Critérios de Aceitação do Produto (Checklist)

- [ ] **CRIT-01:** A hero section contém headline com “zero comissão” ou “aumente vendas diretas”.
- [ ] **CRIT-02:** Existem três bullet points respondendo objeções principais (setup rápido, sem comissão, integra com POS/WhatsApp).
- [ ] **CRIT-03:** O formulário de lead (ou botão CTA) está visível sem necessidade de rolagem (acima da dobra).
- [ ] **CRIT-04:** Existe uma seção de prova social com contador de clientes (+X restaurantes) e logos de marcas conhecidas.
- [ ] **CRIT-05:** Há pelo menos um depoimento em vídeo de dono de restaurante real.
- [ ] **CRIT-06:** A página contém uma demonstração visual (GIF, mockup ou tour interativo) do app funcionando.
- [ ] **CRIT-07:** Os planos de preço são exibidos de forma clara, separados por estágio do restaurante (Start / Crescer / Escalar).
- [ ] **CRIT-08:** O CTA final repete o botão principal e inclui elemento de urgência (teste grátis de 14 dias, 1 mês grátis no plano anual).
- [ ] **CRIT-09:** A página não possui menu de navegação que desvie o foco (apenas links de rodapé essenciais).
- [ ] **CRIT-10:** A página é totalmente responsiva e testada em dispositivos móveis (Chrome, Safari, Android).

### 5.2 Métricas de Sucesso (KPIs)

- **KPI-01:** Taxa de conversão (visitante → lead = preenchimento de formulário ou clique em “teste grátis”) ≥ 5% nos primeiros 30 dias.
- **KPI-02:** Tempo médio de carregamento da página (LCP) < 2,5 segundos.
- **KPI-03:** Taxa de rejeição (bounce rate) < 40%.
- **KPI-04:** Percentual de leads que agendam demonstração após preencher formulário ≥ 30%.

## 6. Backlog Inicial (Épicos e Histórias de Usuário)

### Épico 1: Estrutura e Conteúdo da Página Inicial

- **História 1.1:** Como um dono de restaurante, eu quero ver na primeira tela uma proposta clara de aumento de vendas sem comissão para que eu decida continuar lendo.
  - *Critérios de Aceitação:*
    - **Dado** que o usuário acessa a página, **Quando** ele visualiza a hero section, **Então** ele vê uma headline com “Aumente suas vendas diretas sem pagar comissão” e um subtítulo explicativo.
    - **Dado** que o usuário está na hero, **Quando** ele procura o CTA, **Então** o botão “Começar teste gratuito” está laranja/vermelho e visível sem rolagem.

- **História 1.2:** Como um dono de restaurante cético, eu quero ver respostas diretas para minhas objeções (setup, custo, integração) para confiar na solução.
  - *Critérios de Aceitação:*
    - **Dado** que o usuário rola a página, **Quando** ele encontra a seção de três pilares, **Então** cada pilar tem um ícone, um título curto (ex: “Setup em minutos”) e uma frase de benefício.

### Épico 2: Prova Social e Demonstração

- **História 2.1:** Como um visitante, eu quero ver que outros restaurantes já usam o app para me sentir seguro em contratar.
  - *Critérios de Aceitação:*
    - **Dado** que o usuário acessa a página, **Quando** ele rola até o meio, **Então** existe um contador dinâmico mostrando “+2.500 restaurantes” e logos de parceiros.
    - **Dado** que o usuário clica no depoimento em vídeo, **Então** um modal abre com o vídeo de um dono real falando.

- **História 2.2:** Como um dono de restaurante prático, eu quero ver o app funcionando antes de testar para saber se é fácil de usar.
  - *Critérios de Aceitação:*
    - **Dado** que o usuário está na seção de demonstração, **Quando** ele vê o mockup do celular, **Então** um GIF ou vídeo curto mostra o fluxo: cliente escaneia QR Code → vê cardápio → faz pedido → cozinha recebe.
    - **Dado** que a página é carregada em desktop, **Quando** o usuário passa o mouse sobre o mockup, **Então** o vídeo inicia automaticamente.

### Épico 3: Planos e Chamada Final

- **História 3.1:** Como um dono de restaurante, eu quero ver preços claros e transparentes para decidir se cabe no meu orçamento.
  - *Critérios de Aceitação:*
    - **Dado** que o usuário rola até a seção de planos, **Quando** ele visualiza os cards, **Então** cada plano tem nome por estágio (Start / Crescer / Escalar), preço mensal e lista de recursos principais.
    - **Dado** que o usuário está indeciso, **Quando** ele clica em “Comparar planos”, **Então** uma tabela comparativa é exibida (ou modal).

- **História 3.2:** Como um visitante pronto para contratar, eu quero um CTA final com urgência para não adiar a decisão.
  - *Critérios de Aceitação:*
    - **Dado** que o usuário está no final da página, **Quando** ele vê o botão de CTA repetido, **Então** o botão tem texto como “Teste grátis por 14 dias – Cancele a qualquer momento” e um elemento de urgência (ex: “Ative hoje e ganhe 1 mês grátis”).
    - **Dado** que o usuário clica no CTA, **Então** ele é direcionado para um formulário curto de cadastro (apenas nome, e-mail, telefone, nome do restaurante).

## 7. Análise Inicial

### 7.1 Viabilidade Técnica

- [X] Viável com arquitetura atual? Sim, página estática com HTML/CSS/JS e integração com formulário (CRM ou ferramenta de leads).
- [X] Módulos/Serviços afetados? Landing page standalone; pode usar CDN, analytics, vídeo hospedado.
- [X] Débitos técnicos bloqueantes? Nenhum, desde que haja designer e desenvolvedor front-end.

### 7.2 Impacto Estimado

- [X] Breaking changes? Não, é uma nova página.
- [X] Migração necessária? Não.
- [X] Novos dependencies? Player de vídeo (ex: YouTube/Vimeo), biblioteca de animação (opcional).

### 7.3 Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
| :--- | :--- | :--- | :--- |
| A página não converte por mensagem fraca | Média | Alto | Realizar testes A/B de headline e CTAs antes do lançamento |
| Vídeos de depoimento não estão disponíveis | Alta | Médio | Usar depoimentos textuais com foto e avaliações estrela como fallback |
| Carregamento lento em dispositivos móveis | Baixa | Alto | Otimizar imagens (WebP, lazy loading), usar CDN |
| Donos não preenchem formulário por desconfiança | Média | Médio | Garantir selo de segurança e política de privacidade no rodapé |

### 7.4 Dependências Externas

- Hospedagem da página (Vercel, Netlify, próprio servidor)
- Serviço de captura de leads (HubSpot, Typeform, Google Forms ou integração com CRM)
- Aprovação legal: termos de uso e política de privacidade
- Fornecimento de logos de clientes parceiros e depoimentos (time de marketing)

## 8. Urgência e Justificativa

- [X] **Alta** - Alto impacto no negócio
- **Justificativa:** O time de marketing planeja campanhas pagas (Google Ads, Instagram) para as próximas 4 semanas. Sem uma página inicial otimizada, o custo por lead será muito alto e a conversão baixa, desperdiçando orçamento e atrasando a aquisição de clientes. Além disso, concorrentes diretos (iFood, GloriaFood) já possuem landing pages agressivas.

## 9. Instruções para Orquestração de Agentes (se aplicável)

- **Comando de Início:** `npm run dev` ou `yarn start` (para ambiente de desenvolvimento da landing page)
- **Pipeline Esperado:** Design → Revisão UX → Implementação HTML/CSS/JS → Testes responsivos → A/B test (otimização)
- **Contexto Obrigatório:** Este PRD, arquivos de design (Figma), copywriting aprovado, assets de imagens/vídeos
- **Práticas Obrigatórias:** INVEST para histórias, TDD para componentes interativos (ex: modal de vídeo), mobile-first

## 10. Definição de Pronto (DoR e DoD)

### 10.1 Definition of Ready (DoR)

Uma história está "pronta" quando:

- [ ] Formato: "Como um [ator], eu quero [ação] para que [benefício]"
- [ ] Atende critérios INVEST (Independente, Negociável, Valiosa, Estimável, Pequena, Testável)
- [ ] Critérios de aceitação em Given-When-Then
- [ ] Estimada pelo time (ex: 3 pontos)
- [ ] Sem dependências bloqueantes

### 10.2 Definition of Done (DoD)

Uma tarefa está "pronta" quando:

- [ ] Código implementado e revisado por pelo menos outro membro do time
- [ ] Testes passando (testes manuais de navegadores e dispositivos)
- [ ] Cobertura >= 85% (quando aplicável a componentes JavaScript)
- [ ] Segue padrões em AGENTS.md (se houver)
- [ ] Documentação atualizada (README da landing page)
- [ ] Change arquivada no OpenSpec (ou sistema de versionamento)

## 11. Referências

- **Template PRD:** Este documento
- **Issues Relacionadas:** #LAND-01 (hero section), #LAND-02 (prova social), #LAND-03 (planos)
- **Documentação:** Guia de estilo da marca, personas (arquivo em anexo), pesquisa de concorrência (análise de iFood, GloriaFood, Craver)