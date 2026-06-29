import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.timocom.de');
    await page.waitForFunction(() => typeof (window as any).UC_UI !== 'undefined');
    await page.evaluate(() => (window as any).UC_UI.acceptAllConsents());
    await page.waitForFunction(() => (window as any).UC_UI.isInitialized());
  });

  test('hero section and primary CTA', async ({ page }) => {
    await expect(page).toHaveTitle(/TIMOCOM/);

    await expect(page.getByRole('navigation').first()).toBeVisible();

    await expect(
      page.getByRole('heading', { level: 1, name: 'TIMOCOM Road Freight Marketplace' })
    ).toBeVisible();

    await expect(page.getByText(/58\.000/, { exact: false }).first()).toBeVisible();
    await expect(page.getByText(/1 Million/, { exact: false }).first()).toBeVisible();
    await expect(page.getByText(/TIMOCOM Messenger/, { exact: false }).first()).toBeVisible();

    await expect(
      page.getByRole('link', { name: /Jetzt kostenlos testen/ }).first()
    ).toHaveAttribute('href', '/registrierung');
  });

  test('main navigation links', async ({ page }) => {
    await expect(
      page.getByRole('link', { name: 'Services' }).first()
    ).toHaveAttribute('href', '/services');

    await expect(
      page.getByRole('link', { name: 'Ressourcen' }).first()
    ).toHaveAttribute('href', '/ressourcen');

    await expect(
      page.getByRole('link', { name: 'Unternehmen' }).first()
    ).toHaveAttribute('href', '/unternehmen');

    await expect(
      page.getByRole('link', { name: 'Jetzt registrieren' })
    ).toHaveAttribute('href', '/registrierung');

    const loginLink = page.getByRole('link', { name: 'Login' });
    await expect(loginLink).toBeVisible();
    await expect(loginLink).toHaveAttribute('href', /my\.timocom\.com/);
  });

  test('freight search widget', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Frachten' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Laderaum' })).toBeVisible();

    await expect(page.getByRole('textbox', { name: /Von/ }).first()).toBeVisible();
    await expect(page.getByRole('textbox', { name: /Nach/ }).first()).toBeVisible();

    await expect(
      page.getByRole('textbox', { name: /Aufbauart/ }).first()
    ).toBeVisible();

    const suchenBtn = page.getByRole('button', { name: 'Suchen' });
    await expect(suchenBtn).toBeVisible();
    await expect(suchenBtn).toBeEnabled();
  });
});
