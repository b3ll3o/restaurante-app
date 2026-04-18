import { test, expect } from '@playwright/test';

/**
 * Testes de layout - Sem overflow horizontal
 * Verifica que nenhuma página tem scroll horizontal em 320px
 */
test.describe('Layout - No Horizontal Overflow', () => {
  const pages = [
    { name: 'Login', path: '/admin/login' },
    { name: 'Signup', path: '/admin/signup' },
    { name: 'Dashboard', path: '/admin/dashboard', requiresAuth: true },
    { name: 'Categories', path: '/admin/categories', requiresAuth: true },
    { name: 'Products', path: '/admin/products', requiresAuth: true },
    { name: 'Orders', path: '/admin/orders', requiresAuth: true },
  ];

  const viewports = [
    { name: 'Small Mobile', width: 320, height: 568 },
    { name: 'Large Mobile', width: 390, height: 844 },
    { name: 'Tablet', width: 768, height: 1024 },
  ];

  for (const page of pages) {
    for (const viewport of viewports) {
      test(`${page.name} - No overflow on ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page: playwrightPage }) => {
        await playwrightPage.setViewportSize({ width: viewport.width, height: viewport.height });

        // Login if required
        if (page.requiresAuth) {
          await playwrightPage.goto('/admin/login');
          await playwrightPage.fill('input[type="email"]', 'test@example.com');
          await playwrightPage.fill('input[type="password"]', 'password123');
          await playwrightPage.click('button[type="submit"]');
          await playwrightPage.waitForURL(page.path === '/admin/dashboard' ? '/admin/dashboard' : page.path);
        }

        await playwrightPage.goto(page.path);
        await playwrightPage.waitForLoadState('networkidle');

        // Check for horizontal overflow
        const hasHorizontalOverflow = await playwrightPage.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });

        expect(hasHorizontalOverflow).toBe(false, 
          `Page ${page.name} has horizontal overflow on ${viewport.name}`
        );

        // Also check body
        const bodyOverflow = await playwrightPage.evaluate(() => {
          return document.body.scrollWidth > document.body.clientWidth;
        });

        expect(bodyOverflow).toBe(false,
          `Body of ${page.name} has horizontal overflow on ${viewport.name}`
        );
      });
    }
  }

  test('Public menu has no overflow on 320px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/menu/test-restaurant');
    await page.waitForLoadState('networkidle');

    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    expect(hasOverflow).toBe(false);
  });
});
