import { test, expect } from '@playwright/test';

/**
 * Testes responsivos para a página de pedidos
 * Verifica botões 44x44px e Cards em mobile
 */
test.describe('Responsive Orders', () => {
  test.beforeEach(async ({ page }) => {
    // Login before testing
    await page.goto('/admin/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/dashboard');
    await page.goto('/admin/orders');
  });

  test('Table visible on desktop, cards on mobile', async ({ page }) => {
    // Desktop - Table visible
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.reload();

    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Mobile - Cards visible, table hidden
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();

    await expect(table).not.toBeVisible();

    // Order cards should be visible
    const orderCards = page.locator('[class*="Card"]').filter({ hasText: 'Ver detalhes' });
    await expect(orderCards.first()).toBeVisible();
  });

  test('Confirm/Cancel buttons have 44x44px minimum', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();

    // Look for action buttons (check/x icons)
    const actionButtons = page.locator('button[title="Confirmar pedido"], button[title="Cancelar pedido"]');

    const count = await actionButtons.count();
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const button = actionButtons.nth(i);
        if (await button.isVisible()) {
          const box = await button.boundingBox();
          expect(box?.height).toBeGreaterThanOrEqual(44);
          expect(box?.width).toBeGreaterThanOrEqual(44);
        }
      }
    }
  });

  test('WhatsApp links have adequate touch target', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();

    const whatsappLinks = page.locator('a[href*="wa.me"]');
    const count = await whatsappLinks.count();

    for (let i = 0; i < Math.min(count, 3); i++) {
      const link = whatsappLinks.nth(i);
      if (await link.isVisible()) {
        const box = await link.boundingBox();
        // WhatsApp links should have touch-target class or adequate size
        expect(box?.height).toBeGreaterThanOrEqual(32); // Minimum for touch
      }
    }
  });

  test('Dialog details opens properly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();

    // Click "Ver detalhes" if available
    const detailsButton = page.locator('button:has-text("Ver detalhes")').first();
    if (await detailsButton.isVisible()) {
      await detailsButton.click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
    }
  });
});
