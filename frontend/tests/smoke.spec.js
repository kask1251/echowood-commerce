const { test, expect } = require('@playwright/test');

test('Homepage loads successfully', async ({ page }) => {
  // Go to homepage (uses baseURL 3001)
  await page.goto('/');

  // Check Title
  await expect(page).toHaveTitle(/Echowood Flutes/);

  // Check if "Best Sellers" section exists
  await expect(page.getByText('Best Selling Flutes')).toBeVisible();
});

test('Backend API is connected (Products displayed)', async ({ page }) => {
  await page.goto('/');
  
  // Wait for product cards to load
  // We look for the "₹" symbol which appears in prices
  const prices = page.getByText('₹').first();
  await expect(prices).toBeVisible();
});

test('Category Navigation works', async ({ page }) => {
  // Go to homepage
  await page.goto('/');

  // Find the "Flutes" link within the main content area to avoid clicking a nav link.
  // This makes the locator more specific and robust.
  const fluteCard = page.getByRole('main').getByRole('link', { name: 'Flutes', exact: true });

  // Ensure it's visible and click it
  await expect(fluteCard).toBeVisible();
  await fluteCard.click();

  // Explicitly wait for the navigation to complete.
  await page.waitForURL('**/shop?category=flutes');

  // Verify the URL is correct.
  await expect(page).toHaveURL(/.*category=flutes/);
  
  // Check that a heading on the new page is visible to confirm it loaded.
  await expect(page.getByRole('heading', { name: 'Shop Inventory' })).toBeVisible();
});