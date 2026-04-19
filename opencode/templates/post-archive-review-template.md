# Template: Post-Archive Review Workflow

## Visão Geral

Workflow obrigatório a ser executado após cada mudança ser arquivada no SDD.
Garante que código, documentação e testes estão consistentes após a mudança.

**Quando usar**: Após `sdd-archive` completar, antes de iniciar nova change.

---

## Fases do Workflow

### Fase 1: Verificação de Código

```bash
# Build
npm run build

# Lint
npm run lint

# Type check
npx tsc --noEmit
```

**Critério**: Todos os comandos devem passar sem erros.

---

### Fase 2: Verificação de Testes

```bash
# Unitários
npm run test:unit

# Cobertura (mínimo 80%)
npm run test:coverage

# Integração (se aplicável)
npm run test:integration

# E2E (fluxos críticos)
npm run test:e2e
```

**Critério**:
- Cobertura ≥ 80%
- Todos os testes passam
- Fluxos críticos E2E cobertos

---

### Fase 3: Verificação de Documentação

#### 3.1 AGENTS.md atualizado
```bash
# Verificar se AGENTS.md existe nos módulos modificados
ls -la {módulo-modificado}/AGENTS.md
```

#### 3.2 BDD scenarios atualizados
```bash
# Verificar arquivos .feature nos módulos
ls -la {módulo-modificado}/*.feature
```

#### 3.3 Proximidade de documentação
```bash
# Verificar que documentação está no nível correto
# (REGRA: AGENTS.md e .feature no mesmo nível do módulo)
```

---

### Fase 4: Revisão de Dependências

```bash
# Verificar dependências
npm ls

# Verificar vulnerabilidades
npm audit
```

---

### Fase 5: Cobertura de Rotas (Backlog Contínuo)

**Objetivo**: Garantir que todas as rotas da aplicação tenham testes automatizados.

#### 5.1 Mapeamento de Rotas

```bash
# Listar todas as rotas da aplicação
# Admin: app/admin/**/page.tsx, app/admin/**/route.ts
# API: app/api/**/route.ts
# Menu: app/menu/**/page.tsx
```

#### 5.2 Verificação de Cobertura por Tipo de Teste

| Tipo de Teste | O que cobre | Critério |
|---------------|-------------|----------|
| **Unitário** | Funções, hooks, utils, lógica de negócio | Rotas com lógica complexa |
| **Integração** | API routes, contexto, Supabase | Rotas `/api/*` |
| **E2E (Interface)** | Pages, fluxos de usuário, interações | Rotas de página (`page.tsx`) |

#### 5.3 Checklist de Cobertura de Rotas

Para cada rota nova/modificada na change:

- [ ] **Unitários**: Lógica de negócio da rota tem testes?
- [ ] **Integração**: API route tem testes de integração?
- [ ] **Interface**: Page tem testes E2E de interface?

#### 5.4 Matriz de Rastreamento

```
Rota                          │ Unit │ Integ │ E2E │
------------------------------|------|-------|-----│
app/admin/login/page.tsx      │  ✅  │   -   │  ✅ │
app/admin/dashboard/page.tsx  │  ✅  │   -   │  ✅ │
app/api/orders/route.ts       │  ✅  │  ✅   │  -  │
app/menu/[slug]/page.tsx      │  ✅  │   -   │  ✅ │
```

#### 5.5 Critério de Aceitação

- [ ] **100%** das rotas de API (`/api/*`) cobertas por testes de integração
- [ ] **100%** das páginas críticas (login, dashboard, menu) cobertas por E2E
- [ ] **100%** da lógica de negócio coberta por unitários
- [ ] **Nenhuma rota nova** sem pelo menos 1 tipo de teste

---

## Backlog Item: Relatório de Interface com Screenshots

### Problema

### Verificação Mobile-First
- [ ] Layout usa `min-width` (mobile base, desktop override)
- [ ] Touch targets ≥ 44x44px
- [ ] Breakpoints corretos (640px, 1024px, 1280px)
- [ ] Fonts legíveis em mobile (min 16px body)

### Verificação Offline-First
- [ ] Dados em localStorage para uso offline
- [ ] Service Worker registrado
- [ ] Indicador visual de status offline
- [ ] Carrinho funciona sem conexão
- [ ] Testes incluem cenários offline

### Critérios Mobile-First
| Métrica | Target | Prioridade |
|---------|--------|------------|
| FCP | < 1.8s (3G) | Crítica |
| LCP | < 2.5s | Crítica |
| TTI | < 3.5s | Alta |
| CLS | < 0.1 | Alta |

### Critérios Offline-First
| Funcionalidade | Comportamento Offline |
|---------------|----------------------|
| Ver cardápio | ✅ Funciona (cache local) |
| Adicionar ao carrinho | ✅ Funciona (localStorage) |
| Fazer pedido | ⚠️ Mostra indicador "offline" mas não bloqueia |
| Sincronização | ✅ Automática ao reconectar |

---

## Backlog Item: Relatório de Interface com Screenshots

### Problema
Testes E2E executam mas não geram relatório visual com screenshots para revisão humana.

### Soluções Propostas

#### Opção A: Playwright HTML Reporter (Recomendado)
```bash
# Configuração no playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [['html', { outputFolder: 'playwright-report' }]],
  use: {
    screenshot: 'only-on-failure',  // captura só em falhas
    // ou: screenshot: 'always'     // captura em todo passo
  }
});

# Visualizar relatório
npx playwright show-report
```

**Prós**: Nativo do Playwright, fácil de configurar, relatório interativo
**Contras**: Screenshots só em falha (com `only-on-failure`)

---

#### Opção B: Playwright Trace Viewer com Screenshots
```bash
# Configuração
reporter: [['html']],
use: {
  trace: 'on-first-retry',  // coleta traces no primeiro retry
}

# Visualizar com screenshots
npx playwright show-trace trace.zip
```

**Prós**: Captura completa, replay interativo, screenshots por step
**Contras**: Arquivo zip grande, precisa ferramenta externa

---

#### Opção C: Custom Gallery Report
```typescript
// tests/e2e/gallery-report.ts
import { test } from '@playwright/test';
import * as fs from 'fs';

test('generate gallery report', async ({ page }) => {
  const screenshots: { name: string; path: string }[] = [];

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    const filename = `${test.info().title}-${Date.now()}.png`;
    await page.screenshot({ path: `reports/screenshots/${filename}` });
    screenshots.push({ name: test.info().title, path: filename });
  });

  // Gera HTML com galeria
  generateGalleryHTML(screenshots);
});
```

**Prós**: Totalmente customizável, formato livre
**Contras**: Precisa implementação custom

---

### Recomendação

**Opção A (Playwright HTML Reporter)** + **Opção B (Trace Viewer)** para coverage completo:
- `screenshot: 'only-on-failure'` para relatórios compactos
- `trace: 'on-first-retry'` para debugging profundo

### Implementação Sugerida

1. Criar `playwright.config.ts` com reporter HTML
2. Configurar screenshot mode
3. Adicionar script `npm run test:e2e:report`
4. GitHub Actions: upload do relatório como artifact

---

### Critério de Aceitação do Backlog

- [ ] Playwright configurado com HTML Reporter
- [ ] Screenshots capturados em falhas
- [ ] Relatório acessível via `npm run test:e2e:report`
- [ ] Screenshots disponíveis no artifact do CI/CD

---

### Fase 6: Consolidação de Specs

Se a change adicionou novos requisitos:

- [ ] Requisito foi adicionado à spec principal?
- [ ] Critério de aceitação foi mapeado?
- [ ] Casos de teste foram criados?

---

## Checklist Final

| Verificação | Status | Prioridade |
|-------------|--------|-----------|
| Build passa | [ ] | Crítica |
| Lint passa | [ ] | Crítica |
| Type check passa | [ ] | Crítica |
| Testes unitários passam | [ ] | Crítica |
| Cobertura ≥ 80% | [ ] | Crítica |
| E2E fluxos críticos | [ ] | Alta |
| AGENTS.md atualizado | [ ] | Alta |
| BDD scenarios atualizados | [ ] | Alta |
| Dependências consistentes | [ ] | Média |
| Spec principal consolidada | [ ] | Média |
| **Cobertura de Rotas (Unit)** | [ ] | Crítica |
| **Cobertura de Rotas (Integração)** | [ ] | Crítica |
| **Cobertura de Rotas (E2E)** | [ ] | Crítica |
| **Mobile-First (CSS)** | [ ] | Crítica |
| **Offline-First (Cache)** | [ ] | Crítica |
| **Offline-First (Service Worker)** | [ ] | Crítica |

---

## Fluxo

```
sdd-archive → post-archive-review → nova change
                          ↓
                    [Se tudo OK]
                          ↓
                    [Se problema]
                          ↓
                    Criar new change para corrigir
```

---

## Exemplo de Execução

```bash
# 1. Build
npm run build && echo "✅ Build OK"

# 2. Lint
npm run lint && echo "✅ Lint OK"

# 3. Type check
npx tsc --noEmit && echo "✅ Type check OK"

# 4. Testes
npm run test && echo "✅ Testes OK"

# 5. Cobertura
npm run test:coverage | grep "coverage"

# 6. Documentação
# (verificação manual dos módulos afetados)
```

---

## Status do Template

- [x] Criado
- [ ] Validado
- [ ] Adotado no workflow padrão

---

**Versão**: 1.0
**Última Atualização**: 2026-04-17
**Autor**: AI Agent
