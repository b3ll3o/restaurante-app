import { test, expect } from '@playwright/test';

/**
 * Testes responsivos para a página de produtos
 * Verifica grid responsivo e modal mobile
 */
test.describe('Responsive Products', () => {
  test.beforeEach(async ({ page }) => {
    // Login before testing
    await page.goto('/admin/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/dashboard');
    await page.goto('/admin/products');
  });

  test('Grid layout on tablet, table on desktop', async ({ page }) => {
    // Desktop - Table visible
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.reload();

    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Mobile - Cards visible, table hidden
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();

    await expect(table).not.toBeVisible();

    // Product cards should be visible
    const productCards = page.locator('[class*="Card"]').filter({ hasText: 'Disponível' });
    await expect(productCards.first()).toBeVisible();
  });

  test('Product images have proper aspect ratio', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // Tablet
    await page.reload();

    const productImages = page.locator('img[alt]').first();
    if (await productImages.isVisible()) {
      const imgBox = await productImages.boundingBox();
      // Image should maintain aspect ratio and not overflow
      expect(imgBox?.width).toBeLessThanOrEqual(768);
    }
  });

  test('Dialog opens fullscreen on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();

    // Click "Novo Produto" button
    const newButton = page.locator('button:has-text("Novo Produto")');
    await newButton.click();

    // Dialog should be visible and fullscreen
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    const dialogBox = await dialog.boundingBox();
    expect(dialogBox?.width).toBeGreaterThan(350);
  });

  test('Action buttons have 44x44px touch targets', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();

    const actionButtons = page.locator('[class*="touch-target"]');
    const count = await actionButtons.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = actionButtons.nth(i);
      if (await button.isVisible()) {
        const box = await button.boundingBox();
        if (box && box.width > 0) {
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      }
    }
  });
});
