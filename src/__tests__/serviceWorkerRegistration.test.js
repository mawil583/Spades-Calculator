import { register, unregister } from '../services/serviceWorkerRegistration';

describe('Service Worker Registration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should export register and unregister functions', () => {
    expect(typeof register).toBe('function');
    expect(typeof unregister).toBe('function');
  });

  it('should handle missing service worker support gracefully', () => {
    const originalNavigator = global.navigator;
    global.navigator = {};

    expect(() => register()).not.toThrow();

    global.navigator = originalNavigator;
  });

  it('should handle development environment', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    expect(() => register()).not.toThrow();

    process.env.NODE_ENV = originalEnv;
  });
});
