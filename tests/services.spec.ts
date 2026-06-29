import { test, expect } from '@playwright/test';

test.describe('Services', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.timocom.de');
    await page.waitForFunction(() => typeof (window as any).UC_UI !== 'undefined');
    await page.evaluate(() => (window as any).UC_UI.acceptAllConsents());
    await page.waitForFunction(() => (window as any).UC_UI.isInitialized());
  });

  test('page layout, breadcrumb, and statistics', async ({ page }) => {
    await page.goto('https://www.timocom.de/services');

    await expect(page).toHaveTitle(/Logistiksoftware/);

    await expect(page.getByRole('navigation', { name: 'breadcrumb' })).toBeVisible();

    await expect(
      page.getByRole('link', { name: 'TIMOCOM Deutschland' })
    ).toHaveAttribute('href', '/');

    await expect(
      page.getByRole('heading', { level: 1, name: 'Der TIMOCOM Road Freight Marketplace' }).first()
    ).toBeVisible();

    await expect(page.getByRole('heading', { name: /156\.000/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: '299' })).toBeVisible();

    await expect(
      page.getByRole('link', { name: /Jetzt kostenlos testen/ }).first()
    ).toHaveAttribute('href', '/registrierung');
  });

  test('service category tabs and cards', async ({ page }) => {
    await page.goto('https://www.timocom.de/services');

    await expect(page.getByText('Transport Exchange', { exact: true })).toBeVisible();
    await expect(page.getByText('Transportation Visibility', { exact: true })).toBeVisible();
    await expect(page.getByText('Security & Payments', { exact: true })).toBeVisible();
    await expect(page.getByText('Connect', { exact: true })).toBeVisible();

    await expect(
      page.getByRole('link', { name: /Frachten.*Laderaumbörse/ }).first()
    ).toHaveAttribute('href', '/services/frachtenboerse');

    await expect(
      page.getByRole('link', { name: /Geschlossene Frachtenbörse/ }).first()
    ).toHaveAttribute('href', '/services/frachtenboerse/geschlossene-frachtenboerse');

    await expect(
      page.getByRole('link', { name: /Ausschreibungen/ }).first()
    ).toHaveAttribute('href', '/services/ausschreibungen');

    await expect(page.getByText('Mehr erfahren >').first()).toBeVisible();
  });

  test('role-based solution cards and customer testimonial', async ({ page }) => {
    await page.goto('https://www.timocom.de/services');

    await expect(
      page.getByRole('heading', { name: /Road Freight Solutions/ })
    ).toBeVisible();

    await expect(
      page.locator('a[href="/services/verlader"]').first()
    ).toBeVisible();

    await expect(
      page.locator('a[href="/services/spediteure"]').first()
    ).toBeVisible();

    await expect(
      page.locator('a[href="/services/frachtfuehrer"]').first()
    ).toBeVisible();

    await expect(page.getByText(/Andrea Schumm/)).toBeVisible();
    await expect(page.getByText(/IBIS Backwaren/)).toBeVisible();
  });
});
