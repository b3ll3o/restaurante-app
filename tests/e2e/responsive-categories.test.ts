import { test, expect } from '@playwright/test';

/**
 * Testes responsivos para a página de categorias
 * Verifica Table → Cards adaptativo em diferentes breakpoints
 */
test.describe('Responsive Categories', () => {
  test.beforeEach(async ({ page }) => {
    // Login before testing
    await page.goto('/admin/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/dashboard');
    await page.goto('/admin/categories');
  });

  test('Table visible on desktop, cards on mobile', async ({ page }) => {
    // Desktop - Table should be visible
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.reload();

    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Mobile - Table should be hidden, cards visible
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();

    // Table should not be visible
    await expect(table).not.toBeVisible();

    // Cards should be visible
    const cards = page.locator('[class*="Card"]').filter({ hasText: 'Editar' });
    await expect(cards.first()).toBeVisible();
  });

  test('Cards have touch targets on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();

    const editButton = page.locator('button:has-text("Editar")').first();
    if (await editButton.isVisible()) {
      const buttonBox = await editButton.boundingBox();
      expect(buttonBox?.height).toBeGreaterThanOrEqual(44);
      expect(buttonBox?.width).toBeGreaterThanOrEqual(44);
    }
  });

  test('Dialog opens fullscreen on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();

    // Click "Nova Categoria" button
    const newButton = page.locator('button:has-text("Nova Categoria")');
    await newButton.click();

    // Dialog should be fullscreen
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    const dialogBox = await dialog.boundingBox();
    // On mobile, dialog should take full screen
    expect(dialogBox?.width).toBeGreaterThan(350);
  });

  test('No horizontal overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.reload();

    const hasOverflow = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });
    expect(hasOverflow).toBe(false);
  });
});
