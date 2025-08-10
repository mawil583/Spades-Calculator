module.exports = {
  extends: ['react-app'],
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  globals: {
    // Cypress globals
    cy: 'readonly',
    Cypress: 'readonly',
    // Playwright globals
    test: 'readonly',
    expect: 'readonly',
  },
  overrides: [
    {
      // Cypress files
      files: ['cypress/**/*.js', 'cypress/**/*.jsx'],
      env: {
        'cypress/globals': true,
      },
    },
    {
      // Playwright test files
      files: ['tests/**/*.js', 'tests/**/*.jsx'],
      env: {
        node: true,
      },
    },
  ],
  rules: {
    // Disable some rules for test files
    'no-unused-expressions': 'off',
  },
};
