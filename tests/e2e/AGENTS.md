# Testes E2E - MenuLink

## Visão Geral

O sub-módulo **Testes E2E** (`tests/e2e/`) é responsável por validar fluxos completos da aplicação do ponto de vista do usuário, simulando interações reais com o navegador através do Playwright.

**Responsabilidade**: Garantir que os fluxos críticos do sistema funcionem corretamente em um ambiente que simula uso real.

**Idioma**: Português Brasileiro (pt-BR)

**Stack**: Playwright + TypeScript

---

## Estrutura de Diretórios

```
tests/e2e/
├── admin/
│   └── login.spec.ts       # Fluxos de autenticação admin
├── public/
│   ├── checkout.spec.ts    # Fluxo de checkout público
│   └── offline.spec.ts     # Testes offline-first
├── support/
│   └── page-objects/
│       └── index.ts        # Page Objects reutilizáveis
└── AGENTS.md               # Este arquivo
```

### Descrição dos Arquivos

| Arquivo | Responsabilidade |
|---------|------------------|
| `admin/login.spec.ts` | Testar login, logout e erros de autenticação admin |
| `public/checkout.spec.ts` | Testar visualização do cardápio, adição ao carrinho e checkout |
| `support/page-objects/index.ts` | Page Objects para abstrair seletores e ações |

---

## Padrões (Page Objects)

Os testes E2E seguem o padrão **Page Object** para reduzir duplicação e isolar seletores:

### Page Objects Disponíveis

| Page Object | Responsabilidade | Métodos Principais |
|-------------|------------------|---------------------|
| `LoginPage` | Página de login admin | `goto()`, `login()`, `expectError()` |
| `SignupPage` | Página de cadastro admin | `goto()`, `signup()` |
| `DashboardPage` | Dashboard admin | `goto()`, `expectToBeVisible()` |
| `CategoriesPage` | Gerenciamento de categorias | `goto()`, `addCategory()`, `expectCategoryExists()` |
| `ProductsPage` | Gerenciamento de produtos | `goto()`, `addProduct()`, `expectProductExists()` |
| `OrdersPage` | Listagem de pedidos | `goto()`, `confirmOrder()`, `cancelOrder()` |
| `MenuPage` | Cardápio público | `goto()`, `openCart()`, `proceedToCheckout()`, `fillCheckout()`, `confirmOrder()` |

### Exemplo de Uso

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../support/page-objects';

test('deve fazer login com credenciais válidas', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  
  await loginPage.login('owner@restaurant.com', 'senha123');
  await loginPage.expectToBeLoggedIn();
});
```

### Estrutura de Page Object

```typescript
export class NomePage {
  readonly page: Page;
  readonly seletor1: Locator;
  readonly seletor2: Locator;

  constructor(page: Page) {
    this.page = page;
    this.seletor1 = page.getByLabel('Label');
    this.seletor2 = page.getByRole('button', { name: 'Texto' });
  }

  async goto() {
    await this.page.goto('/caminho/da/pagina');
  }

  async acao() {
    await this.seletor1.fill('valor');
    await this.seletor2.click();
  }
}
```

---

## 100% Fluxos Críticos Cobertos

### Fluxos Críticos Obrigatórios

| # | Fluxo | Módulo | Status |
|---|-------|--------|--------|
| 1 | Login admin com credenciais válidas | admin | ✅ `admin/login.spec.ts` |
| 2 | Login admin com credenciais inválidas | admin | ✅ `admin/login.spec.ts` |
| 3 | Visualização de cardápio público | public | ✅ `public/checkout.spec.ts` |
| 4 | Adicionar produto ao carrinho | public | ✅ `public/checkout.spec.ts` |
| 5 | Checkout completo | public | ✅ `public/checkout.spec.ts` |
| 6 | Validação de campos obrigatórios | public | ✅ `public/checkout.spec.ts` |
| 7 | Indicador offline quando desconectado | public | ✅ `public/offline.spec.ts` |
| 8 | Carrinho funciona offline | public | ✅ `public/offline.spec.ts` |
| 9 | Carrinho persiste após reload offline | public | ✅ `public/offline.spec.ts` |
| 10 | Toast de reconexão | public | ✅ `public/offline.spec.ts` |
| 11 | Service Worker registrado | public | ✅ `public/offline.spec.ts` |
| 12 | localStorage persiste carrinho | public | ✅ `public/offline.spec.ts` |

### Fluxos a Implementar

| # | Fluxo | Módulo | Status |
|---|-------|--------|--------|
| 7 | Cadastro de novo restaurante | admin | 🔲 Pending |
| 8 | CRUD de categorias | admin | 🔲 Pending |
| 9 | CRUD de produtos | admin | 🔲 Pending |
| 10 | Gerenciamento de pedidos | admin | 🔲 Pending |
| 11 | Logout admin | admin | 🔲 Pending |

---

## Cenários de Teste

### Login Admin

```typescript
test.describe('Login', () => {
  test('deve exibir página de login', async ({ page }) => {
    // Verifica campos visíveis
  });

  test('deve mostrar erro com credenciais inválidas', async ({ page }) => {
    // Preenche credenciais erradas
    // Verifica mensagem de erro
  });

  test('deve fazer login com credenciais válidas', async ({ page }) => {
    // Login com credenciais corretas
    // Verifica redirect para dashboard
  });
});
```

### Checkout Público

```typescript
test.describe('Checkout', () => {
  test('deve exibir cardápio público', async ({ page }) => {
    // Navega para /menu/[slug]
    // Verifica conteúdo carregado
  });

  test('deve adicionar produto ao carrinho', async ({ page }) => {
    // Clica em adicionar
    // Verifica badge do carrinho
  });

  test('deve completar fluxo de checkout', async ({ page }) => {
    // Adiciona produto
    // Abre carrinho
    // Preenche dados do cliente
    // Confirma pedido
    // Verifica sucesso
  });
});
```

---

## Configuração

### Playwright Config

Os testes E2E utilizam a configuração padrão do projeto (`playwright.config.ts`). Certifique-se de que:

1. **Base URL** configurado para ambiente de teste
2. **Timeouts** adequados para operações assíncronas
3. **Screenshots** configurados para falhas automáticas

### Variáveis de Ambiente

| Variável | Descrição | Uso |
|----------|-----------|-----|
| `SKIP_E2E_AUTH` | Pula testes que requerem autenticação real | `admin/login.spec.ts` |
| `SKIP_E2E_PUBLIC` | Pula testes do cardápio público | `public/checkout.spec.ts` |
| `TEST_RESTAURANT_SLUG` | Slug do restaurante de teste | `public/checkout.spec.ts` |

### Comandos

```bash
# Rodar todos os E2E
npm run test:e2e

# Rodar com UI interativa
npm run test:e2e:ui

# Rodar em modo debug
npm run test:e2e:debug

# Ver relatório
npx playwright show-report
```

---

## Boas Práticas

### 1. Sempre usar Page Objects

```typescript
// ✅ Bom - Page Object
const menuPage = new MenuPage(page);
await menuPage.goto('bar-do-joao');
await menuPage.addProductToCart('Pizza');

// ❌ Ruim - Seletores inline
await page.goto('/menu/bar-do-joao');
await page.getByRole('button', { name: /adicionar/i }).first().click();
```

### 2. Isolamento com beforeEach

```typescript
test.beforeEach(async ({ page }) => {
  await page.goto('/menu/restaurante-teste');
});
```

### 3. Skip Condicional

```typescript
test.beforeEach(async ({ page }) => {
  test.skip(process.env.SKIP_E2E_PUBLIC === 'true', 'Requer restaurante de teste');
});
```

### 4. Setup de Dados

```typescript
test.beforeEach(async ({ page }) => {
  // Criar dados de teste via API ou usar fixtures
  await createTestRestaurant();
  await page.goto('/menu/test-restaurant');
});
```

### 5. Expect Significativos

```typescript
// ✅ Bom - Verificação clara
await expect(page.getByText('Pedido enviado com sucesso')).toBeVisible();

// ❌ Ruim - Verificação vaga
await expect(page.locator('.message')).toBeVisible();
```

---

## Métricas de Qualidade

| Métrica | Target | Prioridade | Status |
|---------|--------|------------|--------|
| Fluxos críticos cobertos | 100% | Crítica | 6/11 (55%) |
| Page Objects disponíveis | 100% | Alta | 7/7 (100%) |
| Pass rate | ≥95% | Alta | - |
| Tempo de execução | <5min | Média | - |
| Screenshots de falha | Automático | Alta | ✅ |

### Checklist de Cobertura

- [x] Login admin (válido e inválido)
- [x] Cardápio público
- [x] Adição ao carrinho
- [x] Checkout completo
- [x] Validação de campos
- [x] Offline-First (indicador, carrinho, localStorage)
- [x] Service Worker cache
- [ ] Cadastro admin
- [ ] CRUD categorias
- [ ] CRUD produtos
- [ ] Gerenciamento pedidos
- [ ] Logout admin

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| @playwright/test | ^1.59.1 | Framework de testes E2E |

---

## Referências

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright Page Objects](https://playwright.dev/docs/pom)
- [tests/AGENTS.md](../AGENTS.md) - Visão geral dos testes

---

**Versão**: 1.0
**Última Atualização**: 2026-04-17
**Autor**: AI Agent