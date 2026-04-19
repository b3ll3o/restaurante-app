import { test, expect } from '@playwright/test';

/**
 * Testes E2E para acesso às páginas admin
 * @see tests/e2e/AGENTS.md
 *
 * Tags:
 * @e2e - Teste end-to-end
 */

test.describe('Admin Pages Access', () => {

  test('unauthenticated user redirected to login when accessing dashboard', async ({ page }) => {
    // Try to go directly to /admin/dashboard
    await page.goto('/admin/dashboard');

    // Should redirect to /admin/login
    await expect(page).toHaveURL('/admin/login');

    // Verify login page is shown
    await expect(page.getByRole('heading', { name: /login do administrador/i })).toBeVisible();
  });

  test('unauthenticated user redirected to login when accessing categories', async ({ page }) => {
    // Try to go directly to /admin/categories
    await page.goto('/admin/categories');

    // Should redirect to /admin/login
    await expect(page).toHaveURL('/admin/login');

    // Verify login page is shown
    await expect(page.getByRole('heading', { name: /login do administrador/i })).toBeVisible();
  });

  test('unauthenticated user redirected to login when accessing products', async ({ page }) => {
    // Try to go directly to /admin/products
    await page.goto('/admin/products');

    // Should redirect to /admin/login
    await expect(page).toHaveURL('/admin/login');

    // Verify login page is shown
    await expect(page.getByRole('heading', { name: /login do administrador/i })).toBeVisible();
  });

  test('unauthenticated user redirected to login when accessing orders', async ({ page }) => {
    // Try to go directly to /admin/orders
    await page.goto('/admin/orders');

    // Should redirect to /admin/login
    await expect(page).toHaveURL('/admin/login');

    // Verify login page is shown
    await expect(page.getByRole('heading', { name: /login do administrador/i })).toBeVisible();
  });

  test('unauthenticated user redirected to login when accessing settings', async ({ page }) => {
    // Try to go directly to /admin/settings
    await page.goto('/admin/settings');

    // Should redirect to /admin/login
    await expect(page).toHaveURL('/admin/login');

    // Verify login page is shown
    await expect(page.getByRole('heading', { name: /login do administrador/i })).toBeVisible();
  });

  test('signup page is accessible without auth', async ({ page }) => {
    // Go to /admin/signup
    await page.goto('/admin/signup');

    // Should see signup form (not redirected)
    await expect(page).toHaveURL('/admin/signup');
    await expect(page.getByRole('heading', { name: /criar conta de administrador/i })).toBeVisible();
  });

  test('login page is accessible without auth', async ({ page }) => {
    // Go to /admin/login
    await page.goto('/admin/login');

    // Should see login form (not redirected)
    await expect(page).toHaveURL('/admin/login');
    await expect(page.getByRole('heading', { name: /login do administrador/i })).toBeVisible();
  });

});
