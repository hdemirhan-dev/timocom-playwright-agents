import { test, expect } from '@playwright/test';

/**
 * Seed file — copied into every generated test by the Generator agent.
 * Contains the AEM/Usercentrics cookie setup that must run before all tests.
 */
test('seed', async ({ page }) => {
  await page.goto('https://www.timocom.de');

  // Wait for Usercentrics to load (AEM-specific)
  await page.waitForFunction(() => typeof (window as any).UC_UI !== 'undefined');

  // Accept all cookies via JS API — "Hier mit den Cookies!" banner
  await page.evaluate(() => (window as any).UC_UI.acceptAllConsents());

  // Confirm consent was registered
  await page.waitForFunction(() => (window as any).UC_UI.isInitialized());

  // Page is ready when main navigation is visible
  // AEM double-renders nav — use .first()
  await expect(page.getByRole('navigation').first()).toBeVisible();
});
