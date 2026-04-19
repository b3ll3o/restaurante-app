# Design: Evolução do Fluxo de Desenvolvimento com Qualidade Integrada

## Technical Approach

A mudança consiste em evoluir o workflow SDD do MenuLink para incorporar práticas de qualidade (TDD, BDD, ATDD, DDD) desde a fase de design, adicionar uma etapa inicial de concepção (PRD.md), e garantir atualização obrigatória de documentação dos módulos afetados.

### Arquitetura da Solução

```
Fluxo Atual:
proposal → spec → design → tasks → implementation → verification → archive

Fluxo Proposto:
PRD.md → Análise → proposal → spec → design → tasks → implementation → verification → archive
```

---

## Descrição Detalhada das Etapas do Fluxo SDD

### Etapa 1: PRD.md (Product Requirements Document)

**Objetivo**: Capturar a essência da ideia, o problema ou oportunidade identificada.

**Responsável**: Product Owner / Tech Lead / Equipe

**Entrada**: Necessidade de negócio identificada

**Atividades**:
1. Descrever o problema/oportunidade de forma concisa
2. Identificar o público-alvo impactado
3. Definir resultado esperado de alto nível (sem detalhamento técnico)
4. Estabelecer critérios de sucesso preliminares
5. Classificar urgência (Crítica/Alta/Média/Baixa)

**Saída**: Documento `PRD.md` com:
- Título da iniciativa
- Descrição do problema/oportunidade
- Público-alvo impactado
- Resultado esperado de alto nível
- Critérios de sucesso preliminares
- Classificação de urgência

**Exemplo**:
```markdown
# PRD: Adicionar Notificação Push

## Problema
Clientes não são notificados quando o status do pedido muda.

## Público-Alvo
Clientes do restaurante que fazem pedidos pelo cardápio digital.

## Resultado Esperado
Aumentar satisfação do cliente com transparência sobre status do pedido.

## Critérios de Sucesso
- [ ] Notificação enviada em até 5 segundos após mudança de status
- [ ] Taxa de entrega > 95%
```

---

### Etapa 2: Análise (PRD.md + Codebase)

**Objetivo**: Confrontar a ideia do PRD.md com a realidade atual da aplicação.

**Responsável**: Tech Lead / Arquiteto

**Entrada**: PRD.md aprovado, PRD.md existente, codebase

**Atividades**:
1. Ler PRD.md (Product Requirement Document) existente
2. Analisar codebase atual e arquitetura
3. Avaliar viabilidade técnica
4. Identificar módulos/serviços afetados
5. Identificar dependências e débitos técnicos bloqueantes
6. Documentar síntese da análise

**Saída**: Síntese de análise respondendo:
- A ideia é viável com a arquitetura atual?
- Quais módulos/serviços serão afetados?
- Existem dependências ou débitos técnicos bloqueantes?
- Impacto estimado (breaking changes, migração, novos dependencies)?

**Exemplo de Síntese**:
```markdown
## Análise de Viabilidade

### Viabilidade Técnica
- ✅ Viável com arquitetura atual
- ✅ Supabase já possui suporte a triggers para notificações
- ⚠️ Necessário criar serviço de push (FCM ou Supabase Edge Functions)

### Módulos Afetados
- `app/api/orders/` -需要 adicionar trigger de notificação
- `lib/notifications/` - Novo módulo a ser criado
- `context/notification-context.tsx` - Novo contexto

### Débitos Técnicos
- Nenhum bloqueante

### Impacto
- [ ] Breaking changes: Não
- [ ] Migração necessária: Não
- [ ] Novos dependencies: @supabase/edge-functions
```

---

### Etapa 3: proposal.md (Proposta Formal)

**Objetivo**: Formalizar a intenção de desenvolvimento enriquecida com contexto.

**Responsável**: Tech Lead / Equipe

**Entrada**: PRD.md, Análise, PRD.md

**Atividades**:
1. Criar `proposal.md` seguindo template
2. Referenciar PRD.md e análise realizada
3. Definir scope (in/out)
4. Identificar riscos e mitigações
5. Definir critérios de sucesso

**Saída**: Documento `proposal.md` com:
- Intent (propósito)
- Scope (in/out)
- Approach (abordagem)
- Affected Areas (áreas afetadas)
- Risks (riscos)
- Rollback Plan (plano de rollback)
- Success Criteria (critérios de sucesso)

---

### Etapa 4: spec.md (Especificação Formal)

**Objetivo**: Transformar proposta em requisitos testáveis usando RFC 2119.

**Responsável**: Tech Lead / Product Owner

**Entrada**: proposal.md aprovado

**Atividades**:
1. Escrever requisitos usando palavras-chave RFC 2119 (MUST, SHOULD, MAY)
2. Criar cenários Given/When/Then para cada requisito
3. Definir critérios de aceitação (CA-XXX)
4. Garantir que todo requisito seja testável

**Saída**: Documento `spec.md` com:
- Requisitos numerados (REQ-XXX)
- Cenários Gherkin para cada requisito
- Critérios de aceitação (CA-XXX)

**Exemplo**:
```markdown
### REQ-NP-001: Notificação Push ao Confirmar Pedido

O sistema DEVE enviar notificação push ao cliente quando o status do pedido mudar para "confirmed".

#### Cenário: Notificação enviada ao confirmar
- **GIVEN** um pedido com status "pending"
- **WHEN** o admin clica em "Confirmar"
- **THEN** o sistema DEVE enviar notificação push para o cliente
- **AND** a notificação DEVE conter: nome do restaurante, status, tempo estimado
```

---

### Etapa 5: design.md (Design Técnico com Qualidade)

**Objetivo**: Detalhar a solução técnica com estratégia de qualidade integrada.

**Responsável**: Tech Lead / Arquiteto

**Entrada**: spec.md aprovada

**Atividades**:
1. Documentar decisões de arquitetura (com rationale)
2. Definir estratégia de testes (TDD/BDD/ATDD/DDD)
3. Criar diagramas de fluxo e estrutura
4. Mapear file changes (criar/modificar/deletar)
5. Definir interfaces e contratos
6. Documentar estratégia de migração/rollback

**Saída**: Documento `design.md` com seções obrigatórias:

#### 5.1 TDD (Test-Driven Development)
- Cobertura mínima obrigatória (80% linhas, 100% branches críticos)
- Ferramentas (Vitest)
- Estratégia de Mock/Stub

#### 5.2 BDD (Behavior-Driven Development)
- Cenários Gherkin (arquivos .feature)
- Ferramenta (Playwright)
- Cobertura E2E (100% fluxos críticos)
- **Localização**: Arquivos `.feature` no nível do módulo

#### 5.3 ATDD (Acceptance Test-Driven Development)
- Critérios de aceitação por tarefa
- Checklist QA (testes exploratórios, segurança, performance)

#### 5.4 DDD (Domain-Driven Design)
- Bounded Context
- Agregados, Entidades, Value Objects
- Linguagem Ubíqua

---

### Etapa 6: tasks.md (Decomposição DDD)

**Objetivo**: Gerar checklist de tarefas a partir do design orientado a DDD.

**Responsável**: Tech Lead / Equipe

**Entrada**: design.md aprovado

**Atividades**:
1. Decompor em tarefas por camada DDD
2. Estruturar em fases (Infraestrutura, Domínio, Aplicação, Infraestrutura, Interface, Documentação)
3. Definir critérios de conclusão (código + testes + documentação)

**Saída**: Documento `tasks.md` com estrutura:

```markdown
### Fase 1: Infraestrutura de Testes
- [ ] 1.1: Configurar suíte de testes com cobertura mínima de 80%
- [ ] 1.2: Criar steps definitions para cenário BDD

### Fase 2: Domínio (DDD)
- [ ] 2.1: Implementar Agregado `Notificacao` com regras de negócio
- [ ] 2.2: Implementar Entidade `PushToken`

### Fase 3: Aplicação (Casos de Uso)
- [ ] 3.1: Implementar Caso de Uso `EnviarNotificacaoPedido`

### Fase 4: Infraestrutura
- [ ] 4.1: Implementar Repositório `NotificacaoRepository`
- [ ] 4.2: Integrar com FCM/APNS

### Fase 5: Interface
- [ ] 5.1: Expor endpoint REST `/notifications`
- [ ] 5.2: Criar componente `NotificationBanner`

### Fase 6: Documentação
- [ ] 6.1: Criar `lib/notifications/AGENTS.md`
- [ ] 6.2: Criar `lib/notifications/notifications.feature`
```

**Critério de Conclusão**:
Uma tarefa só é `[x]` quando:
1. ✅ Código de produção escrito
2. ✅ Testes unitários/integração obrigatórios passam
3. ✅ Testes E2E referentes passam localmente
4. ✅ AGENTS.md do módulo atualizado com proximidade
5. ✅ Cenários BDD criados com tag `@integration-test`

---

### Etapa 7: implementation (Implementação)

**Objetivo**: Implementar código seguindo tasks.md e specs.

**Responsável**: Equipe de Desenvolvimento

**Entrada**: tasks.md, spec.md, design.md

**Atividades**:
1. Implementar código seguindo ordem das tarefas
2. Escrever testes antes do código (TDD)
3. Executar testes frequentemente
4. Manter cobertura ≥80%
5. Atualizar documentação em paralelo

**Saída**:
- Código implementado
- Testes passando
- Documentação atualizada

---

### Etapa 8: verification (Verificação Completa)

**Objetivo**: Verificar código E documentação antes de archivar.

**Responsável**: Tech Lead / QA

**Entrada**: implementation completa

**Atividades**:

#### 8.1 Verificação de Código
- Build passa sem erros
- Lint passa sem warnings
- Testes passam (unitários, integração, E2E)
- Cobertura ≥80%

#### 8.2 Verificação de Documentação
- AGENTS.md existe no nível mais próximo do elemento
- AGENTS.md do módulo/pai está atualizado
- Cenários BDD têm tag `@integration-test`
- Arquivos `.feature` estão no nível correto (proximidade)

#### 8.3 Correção de Documentação (se necessário)
- Se AGENTS.md faltando: criar
- Se BDD fora do nível: mover
- Se tag faltando: adicionar

#### 8.4 Compliance Report
- Mapear cada requisito (REQ-XXX) à evidência
- Mapear cada critério de aceitação (CA-XXX) à evidência
- Documentar issues encontrados

**Saída**: Documento `verify-report.md` com:
- Completeness (artefatos criados)
- Build and Test Evidence
- Compliance Matrix (REQ-XXX → evidência)
- Design Coherence
- Issues Found
- Verdict (PASS/PASS WITH WARNINGS/FAIL)

---

### Etapa 9: archive (Arquivamento)

**Objetivo**: Consolidar mudanças e arquivar artefatos.

**Responsável**: Tech Lead

**Entrada**: verify-report.md com PASS

**Atividades**:
1. Mover artefatos para `.openspec/changes/archive/{data}/{change-name}/`
2. Consolidar mudanças nas specs principais (se aplicável)
3. Atualizar changelog
4. Criar archive-report.md com resumo

**Saída**:
- Diretório arquivado
- Archive report
- Specs principais atualizadas (se necessário)

---

## Fluxo Completo Visual

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FLUXO SDD MENULINK                                   │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌─────────┐    ┌─────────┐    ┌──────────┐    ┌────────┐    ┌──────────┐
  │ PRD.md  │───▶│ Análise │───▶│ proposal │───▶│ spec   │───▶│ design   │
  └─────────┘    └─────────┘    └──────────┘    └────────┘    └──────────┘
       │              │              │               │              │
       │         PRD.md +        RFC 2119      TDD/BDD/       TDD/BDD/
       │         Codebase        requisitos     ATDD/DDD      ATDD/DDD
       │              │              │               │              │
       ▼              ▼              ▼               ▼              ▼
  ┌─────────┐    ┌─────────┐    ┌──────────┐    ┌────────┐    ┌──────────┐
  │Concepção│    │Viabilid.│    │Formaliz. │    │Testável│    │Técnico   │
  │Inicial  │    │Técnica  │    │          │    │        │    │+ Qualidade│
  └─────────┘    └─────────┘    └──────────┘    └────────┘    └──────────┘

  ┌──────────┐    ┌──────────────────┐    ┌──────────────┐    ┌──────────┐
  │ tasks    │───▶│ implementation   │───▶│ verification │───▶│ archive  │
  └──────────┘    └──────────────────┘    └──────────────┘    └──────────┘
       │                  │                    │                  │
       │            Código +              Código +              Consolidado
       │            Testes +              Documentação           e Arquivado
       │            Documentação          = Compliance
       │                  │                    │
       ▼                  ▼                    ▼
  ┌──────────┐    ┌──────────────────┐    ┌──────────────┐
  │ DDD      │    │ Tarefas check    │    │ verify-      │
  │ Fases    │    │ quando código    │    │ report.md    │
  │          │    │ + testes + docs  │    │              │
  └──────────┘    │ passam           │    │ PASS ✅      │
                  └──────────────────┘    └──────────────┘

  verification = código + documentação (não é só código)
```

### Componentes a Criar/Modificar

1. **Template PRD.md** (novo) - `.openspec/templates/prd-template.md`
2. **Template design.md** (atualizado) - `.openspec/templates/design-template.md`
3. **Template tasks.md** (atualizado) - `.openspec/templates/tasks-template.md`
4. **Atualização do AGENTS.md principal** - fluxo de documentação
5. **Atualização de todos os AGENTS.md de módulos afetados**

---

## Architecture Decisions

### Decision: Adicionar etapa PRD.md como porta de entrada

**Choice**: PRD.md como documento inicial conciso antes do proposal.md

**Alternatives considered**:
- Manter proposal.md como primeiro artefato (descartado - não separa concepção de formalização)
- Começar diretamente pelo spec.md (descartado - falta análise de viabilidade)

**Rationale**: O PRD.md permite capturar a essência da ideia sem detalhar técnica. A análise posterior com PRD.md e codebase garante que a proposta seja fundamentada na realidade.

---

### Decision: Design.md com seções obrigatórias de qualidade

**Choice**: Seções de TDD, BDD, ATDD, DDD obrigatórias no design.md

**Alternatives considered**:
- Manter design.md livre de formato (descartado - inconsistência entre mudanças)
- Criar documentos separados para cada metodologia (descartado - fragmentação)

**Rationale**: Centralizar a estratégia de qualidade no design.md garante que ela seja revisada antes da implementação. A decomposição DDD no tasks.md deriva naturalmente do design.

---

### Decision: Cobertura mínima 80% unitários, 100% fluxos críticos E2E

**Choice**: 80% para unitários, 100% para fluxos críticos E2E

**Alternatives considered**:
- 70% unitários (descartado - insuficiente para garantir qualidade)
- 90% unitários (descartado - muito rigoroso para início de adoção)

**Rationale**: 80% é um padrão da indústria que equilibra qualidade e velocidade de desenvolvimento. 100% E2E para fluxos críticos garante que os caminhos mais importantes nunca falhem.

---

### Decision: Atualização de AGENTS.md como critério de conclusão

**Choice**: Atualização de documentação é parte do Definition of Done

**Alternatives considered**:
- Documentação opcional após implementação (descartado - documentação defasada)
- Revisão de documentação separada (descartado - dessincroniza código e docs)

**Rationale**: Se documentação não é atualizada junto com código, ela se torna inútil. Incluir no Definition of Done garante consistência.

---

### Decision: Documentação no nível mais próximo possível

**Choice**: AGENTS.md colocalizado com o código que documenta

**Alternatives considered**:
- AGENTS.md centralizado em nível de módulo (descartado - documentação distante do código)
- AGENTS.md apenas no nível raiz (descartado - documentação genérica)

**Rationale**: Documentação que vive junto ao código é mais fácil de manter, encontrar e atualizar. Segue o princípio "documentation near code".

---

### Decision: Documentação abrangente de todos os elementos

**Choice**: TODO elemento da arquitetura documentado (módulos, sub-módulos, rotas, classes, componentes, hooks, utilitários)

**Alternatives considered**:
- Apenas módulos de alto nível documentados (descartado - perde detalhes importantes)
- Apenas rotas documentadas (descartado - incompleto)

**Rationale**: Documentação máxima garante que qualquer desenvolvedor possa entender qualquer parte do sistema sem precisar ler código fonte.

---

### Decision: AGENTS.md no nível mais próximo (Proximidade)

**Choice**: Cada AGENTS.md fica no mesmo diretório do elemento que documenta

**Estrutura correta**:
```
app/admin/login/
├── page.tsx          ← Rota
└── AGENTS.md         ← Documentação junto à rota (NÍVEL CORRETO)

app/admin/
├── AGENTS.md         ← Visão geral do módulo admin (NÍVEL CORRETO)
└── login/
    ├── page.tsx
    └── AGENTS.md     ← Documentação específica da rota
```

**Alternatives considered**:
- AGENTS.md apenas no nível de módulo (descartado - documentação distante)
- AGENTS.md apenas no nível raiz (descartado - documentação genérica)

**Rationale**: Documentação colocalizada é mais fácil de manter, encontrar e atualizar. Segue o princípio "documentation near code".

---

### Decision: Arquivos BDD (.feature) com Proximidade

**Choice**: Arquivos `.feature` ficam no nível mais próximo do módulo que documentam

**Estrutura correta**:
```
app/admin/orders/
├── page.tsx              ← Rota de pedidos
├── AGENTS.md             ← Documentação da rota
└── orders.feature        ← Cenários BDD de pedidos (NÍVEL CORRETO)

app/admin/
├── AGENTS.md             ← Visão geral do módulo
└── orders/
    ├── page.tsx
    ├── AGENTS.md
    └── orders.feature    ← Cenários BDD específicos
```

**Alternatives considered**:
- Arquivos BDD centralizados em `tests/e2e/` (descartado - longe do domínio)
- Arquivos BDD apenas no nível raiz (descartado - genérico)

**Rationale**: Cenários BDD documentam comportamento de negócio, então devem estar perto do código que implementa esse comportamento.

---

### Decision: Link BDD ↔ Testes de Integração

**Choice**: Cada cenário BDD tem referência explícita ao teste de integração que o valida

**Formato de link**:
```gherkin
@integration-test="tests/integration/orders.test.ts"
Funcionalidade: Criação de Pedido
  Cenário: Cliente cria pedido com dados válidos
    Dado que o cliente está na página do cardápio
    ...
```

**Alternatives considered**:
- Link apenas na documentação (descartado - pode dessincronizar)
- Sem link (descartado - não garante rastreabilidade)

**Rationale**: Rastreabilidade entre cenário BDD e teste de integração garante que todo cenário tem teste e vice-versa.

---

## Data Flow

### Fluxo de uma Mudança

```
1. PRD.md criado (concepção)
   ↓
2. Análise com PRD.md + codebase
   - Viabilidade técnica?
   - Módulos afetados?
   - Débitos técnicos?
   ↓
3. proposal.md (formalização)
   ↓
4. spec.md (requisitos RFC 2119)
   ↓
5. design.md (TDD/BDD/ATDD/DDD)
   - Estratégia de testes definida
   - Modelagem DDD realizada
   ↓
6. tasks.md (decomposição DDD)
   - Infraestrutura de Testes
   - Domínio
   - Aplicação
   - Infraestrutura
   - Interface
   ↓
7. Implementation + Tests
   - Tarefas checkadas quando código + testes passam
   ↓
8. Verification
   - Compliance report
   ↓
9. Archive + Documentação atualizada
```

---

## File Changes

### Arquivos a Criar (Templates)

| Arquivo | Descrição |
|---------|-----------|
| `.openspec/templates/prd-template.md` | Template de PRD.md |
| `.openspec/templates/design-template.md` | Template atualizado de design.md com seções de qualidade |
| `.openspec/templates/tasks-template.md` | Template atualizado de tasks.md com decomposição DDD |

### Arquivos a Criar (AGENTS.md por Proximidade)

| Arquivo | Descrição |
|---------|-----------|
| `app/admin/login/AGENTS.md` | Documentação da rota de login |
| `app/admin/signup/AGENTS.md` | Documentação da rota de cadastro |
| `app/admin/dashboard/AGENTS.md` | Documentação do dashboard |
| `app/admin/categories/AGENTS.md` | Documentação de categorias |
| `app/admin/products/AGENTS.md` | Documentação de produtos |
| `app/admin/orders/AGENTS.md` | Documentação de pedidos |
| `app/admin/settings/AGENTS.md` | Documentação de configurações |
| `app/admin/auth/callback/AGENTS.md` | Documentação do callback auth |
| `app/menu/[slug]/AGENTS.md` | Documentação do cardápio público |
| `app/api/orders/AGENTS.md` | Documentação do endpoint de pedidos |
| `components/admin/header/AGENTS.md` | Documentação do Header |
| `components/admin/sidebar/AGENTS.md` | Documentação do Sidebar |
| `components/ui/button/AGENTS.md` | Documentação do Button |
| `components/ui/input/AGENTS.md` | Documentação do Input |
| `components/ui/card/AGENTS.md` | Documentação do Card |
| `context/cart-context/AGENTS.md` | Documentação do CartContext |
| `lib/supabase/client/AGENTS.md` | Documentação do cliente browser |
| `lib/supabase/server/AGENTS.md` | Documentação do cliente server |
| `lib/whatsapp/AGENTS.md` | Documentação do serviço WhatsApp |
| `lib/utils/AGENTS.md` | Documentação dos utilitários |
| `hooks/useAuth/AGENTS.md` | Documentação do useAuth |
| `hooks/useRestaurant/AGENTS.md` | Documentação do useRestaurant |
| `types/restaurant/AGENTS.md` | Documentação do tipo Restaurant |
| `types/category/AGENTS.md` | Documentação do tipo Category |
| `types/product/AGENTS.md` | Documentação do tipo Product |
| `types/order/AGENTS.md` | Documentação do tipo Order |
| `types/cart/AGENTS.md` | Documentação do tipo Cart |

### Arquivos BDD a Criar (Proximidade)

| Arquivo | Descrição |
|---------|-----------|
| `app/admin/login/login.feature` | Cenários BDD de autenticação |
| `app/admin/signup/signup.feature` | Cenários BDD de cadastro |
| `app/admin/dashboard/dashboard.feature` | Cenários BDD do dashboard |
| `app/admin/categories/categories.feature` | Cenários BDD de categorias |
| `app/admin/products/products.feature` | Cenários BDD de produtos |
| `app/admin/orders/orders.feature` | Cenários BDD de pedidos |
| `app/admin/settings/settings.feature` | Cenários BDD de configurações |
| `app/menu/[slug]/menu.feature` | Cenários BDD do cardápio público |
| `app/api/orders/orders.feature` | Cenários BDD da API de pedidos |

### Arquivos a Modificar

| Arquivo | Modificação |
|---------|-------------|
| `AGENTS.md` | Atualizar fluxo SDD para incluir PRD.md, análise e regra de proximidade |
| `.openspec/AGENTS.md` | Atualizar templates e workflow |
| `tests/AGENTS.md` | Atualizar para refletir nova estratégia de testes |
| `lib/AGENTS.md` | Atualizar - manter visão geral, não detalhamento |
| `app/AGENTS.md` | Atualizar - manter visão geral, não detalhamento |
| `app/admin/AGENTS.md` | Atualizar - manter visão geral, não detalhamento de rotas |
| `app/menu/AGENTS.md` | Atualizar - manter visão geral, não detalhamento |
| `app/api/AGENTS.md` | Atualizar - manter visão geral, não detalhamento |
| `components/AGENTS.md` | Atualizar - manter visão geral, não detalhamento |
| `components/admin/AGENTS.md` | Atualizar - manter visão geral, não detalhamento |
| `components/ui/AGENTS.md` | Atualizar - manter visão geral, não detalhamento |
| `context/AGENTS.md` | Atualizar - manter visão geral, não detalhamento |
| `hooks/AGENTS.md` | Atualizar - manter visão geral, não detalhamento |
| `types/AGENTS.md` | Atualizar - manter visão geral, não detalhamento |
| `supabase/AGENTS.md` | Atualizar - manter visão geral, não detalhamento |
| `lib/supabase/AGENTS.md` | Atualizar - manter visão geral, não detalhamento |

### Arquivos Não Afetados

- Schema do banco (sem mudança de dados)
- Código fonte de funcionalidades existentes
- Configurações de build/deploy

---

## Interfaces / Contratos

### Template PRD.md

```markdown
# PRD: [Título da Iniciativa]

## Problema/Oportunidade
[Descrição concisa do problema ou oportunidade]

## Público-Alvo Impactado
[Quem será afetado pela mudança]

## Resultado Esperado (Alto Nível)
[O que se espera alcançar sem detalhamento técnico]

## Critérios de Sucesso Preliminares
- [ ] Critério 1
- [ ] Critério 2
```

### Template design.md (seções obrigatórias)

```markdown
# Design: [Nome da Mudança]

## Technical Approach

## Architecture Decisions

### Decision: [Título]
**Choice**: [Escolha feita]
**Alternatives considered**: [Alternativas]
**Rationale**: [Justificativa]

## Estratégia de Qualidade e Design de Código

### TDD (Test-Driven Development)
- **Cobertura mínima**: 80%
- **Ferramentas**: Vitest
- **Estratégia de Mock/Stub**: [Descrição]

### BDD (Behavior-Driven Development)
- **Cenários Gherkin**: [Lista ou referência]
- **Ferramenta**: Playwright
- **Cobertura E2E**: 100% fluxos críticos

### ATDD (Acceptance Test-Driven Development)
- **Critérios de aceitação**: [Por tarefa]
- **Checklist QA**: [Descrição]

### DDD (Domain-Driven Design)
- **Bounded Context**: [Diagrama]
- **Agregados**: [Lista]
- **Entidades**: [Lista]
- **Value Objects**: [Lista]

## Data Flow

## File Changes

## Testing Strategy

## Migration / Rollout

## Open Questions
```

### Template tasks.md (decomposição DDD)

```markdown
# Tasks: [Nome da Mudança]

## Pré-condições
- [ ] Spec aprovada
- [ ] Design aprovado

## Tarefas

### Fase 1: Infraestrutura de Testes
- [ ] Task 1.1: [Descrição]
- [ ] Task 1.2: [Descrição]

### Fase 2: Domínio
- [ ] Task 2.1: [Descrição]
- [ ] Task 2.2: [Descrição]

### Fase 3: Aplicação
- [ ] Task 3.1: [Descrição]

### Fase 4: Infraestrutura
- [ ] Task 4.1: [Descrição]

### Fase 5: Interface
- [ ] Task 5.1: [Descrição]

### Fase 6: Documentação
- [ ] Task 6.1: Atualizar [módulo]/AGENTS.md

## Critério de Conclusão
Uma tarefa só é considerada `[x]` quando:
- Código de produção escrito
- Testes unitários/integração obrigatórios passam
- Testes E2E referentes passam localmente
- Documentação do módulo atualizada

## Progresso
██████████ 100%

## Status
Concluído
```

---

## Testing Strategy

### TDD
- **Ferramenta**: Vitest
- **Cobertura mínima**: 80% de linhas
- **Braches críticos**: 100%
- **Mock/Stub**: Para isolar dependências externas (Supabase, WhatsApp)

### BDD
- **Ferramenta**: Playwright
- **Formato**: Gherkin (Given-When-Then)
- **Cenários**: Derivados dos requisitos (REQ-XXX) no spec.md
- **Execução**: Local e em CI/CD
- **Localização**: Arquivos `.feature` no nível mais próximo do módulo que documentam
- **Link com testes**: Cada cenário BDD DEVE ter referência ao teste de integração que o valida

### ATDD
- **Critérios de aceitação**: Documentados no design.md
- **Validação manual**: Checklist de QA para testes exploratórios

### DDD
- **Modelagem**: Verificada na revisão de design
- **Linguagem ubíqua**: Verificada nos testes unitários (nomes de funções em pt-BR)

---

## Migration / Rollout

### Fase 1: Piloto (1 mudança)
1. Aplicar novo fluxo em uma mudança de escopo pequeno
2. Validar templates e processo
3. Ajustar conforme feedback

### Fase 2: Adoção gradual
1. Treinar equipe com a mudança piloto
2. Aplicar em mudanças médias
3. Revisar e ajustar templates

### Fase 3: Consolidação
1. Atualizar todos os AGENTS.md dos módulos
2. Configurar CI/CD para coverage gates (futuro)
3. Documentar lições aprendidas

### Rollback
- Se impacto negativo na produtividade:
  1. Reverter templates via git
  2. Manter apenas práticas que já funcionavam
  3. Implementar TDD/BDD/DDD incrementalmente

---

## Open Questions

1. **CI/CD**: Quando configurar coverage gates automatizados? (Recomendado após 3 mudanças completas)
2. **Ferramenta BDD**: Playwright já instalado é suficiente ou precisa de Cucumber/Gherkin?
3. **Treinamento**: Qual formato de treinamento para DDD? (Workshop, pair programming, documentação?)

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| Vitest | ^3.0.0 | Testes unitários (já instalado) |
| Playwright | ^1.52.0 | Testes E2E (já instalado) |

---

## Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Curva de aprendizado (DDD/TDD) | Alta | Médio | Treinamento, pair programming |
| Resistência à mudança | Média | Alto | Demonstrar benefícios com piloto |
| Sobrecarga inicial | Média | Médio | Implementação gradual |
| Templates muito rígidos | Baixa | Médio | Ajustar conforme uso real |