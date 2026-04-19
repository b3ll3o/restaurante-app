# Tasks: interface-tests-report

## Fonte da Verdade

Este documento é parte da change `interface-tests-report` e define as tarefas de implementação para o sistema de relatório de cobertura de testes E2E.

---

## Pré-condições

- [x] Design aprovado: `.openspec/changes/interface-tests-report/design.md`
- [x] Dependências verificadas (`tsx`, `glob`)

---

## Fase 1: Script Infrastructure

### 1.1: Criar diretório e arquivo principal

- [x] 1.1.1: Criar arquivo `scripts/generate-test-coverage.ts`
- [x] 1.1.2: Adicionar imports necessários (`fs`, `path`, `glob`)
- [x] 1.1.3: Definir constantes para paths (`appDir`, `testsDir`, `outputDir`)

### 1.2: Definir tipos TypeScript

- [x] 1.2.1: Definir interface `Route` com campos: `path`, `type`, `filePath`, `tests`, `bdds`, `status`, `scenarios`
- [x] 1.2.2: Definir interface `CoverageReport` com campos: `generated`, `routes`, `summary`
- [x] 1.2.3: Definir type `RouteStatus` como `"green" | "yellow" | "red"`
- [x] 1.2.4: Definir type `RouteType` como `"page" | "api"`

### 1.3: Implementar função `init()`

- [x] 1.3.1: Configurar `appDir` como `path.resolve(process.cwd(), 'app')`
- [x] 1.3.2: Configurar `testsDir` como `path.resolve(process.cwd(), 'tests/e2e')`
- [x] 1.3.3: Configurar `outputDir` como `path.resolve(process.cwd(), 'tests/e2e')`

---

## Fase 2: Route Scanner + Test Mapper + BDD Linker

### 2.1: Implementar `scanRoutes(appDir: string): Route[]`

- [x] 2.1.1: Usar `glob` para encontrar `**/page.tsx` e `**/route.ts`
- [x] 2.1.2: Converter filePath para path (e.g., `app/admin/login/page.tsx` → `/admin/login`)
- [x] 2.1.3: Identificar tipo (`page` ou `api`) baseado na extensão
- [x] 2.1.4: Tratar rotas dinâmicas `[slug]` mantendo o placeholder

### 2.2: Implementar `mapE2ETests(route: Route): string[]`

- [x] 2.2.1: Inferir caminho do teste E2E baseado no padrão de proximidade
- [x] 2.2.2: Mapear `app/admin/login/page.tsx` → `tests/e2e/admin/login.spec.ts`
- [x] 2.2.3: Mapear `app/menu/[slug]/page.tsx` → `tests/e2e/public/menu.spec.ts`
- [x] 2.2.4: Retornar array vazio se arquivo não existir

### 2.3: Implementar `mapBDDFeatures(route: Route): string[]`

- [x] 2.3.1: Inferir caminho do `.feature` baseado na proximidade
- [x] 2.3.2: Mapear `app/admin/login/page.tsx` → `app/admin/login/login.feature`
- [x] 2.3.3: Retornar array vazio se arquivo não existir

### 2.4: Implementar `countScenarios(featurePath: string): number`

- [x] 2.4.1: Ler conteúdo do arquivo `.feature`
- [x] 2.4.2: Aplicar regex `/^Cenário:|^Scenario:/im` para contar cenários
- [x] 2.4.3: Retornar contagem total

### 2.5: Implementar `calculateStatus(route: Route): RouteStatus`

- [x] 2.5.1: `green`: route tem E2E (`tests.length > 0`) E BDD (`bdds.length > 0`)
- [x] 2.5.2: `yellow`: route tem apenas E2E OU apenas BDD
- [x] 2.5.3: `red`: route não tem E2E nem BDD

---

## Fase 3: HTML Report Generation

### 3.1: Implementar `generateJSON(report: CoverageReport, outputPath: string): void`

- [x] 3.1.1: Serializar report para JSON com `JSON.stringify(report, null, 2)`
- [x] 3.1.2: Escrever em `tests/e2e/coverage-report.json`
- [x] 3.1.3: logging: `console.log('JSON report written to', outputPath)`

### 3.2: Implementar `generateHTML(report: CoverageReport, outputPath: string): void`

- [x] 3.2.1: Criar template HTML com CSS inline (summary cards + tabela)
- [x] 3.2.2: Renderizar summary cards (total, green, yellow, red) com cores
- [x] 3.2.3: Renderizar tabela com colunas: Path, Type, Tests, BDDs, Status, Scenarios
- [x] 3.2.4: Links para arquivos E2E/BDD (se existirem)
- [x] 3.2.5: Badges coloridos para status
- [x] 3.2.6: Escrever em `tests/e2e/coverage-report.html`
- [x] 3.2.7: logging: `console.log('HTML report written to', outputPath)`

---

## Fase 4: npm script integration

### 4.1: Verificar dependências

- [x] 4.1.1: Verificar se `tsx` está em `devDependencies`
- [x] 4.1.2: Se não existir, adicionar `tsx` como devDependency

### 4.2: Atualizar package.json

- [x] 4.2.1: Adicionar script `test:coverage:e2e` com valor `tsx scripts/generate-test-coverage.ts`
- [x] 4.2.2: Adicionar script `test:coverage:e2e:open` com valor para abrir HTML (opcional)

---

## Fase 5: Documentation

### 5.1: Criar AGENTS.md para scripts

- [x] 5.1.1: Criar `scripts/AGENTS.md` documentando:
  - Propósito do diretório
  - Script `generate-test-coverage.ts` e sua responsabilidade
  - Interface pública (funções exportadas)
  - Usage examples

### 5.2: Verificar/Atualizar AGENTS.md existente

- [x] 5.2.1: Verificar se `tests/e2e/AGENTS.md` existe
- [x] 5.2.2: Se existir, adicionar menção ao coverage report

---

## Progresso

```
████████████████████ 100%
```

---

## Status

Concluído

---

## Verificação

- Script executa sem erros: `npx tsx scripts/generate-test-coverage.ts` ✅
- JSON report criado: `tests/e2e/coverage-report.json` ✅
- HTML report criado: `tests/e2e/coverage-report.html` ✅
- `tsx` em devDependencies: ✅ (^4.0.0)
- Script `test:coverage:e2e` no package.json: ✅
- `scripts/AGENTS.md` existe: ✅
- `tests/e2e/AGENTS.md` menciona coverage reports: ✅

---

## Referências

- Design: `.openspec/changes/interface-tests-report/design.md`
- Tipos: Route, CoverageReport, RouteStatus, RouteType
- Output: `tests/e2e/coverage-report.json`, `tests/e2e/coverage-report.html`
- npm script: `npm run test:coverage:e2e`

---

**Última Atualização**: 2026-04-17
