import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object para a página de Login do admin
 */
export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Senha');
    this.submitButton = page.getByRole('button', { name: 'Entrar' });
    this.errorMessage = page.locator('[role="alert"]');
  }

  async goto() {
    await this.page.goto('/admin/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectToBeLoggedIn() {
    await expect(this.page).toHaveURL('/admin/dashboard');
  }

  async expectError(message: string) {
    await expect(this.errorMessage).toContainText(message);
  }
}

/**
 * Page Object para a página de Cadastro do admin
 */
export class SignupPage {
  readonly page: Page;
  readonly restaurantNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.restaurantNameInput = page.getByLabel('Nome do Restaurante');
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Senha');
    this.confirmPasswordInput = page.getByLabel('Confirmar Senha');
    this.submitButton = page.getByRole('button', { name: 'Cadastrar' });
    this.errorMessage = page.locator('[role="alert"]');
  }

  async goto() {
    await this.page.goto('/admin/signup');
  }

  async signup(restaurantName: string, email: string, password: string) {
    await this.restaurantNameInput.fill(restaurantName);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
    await this.submitButton.click();
  }

  async expectToBeLoggedIn() {
    await expect(this.page).toHaveURL('/admin/dashboard');
  }
}

/**
 * Page Object para a página do Dashboard do admin
 */
export class DashboardPage {
  readonly page: Page;
  readonly sidebar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = page.locator('nav');
  }

  async goto() {
    await this.page.goto('/admin/dashboard');
  }

  async expectToBeVisible() {
    await expect(this.page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  }
}

/**
 * Page Object para a página de Categorias do admin
 */
export class CategoriesPage {
  readonly page: Page;
  readonly addButton: Locator;
  readonly nameInput: Locator;
  readonly saveButton: Locator;
  readonly categoryList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addButton = page.getByRole('button', { name: /adicionar categoria/i });
    this.nameInput = page.getByLabel('Nome');
    this.saveButton = page.getByRole('button', { name: /salvar/i });
    this.categoryList = page.locator('table tbody tr');
  }

  async goto() {
    await this.page.goto('/admin/categories');
  }

  async addCategory(name: string) {
    await this.addButton.click();
    await this.nameInput.fill(name);
    await this.saveButton.click();
  }

  async expectCategoryExists(name: string) {
    await expect(this.page.getByText(name)).toBeVisible();
  }
}

/**
 * Page Object para a página de Produtos do admin
 */
export class ProductsPage {
  readonly page: Page;
  readonly addButton: Locator;
  readonly nameInput: Locator;
  readonly priceInput: Locator;
  readonly categorySelect: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addButton = page.getByRole('button', { name: /adicionar produto/i });
    this.nameInput = page.getByLabel('Nome');
    this.priceInput = page.getByLabel('Preço');
    this.categorySelect = page.getByLabel('Categoria');
    this.saveButton = page.getByRole('button', { name: /salvar/i });
  }

  async goto() {
    await this.page.goto('/admin/products');
  }

  async addProduct(name: string, price: number, categoryName: string) {
    await this.addButton.click();
    await this.nameInput.fill(name);
    await this.priceInput.fill(price.toString());
    await this.categorySelect.selectOption({ label: categoryName });
    await this.saveButton.click();
  }

  async expectProductExists(name: string) {
    await expect(this.page.getByText(name)).toBeVisible();
  }
}

/**
 * Page Object para a página de Pedidos do admin
 */
export class OrdersPage {
  readonly page: Page;
  readonly orderList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.orderList = page.locator('table tbody tr');
  }

  async goto() {
    await this.page.goto('/admin/orders');
  }

  async expectOrderExists(customerName: string) {
    await expect(this.page.getByText(customerName)).toBeVisible();
  }

  async confirmOrder(index: number = 0) {
    const confirmButton = this.orderList.nth(index).getByRole('button', { name: /confirmar/i });
    await confirmButton.click();
  }

  async cancelOrder(index: number = 0) {
    const cancelButton = this.orderList.nth(index).getByRole('button', { name: /cancelar/i });
    await cancelButton.click();
  }
}

/**
 * Page Object para o Cardápio Público
 */
export class MenuPage {
  readonly page: Page;
  readonly cartButton: Locator;
  readonly cartSheet: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartButton = page.locator('button:has([class*="shopping-cart"])');
    this.cartSheet = page.locator('[role="dialog"]');
  }

  async goto(slug: string) {
    await this.page.goto(`/menu/${slug}`);
  }

  async addProductToCart(productName: string) {
    // Encontra o card do produto e clica em adicionar
    const productCard = this.page.getByText(productName).locator('..');
    const addButton = productCard.getByRole('button', { name: /adicionar/i });
    await addButton.click();
  }

  async openCart() {
    await this.cartButton.click();
    await expect(this.cartSheet).toBeVisible();
  }

  async proceedToCheckout() {
    const continueButton = this.cartSheet.getByRole('button', { name: /continuar/i });
    await continueButton.click();
  }

  async fillCheckout(data: { name: string; whatsapp: string; paymentMethod: 'pix' | 'cash' }) {
    await this.cartSheet.getByLabel('Seu Nome').fill(data.name);
    await this.cartSheet.getByLabel('WhatsApp').fill(data.whatsapp);

    const paymentButton = data.paymentMethod === 'pix'
      ? this.cartSheet.getByRole('button', { name: /pix/i })
      : this.cartSheet.getByRole('button', { name: /dinheiro/i });
    await paymentButton.click();
  }

  async confirmOrder() {
    const confirmButton = this.cartSheet.getByRole('button', { name: /confirmar e enviar/i });
    await confirmButton.click();
  }

  async expectOrderSuccess() {
    await expect(this.cartSheet.getByText(/pedido enviado/i)).toBeVisible();
  }
}