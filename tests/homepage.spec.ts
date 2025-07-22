import { test, expect } from '@playwright/test';

test.describe('Awenes Homes - Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://awenesthomes.vercel.app/');
  });

  test('should have the correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Awenes Homes/);
  });

  test('should display featured properties', async ({ page }) => {
    const featuredProperties = page.locator('h2:has-text("Featured Properties")');
    await expect(featuredProperties).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    // Test navigation to properties page
    await page.click('text=Properties');
    await expect(page).toHaveURL(/.*properties/);
    
    // Test navigation to about page
    await page.click('text=About');
    await expect(page).toHaveURL(/.*about/);
  });

  test('should have working search functionality', async ({ page }) => {
    // Test search form
    await page.fill('input[placeholder="Where are you going?"]', 'Goa');
    await page.click('button:has-text("Search")');
    
    // Verify search results or redirect
    await expect(page).toHaveURL(/.*search/);
    const results = page.locator('text=Properties in Goa');
    await expect(results).toBeVisible();
  });
});
