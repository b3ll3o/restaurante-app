# PRD: Melhores Práticas de Desenvolvimento - Stack Completa (OpenSpec/OpenCode/MiniMax M2.7)

## 1. Visão Geral

**Projeto**: MenuLink (Restaurant SaaS, multi-tenant)  
**Stack**: Next.js 16.2.3 + React 19 + TypeScript (strict) + Tailwind CSS 4 + Supabase  
**Idioma**: Português Brasileiro (pt-BR)  
**Data**: 2026-04-17  
**Versão**: 1.0

### Problema

O projeto MenuLink precisa de padronização e aplicação de melhores práticas de mercado para garantir escalabilidade, manutenibilidade e alta qualidade de código. Sem isso, o projeto рискует acumular débitos técnicos e perder manutenibilidade a longo prazo.

### Solução Proposta

Aplicar as melhores práticas de desenvolvimento para cada camada da stack, organizando o projeto de forma estruturada, documentada e com padrões reconhecidos pelo mercado.

### Resultado Esperado

- Código type-safe com utilitários TypeScript avançados
- Componentização reutilizável com design tokens centralizados
- Error handling consistente com logging estruturado
- Cobertura de testes ≥80% com estratégia clara
- Performance otimizada com bundle <500kb

### Urgência

**Alta** - Impacta diretamente a qualidade e escalabilidade do projeto.

---

## 2. Análise de Viabilidade

### Breaking Changes Avaliados

| Área | Breaking Change | Severidade | Mitigação |
|------|---------------|------------|-----------|
| TypeScript strict mode | Nenhum | - | Configuração incremental |
| Tailwind CSS 4 | `@apply` em componentes | Baixa | Migrar gradualmente |
| React 19 Actions | Perubahan forme handling | Média | Dual support durante transição |
| Next.js 16 caching | API de cache mudada | Média | Documentar diferenças |

### Esforço Estimado

| Tarefa | Effort | Prioridade |
|--------|--------|------------|
| Estrutura feature-based | M | Alta |
| Utilitários TypeScript | S | Alta |
| Zod validation | S | Alta |
| Error boundary global | S | Alta |
| Logging estruturado | M | Média |
| shadcn/ui organização | S | Média |
| Testes integração | L | Alta |
| Cobertura 80% | L | Alta |
| ADR decisões | S | Média |
| Bundle audit | S | Média |

### Riscos Identificados

1. **Risco**: Migrar estrutura pode impactar branches existentes
   - **Mitigação**: Fazer em fase, com testes cobrindo cada etapa

2. **Risco**: Cobertura 80% pode ser muito agressiva inicialmente
   - **Mitigação**: Definir baseline atual e aumentar progressivamente

3. **Risco**: Breaking changes em caching podem afetar ISR existente
   - **Mitigação**: Audit completo antes da migração

---

## 3. Requisitos Funcionais

### 3.1 Organização de Pastas

**REQ-ORG-001**: O projeto DEVE utilizar organização baseada em features (feature-based), agrupando componentes, hooks, tipos e lógicas relacionadas ao domínio juntas.

**REQ-ORG-002**: O projeto PODE manter estrutura layer-based para utilitários globais (lib, types, utils).

**REQ-ORG-003**: O projeto DEVE utilizar barrel exports (index.ts) para expor interfaces públicas de cada módulo.

**REQ-ORG-004**: O projeto DEVE praticar co-location, mantendo arquivos de teste junto ao arquivo principal.

### 3.2 TypeScript

**REQ-TS-001**: O projeto DEVE manter `strict: true` no tsconfig.json.

**REQ-TS-002**: O projeto DEVE implementar Result Type (Either) para error handling funcional.

**REQ-TS-003**: O projeto DEVE utilizar discriminated unions para estados (loading/success/error).

**REQ-TS-004**: O projeto DEVE implementar type guards para validação de tipos em runtime.

**REQ-TS-005**: O projeto DEVE adicionar Zod para validação runtime de dados externos (API responses, forms).

**REQ-TS-006**: O projeto DEVE utilizar generics para utilitários reutilizáveis (Option, Result, AsyncResult).

### 3.3 React 19

**REQ-RI-001**: O projeto DEVE utilizar Server Components como padrão para componentes que não interagem com estado cliente.

**REQ-RI-002**: O projeto DEVE utilizar Actions para mutações de dados (forms, submit).

**REQ-RI-003**: O projeto DEVE implementar `use()` hook para consumo de Promises em componentes.

**REQ-RI-004**: O projeto DEVE implementar Suspense boundaries para loading states de componentes async.

**REQ-RI-005**: O projeto PODE utilizar `useFormState` e `useFormStatus` para forms com Server Actions.

### 3.4 Next.js 16

**REQ-NX-001**: O projeto DEVE utilizar Cache Components para caching de dados em nível de componente.

**REQ-NX-002**: O projeto DEVE implementar ISR (Incremental Static Regeneration) para páginas públicas.

**REQ-NX-003**: O projeto DEVE utilizar streaming com `Suspense` para melhorar TTFB.

**REQ-NX-004**: O projeto DEVE implementar middleware para autenticação e redirect logic.

**REQ-NX-005**: O projeto DEVE utilizar route handlers para APIs internas.

**REQ-NX-006**: O projeto DEVE documentar estratégia de caching (full route cache, data cache, router cache).

### 3.5 Tailwind CSS 4

**REQ-TW-001**: O projeto DEVE utilizar `@theme inline` em `app/globals.css` para design tokens.

**REQ-TW-002**: O projeto NÃO DEVE criar `tailwind.config.js` (CSS-first config).

**REQ-TW-003**: O projeto DEVE centralizar cores, espaçamentos e tipografia em CSS custom properties.

**REQ-TW-004**: O projeto PODE utilizar dark mode via `class` ou `media` strategy.

**REQ-TW-005**: O projeto DEVE extrair componentes compostos para reutilização.

### 3.6 Supabase

**REQ-SB-001**: O projeto DEVE implementar RLS (Row Level Security) em todas as tabelas.

**REQ-SB-002**: O projeto DEVE utilizar políticas de RLS baseadas em `auth.uid()` para multi-tenant.

**REQ-SB-003**: O projeto PODE utilizar Edge Functions para lógicas complexas do lado do servidor.

**REQ-SB-004**: O projeto DEVE configurar real-time subscriptions apenas para funcionalidades específicas.

**REQ-SB-005**: O projeto DEVE utilizar service role para operações admin (RLS bypass).

### 3.7 Error Handling

**REQ-EH-001**: O projeto DEVE implementar Error Boundary global para capturar erros React.

**REQ-EH-002**: O projeto DEVE implementar Result Type para operações que podem falhar.

**REQ-EH-003**: O projeto DEVE implementar logging estruturado com níveis (error, warn, info, debug).

**REQ-EH-004**: O projeto PODE utilizar bibliotecas como `neverthrow` ou `ts-results` para Result type.

### 3.8 Testing

**REQ-TT-001**: O projeto DEVE seguir a pirâmide de testes (unitários > integração > E2E).

**REQ-TT-002**: O projeto DEVE utilizar Vitest para testes unitários e integração.

**REQ-TT-003**: O projeto DEVE utilizar Playwright para testes E2E.

**REQ-TT-004**: O projeto DEVE utilizar React Testing Library para testes de componentes.

**REQ-TT-005**: O projeto DEVE manter cobertura de código ≥80% para testes unitários.

### 3.9 Documentation

**REQ-DOC-001**: O projeto DEVE criar ADRs (Architecture Decision Records) para decisões técnicas importantes.

**REQ-DOC-002**: O projeto PODE manter changelog estruturado (Conventional Commits).

**REQ-DOC-003**: O projeto DEVE documentar APIs com JSDoc ou similar.

### 3.10 Performance

**REQ-PF-001**: O projeto DEVE manter bundle inicial <500kb (gzipped).

**REQ-PF-002**: O projeto DEVE utilizar `next/image` para otimização de imagens.

**REQ-PF-003**: O projeto DEVE implementar code splitting por rota.

**REQ-PF-004**: O projeto PODE utilizar bundle analyzer para monitorar tamanho.

### 3.11 Stack Completa de Desenvolvimento

#### 3.11.1 OpenSpec (SDD - Specification-Driven Development)

**Fluxo Completo**:
```
PRD.md → Análise → proposal → spec → design → tasks → implementation → verification → archive
```

**Artefatos**:
- `proposal.md`: Proposta formal com scope, riscos, rollback plan
- `spec.md`: Requisitos RFC 2119 (MUST/SHOULD/MAY) com cenários Given/When/Then
- `design.md`: Design técnico com TDD/BDD/ATDD/DDD integrados
- `tasks.md`: Decomposição DDD em fases (Infraestrutura, Domínio, Aplicação, Interface, Documentação)
- `verify-report.md`: Compliance report (código + documentação)
- `archive-report.md`: Resumo da mudança arquivada

**Gates de Aprovação**:
| Fase | Gate | Responsável |
|------|------|-------------|
| spec | Revisão técnica RFC 2119 | Oracle |
| design | Revisão de arquitetura | Oracle |
| plan | Verificação de blockers | Oracle |

**Diretrizes Centralizadas**:
- `.openspec/specs/menulink-rules.md` - Fonte centralizada de todas as regras
- `.openspec/specs/menulink-specification.md` - Requisitos de negócio (REQ-XXX)
- `.openspec/specs/menulink-technical-plan.md` - Arquitetura e modelos

#### 3.11.2 OpenCode (Orquestrador de Agentes)

**Arquitetura de Agentes**:
| Agente | Responsabilidade | Delegação |
|--------|------------------|-----------|
| Orchestrator | Coordena fluxo, delega tarefas, gerencia memória | `delegate-first` |
| Oracle | Revisa specs (RFC 2119) e design | Gatekeeper |
| Designer | Cria design.md e arquitetura | `quick` ou `deep` |
| Explorer | Análise exploratória, cartografia | `explorer` skill |
| Librarian | Documentação, ADRs, specs | `librarian` skill |

**Skills Disponíveis**:
| Skill | Descrição |
|-------|-----------|
| `sdd-propose` | Criar proposal.md |
| `sdd-spec` | Escrever specs RFC 2119 |
| `sdd-design` | Criar design.md |
| `sdd-tasks` | Gerar tasks.md |
| `sdd-apply` | Executar tasks SDD |
| `sdd-verify` | Verificar compliance |
| `sdd-archive` | Arquivar change |
| `executing-plans` | Executar listas de tarefas com progress tracking |
| `plan-reviewer` | Revisar planos para blockers |
| `requirements-interview` | Descoberta de requisitos |
| `post-archive-review` | Revisão pós-archive (obrigatório) |

**Convenções OpenCode**:
- `openspec-convention.md`: Convenções de nomenclatura e estrutura
- `persistence-contract.md`: Contrato de persistência de memória
- `thoth-mem-convention.md`: Convenções de memória thoth-mem

**Modos de Persistência**:
- `thoth-mem`: Memória session summary, context, search, timeline
- `openspec`: Artefatos SDD persistidos em `.openspec/changes/`
- `hybrid`: Combinação de ambos para coordenação

#### 3.11.3 MiniMax M2.7 Orchestrator

**Regras de Delegação**:
- `delegate-first`: Sempre delegar para agente especializado antes de executar
- Nunca ler arquivos diretamente (exceto coordination artifacts em `.openspec/`)
- Progress tracking via `todowrite` (UI) + SDD artifact (persistente)

**Memória Orchestrator**:
- `mem_session_summary`: Resumo da sessão atual
- `mem_context`: Contexto de trabalho persistente
- `mem_search`: Índice de artefatos pesquisáveis
- `mem_timeline`: Linha do tempo de atividades
- `mem_get_observation`: Observações do ambiente

**Fluxo de Execução**:
```
ENTENDER → MELHOR CAMINHO (delegar + paralelizar) → EXECUTAR → VERIFICAR
```

#### 3.11.4 Integração de Paradigmas (TDD+BDD+ATDD+DDD+SDD)

**TDD (Test-Driven Development)**:
- Ciclo: RED (teste que falha) → GREEN (código mínimo) → REFACTOR (melhorar)
- Cobertura mínima: ≥80% linhas
- Ferramenta: Vitest

**BDD (Behavior-Driven Development)**:
- Formato: Gherkin (Given-When-Then)
- Tag `@integration-test`链接 para teste de integração
- Localização: Arquivo `.feature` no nível mais próximo do módulo

**ATDD (Acceptance Test-Driven Development)**:
- Framework: Playwright
- Cobertura: 100% fluxos críticos
- Validação: Critérios de aceitação (CA-XXX) verificáveis

**DDD (Domain-Driven Design)**:
- Bounded Contexts: Gestão de Restaurante, Cardápio, Pedidos, Pagamento
- Agregados/Entidades: Restaurant, Category, Product, Order, Cart
- Linguagem ubíqua: pt-BR em código e documentação

**SDD (Specification-Driven Development)**:
- Spec como fonte da verdade
- Código deriva das specs
- Requisitos RFC 2119 formalizados

#### 3.11.5 Gates de Qualidade

| Gate | Target | Ferramenta |
|------|--------|------------|
| PR Checks | 100% passam | GitHub Actions |
| Lint | 0 erros | ESLint |
| Build | Sucesso | `npm run build` |
| Typecheck | 0 erros | TypeScript strict |
| Cobertura unitários | ≥80% | Vitest coverage |
| Cobertura E2E | 100% fluxos críticos | Playwright |

#### 3.11.6 Regras de Documentação

**Proximidade (REGRA CRÍTICA)**:
- AGENTS.md deve estar no nível mais próximo do elemento documentado
- Exemplo: `app/admin/orders/page.tsx` → `app/admin/orders/AGENTS.md`

**BDD (REGRA DE PROXIMIDADE)**:
- Arquivos `.feature` no mesmo nível do módulo que documentam
- Tag `@integration-test` apontando para teste de integração correspondente
- Exemplo: `app/admin/orders/orders.feature` ↔ `tests/integration/orders.test.ts`

**Template AGENTS.md por Tipo**:
- Módulo: Visão geral + estrutura + responsabilidades
- Rota: Interface + parâmetros + estados
- Componente: Props + estados + callbacks
- Hook: Assinatura + regras de uso
- Contexto: Provider + operações + regras

---

## 4. Critérios de Aceitação

| ID | Critério | Evidência |
|----|----------|-----------|
| CA-01 | Estrutura de pastas refatorada para feature-based | `app/`, `components/` reorganizados por domínio |
| CA-02 | Utilitários TypeScript genéricos criados (Result, Option, type guards) | `lib/types/` com utilitários |
| CA-03 | Zod adicionado para validação runtime | `lib/validations/` com schemas |
| CA-04 | Error boundary global implementado | `components/error-boundary.tsx` |
| CA-05 | Logging estruturado configurado | `lib/logger.ts` integrado |
| CA-06 | Componentes shadcn/ui organizados por domínio | `components/{admin,menu,shared}/` |
| CA-07 | Tests de integração cobrindo fluxos principais | `tests/integration/` com Playwright |
| CA-08 | Cobertura de testes ≥80% | Relatório de cobertura Vitest |
| CA-09 | ADR criado para decisões de arquitetura | `.openspec/adrs/` incluindo OpenSpec/OpenCode/MiniMax M2.7 decisions |
| CA-10 | Performance auditado (bundle < 500kb) | `next/bundle-analyzer` report + bundle analysis |

---

## 5. Estratégia de Implementação

### Fase 1: Fundamentos (Semana 1)
- [ ] Estrutura feature-based implementada
- [ ] TypeScript utilitários (Result, Option, type guards)
- [ ] Zod schemas para validação
- [ ] Error boundary global

### Fase 2: Infraestrutura (Semana 2)
- [ ] Logging estruturado configurado
- [ ] shadcn/ui reorganizado por domínio
- [ ] Middleware de autenticação documentado

### Fase 3: Testing (Semana 3-4)
- [ ] Setup Vitest + Playwright
- [ ] Testes de integração dos fluxos principais
- [ ] Cobertura ≥80%

### Fase 4: Performance e Docs (Semana 5)
- [ ] Bundle analysis e otimização
- [ ] ADR para decisões técnicas
- [ ] Documentação AGENTS.md atualizada

---

## 6. Referências de Mercado

### Next.js 16
- Cache Components com PPR (Partial Prerendering)
- Stable Turbopack (5-10x faster builds)
- React Compiler support

### React 19
- Server Components como default
- Actions para form handling nativo
- `use()` hook para Promises

### Tailwind CSS 4
- CSS-first configuration com `@theme inline`
- Oxide engine em Rust para performance
- Composable variants

### Supabase
- RLS policies para multi-tenant
- Edge Functions para lógica server-side
- Real-time subscriptions otimizadas

---

## 7. Glossário

| Termo | Definição |
|-------|-----------|
| Barrel Export | Padrão de exportar interfaces públicas via `index.ts` |
| Cache Components | Componentes Next.js 16 com caching built-in |
| ISR | Incremental Static Regeneration |
| Result Type | Tipo funcional para error handling (Either) |
| RLS | Row Level Security (Supabase) |
| ADR | Architecture Decision Record |
| OpenSpec | Framework SDD com fluxo proposal→spec→design→tasks→implementation→verification→archive |
| OpenCode | Orquestrador de agentes IA (Orchestrator, Oracle, Designer, Explorer, Librarian) |
| SDD | Specification-Driven Development - especificação como fonte da verdade |
| TDD | Test-Driven Development - ciclo RED→GREEN→REFACTOR |
| BDD | Behavior-Driven Development - Gherkin Given-When-Then |
| ATDD | Acceptance Test-Driven Development - testes E2E com Playwright |
| DDD | Domain-Driven Design - bounded contexts e linguagem ubíqua |
| Orchestrator | Agente principal MiniMax M2.7 que coordena fluxo e delega tarefas |
| Oracle | Agente gatekeeper que revisa specs RFC 2119 e design de arquitetura |
| Delegate-first | Regra de delegar para agente especializado antes de executar |

---

## 8. Status

**Status**: Draft  
**Próxima Etapa**: Análise de viabilidade detalhada → Proposal → Spec → Design → Tasks

---

**Versão**: 1.0  
**Criado**: 2026-04-17  
**Autor**: AI Agent
