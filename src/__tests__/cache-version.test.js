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
      /const CACHE_VERSION = ['"]v\d+\.\d+\.\d+-\w+['"];/
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

    // Check format: v1.0.timestamp-randomstring
    expect(version).toMatch(/^v\d+\.\d+\.\d+-\w+$/);

    // Check that timestamp is a valid number
    const timestamp = parseInt(version.split('.')[2].split('-')[0]);
    expect(timestamp).toBeGreaterThan(0);
    expect(timestamp).toBeLessThanOrEqual(Date.now());
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
    expect(currentContent).toContain('keys()');
    expect(currentContent).toContain('caches.delete');
  });

  it('should update cache version when update script runs', async () => {
    // Create a temporary service worker file for testing
    const tempServiceWorkerPath = path.join(
      __dirname,
      'temp-service-worker.js'
    );
    const originalContent = fs.readFileSync(serviceWorkerPath, 'utf8');

    try {
      // Copy the original content to temp file
      fs.writeFileSync(tempServiceWorkerPath, originalContent);

      // Read the current version before running the script
      const beforeContent = fs.readFileSync(tempServiceWorkerPath, 'utf8');
      const beforeMatch = beforeContent.match(
        /const CACHE_VERSION = ['"]([^'"]+)['"];/
      );
      expect(beforeMatch).toBeTruthy();
      const beforeVersion = beforeMatch[1];

      // Temporarily modify the update script to use our temp file
      const updateScriptPath = path.join(
        __dirname,
        '..',
        '..',
        'scripts',
        'update-cache-version.js'
      );
      const originalScriptContent = fs.readFileSync(updateScriptPath, 'utf8');
      const modifiedScriptContent = originalScriptContent.replace(
        /const serviceWorkerPath = path\.join\([\s\S]*?\);/,
        `const serviceWorkerPath = '${tempServiceWorkerPath.replace(
          /\\/g,
          '\\\\'
        )}';`
      );

      try {
        // Write the modified script
        fs.writeFileSync(updateScriptPath, modifiedScriptContent);

        // Run the update script
        const { execSync } = await import('child_process');
        execSync('node scripts/update-cache-version.js', { stdio: 'pipe' });

        // Read the version after running the script
        const afterContent = fs.readFileSync(tempServiceWorkerPath, 'utf8');
        const afterMatch = afterContent.match(
          /const CACHE_VERSION = ['"]([^'"]+)['"];/
        );
        expect(afterMatch).toBeTruthy();
        const afterVersion = afterMatch[1];

        // The version should have changed
        expect(afterVersion).not.toBe(beforeVersion);

        // The new version should have a more recent timestamp
        const beforeTimestamp = parseInt(
          beforeVersion.split('.')[2].split('-')[0]
        );
        const afterTimestamp = parseInt(
          afterVersion.split('.')[2].split('-')[0]
        );
        expect(afterTimestamp).toBeGreaterThan(beforeTimestamp);

        // The new version should be very recent (within last minute)
        const now = Date.now();
        const oneMinute = 60 * 1000;
        expect(afterTimestamp).toBeGreaterThan(now - oneMinute);
        expect(afterTimestamp).toBeLessThanOrEqual(now);
      } finally {
        // Restore the original script
        fs.writeFileSync(updateScriptPath, originalScriptContent);
      }
    } finally {
      // Clean up temp file
      if (fs.existsSync(tempServiceWorkerPath)) {
        fs.unlinkSync(tempServiceWorkerPath);
      }
    }
  });
});
