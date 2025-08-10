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
        browser: true,
        es6: true,
      },
      rules: {
        'no-unused-expressions': 'off',
      },
    },
    {
      // Playwright test files
      files: ['tests/**/*.js', 'tests/**/*.jsx'],
      env: {
        node: true,
      },
      rules: {
        'no-unused-expressions': 'off',
      },
    },
  ],
  rules: {
    // Disable some rules for test files
    'no-unused-expressions': 'off',
  },
};
