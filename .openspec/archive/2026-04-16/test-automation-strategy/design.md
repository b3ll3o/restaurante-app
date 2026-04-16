# Design: Estratégia de Automação de Testes Full-Stack

## Fonte da Verdade

Este documento detalha as decisões arquiteturais para implementação da estratégia de testes.

---

## 1. Stack e Configuração

### 1.1 Stack Escolhida

**Decisão**: Manter **Jest** (já configurado) em vez de migrar para Vitest.

**Justificativa**:
- Jest já está configurado e funcionando no projeto
- Migrar para Vitest requer trabalho extra sem benefício imediato
- Jest + jest-environment-jsdom + @testing-library funciona bem
- PRD.md propõe Vitest, mas isso não é obrigatório

### 1.2 Dependências

```json
{
  "devDependencies": {
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/react": "^15.0.7",
    "@testing-library/user-event": "^14.5.0",
    "@playwright/test": "^1.45.0",
    "msw": "^2.3.0",
    "supertest": "^7.0.0"
  }
}
```

**Nota**: `@testing-library/react@15.0.7` tem warning de peer dependency com React 19, mas funciona com `--legacy-peer-deps`.

### 1.3 Configuração Jest (jest.config.ts)

```typescript
import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/tests/e2e/'],
  coverageThreshold: {
    global: {
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};

export default createJestConfig(config);
```

### 1.4 Configuração Playwright (playwright.config.ts)

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## 2. Estrutura de Diretórios

```
tests/
├── setup.ts                    # Configuração global (jest-dom)
├── unit/
│   ├── lib/
│   │   ├── utils.test.ts
│   │   └── whatsapp.test.ts
│   └── context/
│       └── cart-context.test.tsx
├── integration/
│   └── api/
│       └── orders.test.ts
├── e2e/
│   ├── admin/
│   │   ├── signup.spec.ts
│   │   ├── login.spec.ts
│   │   ├── categories.spec.ts
│   │   ├── products.spec.ts
│   │   └── orders.spec.ts
│   ├── public/
│   │   └── checkout.spec.ts
│   └── support/
│       ├── page-objects/
│       │   ├── LoginPage.ts
│       │   ├── AdminPage.ts
│       │   ├── CategoriesPage.ts
│       │   ├── ProductsPage.ts
│       │   └── MenuPage.ts
│       └── steps/
│           └── common.steps.ts
└── mocks/
    └── handlers.ts             # Handlers MSW (se necessário)
```

---

## 3. Testes Unitários

### 3.1 tests/unit/lib/utils.test.ts

```typescript
import { describe, it, expect } from '@jest/globals';
import { cn, formatPrice, generateSlug, isValidWhatsApp, isValidPrice, isValidName } from '@/lib/utils';

describe('cn', () => {
  it('should merge classes correctly', () => {
    expect(cn('px-2 py-1', 'bg-red')).toBe('px-2 py-1 bg-red');
  });
});

describe('formatPrice', () => {
  it('should format price in BRL', () => {
    expect(formatPrice(10)).toBe('R$ 10,00');
    expect(formatPrice(10.5)).toBe('R$ 10,50');
    expect(formatPrice(1234.56)).toBe('R$ 1.234,56');
  });
});

describe('generateSlug', () => {
  it('should convert text to slug', () => {
    expect(generateSlug('Bar do João')).toBe('bar-do-joao');
    expect(generateSlug('Pizza & Pasta')).toBe('pizza-pasta');
  });
});

describe('isValidWhatsApp', () => {
  it('should validate Brazilian phone numbers', () => {
    expect(isValidWhatsApp('11999999999')).toBe(true);
    expect(isValidWhatsApp('5511999999999')).toBe(true);
    expect(isValidWhatsApp('999999999')).toBe(false);
    expect(isValidWhatsApp('abc')).toBe(false);
  });
});

describe('isValidPrice', () => {
  it('should validate prices', () => {
    expect(isValidPrice(10)).toBe(true);
    expect(isValidPrice(0)).toBe(false);
    expect(isValidPrice(-5)).toBe(false);
  });
});

describe('isValidName', () => {
  it('should validate names', () => {
    expect(isValidName('João')).toBe(true);
    expect(isValidName('Jo')).toBe(true);
    expect(isValidName('J')).toBe(false);
    expect(isValidName('')).toBe(false);
  });
});
```

### 3.2 tests/unit/lib/whatsapp.test.ts

```typescript
import { describe, it, expect } from '@jest/globals';
import { formatOrderMessage, generateWhatsAppUrl } from '@/lib/whatsapp';

describe('formatOrderMessage', () => {
  it('should format order message correctly', () => {
    const order = {
      id: '12345678-abcd',
      customer_name: 'Maria Silva',
      customer_whatsapp: '11999999999',
      total: 45.90,
      payment_method: 'pix'
    };
    const items = [
      { quantity: 2, product_name: 'Pizza', total_price: 60.00 },
      { quantity: 1, product_name: 'Refrigerante', total_price: 8.00 }
    ];

    const message = formatOrderMessage(order, items);

    expect(message).toContain('12345678');
    expect(message).toContain('Maria Silva');
    expect(message).toContain('PIX');
    expect(message).toContain('R$ 68,00');
  });
});

describe('generateWhatsAppUrl', () => {
  it('should generate correct wa.me URL', () => {
    const url = generateWhatsAppUrl('5511999999999', 'Olá!');
    expect(url).toBe('https://wa.me/5511999999999?text=Ol%C3%A1%21');
  });

  it('should clean non-numeric characters', () => {
    const url = generateWhatsAppUrl('+55 (11) 9999-9999', 'Teste');
    expect(url).toContain('5511999999999');
  });
});
```

---

## 4. Testes de Integração

### 4.1 tests/integration/api/orders.test.ts

```typescript
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.post('/api/orders', () => {
    return HttpResponse.json({
      success: true,
      order: { id: '123', status: 'pending' }
    });
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());

describe('POST /api/orders', () => {
  it('should create order with valid data', async () => {
    const response = await request('/api/orders')
      .post('/api/orders')
      .send({
        customerName: 'Maria',
        customerWhatsapp: '11999999999',
        paymentMethod: 'pix',
        items: [{ product: { id: '1', name: 'Pizza', price: 45 }, quantity: 1 }],
        total: 45,
        restaurantId: 'rest-123'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
```

---

## 5. Testes E2E

### 5.1 Page Objects

```typescript
// tests/e2e/support/page-objects/LoginPage.ts
import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/admin/login');
  }

  async login(email: string, password: string) {
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Senha').fill(password);
    await this.page.getByRole('button', { name: 'Entrar' }).click();
  }
}
```

### 5.2 Teste E2E de Checkout

```typescript
// tests/e2e/public/checkout.spec.ts
import { test, expect } from '@playwright/test';
import { MenuPage } from '../support/page-objects/MenuPage';

test.describe('Checkout', () => {
  test('should complete checkout flow', async ({ page }) => {
    const menuPage = new MenuPage(page);

    // Acessar cardápio
    await menuPage.goto('bar-do-joao');

    // Adicionar produto
    await menuPage.addProductToCart('Pizza Grande');

    // Ir para checkout
    await menuPage.openCart();
    await menuPage.proceedToCheckout();

    // Preencher dados
    await menuPage.fillCheckout({
      name: 'Maria Silva',
      whatsapp: '11999999999',
      paymentMethod: 'pix'
    });

    // Confirmar
    await menuPage.confirmOrder();

    // Verificar sucesso
    await expect(page.getByText('Pedido Enviado!')).toBeVisible();
  });
});
```

---

## 6. Scripts npm

```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --testPathPattern=unit",
    "test:integration": "jest --testPathPattern=integration",
    "test:e2e": "playwright test",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch"
  }
}
```

---

## 7. GitHub Actions

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:unit

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

---

## Status

Design (revisado - mantendo Jest)