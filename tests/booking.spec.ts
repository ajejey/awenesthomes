import { test, expect } from '@playwright/test';

test.describe('Booking and ID Verification Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the homepage
    await page.goto('http://localhost:3000/');
  });

  test('should navigate to property details and start booking', async ({ page }) => {
    // Click on the first featured property
    const firstProperty = page.locator('[data-testid="property-card"]').first();
    await firstProperty.click();
    
    // Verify we're on the property details page
    await expect(page).toHaveURL(/\/properties\//);
    
    // Click the book now button
    const bookNowButton = page.locator('button:has-text("Book Now")');
    await expect(bookNowButton).toBeVisible();
    await bookNowButton.click();
    
    // Should redirect to login/signup or booking form
    await expect(page).toHaveURL(/\/bookings\/new/);
  });

  test('should show ID verification form after booking', async ({ page }) => {
    // This test assumes we're already on the booking confirmation page
    // In a real test, you would complete the booking flow first
    await page.goto('http://localhost:3000/bookings/123/confirmation');
    
    // Check if ID verification section is visible
    const idVerification = page.locator('h3:has-text("Verify Your Identity")');
    await expect(idVerification).toBeVisible();
    
    // Test file upload functionality
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible();
    
    // Note: In a real test, you would need to handle file uploads
    // This is just checking the UI elements exist
  });

  test('should validate ID upload form', async ({ page }) => {
    await page.goto('http://localhost:3000/bookings/123/confirmation');
    
    // Try to submit without uploading a file
    const submitButton = page.locator('button:has-text("Submit ID")');
    await submitButton.click();
    
    // Should show validation error
    const errorMessage = page.locator('text=Please upload a valid ID document');
    await expect(errorMessage).toBeVisible();
  });

  test('should show ID verification status', async ({ page }) => {
    // Test the GovernmentIdStatus component
    await page.goto('http://localhost:3000/bookings');
    
    // Check if the status indicator is visible
    const statusIndicator = page.locator('[data-testid="id-status"]');
    await expect(statusIndicator).toBeVisible();
    
    // Should show appropriate status (pending/verified/rejected)
    const statusText = await statusIndicator.textContent();
    expect(['Pending', 'Verified', 'Rejected']).toContain(statusText?.trim());
  });
});
