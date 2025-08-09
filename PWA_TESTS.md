# PWA Testing Guide

This document outlines the comprehensive testing suite for the Spades Calculator PWA functionality.

## 🎯 Overview

The PWA testing suite is integrated into the existing test infrastructure:

- **Unit tests** for service worker functionality (runs with `npm run unit`)
- **E2E tests** for PWA features and offline capabilities (runs with `npm run e2e`)

## 🚀 Quick Start

### Run All Tests (Including PWA Tests)

```bash
npm run test
```

### Run Unit Tests Only (Including PWA Unit Tests)

```bash
npm run unit
```

### Run E2E Tests Only (Including PWA E2E Tests)

```bash
npm run e2e
```

## 📋 Test Categories

### 1. Unit Tests

#### Service Worker Tests (`src/service-worker.test.js`)

- ✅ Service worker installation and registration
- ✅ Fetch event handling
- ✅ Offline fallback functionality
- ✅ Cache management
- ✅ Error handling

#### Service Worker Registration Tests (`src/serviceWorkerRegistration.test.js`)

- ✅ Registration in production vs development
- ✅ Error handling during registration
- ✅ Update detection and handling
- ✅ Localhost detection
- ✅ Unregistration functionality

### 2. E2E Tests

#### PWA Functionality Tests (`cypress/e2e/pwa.cy.js`)

- ✅ Service worker registration
- ✅ Offline functionality
- ✅ App installation features
- ✅ Cache management
- ✅ Performance and loading
- ✅ Error handling
- ✅ Cross-browser compatibility

#### Offline Page Tests (`cypress/e2e/offline.cy.js`)

- ✅ Offline page display
- ✅ Navigation and retry functionality
- ✅ Content and accessibility
- ✅ Integration with service worker
- ✅ Performance metrics

## 🧪 Manual Testing

### 1. Service Worker Testing

#### Check Service Worker Registration

1. Open browser dev tools
2. Go to Application/Service Workers tab
3. Verify service worker is registered
4. Check for any errors in console

#### Test Offline Functionality

1. Load the app in browser
2. Open dev tools → Network tab
3. Check "Offline" checkbox
4. Refresh the page
5. Verify app still works offline

### 2. App Installation Testing

#### Desktop Installation

1. Open app in Chrome/Edge
2. Look for install prompt in address bar
3. Click install and verify app launches
4. Check app appears in applications list

#### Mobile Installation

1. Open app in mobile browser
2. Look for "Add to Home Screen" option
3. Install app and verify it launches
4. Test offline functionality

### 3. Cache Testing

#### Verify Caching

1. Open dev tools → Application/Storage
2. Check Cache Storage for cached resources
3. Verify static assets are cached
4. Test navigation caching

## 🔍 Test Coverage

### PWA Core Features

- [x] Service worker registration and updates
- [x] Offline functionality and fallbacks
- [x] App installation and manifest
- [x] Cache management and strategies
- [x] Performance optimization
- [x] Error handling and resilience

### User Experience

- [x] Offline page display
- [x] App navigation when offline
- [x] Retry functionality
- [x] Loading performance
- [x] Cross-browser compatibility

### Technical Implementation

- [x] Workbox integration
- [x] Cache strategies (CacheFirst, NetworkFirst, StaleWhileRevalidate)
- [x] Service worker lifecycle management
- [x] Build process integration
- [x] Error boundaries and fallbacks

## 🐛 Troubleshooting

### Common Issues

#### Service Worker Not Registering

- Check if running in production mode
- Verify HTTPS or localhost
- Check browser console for errors
- Ensure service worker file exists in build

#### Offline Functionality Not Working

- Verify service worker is registered
- Check cache storage in dev tools
- Ensure offline page exists
- Test with network throttling

#### App Installation Issues

- Verify manifest.json is valid
- Check for proper meta tags
- Ensure HTTPS is enabled
- Test on supported browsers

### Debug Commands

```bash
# Run all tests (including PWA tests)
npm run test

# Run unit tests only
npm run unit

# Run e2e tests only
npm run e2e

# Build and test
npm run build && npm run test
```

## 📊 Test Results

### Expected Output

#### Successful Unit Test Run (Including PWA Tests)

```
PASS src/service-worker.test.js
PASS src/serviceWorkerRegistration.test.js
PASS src/helpers/spadesMath.test.js
PASS src/helpers/dealer.test.js

Test Suites: 4 passed, 4 total
Tests:       15 passed, 15 total
```

#### Successful E2E Test Run (Including PWA Tests)

```
✓ PWA Functionality (10 tests)
✓ Offline Page Functionality (8 tests)
✓ Test the input form (2 tests)
✓ When certain sections are visible (4 tests)

4 passing (2m 30s)
```

## 🔄 Continuous Integration

The existing CI pipeline will automatically run PWA tests as part of the standard test suite.

## 📝 Notes

- Tests require a build to be generated first (`npm run build`)
- E2E tests require the app to be running (`npm start`)
- Some tests may fail in development mode (expected behavior)
- Service worker tests are environment-specific
- Offline tests require proper network simulation

## 🤝 Contributing

When adding new PWA features:

1. Add corresponding unit tests to existing test files
2. Add E2E tests for user-facing features
3. Ensure all tests pass before merging
4. Update this documentation if needed
