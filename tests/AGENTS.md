# Tests - MenuLink

## Visão Geral

O módulo **Tests** contém toda a infraestrutura de testes automatizados do projeto MenuLink, incluindo testes unitários, de integração e E2E. O projeto segue rigorosos padrões de qualidade com cobertura mínima de 80% para testes unitários.

**Idioma**: Português Brasileiro (pt-BR)  
**Stack**: Jest + Testing Library + Playwright

---

## Estrutura de Diretórios

```
tests/
├── setup.ts                    # Configuração global dos testes
├── unit/                       # Testes unitários (≥80% cobertura)
│   ├── utils.test.ts          # Testes de funções utilitárias
│   ├── cart-context.test.tsx  # Testes do contexto do carrinho
│   └── whatsapp.test.ts       # Testes do serviço WhatsApp
├── integration/                # Testes de integração
│   ├── api.test.ts            # Testes de API routes
│   └── database.test.ts       # Testes de banco de dados
└── e2e/                        # Testes end-to-end
    ├── admin.spec.ts          # Fluxos do painel admin
    ├── public-menu.spec.ts    # Fluxos do cardápio público
    └── checkout.spec.ts       # Fluxo de checkout
```

---

## Configuração

### Jest (`jest.config.js`)

```javascript
/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@/context/(.*)$': '<rootDir>/context/$1',
    '^@/types/(.*)$': '<rootDir>/types/$1',
  },
  testMatch: [
    '<rootDir>/tests/**/*.test.ts',
    '<rootDir>/tests/**/*.test.tsx',
    '<rootDir>/tests/**/*.spec.ts',
    '<rootDir>/tests/**/*.spec.tsx',
  ],
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    'context/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};

module.exports = config;
```

### Setup Global (`tests/setup.ts`)

```typescript
import '@testing-library/jest-dom';

// Mock do Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock do Supabase
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn(),
      getUser: jest.fn(),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
          order: jest.fn(),
        })),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(),
        })),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(),
        })),
      })),
    })),
  })),
}));

// Mock do localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

// Mock do fetch
global.fetch = jest.fn();

// Limpar mocks após cada teste
afterEach(() => {
  jest.clearAllMocks();
});
```

---

## Sub-módulo: Testes Unitários (`tests/unit/`)

### Responsabilidade

Testar unidades individuais de código em isolamento, garantindo que cada função e componente funciona corretamente.

### Regras

- **Cobertura mínima**: 80%
- **Isolamento**: Cada teste é independente
- **Determinismo**: Testes produzem resultados consistentes

### Exemplo: utils.test.ts

```typescript
import { formatPrice, generateSlug, isValidWhatsApp, isValidPrice, isValidName } from '@/lib/utils';

describe('Utils', () => {
  describe('formatPrice', () => {
    it('should format price in BRL', () => {
      expect(formatPrice(10)).toBe('R$ 10,00');
      expect(formatPrice(10.5)).toBe('R$ 10,50');
      expect(formatPrice(1000)).toBe('R$ 1.000,00');
      expect(formatPrice(1234.56)).toBe('R$ 1.234,56');
    });

    it('should handle zero', () => {
      expect(formatPrice(0)).toBe('R$ 0,00');
    });
  });

  describe('generateSlug', () => {
    it('should convert text to slug', () => {
      expect(generateSlug('Bar do João')).toBe('bar-do-joao');
      expect(generateSlug('Restaurante São Paulo')).toBe('restaurante-sao-paulo');
      expect(generateSlug('Pizza & Pasta')).toBe('pizza-pasta');
    });

    it('should remove special characters', () => {
      expect(generateSlug('Café com Açúcar')).toBe('cafe-com-acucar');
      expect(generateSlug('Restaurante!!!')).toBe('restaurante');
    });

    it('should handle multiple spaces and hyphens', () => {
      expect(generateSlug('  Bar   do   João  ')).toBe('bar-do-joao');
      expect(generateSlug('---test---')).toBe('test');
    });
  });

  describe('isValidWhatsApp', () => {
    it('should validate Brazilian WhatsApp numbers', () => {
      expect(isValidWhatsApp('5511999999999')).toBe(true);
      expect(isValidWhatsApp('11999999999')).toBe(true);
      expect(isValidWhatsApp('999999999')).toBe(false);
      expect(isValidWhatsApp('abc')).toBe(false);
      expect(isValidWhatsApp('')).toBe(false);
    });
  });

  describe('isValidPrice', () => {
    it('should validate prices', () => {
      expect(isValidPrice(10.00)).toBe(true);
      expect(isValidPrice(0.01)).toBe(true);
      expect(isValidPrice(0)).toBe(false);
      expect(isValidPrice(-5)).toBe(false);
      expect(isValidPrice(1000000)).toBe(true);
    });
  });

  describe('isValidName', () => {
    it('should validate names', () => {
      expect(isValidName('João')).toBe(true);
      expect(isValidName('Jo')).toBe(true);
      expect(isValidName('J')).toBe(false);
      expect(isValidName('')).toBe(false);
      expect(isValidName('  ')).toBe(false);
      expect(isValidName('  João  ')).toBe(true);
    });
  });
});
```

### Exemplo: cart-context.test.tsx

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider, useCart } from '@/context/cart-context';

const TestComponent = () => {
  const { items, addItem, removeItem, updateQuantity, clearCart, total, itemCount } = useCart();

  return (
    <div>
      <span data-testid="item-count">{itemCount}</span>
      <span data-testid="total">{total}</span>
      <span data-testid="items">{items.length}</span>
      <button onClick={() => addItem({ id: '1', name: 'Pizza', price: 45.90 })}>
        Add
      </button>
      <button onClick={() => removeItem('1')}>Remove</button>
      <button onClick={() => updateQuantity('1', 2)}>Update</button>
      <button onClick={clearCart}>Clear</button>
    </div>
  );
};

describe('CartContext', () => {
  describe('addItem', () => {
    it('should add item to empty cart', async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      const user = userEvent.setup();
      await user.click(screen.getByText('Add'));

      expect(screen.getByTestId('item-count')).toHaveTextContent('1');
      expect(screen.getByTestId('total')).toHaveTextContent('45.9');
      expect(screen.getByTestId('items')).toHaveTextContent('1');
    });

    it('should increment quantity for existing item', async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      const user = userEvent.setup();
      await user.click(screen.getByText('Add'));
      await user.click(screen.getByText('Add'));

      expect(screen.getByTestId('item-count')).toHaveTextContent('2');
      expect(screen.getByTestId('total')).toHaveTextContent('91.8');
    });
  });

  describe('removeItem', () => {
    it('should remove one quantity', async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      const user = userEvent.setup();
      await user.click(screen.getByText('Add'));
      await user.click(screen.getByText('Add'));
      await user.click(screen.getByText('Remove'));

      expect(screen.getByTestId('item-count')).toHaveTextContent('1');
    });

    it('should remove item completely when quantity is 1', async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      const user = userEvent.setup();
      await user.click(screen.getByText('Add'));
      await user.click(screen.getByText('Remove'));

      expect(screen.getByTestId('items')).toHaveTextContent('0');
    });
  });

  describe('updateQuantity', () => {
    it('should update quantity', async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      const user = userEvent.setup();
      await user.click(screen.getByText('Add'));
      await user.click(screen.getByText('Update'));

      expect(screen.getByTestId('item-count')).toHaveTextContent('2');
      expect(screen.getByTestId('total')).toHaveTextContent('91.8');
    });
  });

  describe('clearCart', () => {
    it('should remove all items', async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      const user = userEvent.setup();
      await user.click(screen.getByText('Add'));
      await user.click(screen.getByText('Clear'));

      expect(screen.getByTestId('items')).toHaveTextContent('0');
      expect(screen.getByTestId('total')).toHaveTextContent('0');
    });
  });
});
```

---

## Sub-módulo: Testes de Integração (`tests/integration/`)

### Responsabilidade

Testar a interação entre múltiplos módulos e componentes, verificando que funcionam corretamente juntos.

### Regras

- **Mocks**: Usar mocks para dependências externas (Supabase, APIs)
- **Fixtures**: Dados de teste consistentes
- **Cleanup**: Limpar estado entre testes

### Exemplo: api.test.ts

```typescript
import { validateOrderRequest } from '@/lib/utils';

describe('POST /api/orders', () => {
  describe('validateOrderRequest', () => {
    it('should return valid for correct data', () => {
      const data = {
        restaurantId: 'valid-uuid',
        customerName: 'João Silva',
        customerWhatsapp: '5511999999999',
        paymentMethod: 'pix',
        items: [
          {
            productId: 'valid-uuid',
            productName: 'Pizza',
            unitPrice: 45.90,
            quantity: 2,
          },
        ],
      };

      const result = validateOrderRequest(data);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return error for missing customerName', () => {
      const data = {
        restaurantId: 'valid-uuid',
        customerName: '',
        customerWhatsapp: '5511999999999',
        paymentMethod: 'pix',
        items: [{ productId: 'uuid', productName: 'Pizza', unitPrice: 45.90, quantity: 1 }],
      };

      const result = validateOrderRequest(data);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Nome é obrigatório (mínimo 2 caracteres)');
    });

    it('should return error for invalid WhatsApp', () => {
      const data = {
        restaurantId: 'valid-uuid',
        customerName: 'João Silva',
        customerWhatsapp: '123',
        paymentMethod: 'pix',
        items: [{ productId: 'uuid', productName: 'Pizza', unitPrice: 45.90, quantity: 1 }],
      };

      const result = validateOrderRequest(data);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('WhatsApp é obrigatório (formato brasileiro)');
    });

    it('should return error for empty items', () => {
      const data = {
        restaurantId: 'valid-uuid',
        customerName: 'João Silva',
        customerWhatsapp: '5511999999999',
        paymentMethod: 'pix',
        items: [],
      };

      const result = validateOrderRequest(data);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Pedido deve ter pelo menos 1 item');
    });

    it('should return error for invalid payment method', () => {
      const data = {
        restaurantId: 'valid-uuid',
        customerName: 'João Silva',
        customerWhatsapp: '5511999999999',
        paymentMethod: 'bitcoin',
        items: [{ productId: 'uuid', productName: 'Pizza', unitPrice: 45.90, quantity: 1 }],
      };

      const result = validateOrderRequest(data);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Forma de pagamento é obrigatória');
    });
  });
});
```

---

## Sub-módulo: Testes E2E (`tests/e2e/`)

### Responsabilidade

Testar fluxos completos da aplicação do ponto de vista do usuário, simulando interações reais com o navegador.

### Ferramentas

- **Playwright**: Automação de navegador
- **Browser**: Chromium, Firefox, WebKit

### Exemplo: checkout.spec.ts

```typescript
import { test, expect } from '@playwright/test';

test.describe('Fluxo de Checkout', () => {
  test.beforeEach(async ({ page }) => {
    // Navega para cardápio de exemplo
    await page.goto('/menu/bar-do-joao');
  });

  test('deve adicionar item ao carrinho', async ({ page }) => {
    // Clica no botão adicionar do primeiro produto
    const addButton = page.locator('button:has-text("Adicionar")').first();
    await addButton.click();

    // Verifica que o carrinho foi atualizado
    const cartButton = page.locator('button:has-text("Carrinho")');
    await expect(cartButton).toContainText('1');
  });

  test('deve criar pedido com sucesso', async ({ page }) => {
    // Adiciona produto ao carrinho
    const addButton = page.locator('button:has-text("Adicionar")').first();
    await addButton.click();

    // Abre o carrinho
    const cartButton = page.locator('button:has-text("Carrinho")');
    await cartButton.click();

    // Preenche dados do cliente
    await page.fill('input[name="customerName"]', 'Maria Silva');
    await page.fill('input[name="customerWhatsapp"]', '5511888888888');
    await page.selectOption('select[name="paymentMethod"]', 'pix');

    // Confirma o pedido
    const confirmButton = page.locator('button:has-text("Confirmar Pedido")');
    await confirmButton.click();

    // Verifica mensagem de sucesso
    await expect(page.locator('text=Pedido criado com sucesso')).toBeVisible();
  });

  test('deve validar campos obrigatórios', async ({ page }) => {
    // Adiciona produto ao carrinho
    const addButton = page.locator('button:has-text("Adicionar")').first();
    await addButton.click();

    // Abre o carrinho
    const cartButton = page.locator('button:has-text("Carrinho")');
    await cartButton.click();

    // Tenta confirmar sem preencher dados
    const confirmButton = page.locator('button:has-text("Confirmar Pedido")');
    await confirmButton.click();

    // Verifica mensagens de erro
    await expect(page.locator('text=Nome é obrigatório')).toBeVisible();
    await expect(page.locator('text=WhatsApp é obrigatório')).toBeVisible();
  });
});
```

### Exemplo: admin.spec.ts

```typescript
import { test, expect } from '@playwright/test';

test.describe('Painel Administrativo', () => {
  test.beforeEach(async ({ page }) => {
    // Faz login antes de cada teste
    await page.goto('/admin/login');
    await page.fill('input[name="email"]', 'owner@restaurant.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button:has-text("Entrar")');
    await expect(page).toHaveURL('/admin/dashboard');
  });

  test('deve criar nova categoria', async ({ page }) => {
    // Navega para categorias
    await page.click('a:has-text("Categorias")');
    await expect(page).toHaveURL('/admin/categories');

    // Clica em adicionar
    await page.click('button:has-text("Adicionar Categoria")');

    // Preenche nome
    await page.fill('input[name="name"]', 'Bebidas');

    // Salva
    await page.click('button:has-text("Salvar")');

    // Verifica que categoria foi criada
    await expect(page.locator('text=Bebidas')).toBeVisible();
  });

  test('deve editar produto', async ({ page }) => {
    // Navega para produtos
    await page.click('a:has-text("Produtos")');
    await expect(page).toHaveURL('/admin/products');

    // Clica no primeiro produto
    await page.locator('table tbody tr').first().click();

    // Edita nome
    await page.fill('input[name="name"]', 'Pizza Grande');

    // Salva
    await page.click('button:has-text("Salvar")');

    // Verifica atualização
    await expect(page.locator('text=Pizza Grande')).toBeVisible();
  });

  test('deve visualizar pedidos', async ({ page }) => {
    // Navega para pedidos
    await page.click('a:has-text("Pedidos")');
    await expect(page).toHaveURL('/admin/orders');

    // Verifica lista de pedidos
    const ordersTable = page.locator('table');
    await expect(ordersTable).toBeVisible();
  });
});
```

---

## Scripts de Teste

### package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --testPathPattern=unit",
    "test:integration": "jest --testPathPattern=integration",
    "test:e2e": "playwright test",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

### Comandos

```bash
# Rodar todos os testes
npm test

# Rodar apenas unitários
npm run test:unit

# Rodar apenas integração
npm run test:integration

# Rodar E2E
npm run test:e2e

# Ver cobertura
npm run test:coverage

# Modo watch
npm run test:watch

# E2E com UI
npm run test:e2e:ui
```

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura unitários | ≥80% | Crítica |
| Cobertura integração | ≥70% | Alta |
| Testes E2E críticos | 100% | Crítica |
| Tempo de execução | <5min | Média |

---

## Gates de Qualidade

### CI/CD

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:unit -- --coverage
      - uses: codecov/codecov-action@v4

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:e2e
```

### Fail Fast

- Se unit tests falham → não roda E2E
- Se coverage < 80% → PR bloqueado
- Se lint falha → PR bloqueado

---

## Boas Práticas

### 1. Nomenclatura

```typescript
// ✅ Bom: Descrição clara do comportamento
describe('CartContext', () => {
  it('should add item to empty cart', () => { });
  it('should increment quantity for existing item', () => { });
});

// ❌ Ruim: Nomes vagos
describe('CartContext', () => {
  it('add item', () => { });
  it('test 2', () => { });
});
```

### 2. Arrange-Act-Assert

```typescript
// ✅ Bom: AAA pattern
it('should calculate total correctly', () => {
  // Arrange
  const items = [{ price: 10, quantity: 2 }];

  // Act
  const total = calculateTotal(items);

  // Assert
  expect(total).toBe(20);
});

// ❌ Ruim: Tudo junto
it('should calculate total correctly', () => {
  expect(calculateTotal([{ price: 10, quantity: 2 }])).toBe(20);
});
```

### 3. Isolamento

```typescript
// ✅ Bom: Cada teste é independente
it('should add item', () => {
  const cart = createCart();
  cart.addItem({ id: '1', name: 'Pizza', price: 45.90 });
  expect(cart.items).toHaveLength(1);
});

it('should remove item', () => {
  const cart = createCart();
  cart.addItem({ id: '1', name: 'Pizza', price: 45.90 });
  cart.removeItem('1');
  expect(cart.items).toHaveLength(0);
});

// ❌ Ruim: Dependência entre testes
let cart;
beforeEach(() => { cart = createCart(); });
it('should add item', () => {
  cart.addItem({ id: '1', name: 'Pizza', price: 45.90 });
});
it('should remove item', () => {
  // Depende do teste anterior!
  cart.removeItem('1');
});
```

### 4. Mocks Appropriados

```typescript
// ✅ Bom: Mock específico
jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: mockRestaurant }),
        }),
      }),
    }),
  }),
}));

// ❌ Ruim: Mock genérico
jest.mock('@/lib/supabase/client');
```

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| jest | ^29.7.0 | Test runner |
| ts-jest | ^29.2.5 | TypeScript transform |
| @testing-library/react | ^15.0.7 | Testes de React |
| @testing-library/jest-dom | ^6.4.2 | Matchers DOM |
| @testing-library/user-event | ^14.5.2 | Simular usuário |
| @playwright/test | ^1.45.3 | Testes E2E |
| jest-environment-jsdom | ^29.7.0 | Ambiente jsdom |

---

## Referências

- [Jest Documentation](https://jestjs.io/pt-BR/docs)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright](https://playwright.dev/docs/intro)
- [menulink-unit-tests-checklist.md](../.openspec/specs/menulink-unit-tests-checklist.md)

---

**Versão**: 1.0  
**Última Atualização**: 2026-04-15  
**Autor**: AI Agent