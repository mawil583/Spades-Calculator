// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Configure global test environment
import { vi } from "vitest";

// Make vi available globally as jest (for libraries that reference jest globals)
Object.defineProperty(global, "jest", { value: vi, writable: true });

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  warn: vi.fn(),
  error: vi.fn(),
};

// Mock window.matchMedia for PWA-related tests
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock window.navigator.standalone for iOS PWA detection
Object.defineProperty(window.navigator, "standalone", {
  writable: true,
  value: false,
});

// Mock navigator.share for Web Share API
Object.defineProperty(navigator, "share", {
  writable: true,
  value: undefined,
});

// Mock navigator.brave for Brave browser detection
Object.defineProperty(navigator, "brave", {
  writable: true,
  value: undefined,
});

// Mock service worker for PWA functionality
Object.defineProperty(navigator, "serviceWorker", {
  writable: true,
  value: {
    ready: Promise.resolve({
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      installing: null,
      controller: null,
    }),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    register: vi.fn(),
    getRegistration: vi.fn(),
    getRegistrations: vi.fn(),
    controller: null,
  },
});

// Mock virtual PWA module for Vitest
vi.mock("virtual:pwa-register/react", () => ({
  useRegisterSW: () => ({
    offlineReady: [false, vi.fn()],
    needRefresh: [false, vi.fn()],
    updateServiceWorker: vi.fn(),
  }),
}));
