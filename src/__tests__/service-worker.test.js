import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Service Worker', () => {
  it('should have service worker file that exists', () => {
    // This test verifies that the service worker file exists
    const serviceWorkerPath = path.join(
      __dirname,
      '../services/service-worker.js'
    );
    expect(fs.existsSync(serviceWorkerPath)).toBe(true);
  });
});
