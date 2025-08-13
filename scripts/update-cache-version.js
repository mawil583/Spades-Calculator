#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate a new cache version based on timestamp
const timestamp = Date.now();
const cacheVersion = `v1.0.${timestamp}`;

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
