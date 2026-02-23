import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [react(), VitePWA({ registerType: 'prompt' })],
    test: {
        environment: 'jsdom',
        setupFiles: ['./src/setupTests.ts'],
        globals: true,
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
