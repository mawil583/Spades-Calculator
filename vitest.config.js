import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [react(), VitePWA({ registerType: 'prompt' })],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    globals: true,
    deps: {
      optimizer: {
        web: {
          include: ['@jest/globals'],
        },
      },
    },
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: [
      'node_modules/**',
      'tests/**/*',
      '**/*.spec.js',
      'cypress/**/*',
      'playwright-report/**/*',
    ],
    testTimeout: 10000,
  },
});
