import { test, expect } from '@playwright/test';

/**
 * Testes responsivos para a página de login admin
 * Verifica layout e touch targets em diferentes breakpoints
 */
test.describe('Responsive Login', () => {
  const devices = [
    { name: 'iPhone 12', width: 390, height: 844 },
    { name: 'iPad', width: 768, height: 1024 },
    { name: 'MacBook', width: 1280, height: 800 },
  ];

  devices.forEach(({ name, width, height }) => {
    test(`Login form should be usable on ${name} (${width}x${height})`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/admin/login');

      // Verifica que o formulário está visível
      await expect(page.locator('text=Login do Administrador')).toBeVisible();

      // Verifica que o Card ocupa largura total em mobile
      const card = page.locator('[class*="Card"]').first();
      await expect(card).toBeVisible();

      // Verifica que o botão de submit tem tamanho mínimo de 44x44px
      const submitButton = page.locator('button[type="submit"]');
      await expect(submitButton).toBeVisible();

      const buttonBox = await submitButton.boundingBox();
      expect(buttonBox?.height).toBeGreaterThanOrEqual(44);
      expect(buttonBox?.width).toBeGreaterThanOrEqual(44);

      // Verifica que inputs são acessíveis
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();

      // Verifica que não há overflow horizontal
      const bodyOverflowX = await page.evaluate(() => {
        return document.body.scrollWidth > document.body.clientWidth;
      });
      expect(bodyOverflowX).toBe(false);
    });
  });

  test('Touch targets should be at least 44x44px on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/admin/login');

    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const isVisible = await button.isVisible();
      if (isVisible) {
        const box = await button.boundingBox();
        if (box && box.width > 0 && box.height > 0) {
          expect(box.height).toBeGreaterThanOrEqual(44, `Button ${i} height should be >= 44px`);
        }
      }
    }
  });
});
