#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate a new cache version based on timestamp and random string
const timestamp = Date.now();
const randomString = Math.random().toString(36).substring(2, 8);
const cacheVersion = `v1.0.${timestamp}-${randomString}`;

// Path to the service worker file
const serviceWorkerPath = path.join(
  __dirname,
  '..',
  'src',
  'services',
  'service-worker.js'
);

// Read the current service worker file
let content = fs.readFileSync(serviceWorkerPath, 'utf8');

// Update the cache version
content = content.replace(
  /const CACHE_VERSION = ['"]v[^'"]*['"];/,
  `const CACHE_VERSION = '${cacheVersion}';`
);

// Write the updated content back
fs.writeFileSync(serviceWorkerPath, content);

console.log(`Updated cache version to: ${cacheVersion}`);
console.log(
  'This will force all clients to download fresh content on next visit.'
);
