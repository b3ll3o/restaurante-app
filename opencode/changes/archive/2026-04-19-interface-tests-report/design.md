# Design: interface-tests-report

## Fonte da Verdade

Este documento é parte das especificações do MenuLink e detalha a arquitetura técnica para o sistema de relatório de cobertura de testes E2E.

---

## Abordagem Técnica

### Visão Geral

O sistema é composto por um script Node.js standalone que varre rotas da aplicação, mapeia testes E2E e cenários BDD, e gera relatórios em formato JSON e HTML.

### Stack Tecnológico

- **Runtime**: Node.js 18+ (nativo ao projeto)
- **Linguagem**: TypeScript (compilado via `tsx` ou executado diretamente)
- **Dependências**: Apenas `fs`, `path`, `glob` (nativas ou já disponíveis)
- **Output**: JSON + HTML (sem dependências externas de templating)

---

## Decisões de Arquitetura

### Decisão 1: Localização do Script

**Choice**: `scripts/generate-test-coverage.ts`

**Alternatives considered**:
- `tests/e2e/generate-coverage.ts` — Mistura código de produção com testes
- `scripts/coverage-report.ts` — Menos específico
- `scripts/test-coverage.ts` — Pode conflitar com scripts existentes

**Rationale**: Diretório `scripts/` é o local padrão para utilitários de build/quality. O nome `generate-test-coverage` é descritivo e não conflita com `test:coverage` do npm.

---

### Decisão 2: Formato de Output HTML

**Choice**: HTML gerado via template string (sem dependência de templating engine)

**Alternatives considered**:
- Usar biblioteca como `mustache` ou `ejs` — Adiciona dependência
- Usar `react` para renderizar — Overkill para um relatório estático

**Rationale**: Minimiza dependências. O HTML é simples (tabela + CSS inline) e pode ser gerado via template literals sem perda de manutenibilidade.

---

### Decisão 3: Mapeamento de Testes E2E

**Choice**: Convenção de proximidade com segmentos de rota

**Alternatives considered**:
- Buscar em todo `tests/e2e/**/*.spec.ts` e inferir por similaridade — Impreciso
- Mapear manualmente em arquivo de configuração — Manutenção adicional

**Rationale**: Segue a mesma regra de proximidade do BDD (`app/admin/login/login.feature`). O padrão `tests/e2e/{segment}/{segment}.spec.ts` mapeia naturalmente para `app/{segment}/{segment}/page.tsx`.

**Mapeamento inferido**:
| Rota | Arquivo E2E esperado |
|------|---------------------|
| `app/admin/login/page.tsx` | `tests/e2e/admin/login.spec.ts` |
| `app/admin/orders/page.tsx` | `tests/e2e/admin/orders.spec.ts` |
| `app/menu/[slug]/page.tsx` | `tests/e2e/public/menu.spec.ts` |
| `app/api/orders/route.ts` | `tests/e2e/api/orders.spec.ts` |

---

### Decisão 4: Contagem de Cenários BDD

**Choice**: Regex `/^Cenário:|^Scenario:/im` aplicado ao conteúdo do arquivo `.feature`

**Alternatives considered**:
- Parser Gherkin completo (cucumber) — Dependência pesada
- Parser AST com regex mais complexo — Propenso a erros

**Rationale**: Os arquivos `.feature` seguem formato Gherkin simples. Contar linhas que começam com "Cenário:" ou "Scenario:" é suficiente para o requisito REQ-COVER-008.

---

## Arquitetura do Script

### Estrutura de Arquivos

```
scripts/
└── generate-test-coverage.ts    # Script principal

tests/e2e/
├── coverage-report.json          # Output JSON (gerado)
└── coverage-report.html          # Output HTML (gerado)
```

### Fluxo de Execução

```
1. init()          → Configurar paths e constantes
2. scanRoutes()    → Varrer app/ e coletar todas as rotas
3. mapE2ETests()   → Para cada rota, localizar test spec correspondente
4. mapBDDFeatures()→ Para cada rota, localizar .feature na mesma pasta
5. countScenarios()→ Contar "Cenário:" em cada .feature
6. calculateStatus()→ Aplicar lógica green/yellow/red
7. generateJSON()  → Escrever coverage-report.json
8. generateHTML()   → Gerar e escrever coverage-report.html
```

### Funções Principais

```typescript
// Tipos
interface Route {
  path: string;           // e.g., "/admin/login"
  type: "page" | "api";   // page.tsx or route.ts
  filePath: string;       // absolute path to file
  tests: string[];        // paths of E2E specs
  bdds: string[];         // paths of .feature files
  status: "green" | "yellow" | "red";
  scenarios: number;       // count of scenarios in BDD files
}

interface CoverageReport {
  generated: string;      // ISO-8601 timestamp
  routes: Route[];
  summary: {
    total: number;
    green: number;
    yellow: number;
    red: number;
  };
}

// Funções
scanRoutes(appDir: string): Route[]
mapE2ETests(route: Route): string[]
mapBDDFeatures(route: Route): string[]
countScenarios(featurePath: string): number
calculateStatus(route: Route): "green" | "yellow" | "red"
generateJSON(report: CoverageReport, outputPath: string): void
generateHTML(report: CoverageReport, outputPath: string): void
```

---

## Mapeamento de Rotas Identificadas

### Rotas de Página (app/*/page.tsx)

| Rota | Tipo | Arquivo Fonte |
|------|------|---------------|
| `/admin/login` | page | `app/admin/login/page.tsx` |
| `/admin/signup` | page | `app/admin/signup/page.tsx` |
| `/admin/dashboard` | page | `app/admin/dashboard/page.tsx` |
| `/admin/categories` | page | `app/admin/categories/page.tsx` |
| `/admin/products` | page | `app/admin/products/page.tsx` |
| `/admin/orders` | page | `app/admin/orders/page.tsx` |
| `/admin/settings` | page | `app/admin/settings/page.tsx` |
| `/menu/[slug]` | page (dynamic) | `app/menu/[slug]/page.tsx` |

### Rotas de API (app/*/route.ts)

| Rota | Tipo | Arquivo Fonte |
|------|------|---------------|
| `/api/orders` | api | `app/api/orders/route.ts` |
| `/admin/auth/callback` | api | `app/admin/auth/callback/route.ts` |

### Arquivos E2E Existentes

| Arquivo | Mapeamento |
|---------|------------|
| `tests/e2e/admin/login.spec.ts` | `/admin/login` |
| `tests/e2e/public/checkout.spec.ts` | `/menu/[slug]/checkout` |
| `tests/e2e/public/offline.spec.ts` | — (fallback offline) |

### Arquivos BDD Existentes (por proximidade)

| Arquivo | Mapeamento |
|---------|------------|
| `app/admin/login/login.feature` | `/admin/login` (4 cenários) |
| `app/admin/signup/signup.feature` | `/admin/signup` |
| `app/admin/dashboard/dashboard.feature` | `/admin/dashboard` |
| `app/admin/categories/categories.feature` | `/admin/categories` |
| `app/admin/products/products.feature` | `/admin/products` |
| `app/admin/orders/orders.feature` | `/admin/orders` |
| `app/admin/settings/settings.feature` | `/admin/settings` |
| `app/menu/[slug]/menu.feature` | `/menu/[slug]` |
| `app/menu/[slug]/checkout/checkout.feature` | `/menu/[slug]/checkout` |
| `app/api/orders/orders.feature` | `/api/orders` |

---

## Formato do Relatório JSON

```json
{
  "generated": "2026-04-17T12:00:00.000Z",
  "routes": [
    {
      "path": "/admin/login",
      "type": "page",
      "tests": ["tests/e2e/admin/login.spec.ts"],
      "bdds": ["app/admin/login/login.feature"],
      "status": "green",
      "scenarios": 4
    },
    {
      "path": "/admin/settings",
      "type": "page",
      "tests": [],
      "bdds": ["app/admin/settings/settings.feature"],
      "status": "red",
      "scenarios": 0
    }
  ],
  "summary": {
    "total": 10,
    "green": 4,
    "yellow": 2,
    "red": 4
  }
}
```

---

## Formato do Relatório HTML

Estrutura:
- Header com título e timestamp
- Summary cards (total, green, yellow, red) com cores
- Tabela de rotas com colunas:
  - Path (rota)
  - Type (page/api)
  - Tests (links ou "—")
  - BDDs (links ou "—")
  - Status (badge colorido)
  - Scenarios (número)
- CSS inline para portabilidade

---

## Estratégia TDD/BDD/ATDD

### TDD (Test-Driven Development)
- O script será validado por si mesmo ao verificar se identifica corretamente as rotas existentes
- Testes unitários podem ser escritos para funções de parsing (glob, regex)

### BDD (Behavior-Driven Development)
- Cenários BDD já existem para várias rotas
- O script apenas mapeia, não muda comportamento

### ATDD (Acceptance Test-Driven Development)
- Critério de aceitação: CA-01 exige que `npm run test:coverage:e2e` execute sem erros
- A saída JSON/HTML serve como evidência de execução

---

## Estratégia DDD (Domain-Driven Design)

### Bounded Context
- **Contexto**: Test Coverage Reporting
- **Linguagem Ubíqua**: Route, Test, BDD, Scenario, Coverage, Status

### Aggregates
- `Route` — Entidade principal com identidade pelo path
- `CoverageReport` — Aggregate root que contém todas as rotas e summary

### Value Objects
- `RouteStatus` — green | yellow | red
- `RouteType` — page | api

---

## Mudanças de Arquivos

### Arquivos a Criar

| Arquivo | Descrição |
|---------|-----------|
| `scripts/generate-test-coverage.ts` | Script principal de geração de relatório |
| `tests/e2e/coverage-report.json` | Output (gerado na execução) |
| `tests/e2e/coverage-report.html` | Output (gerado na execução) |

### Arquivos a Modificar

| Arquivo | Modificação |
|---------|-------------|
| `package.json` | Adicionar script `test:coverage:e2e` |

---

## Integração com package.json

```json
{
  "scripts": {
    "test:coverage:e2e": "tsx scripts/generate-test-coverage.ts",
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest",
    "test:unit": "vitest --run tests/unit",
    "test:integration": "vitest --run tests/integration",
    "test:e2e": "playwright test",
    "test:coverage": "vitest --run --coverage",
    "test:watch": "vitest --watch",
    "test:ui": "vitest --ui"
  }
}
```

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| `tsx` | ^4.0.0 | Executar TypeScript diretamente (já em devDependencies do projeto ou adicionar) |
| `glob` | ^10.0.0 | Pattern matching para arquivos (Node 18+ native ou adicionar) |

**Nota**: Verificar se `tsx` já está disponível. Se não, será adicionado como devDependency.

---

## Riscos e Mitigações

| Risco | Mitigação |
|-------|-----------|
| Arquivos .feature não seguem padrão "Cenário:" | Usar regex case-insensitive para "Scenario:" também |
| Rotas dinâmicas como `[slug]` não mapeiam para E2E | Manter mapeamento flexível (similarity match) |
| Complexidade de glob em caminhos com especiais | Usar `path.resolve` e normalização |

---

## Perguntas em Aberto

1. **Rotas dinâmicas** (`/menu/[slug]`): O E2E `tests/e2e/public/checkout.spec.ts` mapeia para qual rota exata? Devemos criar `tests/e2e/public/menu.spec.ts`?

2. **`tsx`**: O projeto já tem `tsx` como dependência? Se não, qual preferência — adicionar `tsx` ou usar `ts-node`?

---

## Próximo Passo

Este design serve como entrada para `sdd-tasks`, que irá decompor em tarefas de implementação seguindo as fases DDD: Infraestrutura (script), Domínio (types/interfaces), Aplicação (lógica de mapeamento), Interface (output JSON/HTML), Documentação (AGENTS.md).
