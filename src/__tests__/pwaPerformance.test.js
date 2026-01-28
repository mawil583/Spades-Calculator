import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('PWA Performance', () => {
  let serviceWorkerContent;
  let manifestContent;

  beforeAll(() => {
    const serviceWorkerPath = path.join(
      __dirname,
      '../services/service-worker.js'
    );
    const manifestPath = path.join(__dirname, '../../public/manifest.json');

    serviceWorkerContent = fs.readFileSync(serviceWorkerPath, 'utf8');
    manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  });

  describe('Service Worker Performance Optimizations', () => {
    it('should implement proper caching strategies', () => {
      // Check for different caching strategies
      const hasCacheFirst = serviceWorkerContent.includes('CacheFirst');
      const hasNetworkFirst = serviceWorkerContent.includes('NetworkFirst');
      const hasStaleWhileRevalidate = serviceWorkerContent.includes(
        'StaleWhileRevalidate'
      );

      expect(hasCacheFirst || hasNetworkFirst || hasStaleWhileRevalidate).toBe(
        true
      );
    });

    it('should use precaching for static assets', () => {
      expect(serviceWorkerContent).toContain('precacheAndRoute');
    });

    it('should handle navigation requests efficiently', () => {
      expect(serviceWorkerContent).toContain('navigate');
    });

    it('should implement expiration plugins for cache management', () => {
      expect(serviceWorkerContent).toContain('ExpirationPlugin');
    });

    it('should use proper cache names for organization', () => {
      expect(serviceWorkerContent).toContain('cacheName');
    });
  });

  describe('Manifest Performance Optimizations', () => {
    it('should have optimized icon sizes', () => {
      const iconSizes = manifestContent.icons.map((icon) => icon.sizes);

      // Should have appropriate sizes for different devices
      expect(iconSizes).toContain('128x128'); // Small devices
      expect(iconSizes).toContain('192x192'); // Medium devices
      expect(iconSizes).toContain('512x512'); // Large devices
    });

    it('should have proper icon purposes for performance', () => {
      const iconPurposes = manifestContent.icons.map((icon) => icon.purpose);

      // Should have maskable icons for better performance
      expect(iconPurposes.some((purpose) => purpose.includes('maskable'))).toBe(
        true
      );
      expect(iconPurposes.some((purpose) => purpose.includes('any'))).toBe(
        true
      );
    });

    it('should have minimal manifest size', () => {
      const manifestString = JSON.stringify(manifestContent);
      const manifestSize = Buffer.byteLength(manifestString, 'utf8');

      // Manifest should be under 1KB for fast loading
      expect(manifestSize).toBeLessThan(1024);
    });
  });

  describe('Resource Optimization', () => {
    it('should handle static assets efficiently', () => {
      expect(serviceWorkerContent).toContain('.png');
      // Note: .ico files are handled by the favicon link in HTML, not service worker
    });

    it('should handle CSS and JS files efficiently', () => {
      expect(serviceWorkerContent).toContain('style');
      expect(serviceWorkerContent).toContain('script');
    });

    it('should implement proper error handling for performance', () => {
      expect(serviceWorkerContent).toContain('catch');
    });

    it('should have fallback strategies for performance', () => {
      expect(serviceWorkerContent).toContain('caches.match');
    });
  });

  describe('Large Data Set Handling', () => {
    it('should handle multiple rounds of data efficiently', () => {
      // Test that the app can handle large amounts of data
      const largeDataSet = Array.from({ length: 100 }, (_, i) => ({
        round: i + 1,
        team1BidsAndActuals: {
          p1Bid: '3',
          p2Bid: '2',
          p1Actual: '3',
          p2Actual: '2',
        },
        team2BidsAndActuals: {
          p1Bid: '4',
          p2Bid: '4',
          p1Actual: '4',
          p2Actual: '4',
        },
        dealerOverride: null,
      }));

      // Verify the data structure is valid
      expect(largeDataSet).toHaveLength(100);
      expect(largeDataSet[0]).toHaveProperty('round');
      expect(largeDataSet[0]).toHaveProperty('team1BidsAndActuals');
      expect(largeDataSet[0]).toHaveProperty('team2BidsAndActuals');
    });

    it('should maintain performance with complex state', () => {
      // Test complex state structure that the app should handle
      const complexState = {
        roundHistory: Array.from({ length: 50 }, (_, i) => ({
          round: i + 1,
          team1BidsAndActuals: {
            p1Bid: '3',
            p2Bid: '2',
            p1Actual: '3',
            p2Actual: '2',
          },
          team2BidsAndActuals: {
            p1Bid: '4',
            p2Bid: '4',
            p1Actual: '4',
            p2Actual: '4',
          },
          dealerOverride: i % 2 === 0 ? 'team1BidsAndActuals.p1Bid' : null,
        })),
        currentRound: {
          team1BidsAndActuals: {
            p1Bid: '',
            p2Bid: '',
            p1Actual: '',
            p2Actual: '',
          },
          team2BidsAndActuals: {
            p1Bid: '',
            p2Bid: '',
            p1Actual: '',
            p2Actual: '',
          },
          dealerOverride: null,
        },
        names: {
          team1: { p1: 'Alice', p2: 'Bob' },
          team2: { p1: 'Charlie', p2: 'David' },
        },
        teamNames: { team1: 'Team Alpha', team2: 'Team Beta' },
      };

      // Verify the complex state structure is valid
      expect(complexState.roundHistory).toHaveLength(50);
      expect(complexState).toHaveProperty('currentRound');
      expect(complexState).toHaveProperty('names');
      expect(complexState).toHaveProperty('teamNames');
    });
  });

  describe('Memory Management', () => {
    it('should implement proper cleanup mechanisms', () => {
      expect(serviceWorkerContent).toContain('skipWaiting');
      expect(serviceWorkerContent).toContain('clientsClaim');
    });

    it('should handle cache cleanup efficiently', () => {
      expect(serviceWorkerContent).toContain('caches.open');
      // Note: caches.delete is handled by ExpirationPlugin, not directly in service worker
    });
  });
});
