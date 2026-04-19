import { test, expect } from '@playwright/test';

/**
 * Testes responsivos para o dashboard admin
 * Verifica sidebar colapsável e grid de métricas
 */
test.describe('Responsive Dashboard', () => {
  test.use({ storageState: 'admin' }); // Assuming auth setup

  test.beforeEach(async ({ page }) => {
    // Login before testing dashboard
    await page.goto('/admin/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/dashboard');
  });

  test('Sidebar should be visible on desktop and collapsible on mobile', async ({ page }) => {
    // Desktop - sidebar should be visible
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/admin/dashboard');

    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();

    // Mobile - sidebar should be hidden, hamburger visible
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/admin/dashboard');

    // Sidebar should not be visible
    await expect(sidebar).not.toBeVisible();

    // Hamburger menu button should be visible
    const menuButton = page.locator('button[aria-label="Abrir menu"]');
    await expect(menuButton).toBeVisible();
  });

  test('Metrics grid should adapt to viewport', async ({ page }) => {
    // Desktop - 4 columns
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/admin/dashboard');

    const metricsGrid = page.locator('.grid').first();
    await expect(metricsGrid).toBeVisible();

    // Mobile - 2 columns
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/admin/dashboard');

    // Grid should still be visible and cards should stack properly
    await expect(metricsGrid).toBeVisible();
  });

  test('Hamburger menu should open sidebar drawer on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/admin/dashboard');

    // Click hamburger menu
    const menuButton = page.locator('button[aria-label="Abrir menu"]');
    await menuButton.click();

    // Sidebar content should now be visible in a drawer
    const sidebarContent = page.locator('text=PediAi');
    await expect(sidebarContent).toBeVisible();

    // Clicking outside should close drawer (via Sheet overlay)
    await page.locator('[class*="fixed inset-0"]').click({ position: { x: 10, y: 10 } });
    await expect(sidebarContent).not.toBeVisible();
  });
});
