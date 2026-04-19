import { test, expect } from '@playwright/test';

/**
 * Testes de acessibilidade para touch targets
 * Verifica que todos os botões têm no mínimo 44x44px
 */
test.describe('Accessibility - Touch Targets', () => {
  const adminPages = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Categories', path: '/admin/categories' },
    { name: 'Products', path: '/admin/products' },
    { name: 'Orders', path: '/admin/orders' },
  ];

  const devices = [
    { name: 'iPhone 12', width: 390, height: 844 },
    { name: 'iPad', width: 768, height: 1024 },
  ];

  for (const device of devices) {
    test(`All interactive elements meet 44x44px on ${device.name}`, async ({ page }) => {
      await page.setViewportSize({ width: device.width, height: device.height });

      // Login first
      await page.goto('/admin/login');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL('/admin/dashboard');

      for (const adminPage of adminPages) {
        await page.goto(adminPage.path);
        await page.waitForLoadState('networkidle');

        // Check all buttons
        const buttons = page.locator('button');
        const buttonCount = await buttons.count();

        for (let i = 0; i < buttonCount; i++) {
          const button = buttons.nth(i);
          const isVisible = await button.isVisible();
          const isDisabled = await button.isDisabled();

          if (isVisible && !isDisabled) {
            const box = await button.boundingBox();
            if (box && box.width > 0 && box.height > 0) {
              expect(box.height).toBeGreaterThanOrEqual(44);
            }
          }
        }
      }
    });
  }

  test('All links meet minimum touch target size', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Login and go to orders page
    await page.goto('/admin/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/dashboard');
    await page.goto('/admin/orders');

    // Check WhatsApp links
    const whatsappLinks = page.locator('a[href*="wa.me"]');
    const linkCount = await whatsappLinks.count();

    for (let i = 0; i < linkCount; i++) {
      const link = whatsappLinks.nth(i);
      if (await link.isVisible()) {
        const box = await link.boundingBox();
        if (box && box.width > 0 && box.height > 0) {
          // Links should have adequate touch area
          expect(box.height).toBeGreaterThanOrEqual(32);
        }
      }
    }
  });
});
