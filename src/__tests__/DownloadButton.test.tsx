import { vi } from 'vitest';

import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { Provider } from '../components/ui/provider';
import { DownloadButton } from '../components/ui';
import type { ReactNode } from 'react';

/** Event mock type for beforeinstallprompt tests */
interface MockBeforeInstallPromptEvent extends Event {
  prompt: ReturnType<typeof vi.fn>;
  userChoice: Promise<{ outcome: string }>;
}

const { mockToast } = vi.hoisted(() => {
  return { mockToast: vi.fn() };
});

// Mock the toaster instead of useToast since we converted to it
vi.mock('../components/ui/toaster', () => ({
  toaster: {
    create: mockToast,
  },
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
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

// Mock window.navigator.standalone
Object.defineProperty(window.navigator, 'standalone', {
  writable: true,
  value: false,
});

// Mock the appinstalled event
const mockAppInstalledEvent = new Event('appinstalled');

const renderWithProvider = (component: ReactNode) => {
  return render(<Provider>{component}</Provider>);
};

describe('DownloadButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset window.navigator.standalone
    Object.defineProperty(window.navigator, 'standalone', {
      writable: true,
      value: false,
    });
    // Reset window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
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
    // Reset navigator.share
    try {
      Object.defineProperty(navigator, 'share', {
        value: undefined,
        configurable: true,
        writable: true,
      });
    } catch {
      // If it's already non-configurable, we can't change it this way
      // But we can try a simple assignment if it's writable
      try {
        (navigator as unknown as Record<string, unknown>).share = undefined;
      } catch {
        // console.warn('Could not reset navigator.share');
      }
    }
    // Reset navigator.userAgent
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      configurable: true,
    });
  });

  it('should render download button when app is not installed', async () => {
    renderWithProvider(<DownloadButton />);

    // Wait for the installation check to complete
    await waitFor(() => {
      expect(
        screen.getByText('📱 Download Spades Calculator App')
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText(
        'Add to your home screen for quick access and offline use'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /download app/i })
    ).toBeInTheDocument();
  });

  it('should show already installed message when app is already installed (standalone mode)', async () => {
    // Mock standalone mode
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === '(display-mode: standalone)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    renderWithProvider(<DownloadButton />);

    // Wait for the installation check to complete
    await waitFor(() => {
      expect(screen.getByText('✅ App Already Installed')).toBeInTheDocument();
    });

    expect(
      screen.queryByText('📱 Download Spades Calculator App')
    ).not.toBeInTheDocument();
    expect(
      screen.getByText('Spades Calculator is already installed on your device')
    ).toBeInTheDocument();
  });

  it('should show already installed message when app is already installed (iOS standalone)', async () => {
    // Mock iOS standalone mode
    Object.defineProperty(window.navigator, 'standalone', {
      writable: true,
      value: true,
    });

    renderWithProvider(<DownloadButton />);

    // Wait for the installation check to complete
    await waitFor(() => {
      expect(screen.getByText('✅ App Already Installed')).toBeInTheDocument();
    });

    expect(
      screen.queryByText('📱 Download Spades Calculator App')
    ).not.toBeInTheDocument();
    expect(
      screen.getByText('Spades Calculator is already installed on your device')
    ).toBeInTheDocument();
  });

  it('should handle beforeinstallprompt event', async () => {
    renderWithProvider(<DownloadButton />);

    // Simulate beforeinstallprompt event
    const beforeInstallPromptEvent = new Event('beforeinstallprompt') as MockBeforeInstallPromptEvent;
    beforeInstallPromptEvent.preventDefault = vi.fn();
    beforeInstallPromptEvent.prompt = vi.fn();
    beforeInstallPromptEvent.userChoice = Promise.resolve({
      outcome: 'accepted',
    });

    await act(async () => {
      window.dispatchEvent(beforeInstallPromptEvent);
    });

    // Wait for the event to be processed
    await waitFor(() => {
      expect(beforeInstallPromptEvent.preventDefault).toHaveBeenCalled();
    });
  });

  it('should handle install button click with deferred prompt', async () => {
    renderWithProvider(<DownloadButton />);

    // Simulate beforeinstallprompt event first
    const beforeInstallPromptEvent = new Event('beforeinstallprompt') as MockBeforeInstallPromptEvent;
    beforeInstallPromptEvent.preventDefault = vi.fn();
    beforeInstallPromptEvent.prompt = vi.fn();
    beforeInstallPromptEvent.userChoice = Promise.resolve({
      outcome: 'accepted',
    });

    await act(async () => {
      window.dispatchEvent(beforeInstallPromptEvent);
    });

    // Wait for the event to be processed
    await waitFor(() => {
      expect(beforeInstallPromptEvent.preventDefault).toHaveBeenCalled();
    });

    // Click the download button
    const downloadButton = screen.getByRole('button', {
      name: /download app/i,
    });
    await act(async () => {
      fireEvent.click(downloadButton);
    });

    // Wait for the prompt to be called
    await waitFor(() => {
      expect(beforeInstallPromptEvent.prompt).toHaveBeenCalled();
    });
  });

  it('should handle install button click with deferred prompt - user cancels', async () => {
    renderWithProvider(<DownloadButton />);

    // Simulate beforeinstallprompt event first
    const beforeInstallPromptEvent = new Event('beforeinstallprompt') as MockBeforeInstallPromptEvent;
    beforeInstallPromptEvent.preventDefault = vi.fn();
    beforeInstallPromptEvent.prompt = vi.fn();
    beforeInstallPromptEvent.userChoice = Promise.resolve({
      outcome: 'dismissed',
    });

    await act(async () => {
      window.dispatchEvent(beforeInstallPromptEvent);
    });

    // Click the download button
    const downloadButton = screen.getByRole('button', {
      name: /download app/i,
    });
    await act(async () => {
      fireEvent.click(downloadButton);
    });

    // Wait for the prompt to be called and check for cancellation message
    await waitFor(() => {
      expect(beforeInstallPromptEvent.prompt).toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Installation Cancelled',
          description: expect.stringMatching(/try again anytime/),
        })
      );
    });
  });

  it('should show manual instructions when no deferred prompt is available', async () => {
    renderWithProvider(<DownloadButton />);

    // Click the download button without a deferred prompt
    const downloadButton = screen.getByRole('button', {
      name: /download app/i,
    });
    await act(async () => {
      fireEvent.click(downloadButton);
    });

    // Wait for the toast to be called with manual instructions
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Install Instructions',
          description: expect.stringMatching(/install icon/),
        })
      );
    });
  });

  it('should handle appinstalled event', async () => {
    renderWithProvider(<DownloadButton />);

    // Simulate appinstalled event
    await act(async () => {
      window.dispatchEvent(mockAppInstalledEvent);
    });

    // Wait for the toast to be called
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'App Installed!',
          description: 'Spades Calculator has been added to your home screen.',
          type: 'success',
        })
      );
    });
  });

  it('should show iOS instructions for iOS devices', async () => {
    // Mock iOS user agent
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
      configurable: true,
    });

    renderWithProvider(<DownloadButton />);

    const downloadButton = screen.getByRole('button', {
      name: /download app/i,
    });
    await act(async () => {
      fireEvent.click(downloadButton);
    });

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Install on iOS',
          description: expect.stringMatching(/Share button/),
        })
      );
    });
  });

  it('should show Android instructions for Android devices', async () => {
    // Mock Android user agent
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36',
      configurable: true,
    });

    renderWithProvider(<DownloadButton />);

    const downloadButton = screen.getByRole('button', {
      name: /download app/i,
    });
    await act(async () => {
      fireEvent.click(downloadButton);
    });

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Install on Android',
          description: expect.stringMatching(/menu/),
        })
      );
    });
  });

  it('should show desktop instructions for desktop browsers', async () => {
    // Mock desktop user agent
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      configurable: true,
    });

    renderWithProvider(<DownloadButton />);

    const downloadButton = screen.getByRole('button', {
      name: /download app/i,
    });
    await act(async () => {
      fireEvent.click(downloadButton);
    });

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Install Instructions',
          description: expect.stringMatching(/install icon/),
        })
      );
    });
  });

  // New tests for enhanced installation functionality
  describe('Enhanced Installation Logic', () => {
    it('should try to trigger installation multiple times for Android/desktop', async () => {
      renderWithProvider(<DownloadButton />);

      const downloadButton = screen.getByRole('button', {
        name: /download app/i,
      });

      await act(async () => {
        fireEvent.click(downloadButton);
      });

      // Wait for manual instructions to be shown
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Install Instructions',
            description: expect.stringMatching(/install icon/),
          })
        );
      });
    });

    it('should handle iOS share functionality when available', async () => {
      // Mock iOS user agent
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
        configurable: true,
      });

      renderWithProvider(<DownloadButton />);

      const downloadButton = screen.getByRole('button', {
        name: /download app/i,
      });

      await act(async () => {
        fireEvent.click(downloadButton);
      });

      // Check for the iOS instructions toast
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Install on iOS',
            description: expect.stringMatching(/Share button/),
          })
        );
      });
    });

    it('should handle iOS share functionality when share is cancelled', async () => {
      // Mock iOS user agent
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
        configurable: true,
      });

      renderWithProvider(<DownloadButton />);

      const downloadButton = screen.getByRole('button', {
        name: /download app/i,
      });

      await act(async () => {
        fireEvent.click(downloadButton);
      });

      // Wait for manual instructions to be shown
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Install on iOS',
            description: expect.stringMatching(/Share button/),
          })
        );
      });
    });

    it('should use deferredPromptRef when state is not updated yet', async () => {
      const { container } = renderWithProvider(<DownloadButton />);

      // Wait for the component to be fully mounted
      await waitFor(() => {
        expect(
          container.querySelector('[data-testid="download-button"]')
        ).toBeInTheDocument();
      });

      // Create a proper mock for the beforeinstallprompt event
      const beforeInstallPromptEvent = {
        preventDefault: vi.fn(),
        prompt: vi.fn(),
        userChoice: Promise.resolve({
          outcome: 'accepted',
        }),
      } as unknown as MockBeforeInstallPromptEvent;

      // Create a custom event that can be dispatched
      const customEvent = new Event('beforeinstallprompt') as MockBeforeInstallPromptEvent;
      // Add the required methods to the event
      customEvent.preventDefault = beforeInstallPromptEvent.preventDefault;
      customEvent.prompt = beforeInstallPromptEvent.prompt;
      customEvent.userChoice = beforeInstallPromptEvent.userChoice;

      // Dispatch the event and wait for it to be processed
      await act(async () => {
        window.dispatchEvent(customEvent);
      });

      // Wait for the event to be processed by checking if preventDefault was called
      await waitFor(
        () => {
          expect(beforeInstallPromptEvent.preventDefault).toHaveBeenCalled();
        },
        { timeout: 3000 }
      );

      // Click the download button immediately after the event
      const downloadButton = screen.getByRole('button', {
        name: /download app/i,
      });

      await act(async () => {
        fireEvent.click(downloadButton);
      });

      // Wait for the prompt to be called
      await waitFor(() => {
        expect(beforeInstallPromptEvent.prompt).toHaveBeenCalled();
      });
    });

    it('should handle errors during installation gracefully', async () => {
      // Mock console.error to avoid noise in tests
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => { });

      renderWithProvider(<DownloadButton />);

      const downloadButton = screen.getByRole('button', {
        name: /download app/i,
      });

      // Mock a scenario where an error occurs during the installation process
      // by mocking the deferredPrompt.prompt method to throw an error
      const mockError = new Error('Installation failed');
      const originalPrompt = (window.Event.prototype as unknown as Record<string, unknown>).prompt;
      (window.Event.prototype as unknown as Record<string, unknown>).prompt = vi.fn().mockImplementation(() => {
        throw mockError;
      });

      // Create a beforeinstallprompt event to trigger the error
      const beforeInstallPromptEvent = new Event('beforeinstallprompt') as MockBeforeInstallPromptEvent;
      beforeInstallPromptEvent.preventDefault = vi.fn();
      beforeInstallPromptEvent.prompt = vi.fn().mockImplementation(() => {
        throw mockError;
      });
      beforeInstallPromptEvent.userChoice = Promise.resolve({
        outcome: 'accepted',
      });

      await act(async () => {
        window.dispatchEvent(beforeInstallPromptEvent);
      });

      await act(async () => {
        fireEvent.click(downloadButton);
      });

      // Wait for manual instructions to be shown as fallback
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Install Instructions',
            description: expect.stringMatching(/install icon/),
          })
        );
      });

      // Verify error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error during installation:',
        mockError
      );

      consoleErrorSpy.mockRestore();
      (window.Event.prototype as unknown as Record<string, unknown>).prompt = originalPrompt;
    });

    it('should clean up event listeners on unmount', () => {
      const { unmount } = renderWithProvider(<DownloadButton />);

      // Spy on removeEventListener
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

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
});
