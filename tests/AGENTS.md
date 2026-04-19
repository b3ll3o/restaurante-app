# Tests - PediAi

## Visão Geral

O módulo **Tests** contém toda a infraestrutura de testes automatizados do projeto PediAi, seguindo os paradigmas **TDD**, **BDD** e **ATDD**. O projeto aplica cobertura mínima de 80% para testes unitários e 100% de cobertura E2E nos fluxos críticos.

**Idioma**: Português Brasileiro (pt-BR)
**Stack**: Vitest + Testing Library + Playwright

---

## Paradigmas de Testes

Este módulo implementa os paradigmas definidos em `opencode/rules/AGENTS.md`:

| Paradigma | Aplicação | Referência |
|-----------|-----------|------------|
| **TDD** | Testes unitários (RED → GREEN → REFACTOR) | [opencode/rules/AGENTS.md §7.4](opencode/rules/AGENTS.md#74-fluxo-tdd) |
| **BDD** | Testes de integração com Gherkin | [opencode/rules/AGENTS.md §7.5](opencode/rules/AGENTS.md#75-fluxo-para-novas-funcionalidades) |
| **ATDD** | Testes E2E com Playwright | [opencode/rules/AGENTS.md §7.5](opencode/rules/AGENTS.md#75-fluxo-para-novas-funcionalidades) |

**Cobertura mínima**: ≥80% (unitários), 100% (fluxos críticos E2E)
**Referência**: [opencode/rules/AGENTS.md §3.2, §7](opencode/rules/AGENTS.md)

---

## Estrutura de Diretórios

```
tests/
├── setup.ts # Configuração global dos testes
├── unit/ # Testes unitários (≥80% cobertura)
│ ├── utils.test.ts # Testes de funções utilitárias
│ ├── cart-context.test.tsx # Testes do contexto do carrinho
│ └── lib/
│ └── whatsapp.test.ts # Testes do serviço WhatsApp
├── integration/ # Testes de integração
│ ├── orders.test.ts # Testes da API de pedidos
│ ├── categories.test.ts # Testes de categorias
│ └── auth.test.ts # Testes de autenticação
├── e2e/ # Testes end-to-end (Playwright)
│ ├── admin.spec.ts # Fluxos do painel admin
│ ├── public-menu.spec.ts # Fluxos do cardápio público
│ ├── checkout.spec.ts # Fluxo de checkout
│ └── support/
│ └── page-objects/ # Page Objects para E2E
└── bdd/ # Arquivos BDD (referência centralizada)
# Os arquivos .feature DEVEM estar no nível do módulo que documentam
# Ver tabela de proximidade na seção BDD acima
```
tests/
├── setup.ts # Configuração global dos testes
├── unit/ # Testes unitários (≥80% cobertura)
│ ├── utils.test.ts # Testes de funções utilitárias
│ ├── context/
│ │ └── cart-context.test.tsx # Testes do contexto do carrinho
│ └── lib/
│ └── whatsapp.test.ts # Testes do serviço WhatsApp
├── integration/ # Testes de integração (a criar)
│ ├── api.test.ts # Testes de API routes
│ └── database.test.ts # Testes de banco de dados
└── e2e/ # Testes end-to-end
├── admin/
│ └── login.spec.ts # Testes de login do admin
├── public/
│ └── checkout.spec.ts # Fluxo de checkout
└── support/
└── page-objects/ # Page Objects para E2E
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

### Vitest (`vitest.config.ts`)

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['<rootDir>/tests/setup.ts'],
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
      include: [
        'app/**/*.{ts,tsx}',
        'components/**/*.{ts,tsx}',
        'lib/**/*.{ts,tsx}',
        'hooks/**/*.{ts,tsx}',
        'context/**/*.{ts,tsx}',
      ],
      exclude: [
        '**/*.d.ts',
        '**/node_modules/**',
        '**/.next/**',
        '**/tests/**',
      ],
    },
    include: [
      'tests/**/*.test.{ts,tsx}',
      'tests/**/*.spec.{ts,tsx}',
    ],
    globals: true,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

### Setup Global (`tests/setup.ts`)

```typescript
import '@testing-library/jest-dom';

// Mock do Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock do Supabase
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn(),
      getUser: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
          order: vi.fn(),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(),
        })),
      })),
    })),
  })),
}));

// Mock do localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

// Mock do fetch
global.fetch = vi.fn();

// Limpar mocks após cada teste
afterEach(() => {
  vi.clearAllMocks();
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
    "test": "vitest",
    "test:unit": "vitest --run tests/unit",
    "test:integration": "vitest --run tests/integration",
    "test:e2e": "npx playwright test",
    "test:e2e:ui": "npx playwright test --ui",
    "test:e2e:debug": "npx playwright test --debug",
    "test:coverage": "vitest --run --coverage",
    "test:watch": "vitest --watch",
    "test:ui": "vitest --ui",
    "test:all": "npm run test:unit && npm run test:integration && npm run test:e2e"
  }
}
```

### Comandos

```bash
# Rodar todos os testes unitários e integração
npm test

# Rodar apenas unitários (cobertura ≥80%)
npm run test:unit

# Rodar apenas integração
npm run test:integration

# Rodar E2E (Playwright)
npm run test:e2e

# Rodar E2E com UI interativa
npm run test:e2e:ui

# Rodar E2E em modo debug
npm run test:e2e:debug

# Ver cobertura (obrigatório ≥80%)
npm run test:coverage

# Modo watch (desenvolvimento)
npm run test:watch

# UI interativa do Vitest
npm run test:ui

# Rodar todos os testes (CI/CD)
npm run test:all
```

---

## Métricas de Qualidade

### TDD (Testes Unitários)

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura linhas | ≥80% | Crítica |
| Cobertura functions | ≥80% | Crítica |
| Cobertura branches | ≥80% | Crítica |
| Cobertura statements | ≥80% | Crítica |
| Tempo de execução | <2min | Média |

### BDD (Testes de Integração)

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cenários com @integration-test | 100% | Crítica |
| Arquivos .feature por módulo | 100% | Alta |
| Cobertura cenários | 100% | Alta |

### ATDD (Testes E2E)

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Fluxos críticos E2E | 100% | Crítica |
| Tempo de execução E2E | <5min | Média |
| Pass rate E2E | ≥95% | Alta |

---

## Gates de Qualidade

Os gates de qualidade são definidos em `opencode/rules/AGENTS.md §3.3`.

**Antes de fazer commit, TODO seguinte DEVE passar:**
- `npm run lint` (0 errors, 0 warnings)
- `npm run build` (Build passa)
- `npm run test:unit` (100% passando)
- `npx tsc --noEmit` (0 TypeScript errors)

**Referência**: [opencode/rules/AGENTS.md §3.3](opencode/rules/AGENTS.md#33-gates-de-qualidade-regra-crítica---bloqueante)

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
vi.mock('@/lib/supabase/client', () => ({
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
vi.mock('@/lib/supabase/client');
```

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| vitest | ^4.1.4 | Test runner |
| @vitest/ui | ^4.1.4 | UI de testes |
| @vitest/coverage-v8 | ^4.1.4 | Cobertura V8 |
| @testing-library/react | ^15.0.7 | Testes de React |
| @testing-library/jest-dom | ^6.9.1 | Matchers DOM |
| @testing-library/user-event | ^14.6.1 | Simular usuário |
| @playwright/test | ^1.59.1 | Testes E2E |
| jsdom | ^29.0.2 | Ambiente jsdom |

---

## Referências

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright](https://playwright.dev/docs/intro)
- [opencode/rules/AGENTS.md](opencode/rules/AGENTS.md) — Regras gerais de qualidade e testes
- [pediai-unit-tests-checklist.md](../.openspec/specs/pediai-unit-tests-checklist.md)

---

**Versão**: 1.3
**Última Atualização**: 2026-04-19
**Autor**: AI Agent