# Consolidated Knowledge: Changes Arquivadas

**Total de Changes**: 25
**Período**: 2026-04-16 a 2026-04-19
**Data de Consolidação**: 2026-04-19

---

## 1. Resumo das Changes

### 2026-04-16 (6 changes)

| # | Change | Problema | Solução | Status |
|---|--------|----------|---------|--------|
| 1 | dependency-cleanup | Dependências desatualizadas e conflitantes | Limpeza e atualização de packages | ✅ CONCLUÍDO |
| 2 | extract-whatsapp-service | Lógica de WhatsApp acoplada ao API route | Extração para `lib/whatsapp.ts` separado | ✅ CONCLUÍDO |
| 3 | migrate-jest-to-vitest | Jest com problemas de compatibilidade | Migração para Vitest | ✅ CONCLUÍDO |
| 4 | test-automation-strategy | Falta de estratégia de testes | Definição de strategy: unit ≥80%, E2E fluxos críticos 100% | ✅ CONCLUÍDO |
| 5 | whatsapp-service | Integração WhatsApp complexa | Service dedicado com `formatOrderMessage`, `sendWhatsAppMessage` | ✅ CONCLUÍDO |
| 6 | whatsapp-validation | Validação de WhatsApp inconsistente | `validateWhatsApp()` com 10-13 dígitos, `maskWhatsApp()` | ✅ CONCLUÍDO |

### 2026-04-17 (14 changes)

| # | Change | Problema | Solução | Status |
|---|--------|----------|---------|--------|
| 7 | ai-development-workflow | Falta de workflow documentado para AI agents | Definição do pipeline SDD: proposal→spec→design→tasks→apply→verify→archive | ✅ CONCLUÍDO |
| 8 | ai-plugins | Falta de plugins para extensibilidade | Setup de plugins opencode | ✅ CONCLUÍDO |
| 9 | backlog-workflow | Backlog desorganizado | Workflow de PRD com pipeline approval | ✅ CONCLUÍDO |
| 10 | documentation-proximity | Documentação longe do código | Regra: AGENTS.md no mesmo nível do elemento | ✅ CONCLUÍDO |
| 11 | email-conf-auth-issue | Email confirmation causando issues | ⚠️ Pendente config manual Supabase Dashboard | ⚠️ COM WARNINGS |
| 12 | email-not-confirmed-handling | Fluxo de email não confirmado ruim | `resendConfirmationEmail`, UI melhorada | ✅ CONCLUÍDO |
| 13 | error-handling-rule | Tratamento de erros inconsistente | RCA template, `pediai-rules.md` §11 | ✅ CONCLUÍDO |
| 14 | general-review | Necessidade de revisão geral | Revisão completa do codebase | ✅ CONCLUÍDO |
| 15 | landing-page-redesign | Landing page com messaging inconsistente | Redesign com "Zero comissão" messaging | ✅ CONCLUÍDO |
| 16 | module-organization | Estrutura de módulos confusa | Reorganização em `app/`, `components/`, `lib/`, etc | ✅ CONCLUÍDO |
| 17 | project-best-practices | Falta de padrões | `lib/result.ts`, Zod schemas, error-boundary | ✅ CONCLUÍDO |
| 18 | quality-workflow-evolution | Workflow de qualidade v1 imaturo | Evolução para v2 com gates claros | ✅ CONCLUÍDO |
| 19 | sddd-templates | Templates SDD inconsistentes | Templates padronizados em `opencode/templates/` | ✅ CONCLUÍDO |
| 20 | thoth-mem-fix | Erro ProviderModelNotFoundError | Corrigido preset para `minimax/MiniMax-M2.7` | ⚠️ COM RESSALVAS |
| 21 | token-tracker | Sem visibilidade de consumo de tokens | Plugin token-tracker adicionado | ✅ CONCLUÍDO |

### 2026-04-19 (5 changes)

| # | Change | Problema | Solução | Status |
|---|--------|----------|---------|--------|
| 22 | interface-tests-report | Necessidade de visualizar cobertura E2E | Script `generate-test-coverage.ts` | ✅ CONCLUÍDO |
| 23 | landing-page-redesign | Landing page precisa de redesign conversão | Hero + Pillars + Video + Pricing + CTA | ✅ PASS |
| 24 | landing-pages-segmentadas | Necessidade de landing pages por segmento | 4 landing pages: pizzaria, hamburgueria, bar, restaurante | ✅ CONCLUÍDO |
| 25 | responsive-pages | Páginas não funcionavam bem em mobile | CSS mobile-first, sidebar→drawer, table→cards | ✅ PASS |

---

## 2. Padrões Identificados

### 2.1 Padrões de Código

| Padrão | Descrição | Origem |
|--------|-----------|--------|
| **Result Type** | `lib/result.ts` com `Result<T, E>` para tratamento de erros | project-best-practices |
| **Validation Layer** | Validação em duas camadas: cliente (React) + servidor (API route) | whatsapp-validation |
| **Service Layer** | Lógica de negócio separada em `lib/` (ex: `lib/whatsapp.ts`) | extract-whatsapp-service |
| **Constants Centralized** | Strings em `lib/constants.ts` (ORDER_STATUS, STATUS_LABELS, LOCALE) | dependency-cleanup |
| **Sanitization** | `lib/sanitize.ts` para proteger dados sensíveis em logs | project-best-practices |
| **Error Boundary** | `components/error-boundary.tsx` para erros React | project-best-practices |
| **Fallback Client** | Supabase client com fallback para build sem env vars | dependency-cleanup |

### 2.2 Padrões de Componentes

| Padrão | Descrição | Origem |
|--------|-----------|--------|
| **Sheet Drawer** | Sidebar como Sheet em <1024px, fixa em ≥1024px | responsive-pages |
| **Table→Cards** | Tabelas em desktop, Cards em mobile | responsive-pages |
| **FAB Cart** | Floating Action Button para carrinho em mobile | responsive-pages |
| **Dialog Fullscreen** | Dialog fullscreen em mobile | responsive-pages |
| **Touch Targets** | `.touch-target { min-width: 44px; min-height: 44px }` | responsive-pages |
| **Accordion Menu** | Categorias colapsáveis com chevron | Visualização do Cardápio |
| **Status Badge** | Badges coloridos por status (pending=yellow, confirmed=green) | Gestão de Pedidos |

### 2.3 Padrões de Testes

| Padrão | Descrição | Origem |
|--------|-----------|--------|
| **Test Coverage Script** | `scripts/generate-test-coverage.ts` que varre rotas e mapeia testes | interface-tests-report |
| **Proximity Rule** | Testes no mesmo nível do código que testam | documentation-proximity |
| **BDD Scenarios** | `.feature` files com Gherkin, tag `@integration-test` | test-automation-strategy |
| **E2E Responsive** | `tests/e2e/responsive-*.test.ts` para cada página | responsive-pages |
| **Unit para Landing** | 6 arquivos de testes unitários para landing components | landing-page-redesign |

### 2.4 Padrões de Documentação

| Padrão | Descrição | Origem |
|--------|-----------|--------|
| **AGENTS.md Proximity** | `AGENTS.md` no mesmo diretório do código que documenta | documentation-proximity |
| **Change Artifacts** | proposal.md, spec.md, design.md, tasks.md, verify-report.md, archive-report.md | ai-development-workflow |
| **RCA Template** | Template em `opencode/root-causes/` para análise de erros | error-handling-rule |
| **ADR Documents** | Architecture Decision Records em `docs/adr/` | project-best-practices |

---

## 3. Regras Estabelecidas

### 3.1 Regras de Código (`opencode/rules/AGENTS.md`)

| # | Regra | Origem |
|---|-------|--------|
| 1 | Validação de WhatsApp: 10-13 dígitos, apenas números | whatsapp-validation |
| 2 | Sanitização de dados sensíveis em logs | project-best-practices |
| 3 | Error handling: try/catch com logs e user-friendly messages | error-handling-rule |
| 4 | Result Type para operações que podem falhar | project-best-practices |
| 5 | Constantes centralizadas em `lib/constants.ts` | dependency-cleanup |
| 6 | Service layer para integrações externas | extract-whatsapp-service |

### 3.2 Regras de Projeto

| # | Regra | Origem |
|---|-------|--------|
| 1 | Mobile-first: CSS começa em mobile, `md:`/`lg:` para telas maiores | responsive-pages |
| 2 | Breakpoint principal: `lg` (1024px) | responsive-pages |
| 3 | Touch targets: mínimo 44x44px | responsive-pages |
| 4 | AGENTS.md no mesmo nível do elemento que documenta | documentation-proximity |
| 5 | BDD scenarios com tag `@integration-test="caminho/para/test.ts"` | test-automation-strategy |
| 6 | Build deve passar sem variáveis de ambiente (fallback client) | dependency-cleanup |

### 3.3 Regras de Qualidade

| # | Regra | Target | Origem |
|---|-------|--------|--------|
| 1 | Cobertura de testes unitários | ≥ 80% | test-automation-strategy |
| 2 | Fluxos críticos E2E | 100% | test-automation-strategy |
| 3 | Lint: 0 errors, 0 warnings | 100% | quality-workflow-evolution |
| 4 | TypeScript: 0 errors (`tsc --noEmit`) | 100% | quality-workflow-evolution |
| 5 | Build passa antes de commit | MUST | quality-workflow-evolution |

---

## 4. Erros Comuns e Lições Aprendidas

### 4.1 Erros Encontrados

| Erro | Ocorrências | Solução |
|------|-------------|---------|
| **Loop de redirect infinito** | 2 (login-reload-loop, email-conf-auth-issue) | Adicionar check `pathname === '/admin/login'` antes de auth check |
| **Build falhando sem env vars** | 1 (supabase-env-build-fix) | Criar `createFallbackClient()` com mock null |
| **Componentes não responsivos** | 1 (responsive-pages) | CSS mobile-first, breakpoints consistentes |
| **Validação de WhatsApp inconsistente** | 1 (whatsapp-validation) | Criar `validateWhatsApp()` centralizado |
| **Config Supabase não documentada** | 1 (email-conf-auth-issue) | Documentar config manual necessária |

### 4.2 Lições Aprendidas

| # | Lição | Implicação |
|---|-------|------------|
| 1 | **Sempre testar sem variáveis de ambiente** | Build deve funcionar em CI/CD sem `.env` |
| 2 | **Auth check no layout causa loops** | Verificar pathname antes de fazer redirect |
| 3 | **Mobile-first reduz retrabalho** | Começar CSS por mobile, adicionar breakpoints depois |
| 4 | **Specs devem especificar config manual** | Se requiere ação humana pós-deploy, documentar explicitamente |
| 5 | **Testes próximos ao código** | Proximity reduz chance de tests ficarem desatualizados |
| 6 | **Change sem execution é só documento** | PRDs sem change SDD não são implementados |

### 4.3 Anti-Padrões Identificados

| Anti-Padrão | Descrição | Evitado por |
|-------------|-----------|------------|
| **God Components** | Componentes grandes demais | Service layer, constants centralizadas |
| **Magic Strings** | Strings soltas no código | `lib/constants.ts` |
| **Coupling** | Lógica acoplada a API routes | Extração para `lib/whatsapp.ts` |
| **Untested Critical Paths** | Fluxos sem E2E | 100% E2E coverage para fluxos críticos |
| **Documentation Drift** | Docs desatualizadas | Proximity rule + CI validation |

---

## 5. Architecture Decision Records (ADRs)

### ADR-001: Stack de Testes
**Data**: 2026-04-16
**Status**: Accepted
**Contexto**: Jest apresentava problemas de compatibilidade com TypeScript e mocks.
**Decisão**: Migrar para Vitest. Vitest oferece melhor compatibilidade com TypeScript, hot module replacement, e API compatível com Jest.
**Consequências**: Scripts de teste atualizados, configuração em `vitest.config.ts`.

---

### ADR-002: Service Layer Pattern
**Data**: 2026-04-16
**Status**: Accepted
**Contexto**: Lógica de integração (WhatsApp) acoplada aos API routes.
**Decisão**: Extrair para `lib/{domain}.ts` services separados.
**Consequências**: Código mais testável, reusável, e manutenível.

---

### ADR-003: Result Type para Error Handling
**Data**: 2026-04-17
**Status**: Accepted
**Contexto**: Tratamento de erros inconsistente através do codebase.
**Decisão**: Adotar `Result<T, E>` type para operações que podem falhar, eliminando throws em lógica de negócio.
**Consequências**: Error handling mais explícito, código mais limpo.

---

### ADR-004: Mobile-First CSS Architecture
**Data**: 2026-04-19
**Status**: Accepted
**Contexto**: Páginas admin não funcionavam bem em mobile.
**Decisão**: CSS começa em mobile (classe base), breakpoints `md:`/`lg:` para telas maiores.
**Consequências**: Melhor experiência mobile, CSS mais simples.

---

### ADR-005: Documentation Proximity
**Data**: 2026-04-17
**Status**: Accepted
**Contexto**: Documentação em diretórios genéricos `docs/` ficava desatualizada.
**Decisão**: `AGENTS.md` e `.feature` files devem estar no mesmo diretório do código que documentam/testam.
**Consequências**: Docs mantidas atualizadas naturalmente.

---

## 6. Evolução da Stack

### 2026-04-16 → 2026-04-19

| Tecnologia | Antes | Depois |
|------------|-------|--------|
| **Test Runner** | Jest | Vitest |
| **Validation** | Inline | Zod schemas (`lib/schemas/`) |
| **Error Handling** | try/catch scattered | `lib/result.ts` Result type |
| **WhatsApp** | Coupled to API route | `lib/whatsapp.ts` service |
| **Constants** | Magic strings | `lib/constants.ts` |
| **Sanitization** | None | `lib/sanitize.ts` |
| **Error Boundary** | None | `components/error-boundary.tsx` |
| **CSS** | Desktop-first | Mobile-first (Tailwind) |
| **Documentation** | Centralized | Proximity (distributed) |

### Arquivos Criados pela Primeira Vez

| Arquivo | Change Origem |
|---------|--------------|
| `lib/whatsapp.ts` | extract-whatsapp-service |
| `lib/result.ts` | project-best-practices |
| `lib/sanitize.ts` | project-best-practices |
| `lib/schemas/` | project-best-practices |
| `lib/constants.ts` | dependency-cleanup |
| `components/error-boundary.tsx` | project-best-practices |
| `vitest.config.ts` | migrate-jest-to-vitest |
| `opencode/templates/` | sddd-templates |
| `opencode/root-causes/` | error-handling-rule |
| `scripts/generate-test-coverage.ts` | interface-tests-report |

---

## 7. Gaps de Testes

### 7.1 Testes Implementados

| Tipo | Cobertura | Status |
|------|----------|--------|
| Unitários | Landing components (6) | ✅ Implementado |
| Integração | Landing, Orders, Auth | ✅ Implementado |
| E2E | Landing, Responsivo (7), Acessibilidade (3) | ✅ Implementado |
| BDD | Landing, Orders, Auth | ✅ Implementado |

### 7.2 Gaps Identificados

| Gap | Prioridade | Recomendação |
|-----|------------|--------------|
| **Testes unitários de serviços** | Alta | `lib/whatsapp.ts`, `lib/sanitize.ts` precisam unit tests |
| **Testes de mutations** | Alta | CUD operations em categorias, produtos, pedidos |
| **Testes de auth flow** | Alta | Login, logout, signup, OAuth callback |
| **Testes de cart context** | Alta | addItem, removeItem, persistence |
| **Snapshot tests** | Média | Components que não mudam frequentemente |
| **Performance tests** | Baixa | Tempo de carregamento de páginas |

### 7.3 Testes Recomendados por Componente

| Componente | Unit | Integração | E2E |
|------------|------|------------|-----|
| `lib/whatsapp.ts` | ❌ FALTA | ❌ FALTA | ❌ |
| `lib/sanitize.ts` | ❌ FALTA | ❌ FALTA | ❌ |
| `lib/constants.ts` | ❌ FALTA | N/A | N/A |
| `context/cart-context.tsx` | ❌ FALTA | ❌ FALTA | ❌ |
| `app/menu/[slug]/page.tsx` | ❌ FALTA | ❌ FALTA | ✅ |
| `app/admin/auth/` | ❌ FALTA | ❌ FALTA | ❌ |

---

## 8. Gaps de Documentação

### 8.1 Documentação Implementada

| Documento | Local | Status |
|-----------|-------|--------|
| Workflows | `opencode/workflows/AGENTS.md` | ✅ |
| Specs | `opencode/specs/` | ✅ |
| Changes SDD | `opencode/changes/` | ✅ |
| Templates | `opencode/templates/` | ✅ |
| Root Causes | `opencode/root-causes/` | ✅ |
| ADRs | `docs/adr/` | ✅ |

### 8.2 Gaps de Documentação

| Gap | Prioridade | Recomendação |
|-----|------------|--------------|
| **Documentação de APIs** | Alta | Gerar Swagger/OpenAPI de `app/api/` e criar `opencode/specs/API.md` |
| **README principal** | Alta | `README.md` com setup, stack, comandos |
| **Contribuindo** | Média | `CONTRIBUTING.md` com workflow |
| **Changelog** | Média | `CHANGELOG.md` para releases |

---

## 9. Melhorias de Processo

### 9.1 SDD Pipeline Estabelecido

```
PRD → proposal → spec → design → tasks → apply → verify → archive → post-archive-review
```

### 9.2 Gates de Qualidade

| Gate | Antes | Depois |
|------|-------|--------|
| **Lint** | Opcional | Obrigatório (0 errors) |
| **Build** | Às vezes | Obrigatório |
| **Unit Tests** | Mínima cobertura | ≥ 80% |
| **E2E** | Nenhum | 100% fluxos críticos |
| **TypeScript** | Opt-in | Obrigatório (`tsc --noEmit`) |

### 9.3 Workflow de Changes

| Fase | Responsável | Gate |
|------|-------------|------|
| proposal | Orchestrator | Scope definido |
| spec | Oracle | RFC 2119 review |
| design | Oracle | Architecture review |
| tasks | Orchestrator | Completude |
| apply | Deep Agent | CI/CD |
| verify | Deep Agent | Compliance report |
| archive | Orchestrator | Consolidation |
| post-archive-review | Orchestrator | Build + Tests + Docs |

### 9.4 Lições de Processamento

| # | Lição | Evidência |
|---|-------|-----------|
| 1 | **Mudanças pequenas são mais rápidas** | dependency-cleanup vs landing-page-redesign |
| 2 | **Specs vagas causam retrabalho** | email-conf-auth-issue precisou de mais iterações |
| 3 | **Testes devem vir com código** | responsive-pages incluiu testes na mesma change |
| 4 | **Verificar antes de archivar** | verify-report evita archivar código quebrado |
| 5 | **Post-archive-review é essencial** | Garante que tudo ainda funciona após consolidação |

---

## 10. Recomendações

### 10.1 Curto Prazo (1-2 semanas)

- [ ] Adicionar unit tests para `lib/whatsapp.ts` e `lib/sanitize.ts`
- [ ] Adicionar testes de mutations para CRUD admin
- [ ] Criar `README.md` principal
- [ ] Corrigir email-conf-auth-issue (config manual Supabase)

### 10.2 Médio Prazo (1 mês)

- [ ] Gerar documentação API com Swagger
- [ ] Adicionar testes E2E para auth flows
- [ ] Implementar snapshot tests para componentes críticos
- [ ] Criar `CONTRIBUTING.md`

### 10.3 Longo Prazo (3+ meses)

- [ ] Migrar código remaining para Result type
- [ ] Adicionar testes de performance
- [ ] Setup de CI/CD com cache de dependências
- [ ] Internacionalização (i18n)

---

## 11. Métricas Finais

| Métrica | Valor |
|---------|-------|
| Total de Changes | 25 |
| Concluídas | 23 (92%) |
| Com Warnings | 2 (8%) |
| Falhas | 0 |
| Arquivos Criados/Modificados | ~80 |
| Regras Estabelecidas | 15+ |
| ADRs | 5 |
| Patterns Identificados | 12 |

---

**Versão**: 1.2
**Última Atualização**: 2026-04-19
**Origem**: Análise de 25 changes arquivadas em `opencode/changes/archive/`

---

## Histórico de Correções

| Versão | Data | Correções |
|--------|------|-----------|
| 1.2 | 2026-04-19 | Atualizada versão para 1.2 com mesma data de consolidação |
| 1.1 | 2026-04-19 | Corrigidos: typo "Occorrências"→"Ocorrências", "código清明"→"código mais limpo", "proximity Rule"→"Proximity Rule", "Specs vagass"→"Specs vagas", referências de seção inválidas (§6, §11, §4, §5), origens "menu-public"/"orders-management" substituídas, entrada duplicada em gaps de documentação |
| 1.0 | 2026-04-19 | Versão inicial |
