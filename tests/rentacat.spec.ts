import { test, expect } from '@playwright/test';

// TODO: Fill in with test cases.

// Test fixture: the URL http://localhost:8080/ is open and the values of
// cookies "1", "2", and "3" are set to "false" (no cats are rented).
test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8080/');
  await page.evaluate(() => {
    document.cookie = '1=false';
    document.cookie = '2=false';
    document.cookie = '3=false';
  });
});

test('TEST-1-RESET', async ({ page }) => {
  // Preconditions: cookies "1", "2", and "3" are set to "true" (cats ID 1, 2, 3 are rented).
  await page.evaluate(() => {
    document.cookie = '1=true';
    document.cookie = '2=true';
    document.cookie = '3=true';
  });
  // Execution steps
  await page.getByRole('link', { name: 'Reset', exact: true }).click();
  // Postconditions
  const listing = page.locator('#listing li');
  await expect(listing.nth(0)).toHaveText('ID 1. Jennyanydots');
  await expect(listing.nth(1)).toHaveText('ID 2. Old Deuteronomy');
  await expect(listing.nth(2)).toHaveText('ID 3. Mistoffelees');
});

test('TEST-2-CATALOG', async ({ page }) => {
  // Execution steps
  await page.getByRole('link', { name: 'Catalog', exact: true }).click();
  // Postconditions
  const photos = page.locator('ol li');
  await expect(photos.nth(1).locator('img')).toHaveAttribute('src', '/images/cat2.jpg');
});

test('TEST-3-LISTING', async ({ page }) => {
  // Execution steps
  await page.getByRole('link', { name: 'Catalog', exact: true }).click();
  // Postconditions
  const listing = page.locator('#listing li');
  await expect(listing).toHaveCount(3);
  await expect(listing.nth(2)).toHaveText('ID 3. Mistoffelees');
});

test('TEST-4-RENT-A-CAT', async ({ page }) => {
  // Execution steps
  await page.getByRole('link', { name: 'Rent-A-Cat', exact: true }).click();
  // Postconditions
  await expect(page.getByRole('button', { name: 'Rent', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Return', exact: true })).toBeVisible();
});

test('TEST-5-RENT', async ({ page }) => {
  // Execution steps
  await page.getByRole('link', { name: 'Rent-A-Cat', exact: true }).click();
  await page.locator('#rentID').fill('1');
  await page.getByRole('button', { name: 'Rent', exact: true }).click();
  // Postconditions
  const listing = page.locator('#listing li');
  await expect(listing.nth(0)).toHaveText('Rented out');
  await expect(listing.nth(1)).toHaveText('ID 2. Old Deuteronomy');
  await expect(listing.nth(2)).toHaveText('ID 3. Mistoffelees');
  await expect(page.getByText('Success!', { exact: true })).toBeVisible();
});

test('TEST-6-RETURN', async ({ page }) => {
  // Preconditions: cookies "2" and "3" are set to "true" (cats ID 2 and 3 are rented).
  await page.evaluate(() => {
    document.cookie = '2=true';
    document.cookie = '3=true';
  });
  // Execution steps
  await page.getByRole('link', { name: 'Rent-A-Cat', exact: true }).click();
  await page.locator('#returnID').fill('2');
  await page.getByRole('button', { name: 'Return', exact: true }).click();
  // Postconditions
  const listing = page.locator('#listing li');
  await expect(listing.nth(0)).toHaveText('ID 1. Jennyanydots');
  await expect(listing.nth(1)).toHaveText('ID 2. Old Deuteronomy');
  await expect(listing.nth(2)).toHaveText('Rented out');
  await expect(page.getByText('Success!', { exact: true })).toBeVisible();
});

test('TEST-7-FEED-A-CAT', async ({ page }) => {
  // Execution steps
  await page.getByRole('link', { name: 'Feed-A-Cat', exact: true }).click();
  // Postconditions
  await expect(page.getByRole('button', { name: 'Feed', exact: true })).toBeVisible();
});

test('TEST-8-FEED', async ({ page }) => {
  // Execution steps
  await page.getByRole('link', { name: 'Feed-A-Cat', exact: true }).click();
  await page.locator('#catnips').fill('6');
  await page.getByRole('button', { name: 'Feed', exact: true }).click();
  // Postconditions (cats take ~7 seconds to eat, so wait up to 10 seconds)
  await expect(page.getByText('Nom, nom, nom.', { exact: true })).toBeVisible({ timeout: 10000 });
});

test('TEST-9-GREET-A-CAT', async ({ page }) => {
  // Execution steps
  await page.getByRole('link', { name: 'Greet-A-Cat', exact: true }).click();
  // Postconditions
  await expect(page.getByText('Meow!Meow!Meow!', { exact: true })).toBeVisible();
});

test('TEST-10-GREET-A-CAT-WITH-NAME', async ({ page }) => {
  // Execution steps
  await page.goto('http://localhost:8080/greet-a-cat/Jennyanydots');
  // Postconditions
  await expect(page.getByText('Meow! from Jennyanydots.', { exact: true })).toBeVisible();
});

test('TEST-11-FEED-A-CAT-SCREENSHOT', async ({ page }) => {
  // Preconditions: cookies "1", "2", and "3" are set to "true" (cats ID 1, 2, 3 are rented).
  await page.evaluate(() => {
    document.cookie = '1=true';
    document.cookie = '2=true';
    document.cookie = '3=true';
  });
  // Execution steps
  await page.getByRole('link', { name: 'Feed-A-Cat', exact: true }).click();
  // Postconditions
  await expect(page.locator('body')).toHaveScreenshot();
});

// DEFECT tests go here once three defects are confirmed.
