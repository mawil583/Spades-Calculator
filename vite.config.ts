import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
// @ts-expect-error missing types
import eslint from 'vite-plugin-eslint';
import { resolve } from 'path';

// Import configuration
const DEV_PORT = 5173;

export default defineConfig({
    plugins: [
        react(),
        eslint({
            include: ['src/**/*.{js,jsx,ts,tsx}'],
            exclude: ['node_modules/**', 'dist/**'],
            failOnError: false,
            failOnWarning: false,
            cache: false,
            emitWarning: true,
            emitError: true,
        }),
        VitePWA({
            registerType: 'prompt',
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,webmanifest}'],
                cleanupOutdatedCaches: true,
                clientsClaim: true,
                skipWaiting: true,
            },
            includeAssets: ['favicon.ico', 'logo192.png', 'logo512.png'],
            manifest: {
                name: 'Spades Calculator',
                short_name: 'Spades Calc',
                description:
                    'A comprehensive Spades card game calculator and score tracker',
                theme_color: '#667eea',
                background_color: '#ffffff',
                display: 'standalone',
                orientation: 'portrait',
                scope: '/',
                start_url: '/',
                icons: [
                    {
                        src: 'logo192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'logo512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
        }),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    },
    server: {
        port: DEV_PORT,
        open: process.argv.includes('--open'),
        hmr: {
            overlay: true,
        },
    },
    build: {
        outDir: 'build',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    chakra: [
                        '@chakra-ui/react',
                        '@emotion/react',
                        'framer-motion',
                    ],
                },
            },
        },
    },
    define: {
        'process.env.NODE_ENV': JSON.stringify(
            process.env.NODE_ENV || 'development'
        ),
    },
    esbuild: {
        jsxFactory: 'React.createElement',
        jsxFragment: 'React.Fragment',
    },
    optimizeDeps: {
        include: ['react', 'react-dom'],
    },
});
