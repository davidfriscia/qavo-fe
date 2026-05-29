import { expect, test } from '@playwright/test';

/**
 * Smoke test of the reference application. Runs on both the desktop and mobile
 * Playwright projects, demonstrating that one codebase serves every device.
 */
test.describe('Qavo reference app', () => {
  test('renders the shell and home page', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Qavo reference application' })).toBeVisible();
    await expect(page.getByText('Active plugins')).toBeVisible();
  });

  test('navigates to the login route contributed by the plugin', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
    await expect(page.getByLabel('Username')).toBeVisible();
  });

  test('switches theme at runtime', async ({ page }) => {
    await page.goto('/');
    const root = page.locator('html');
    const before = await root.getAttribute('data-qavo-theme');
    await page.getByRole('button', { name: /Dark|Light/ }).click();
    await expect(root).not.toHaveAttribute('data-qavo-theme', before ?? '');
  });
});
