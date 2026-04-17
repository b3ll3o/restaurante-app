import { test, expect } from '@playwright/test';
import { MenuPage } from '../support/page-objects';

test.describe('Checkout', () => {
  // Slug de exemplo - em teste real, seria criado via API ou fixture
  const testRestaurantSlug = 'restaurante-teste';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  test.beforeEach(async ({ page: _page }) => {
    // Skip se não houver restaurante de teste
    test.skip(process.env.SKIP_E2E_PUBLIC === 'true', 'Requer restaurante de teste');
  });

  test('deve exibir cardápio público', async ({ page }) => {
    const menuPage = new MenuPage(page);
    await menuPage.goto(testRestaurantSlug);

    // Verifica que a página carregou
    await expect(page.getByRole('heading')).toBeVisible();
  });

  test('deve adicionar produto ao carrinho', async ({ page }) => {
    const menuPage = new MenuPage(page);
    await menuPage.goto(testRestaurantSlug);

    // Clica no botão adicionar de um produto (primeiro que encontrar)
    const addButton = page.getByRole('button', { name: /adicionar/i }).first();
    await addButton.click();

    // Verifica que o carrinho foi atualizado
    await expect(page.locator('[class*="badge"]')).toContainText('1');
  });

  test('deve completar fluxo de checkout', async ({ page }) => {
    const menuPage = new MenuPage(page);
    await menuPage.goto(testRestaurantSlug);

    // Adiciona produto
    const addButton = page.getByRole('button', { name: /adicionar/i }).first();
    await addButton.click();

    // Abre carrinho
    await menuPage.openCart();

    // Vai para checkout
    await menuPage.proceedToCheckout();

    // Preenche dados
    await menuPage.fillCheckout({
      name: 'Cliente Teste E2E',
      whatsapp: '11999999999',
      paymentMethod: 'pix',
    });

    // Confirma pedido
    await menuPage.confirmOrder();

    // Verifica sucesso
    await menuPage.expectOrderSuccess();
  });

  test('deve validar campos obrigatórios no checkout', async ({ page }) => {
    const menuPage = new MenuPage(page);
    await menuPage.goto(testRestaurantSlug);

    // Adiciona produto e abre checkout
    const addButton = page.getByRole('button', { name: /adicionar/i }).first();
    await addButton.click();
    await menuPage.openCart();
    await menuPage.proceedToCheckout();

    // Tenta confirmar sem preencher dados
    const confirmButton = page.locator('[role="dialog"]').getByRole('button', { name: /confirmar/i });
    await confirmButton.click();

    // Verifica mensagens de erro
    await expect(page.getByText(/nome é obrigatório/i)).toBeVisible();
    await expect(page.getByText(/whatsapp é obrigatório/i)).toBeVisible();
  });
});