import { jest } from '@jest/globals';

describe('Service Worker', () => {
  it('should have service worker file that exists', () => {
    // This test verifies that the service worker file exists
    const fs = require('fs');
    const path = require('path');
    const serviceWorkerPath = path.join(
      __dirname,
      '../services/service-worker.js'
    );
    expect(fs.existsSync(serviceWorkerPath)).toBe(true);
  });
});
