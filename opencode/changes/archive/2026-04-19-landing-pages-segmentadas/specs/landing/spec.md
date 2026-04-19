# Delta for Landing Pages Segmentadas

## ADDED Requirements

### Requirement: REQ-LP-001 - Landing Page de Pizzaria

O sistema **DEVE** disponibilizar uma landing page segmentada para pizzarias em `/landing/pizzaria` que seja acessível pubblicamente.

#### Cenário: Acesso à landing page de pizzaria
- **GIVEN** um usuário acessa `/landing/pizzaria`
- **WHEN** a página carrega completamente
- **THEN** o sistema **DEVE** exibir hero, benefícios, prova social e features específicas para pizzarias artesanais

#### Cenário: Hero segmentado para pizzaria
- **GIVEN** um usuário está na landing page de pizzaria
- **WHEN** a página carrega
- **THEN** o hero **DEVE** conter headline focado em "entrega via iFood, WhatsApp e cardápio digital sem comissão"

#### Cenário: CTA com UTM para pizzaria
- **GIVEN** um usuário está na landing page de pizzaria
- **WHEN** clica no CTA principal
- **THEN** o sistema **DEVE** redirecionar para `/signup?ut utm_source=landing&utm_content=pizzaria`

---

### Requirement: REQ-LP-002 - Landing Page de Hamburgueria

O sistema **DEVE** disponibilizar uma landing page segmentada para hamburguerias boutique em `/landing/hamburgueria` que seja acessível pubblicamente.

#### Cenário: Acesso à landing page de hamburgueria
- **GIVEN** um usuário acessa `/landing/hamburgueria`
- **WHEN** a página carrega completamente
- **THEN** o sistema **DEVE** exibir hero, benefícios, prova social e features específicas para hamburguerias boutique

#### Cenário: Hero segmentado para hamburgueria
- **GIVEN** um usuário está na landing page de hamburgueria
- **WHEN** a página carrega
- **THEN** o hero **DEVE** conter headline focado em "cardápio visual com QR code para pedidos direto na mesa"

#### Cenário: CTA com UTM para hamburgueria
- **GIVEN** um usuário está na landing page de hamburgueria
- **WHEN** clica no CTA principal
- **THEN** o sistema **DEVE** redirecionar para `/signup?ut utm_source=landing&utm_content=hamburgueria`

---

### Requirement: REQ-LP-003 - Landing Page de Bar

O sistema **DEVE** disponibilizar uma landing page segmentada para bares em `/landing/bar` que seja acessível pubblicamente.

#### Cenário: Acesso à landing page de bar
- **GIVEN** um usuário acessa `/landing/bar`
- **WHEN** a página carrega completamente
- **THEN** o sistema **DEVE** exibir hero, benefícios, prova social e features específicas para bares

#### Cenário: Hero segmentado para bar
- **GIVEN** um usuário está na landing page de bar
- **WHEN** a página carrega
- **THEN** o hero **DEVE** conter headline focado em "controle de comanda individual e divisão de conta por pessoa"

#### Cenário: CTA com UTM para bar
- **GIVEN** um usuário está na landing page de bar
- **WHEN** clica no CTA principal
- **THEN** o sistema **DEVE** redirecionar para `/signup?ut utm_source=landing&utm_content=bar`

---

### Requirement: REQ-LP-004 - Landing Page de Restaurante

O sistema **DEVE** disponibilizar uma landing page segmentada para restaurantes à la carte em `/landing/restaurante` que seja acessível pubblicamente.

#### Cenário: Acesso à landing page de restaurante
- **GIVEN** um usuário acessa `/landing/restaurante`
- **WHEN** a página carrega completamente
- **THEN** o sistema **DEVE** exibir hero, benefícios, prova social e features específicas para restaurantes fine dining

#### Cenário: Hero segmentado para restaurante
- **GIVEN** um usuário está na landing page de restaurante
- **WHEN** a página carrega
- **THEN** o hero **DEVE** conter headline focado em "reservas online e carta de vinhos digital"

#### Cenário: CTA com UTM para restaurante
- **GIVEN** um usuário está na landing page de restaurante
- **WHEN** clica no CTA principal
- **THEN** o sistema **DEVE** redirecionar para `/signup?ut utm_source=landing&utm_content=restaurante`

---

### Requirement: REQ-LP-005 - Componentes Reutilizáveis com Props Segmentadas

O sistema **DEVE** utilizar componentes compartilhados em `app/components/landing/` com props personalizadas por segmento.

#### Cenário: HeroSection aceita props de segmento
- **GIVEN** o componente `HeroSection` é renderizado
- **WHEN** recebe props com `segment: "pizzaria"`
- **THEN** o sistema **DEVE** exibir headline e benefícios específicos para pizzaria

#### Cenário: SocialProofSection aceita casos por segmento
- **GIVEN** o componente `SocialProofSection` é renderizado
- **WHEN** recebe props com `segment: "hamburgueria"`
- **THEN** o sistema **DEVE** exibir casos de sucesso de hamburguerias

#### Cenário: PillarsSection aceita features por segmento
- **GIVEN** o componente `PillarsSection` é renderizado
- **WHEN** recebe props com `segment: "bar"`
- **THEN** o sistema **DEVE** exibir features específicas para bares

#### Cenário: CTASection aceita UTM por segmento
- **GIVEN** o componente `CTASection` é renderizado
- **WHEN** recebe props com `segment: "restaurante"`
- **THEN** o sistema **DEVE** gerar URL com `utm_source=landing&utm_content=restaurante`

---

### Requirement: REQ-LP-006 - Tracking Analytics com Segmento

O sistema **DEVE** disparar evento `page_view` com tag `segment` em cada landing page segmentada.

#### Cenário: Evento page_view com segment para pizzaria
- **GIVEN** um usuário acessa `/landing/pizzaria`
- **WHEN** a página carrega completamente
- **THEN** o sistema **DEVE** disparar `analytics.page_view({ segment: 'pizzaria' })`

#### Cenário: Evento page_view com segment para hamburgueria
- **GIVEN** um usuário acessa `/landing/hamburgueria`
- **WHEN** a página carrega completamente
- **THEN** o sistema **DEVE** disparar `analytics.page_view({ segment: 'hamburgueria' })`

#### Cenário: Evento page_view com segment para bar
- **GIVEN** um usuário acessa `/landing/bar`
- **WHEN** a página carrega completamente
- **THEN** o sistema **DEVE** disparar `analytics.page_view({ segment: 'bar' })`

#### Cenário: Evento page_view com segment para restaurante
- **GIVEN** um usuário acessa `/landing/restaurante`
- **WHEN** a página carrega completamente
- **THEN** o sistema **DEVE** disparar `analytics.page_view({ segment: 'restaurante' })`

---

### Requirement: REQ-LP-007 - Build e Lint Sem Erros

As landing pages segmentadas **DEVEM** permitir que `npm run build` e `npm run lint` passem sem erros.

#### Cenário: Build passa com landing pages
- **GIVEN** o projeto MenuLink contém 4 landing pages segmentadas
- **WHEN** executa `npm run build`
- **THEN** o build **DEVE** completar sem erros de compilação

#### Cenário: Lint passa com landing pages
- **GIVEN** o projeto MenuLink contém 4 landing pages segmentadas
- **WHEN** executa `npm run lint`
- **THEN** o lint **DEVE** passar sem novos erros

---

## MODIFIED Requirements

Nenhum requisito existente foi modificado por esta mudança.

---

## REMOVED Requirements

Nenhum requisito existente foi removido por esta mudança.

---

## Critérios de Aceitação (CA-XXX)

### CA-LP-01: 4 landing pages criadas e acessíveis

O sistema **DEVE** ter 4 landing pages segmentadas funcionais:
- `/landing/pizzaria`
- `/landing/hamburgueria`
- `/landing/bar`
- `/landing/restaurante`

**Evidência**: Cenários REQ-LP-001 a REQ-LP-004

### CA-LP-02: Cada página possui conteúdo segmentado

Cada landing page **DEVE** conter:
- Hero com headline específico do segmento
- Seção de benefícios (3-5 itens)
- Prova social com cases do segmento
- Features/pillars específicas do segmento

**Evidência**: Cenários REQ-LP-001 a REQ-LP-004, REQ-LP-005

### CA-LP-03: CTAs com UTM correto

Cada CTA **DEVE** conter parâmetros UTM:
- `utm_source=landing`
- `utm_content={segmento}`

**Evidência**: Cenários REQ-LP-001.3 a REQ-LP-004.3

### CA-LP-04: Build passa sem erros

`npm run build` **DEVE** completar com sucesso.

**Evidência**: Cenário REQ-LP-007.1

### CA-LP-05: Lint passa sem erros

`npm run lint` **DEVE** passar sem novos erros.

**Evidência**: Cenário REQ-LP-007.2

### CA-LP-06: Evento page_view com segment tag

Cada landing page **DEVE** disparar `analytics.page_view({ segment: '{segmento}' })`.

**Evidência**: Cenários REQ-LP-006.1 a REQ-LP-006.4

---

## Gherkin - Funcionalidade: Landing Pages Segmentadas

```gherkin
@integration-test="tests/integration/landing-pages.test.ts"
Funcionalidade: Landing Pages Segmentadas

  Cenário: Usuário acessa landing page de pizzaria
    Dado que o usuário acessa "/landing/pizzaria"
    Quando a página carrega completamente
    Então o sistema deve exibir headline sobre "entrega via iFood, WhatsApp e cardápio digital sem comissão"
    E o CTA deve redirecionar para "/signup?utm_source=landing&utm_content=pizzaria"
    E o analytics deve disparar "page_view" com segment "pizzaria"

  Cenário: Usuário acessa landing page de hamburgueria
    Dado que o usuário acessa "/landing/hamburgueria"
    Quando a página carrega completamente
    Então o sistema deve exibir headline sobre "cardápio visual com QR code para pedidos direto na mesa"
    E o CTA deve redirecionar para "/signup?utm_source=landing&utm_content=hamburgueria"
    E o analytics deve disparar "page_view" com segment "hamburgueria"

  Cenário: Usuário acessa landing page de bar
    Dado que o usuário acessa "/landing/bar"
    Quando a página carrega completamente
    Então o sistema deve exibir headline sobre "controle de comanda individual e divisão de conta por pessoa"
    E o CTA deve redirecionar para "/signup?utm_source=landing&utm_content=bar"
    E o analytics deve disparar "page_view" com segment "bar"

  Cenário: Usuário acessa landing page de restaurante
    Dado que o usuário acessa "/landing/restaurante"
    Quando a página carrega completamente
    Então o sistema deve exibir headline sobre "reservas online e carta de vinhos digital"
    E o CTA deve redirecionar para "/signup?utm_source=landing&utm_content=restaurante"
    E o analytics deve disparar "page_view" com segment "restaurante"
```

---

## Dependências

| Módulo | Tipo | Descrição |
|--------|------|----------|
| `app/landing/{segment}/page.tsx` | Criar | Rotas estáticas para cada segmento |
| `app/components/landing/*` | Modificar | Props aceitando parâmetros de segmento |
| `lib/analytics.ts` | Modificar | Função page_view com parâmetro segment |

---

## Fora do Escopo

- Sistema de reservas
- Integração com iFood/delivery
- Framework de A/B testing
- Landing page para food trucks
- Landing pages em outros idiomas
- Alteração ou remoção da homepage existente
- Autenticação ou área protegida nas landing pages

---

**Versão:** 1.0
**Última Atualização:** 2026-04-17
**Autor:** AI Agent
**Change:** landing-pages-segmentadas
