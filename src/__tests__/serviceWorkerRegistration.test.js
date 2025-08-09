import { jest } from '@jest/globals';

describe('Service Worker Registration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should export register and unregister functions', () => {
    const {
      register,
      unregister,
    } = require('../services/serviceWorkerRegistration');
    expect(typeof register).toBe('function');
    expect(typeof unregister).toBe('function');
  });

  it('should handle missing service worker support gracefully', () => {
    const originalNavigator = global.navigator;
    global.navigator = {};

    const { register } = require('../services/serviceWorkerRegistration');
    expect(() => register()).not.toThrow();

    global.navigator = originalNavigator;
  });

  it('should handle development environment', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const { register } = require('../services/serviceWorkerRegistration');
    expect(() => register()).not.toThrow();

    process.env.NODE_ENV = originalEnv;
  });
});
