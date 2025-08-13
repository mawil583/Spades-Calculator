import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Cache Version Update Script', () => {
  const serviceWorkerPath = path.join(
    __dirname,
    '..',
    'services',
    'service-worker.js'
  );

  let originalContent;

  beforeAll(() => {
    // Read the original content
    originalContent = fs.readFileSync(serviceWorkerPath, 'utf8');
  });

  afterAll(() => {
    // Restore original content after tests
    fs.writeFileSync(serviceWorkerPath, originalContent);
  });

  it('should update cache version in service worker file', () => {
    // Read current content
    const currentContent = fs.readFileSync(serviceWorkerPath, 'utf8');

    // Check if CACHE_VERSION is present
    expect(currentContent).toMatch(
      /const CACHE_VERSION = ['"]v\d+\.\d+\.\d+['"];/
    );

    // Check if CACHE_NAMES object is present
    expect(currentContent).toContain('CACHE_NAMES');
    expect(currentContent).toContain('static-resources-${CACHE_VERSION}');
    expect(currentContent).toContain('images-${CACHE_VERSION}');
    expect(currentContent).toContain('api-cache-${CACHE_VERSION}');
    expect(currentContent).toContain('app-shell-${CACHE_VERSION}');
    expect(currentContent).toContain('dynamic-cache-${CACHE_VERSION}');
  });

  it('should have proper cache version format', () => {
    const currentContent = fs.readFileSync(serviceWorkerPath, 'utf8');

    // Extract the cache version
    const versionMatch = currentContent.match(
      /const CACHE_VERSION = ['"]([^'"]+)['"];/
    );
    expect(versionMatch).toBeTruthy();

    const version = versionMatch[1];

    // Check format: v1.0.timestamp
    expect(version).toMatch(/^v\d+\.\d+\.\d+$/);

    // Check that timestamp is recent (within last hour)
    const timestamp = parseInt(version.split('.')[2]);
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    expect(timestamp).toBeGreaterThan(now - oneHour);
    expect(timestamp).toBeLessThanOrEqual(now);
  });

  it('should have all required cache strategies', () => {
    const currentContent = fs.readFileSync(serviceWorkerPath, 'utf8');

    // Check for StaleWhileRevalidate strategy
    expect(currentContent).toContain('StaleWhileRevalidate');

    // Check for NetworkFirst strategy
    expect(currentContent).toContain('NetworkFirst');

    // Should NOT contain CacheFirst (removed)
    expect(currentContent).not.toContain('CacheFirst');
  });

  it('should have cache cleanup functionality', () => {
    const currentContent = fs.readFileSync(serviceWorkerPath, 'utf8');

    // Check for activate event listener
    expect(currentContent).toContain("addEventListener('activate'");

    // Check for cache cleanup logic
    expect(currentContent).toContain('caches.keys()');
    expect(currentContent).toContain('caches.delete');
  });
});
