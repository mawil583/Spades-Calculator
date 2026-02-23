// Mock the toast hook before importing components
import { vi } from 'vitest';

import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { Provider } from '../components/ui/provider';
import { InstallPrompt } from '../components/ui';

const { mockToaster } = vi.hoisted(() => {
  return {
    mockToaster: {
      create: vi.fn(),
    },
  };
});

vi.mock('../components/ui/toaster', () => ({
  toaster: mockToaster,
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.navigator.standalone
Object.defineProperty(window.navigator, 'standalone', {
  writable: true,
  value: false,
});

// Mock setTimeout
vi.useFakeTimers();

const renderWithProvider = (component) => {
  return render(<Provider>{component}</Provider>);
};

describe('InstallPrompt', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    // Reset window.navigator.standalone
    Object.defineProperty(window.navigator, 'standalone', {
      writable: true,
      value: false,
    });
    // Reset window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.runOnlyPendingTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('should not render initially when app is not installed', () => {
    renderWithProvider(<InstallPrompt />);

    expect(
      screen.queryByText('📱 Install Spades Calculator')
    ).not.toBeInTheDocument();
  });

  it('should not render when app is already installed (standalone mode)', () => {
    // Mock standalone mode
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query === '(display-mode: standalone)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    renderWithProvider(<InstallPrompt />);

    expect(
      screen.queryByText('📱 Install Spades Calculator')
    ).not.toBeInTheDocument();
  });

  it('should not render when app is already installed (iOS standalone)', () => {
    // Mock iOS standalone mode
    Object.defineProperty(window.navigator, 'standalone', {
      writable: true,
      value: true,
    });

    renderWithProvider(<InstallPrompt />);

    expect(
      screen.queryByText('📱 Install Spades Calculator')
    ).not.toBeInTheDocument();
  });

  it('should show prompt after 10 seconds when beforeinstallprompt event is fired', async () => {
    renderWithProvider(<InstallPrompt />);

    // Simulate beforeinstallprompt event
    const beforeInstallPromptEvent = new Event('beforeinstallprompt');
    beforeInstallPromptEvent.preventDefault = jest.fn();
    beforeInstallPromptEvent.prompt = jest.fn();
    beforeInstallPromptEvent.userChoice = Promise.resolve({
      outcome: 'accepted',
    });

    await act(async () => {
      window.dispatchEvent(beforeInstallPromptEvent);
    });

    // Fast-forward time by 10 seconds
    await act(async () => {
      vi.advanceTimersByTime(10000);
    });

    // Wait for the prompt to appear
    await waitFor(() => {
      expect(
        screen.getByText('📱 Install Spades Calculator')
      ).toBeInTheDocument();
    });
  });

  it('should handle install button click with deferred prompt', async () => {
    renderWithProvider(<InstallPrompt />);

    // Simulate beforeinstallprompt event first
    const beforeInstallPromptEvent = new Event('beforeinstallprompt');
    beforeInstallPromptEvent.preventDefault = jest.fn();
    beforeInstallPromptEvent.prompt = jest.fn();
    beforeInstallPromptEvent.userChoice = Promise.resolve({
      outcome: 'accepted',
    });

    await act(async () => {
      window.dispatchEvent(beforeInstallPromptEvent);
    });

    // Fast-forward time by 10 seconds
    await act(async () => {
      vi.advanceTimersByTime(10000);
    });

    // Wait for the prompt to appear
    await waitFor(() => {
      expect(
        screen.getByText('📱 Install Spades Calculator')
      ).toBeInTheDocument();
    });

    // Click the install button
    const installButton = screen.getByRole('button', { name: /install app/i });
    await act(async () => {
      fireEvent.click(installButton);
    });

    // Wait for the prompt to be called
    await waitFor(() => {
      expect(beforeInstallPromptEvent.prompt).toHaveBeenCalled();
    });
  });

  it('should handle dismiss button click', async () => {
    renderWithProvider(<InstallPrompt />);

    // Simulate beforeinstallprompt event first
    const beforeInstallPromptEvent = new Event('beforeinstallprompt');
    beforeInstallPromptEvent.preventDefault = jest.fn();
    beforeInstallPromptEvent.prompt = jest.fn();
    beforeInstallPromptEvent.userChoice = Promise.resolve({
      outcome: 'accepted',
    });

    await act(async () => {
      window.dispatchEvent(beforeInstallPromptEvent);
    });

    // Fast-forward time by 10 seconds
    await act(async () => {
      vi.advanceTimersByTime(10000);
    });

    // Wait for the prompt to appear
    await waitFor(() => {
      expect(
        screen.getByText('📱 Install Spades Calculator')
      ).toBeInTheDocument();
    });

    // Click the dismiss button
    const dismissButton = screen.getByRole('button', { name: /maybe later/i });
    await act(async () => {
      fireEvent.click(dismissButton);
    });

    // Wait for the prompt to disappear
    await waitFor(() => {
      expect(
        screen.queryByText('📱 Install Spades Calculator')
      ).not.toBeInTheDocument();
    });
  });

  it('should handle appinstalled event', async () => {
    renderWithProvider(<InstallPrompt />);

    // Simulate appinstalled event
    const appInstalledEvent = new Event('appinstalled');
    await act(async () => {
      window.dispatchEvent(appInstalledEvent);
    });

    // Wait for the toast to be called
    await waitFor(() => {
      expect(mockToaster.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'App Installed!',
          description: 'Spades Calculator has been added to your home screen.',
          type: 'success',
        })
      );
    });
  });

  it('should show manual instructions when no deferred prompt is available', async () => {
    renderWithProvider(<InstallPrompt />);

    // Fast-forward time by 10 seconds to trigger the prompt
    await act(async () => {
      jest.advanceTimersByTime(10000);
    });

    // Since no beforeinstallprompt event was fired, the prompt shouldn't appear
    expect(
      screen.queryByText('📱 Install Spades Calculator')
    ).not.toBeInTheDocument();
  });

  it('should clean up event listeners on unmount', () => {
    const { unmount } = renderWithProvider(<InstallPrompt />);

    // Spy on removeEventListener
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'beforeinstallprompt',
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'appinstalled',
      expect.any(Function)
    );
  });
});
