import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end test configuration for the reference application.
 *
 * Spins up the dev server and runs the suite across a desktop and a mobile
 * viewport — exercising the platform's mobile-first responsive behavior (the
 * adaptive shell collapses to a drawer on the mobile project).
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  webServer: {
    command: 'npm start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
});
