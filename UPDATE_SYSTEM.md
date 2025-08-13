# Update System

This document describes how the Spades Calculator app handles updates and ensures users get the latest version without losing their game data.

## How It Works

### 1. **Service Worker Caching Strategy**

- **StaleWhileRevalidate**: CSS and JS files use this strategy, which serves cached content immediately while checking for updates in the background
- **Cache Versioning**: Each deployment gets a unique cache version (e.g., `v1.0.1234567890`) that forces cache invalidation
- **Automatic Cleanup**: Old caches are automatically deleted when the service worker updates

### 2. **Update Detection**

- The service worker checks for updates on every page load
- When a new version is detected, the `UpdateNotification` component appears
- Users can choose to update immediately or dismiss the notification

### 3. **Update Options**

- **Update Now**: Uses the service worker's `skipWaiting()` to immediately switch to the new version
- **Force Refresh**: Clears all caches and reloads the page (useful for stubborn cache issues)
- **Later**: Dismisses the notification (updates will still be applied on next page load)

## Technical Implementation

### Cache Versioning

```javascript
// Automatically updated during build process
const CACHE_VERSION = 'v1.0.1234567890';
const CACHE_NAMES = {
  static: `static-resources-${CACHE_VERSION}`,
  images: `images-${CACHE_VERSION}`,
  api: `api-cache-${CACHE_VERSION}`,
  appShell: `app-shell-${CACHE_VERSION}`,
  dynamic: `dynamic-cache-${CACHE_VERSION}`,
};
```

### Build Process

- `prebuild` script automatically updates the cache version before each build
- This ensures every deployment gets a fresh cache

### Game Data Preservation

- **localStorage**: Game data is stored in the browser's localStorage, which is separate from the service worker cache
- **No Data Loss**: Updates only affect the app code, not user data
- **Immediate Availability**: Game data remains available immediately after updates

## User Experience

### Normal Flow

1. User visits the app
2. App loads quickly from cache
3. Service worker checks for updates in background
4. If update available, notification appears
5. User can update immediately or continue playing
6. Game data is preserved throughout the process

### Edge Cases

- **Stubborn Cache**: If updates aren't appearing, users can use "Force Refresh"
- **Offline Mode**: App continues to work offline with cached resources
- **Multiple Tabs**: Updates are coordinated across all open tabs

## Benefits

✅ **Fast Loading**: Cached resources load instantly
✅ **Automatic Updates**: Users get latest version without manual intervention
✅ **Data Preservation**: Game progress is never lost during updates
✅ **Offline Support**: App works without internet connection
✅ **Cross-Device Sync**: Updates work consistently across mobile and desktop

## Troubleshooting

### If Updates Aren't Appearing

1. Check if the "New Version Available" notification appears
2. Try the "Force Refresh" button
3. Clear browser cache manually if needed
4. Check browser console for service worker errors

### For Developers

- Cache version is automatically updated during `npm run build`
- Manual cache version update: `node scripts/update-cache-version.js`
- Test updates by deploying and checking the notification appears
