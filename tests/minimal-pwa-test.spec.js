import { test, expect } from '@playwright/test';

test.setTimeout(15000);

test.describe('Minimal PWA Tests', () => {
  test('should have proper PWA manifest', async ({ page }) => {
    await page.goto('/', { timeout: 8000 });

    // Check that the manifest file exists
    const manifestResponse = await page.request.get('/manifest.json');
    expect(manifestResponse.status()).toBe(200);

    const manifest = await manifestResponse.json();
    expect(manifest.name).toBe('Spades Calculator');
    expect(manifest.short_name).toBe('Spades');
    expect(manifest.start_url).toBe('/');
    expect(manifest.display).toBe('standalone');
  });

  // Download button tests removed as per user request (moved to hamburger menu)
});
