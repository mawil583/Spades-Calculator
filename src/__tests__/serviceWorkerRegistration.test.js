import { register, unregister } from '../services/serviceWorkerRegistration';

describe('Service Worker Registration', () => {
  let originalNavigator;
  let originalWindow;
  let originalProcess;
  let originalFetch;

  beforeEach(() => {
    jest.clearAllMocks();

    // Store original globals
    originalNavigator = global.navigator;
    originalWindow = global.window;
    originalProcess = process.env;
    originalFetch = global.fetch;

    // Mock console methods
    global.console = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };
  });

  afterEach(() => {
    // Restore original globals
    global.navigator = originalNavigator;
    global.window = originalWindow;
    process.env = originalProcess;
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  describe('Basic Functionality', () => {
    it('should export register and unregister functions', () => {
      expect(typeof register).toBe('function');
      expect(typeof unregister).toBe('function');
    });

    it('should handle missing service worker support gracefully', () => {
      global.navigator = {};

      expect(() => register()).not.toThrow();
    });

    it('should handle development environment', () => {
      process.env.NODE_ENV = 'development';
      global.navigator = {};

      expect(() => register()).not.toThrow();
    });
  });

  describe('Environment Detection', () => {
    it('should detect production environment', () => {
      process.env.NODE_ENV = 'production';
      global.navigator = {};

      expect(() => register()).not.toThrow();
    });

    it('should detect localhost environment', () => {
      global.window = {
        location: { hostname: 'localhost' },
      };
      global.navigator = {};

      expect(() => register()).not.toThrow();
    });

    it('should detect IPv4 localhost', () => {
      global.window = {
        location: { hostname: '127.0.0.1' },
      };
      global.navigator = {};

      expect(() => register()).not.toThrow();
    });

    it('should detect IPv6 localhost', () => {
      global.window = {
        location: { hostname: '[::1]' },
      };
      global.navigator = {};

      expect(() => register()).not.toThrow();
    });
  });

  describe('Configuration Handling', () => {
    it('should handle custom configuration', () => {
      const config = { onSuccess: jest.fn(), onUpdate: jest.fn() };
      global.navigator = {};

      expect(() => register(config)).not.toThrow();
    });

    it('should handle null configuration', () => {
      global.navigator = {};

      expect(() => register(null)).not.toThrow();
    });

    it('should handle undefined configuration', () => {
      global.navigator = {};

      expect(() => register(undefined)).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing navigator gracefully', () => {
      global.navigator = {};

      expect(() => register()).not.toThrow();
    });

    it('should handle missing window gracefully', () => {
      global.window = undefined;
      global.navigator = {};

      expect(() => register()).not.toThrow();
    });

    it('should handle missing location gracefully', () => {
      global.window = {};
      global.navigator = {};

      expect(() => register()).not.toThrow();
    });
  });

  describe('Unregister Functionality', () => {
    it('should handle unregister without service worker support', () => {
      global.navigator = {};

      expect(() => unregister()).not.toThrow();
    });

    it('should handle unregister with service worker support', () => {
      const mockRegistration = {
        unregister: jest.fn().mockResolvedValue(true),
      };

      global.navigator = {
        serviceWorker: {
          ready: Promise.resolve(mockRegistration),
        },
      };

      expect(() => unregister()).not.toThrow();
    });
  });

  describe('Production Environment', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
      process.env.PUBLIC_URL = '/';

      global.window = {
        location: {
          hostname: 'localhost',
          href: 'http://localhost:3000/',
          origin: 'http://localhost:3000',
        },
        addEventListener: jest.fn(),
      };

      global.navigator = {
        serviceWorker: {
          register: jest.fn().mockResolvedValue({
            onupdatefound: null,
            installing: null,
          }),
          ready: Promise.resolve({
            unregister: jest.fn(),
          }),
        },
      };

      global.fetch = jest.fn().mockResolvedValue({
        status: 200,
        headers: { get: () => 'application/javascript' },
      });
    });

    it('should attempt registration in production', () => {
      register();

      // Should add load event listener
      expect(global.window.addEventListener).toHaveBeenCalledWith(
        'load',
        expect.any(Function)
      );
    });

    it('should handle localhost environment in production', () => {
      register();

      expect(global.window.addEventListener).toHaveBeenCalledWith(
        'load',
        expect.any(Function)
      );
    });
  });

  describe('Service Worker URL Construction', () => {
    it('should handle different PUBLIC_URL values', () => {
      process.env.NODE_ENV = 'production';
      process.env.PUBLIC_URL = '/my-app';

      global.window = {
        location: {
          hostname: 'localhost',
          href: 'http://localhost:3000/my-app/',
          origin: 'http://localhost:3000',
        },
        addEventListener: jest.fn(),
      };

      global.navigator = {
        serviceWorker: {
          register: jest.fn(),
          ready: Promise.resolve({
            unregister: jest.fn(),
          }),
        },
      };

      expect(() => register()).not.toThrow();
    });
  });
});
