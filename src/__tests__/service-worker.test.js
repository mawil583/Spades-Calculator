import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Service Worker', () => {
  let serviceWorkerContent;

  beforeAll(() => {
    const serviceWorkerPath = path.join(
      __dirname,
      '../services/service-worker.js'
    );
    serviceWorkerContent = fs.readFileSync(serviceWorkerPath, 'utf8');
  });

  describe('File Existence', () => {
    it('should have service worker file that exists', () => {
      const serviceWorkerPath = path.join(
        __dirname,
        '../services/service-worker.js'
      );
      expect(fs.existsSync(serviceWorkerPath)).toBe(true);
    });
  });

  describe('Service Worker Content', () => {
    it('should contain Workbox imports', () => {
      expect(serviceWorkerContent).toContain('import { clientsClaim }');
      expect(serviceWorkerContent).toContain('workbox-core');
      expect(serviceWorkerContent).toContain('workbox-precaching');
      expect(serviceWorkerContent).toContain('workbox-routing');
      expect(serviceWorkerContent).toContain('workbox-strategies');
    });

    it('should contain cache strategies', () => {
      expect(serviceWorkerContent).toContain('NetworkFirst');
      expect(serviceWorkerContent).toContain('StaleWhileRevalidate');
    });

    it('should contain fetch event listener', () => {
      expect(serviceWorkerContent).toContain("addEventListener('fetch'");
    });

    it('should contain message event listener', () => {
      expect(serviceWorkerContent).toContain("addEventListener('message'");
    });

    it('should contain skipWaiting functionality', () => {
      expect(serviceWorkerContent).toContain('skipWaiting');
    });
  });

  describe('Cache Configuration', () => {
    it('should define cache names', () => {
      expect(serviceWorkerContent).toContain('cacheName');
    });

    it('should handle static assets caching', () => {
      expect(serviceWorkerContent).toContain('.png');
    });

    it('should handle CSS and JS files', () => {
      expect(serviceWorkerContent).toContain('style');
      expect(serviceWorkerContent).toContain('script');
    });

    it('should handle API requests', () => {
      expect(serviceWorkerContent).toContain('/api/');
    });
  });

  describe('Offline Functionality', () => {
    it('should handle offline scenarios', () => {
      expect(serviceWorkerContent).toContain('catch');
    });

    it('should have fallback strategies', () => {
      expect(serviceWorkerContent).toContain('caches.match');
    });
  });

  describe('Performance Optimization', () => {
    it('should implement proper caching strategies', () => {
      // Check for different caching strategies
      const hasNetworkFirst = serviceWorkerContent.includes('NetworkFirst');
      const hasStaleWhileRevalidate = serviceWorkerContent.includes(
        'StaleWhileRevalidate'
      );

      expect(hasNetworkFirst && hasStaleWhileRevalidate).toBe(true);
    });

    it('should handle navigation requests', () => {
      expect(serviceWorkerContent).toContain('navigate');
    });

    it('should use precaching', () => {
      expect(serviceWorkerContent).toContain('precacheAndRoute');
    });
  });

  describe('Error Handling', () => {
    it('should have error handling mechanisms', () => {
      expect(serviceWorkerContent).toContain('catch');
    });

    it('should handle failed requests gracefully', () => {
      expect(serviceWorkerContent).toContain('response.status');
    });
  });

  describe('Service Worker Lifecycle', () => {
    it('should claim clients', () => {
      expect(serviceWorkerContent).toContain('clientsClaim');
    });

    it('should handle message events', () => {
      expect(serviceWorkerContent).toContain("addEventListener('message'");
    });

    it('should handle cache operations', () => {
      expect(serviceWorkerContent).toContain('caches.open');
    });
  });

  describe('Security and Best Practices', () => {
    it('should only handle GET requests', () => {
      expect(serviceWorkerContent).toContain('GET');
    });

    it('should validate responses before caching', () => {
      expect(serviceWorkerContent).toContain('response.status');
    });

    it('should handle origin validation', () => {
      expect(serviceWorkerContent).toContain('self.location.origin');
    });
  });

  describe('Workbox Integration', () => {
    it('should use Workbox modules', () => {
      expect(serviceWorkerContent).toContain('workbox');
    });

    it('should register routes', () => {
      expect(serviceWorkerContent).toContain('registerRoute');
    });

    it('should use expiration plugins', () => {
      expect(serviceWorkerContent).toContain('ExpirationPlugin');
    });
  });

  describe('Cache Versioning System', () => {
    it('should define cache version constant', () => {
      expect(serviceWorkerContent).toContain('CACHE_VERSION');
    });

    it('should use versioned cache names', () => {
      expect(serviceWorkerContent).toContain('CACHE_NAMES');
      expect(serviceWorkerContent).toContain(
        'static-resources-${CACHE_VERSION}'
      );
      expect(serviceWorkerContent).toContain('images-${CACHE_VERSION}');
      expect(serviceWorkerContent).toContain('api-cache-${CACHE_VERSION}');
      expect(serviceWorkerContent).toContain('app-shell-${CACHE_VERSION}');
      expect(serviceWorkerContent).toContain('dynamic-cache-${CACHE_VERSION}');
    });

    it('should have cache cleanup on activation', () => {
      expect(serviceWorkerContent).toContain("addEventListener('activate'");
      expect(serviceWorkerContent).toContain('caches.keys()');
      expect(serviceWorkerContent).toContain('caches.delete');
    });

    it('should use StaleWhileRevalidate for CSS and JS files', () => {
      expect(serviceWorkerContent).toContain('StaleWhileRevalidate');
      expect(serviceWorkerContent).toContain(
        "request.destination === 'style' || request.destination === 'script'"
      );
    });

    it('should have app shell caching strategy', () => {
      expect(serviceWorkerContent).toContain(
        "url.pathname === '/' || url.pathname === '/index.html'"
      );
      expect(serviceWorkerContent).toContain('app-shell');
    });
  });
});
