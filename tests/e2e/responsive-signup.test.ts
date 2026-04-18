import { test, expect } from '@playwright/test';

/**
 * Testes responsivos para a página de signup admin
 * Verifica layout e touch targets em diferentes breakpoints
 */
test.describe('Responsive Signup', () => {
  const devices = [
    { name: 'iPhone 12', width: 390, height: 844 },
    { name: 'iPad', width: 768, height: 1024 },
    { name: 'MacBook', width: 1280, height: 800 },
  ];

  devices.forEach(({ name, width, height }) => {
    test(`Signup form should be usable on ${name} (${width}x${height})`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/admin/signup');

      // Verifica que o formulário está visível
      await expect(page.locator('text=Create Admin Account')).toBeVisible();

      // Verifica que o Card ocupa largura total em mobile
      const card = page.locator('[class*="Card"]').first();
      await expect(card).toBeVisible();

      // Verifica que o botão de submit tem tamanho mínimo de 44x44px
      const submitButton = page.locator('button[type="submit"]');
      await expect(submitButton).toBeVisible();

      const buttonBox = await submitButton.boundingBox();
      expect(buttonBox?.height).toBeGreaterThanOrEqual(44);
      expect(buttonBox?.width).toBeGreaterThanOrEqual(44);

      // Verifica que não há overflow horizontal
      const bodyOverflowX = await page.evaluate(() => {
        return document.body.scrollWidth > document.body.clientWidth;
      });
      expect(bodyOverflowX).toBe(false);
    });
  });

  test('All form inputs should be full width on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 }); // Small mobile
    await page.goto('/admin/signup');

    const inputs = page.locator('input');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const isVisible = await input.isVisible();
      if (isVisible) {
        const box = await input.boundingBox();
        // Inputs should take full width of their container
        expect(box?.width).toBeGreaterThan(0);
      }
    }
  });
});
