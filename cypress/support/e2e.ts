// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Suppress noisy Chrome extension error: "The message port closed before a response was received."
// This originates from browser extensions, not our app. Ignore it to keep test logs clean.
Cypress.on('uncaught:exception', (err) => {
  if (
    typeof err?.message === 'string' &&
    err.message.includes(
      'The message port closed before a response was received'
    )
  ) {
    return false;
  }
});

Cypress.on('window:before:load', (win) => {
  const originalError = win.console.error;
  win.console.error = function (...args) {
    const first = args[0];
    if (
      typeof first === 'string' &&
      first.includes('The message port closed before a response was received')
    ) {
      return; // swallow this noise
    }
    return originalError.apply(this, args);
  };
});

// Alternatively you can use CommonJS syntax:
// require('./commands')
