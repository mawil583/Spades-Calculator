import { test, expect } from '@playwright/test';

test.setTimeout(10000);

test.describe('Minimal PWA Tests', () => {
  test('should have proper PWA manifest', async ({ page }) => {
    await page.goto('/', { timeout: 5000 });

    // Check that the manifest file exists
    const manifestResponse = await page.request.get('/manifest.json');
    expect(manifestResponse.status()).toBe(200);

    const manifest = await manifestResponse.json();
    expect(manifest.name).toBe('Spades Calculator');
    expect(manifest.short_name).toBe('Spades');
    expect(manifest.start_url).toBe('/');
    expect(manifest.display).toBe('standalone');
  });

  test('should show download button on home page', async ({ page }) => {
    await page.goto('/', { timeout: 5000 });

    // Check that download button exists
    const downloadButton = page.locator('button:has-text("Download App")');
    await expect(downloadButton).toBeVisible({ timeout: 3000 });
  });

  test('should work with different user agents', async ({ page }) => {
    // Set a mobile user agent
    await page.setExtraHTTPHeaders({
      'User-Agent':
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    });

    await page.goto('/', { timeout: 5000 });

    // Check that download button exists
    const downloadButton = page.locator('button:has-text("Download App")');
    await expect(downloadButton).toBeVisible({ timeout: 3000 });
  });
});
