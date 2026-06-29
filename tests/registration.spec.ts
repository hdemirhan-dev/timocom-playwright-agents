import { test, expect } from '@playwright/test';

test.describe('Registration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.timocom.de');
    await page.waitForFunction(() => typeof (window as any).UC_UI !== 'undefined');
    await page.evaluate(() => (window as any).UC_UI.acceptAllConsents());
    await page.waitForFunction(() => (window as any).UC_UI.isInitialized());
  });

  test('company type selection — step 1', async ({ page }) => {
    await page.goto('https://www.timocom.de/registrierung');

    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();

    const companyTypes = [
      'Frachtführer',
      'Handel',
      'Spedition',
      'KEP-Dienstleister (3,5 t)',
      'Produktion',
      'Lagerhalter',
      'Entsorger',
      'Privatperson',
    ];
    for (const name of companyTypes) {
      await expect(page.getByRole('button', { name })).toBeVisible();
    }

    await page.getByRole('button', { name: 'Spedition' }).click();

    await expect(page.getByRole('textbox').first()).toBeVisible();
  });

  test('contact information', async ({ page }) => {
    await page.goto('https://www.timocom.de/registrierung');

    await expect(page.getByRole('heading', { name: 'Kontakt' })).toBeVisible();

    await expect(page.getByText('+49 211 88 26 88 26')).toBeVisible();

    const emailLink = page.getByRole('link', { name: /salessupport@timocom\.com/ });
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toHaveAttribute('href', 'mailto:salessupport@timocom.com');
  });

  test('minimal navigation', async ({ page }) => {
    await page.goto('https://www.timocom.de/registrierung');

    await expect(
      page.getByRole('link', { name: 'LOGO-TIMOCOM' })
    ).toHaveAttribute('href', '/');

    await expect(
      page.getByRole('navigation').getByRole('link', { name: 'Services' })
    ).toHaveCount(0);

    await expect(
      page.getByRole('link', { name: 'Impressum' }).first()
    ).toHaveAttribute('href', 'https://www.timocom.de/impressum');

    await expect(
      page.getByRole('link', { name: 'Datenschutz' }).first()
    ).toHaveAttribute('href', 'https://www.timocom.de/datenschutz');

    await expect(
      page.locator('a[href*="facebook.com"]').first()
    ).toBeVisible();
  });
});
