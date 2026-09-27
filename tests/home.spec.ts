import { expect, test } from '@playwright/test';

const pages = ['/', '/about', '/services', '/faq', '/contact'];

test('home presents the NeatNest brand and navigates between pages', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('NeatNest');
  await expect(page.getByText('Spotless care for every space.').first()).toBeVisible();
  await expect(page.locator('img[src="/assets/neatnest-logo.svg"]').first()).toBeVisible();

  await page.getByRole('navigation').getByRole('link', { name: 'Services' }).click();
  await expect(page).toHaveURL(/\/services$/);
  await expect(page.locator('h1')).toContainText('Cleaning care');

  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('h1')).toContainText('NeatNest');
});

test('quote dialog selects a service and composes the WhatsApp enquiry', async ({ page }) => {
  await page.goto('/services');
  await page.getByRole('button', { name: /Ask about this service/ }).nth(2).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByLabel('Service')).toHaveValue('Deep cleaning');

  await dialog.getByLabel('Your name').fill('Test Visitor');
  await dialog.getByLabel('A little about your space').fill('Three bedroom apartment in Lekki. Saturday preferred.');
  await page.evaluate(() => {
    (window as unknown as { capturedUrl: string }).capturedUrl = '';
    window.open = url => {
      (window as unknown as { capturedUrl: string }).capturedUrl = String(url);
      return null;
    };
  });
  await dialog.getByRole('button', { name: /Continue to WhatsApp/ }).click();
  const target = await page.evaluate(() => (window as unknown as { capturedUrl: string }).capturedUrl);
  expect(target).toMatch(/^https:\/\/wa.me\/2348115112243\?text=/);
  expect(new URL(target).searchParams.get('text')).toContain('Test Visitor');
  expect(new URL(target).searchParams.get('text')).toContain('deep cleaning');
  expect(new URL(target).searchParams.get('text')).toContain('Three bedroom apartment');

  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(page.locator('a[href="tel:+2347076967302"]').first()).toBeAttached();
});

test('FAQ expands accessibly', async ({ page }) => {
  await page.goto('/faq');
  const question = page.getByRole('button', { name: 'Can I book recurring cleaning?' });
  await question.click();
  await expect(question).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#faq-answer-3')).toBeVisible();
  await question.click();
  await expect(page.locator('#faq-answer-3')).toBeHidden();
});

for (const path of pages) {
  test(`${path} loads images without console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(path);
    await expect(page.locator('h1')).toBeVisible();

    for (const image of await page.locator('img').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate(node => (node as HTMLImageElement).complete && (node as HTMLImageElement).naturalWidth > 0)).toBeTruthy();
    }

    expect(errors).toEqual([]);
  });
}

for (const width of [360, 390, 768, 1440]) {
  test(`layout has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of pages) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflow, `Overflow on ${path}`).toBe(false);
    }

    if (width < 760) {
      await page.getByRole('button', { name: 'Open menu' }).click();
      await page.keyboard.press('Escape');
      await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
      await page.getByRole('button', { name: 'Open menu' }).click();
      await page.getByRole('navigation').getByRole('link', { name: 'Contact' }).click();
      await expect(page).toHaveURL(/\/contact$/);
      await expect(page.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');
    }
  });
}

test('each photograph has only one placement across the website', async ({ page }) => {
  const photographs: string[] = [];
  for (const path of pages) {
    await page.goto(path);
    const sources = await page.locator('main img').evaluateAll(images => images.map(image => image.getAttribute('src')!));
    for (const source of sources) {
      expect(source).toMatch(/^\/assets\/photos\//);
      expect(photographs, `Repeated photograph on ${path}: ${source}`).not.toContain(source);
      photographs.push(source);
    }
  }
  expect(photographs.length).toBeGreaterThan(0);
});
