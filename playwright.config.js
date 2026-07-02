require('dotenv').config();
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 1,
  workers: 1, // single worker — AEM can be flaky under parallel load

  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'playwright-report/report.json' }],
  ],

  use: {
    baseURL: process.env.BASE_URL || 'https://www.timocom.de',
    browserName: 'chromium',
    headless: true,
    viewport: { width: 1280, height: 800 },
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    ignoreHTTPSErrors: false,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});