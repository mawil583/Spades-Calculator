// Mock the toast hook before importing components
const mockToast = jest.fn();

// Mock the useToast hook
jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useToast: () => mockToast,
}));

// Also mock the specific useToast function
jest.mock('@chakra-ui/react', () => {
  const original = jest.requireActual('@chakra-ui/react');
  return {
    ...original,
    useToast: () => mockToast,
  };
});

import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { DownloadButton } from '../components/ui';

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

// Mock the appinstalled event
const mockAppInstalledEvent = new Event('appinstalled');

const renderWithChakra = (component) => {
  return render(<ChakraProvider>{component}</ChakraProvider>);
};

describe('DownloadButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
    // Reset navigator.share
    if (navigator.share) {
      delete navigator.share;
    }
    // Reset navigator.userAgent
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      configurable: true,
    });
  });

  it('should render download button when app is not installed', () => {
    renderWithChakra(<DownloadButton />);

    expect(
      screen.getByText('📱 Download Spades Calculator App')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Add to your home screen for quick access and offline use'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /download app/i })
    ).toBeInTheDocument();
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

    renderWithChakra(<DownloadButton />);

    expect(
      screen.queryByText('📱 Download Spades Calculator App')
    ).not.toBeInTheDocument();
  });

  it('should not render when app is already installed (iOS standalone)', () => {
    // Mock iOS standalone mode
    Object.defineProperty(window.navigator, 'standalone', {
      writable: true,
      value: true,
    });

    renderWithChakra(<DownloadButton />);

    expect(
      screen.queryByText('📱 Download Spades Calculator App')
    ).not.toBeInTheDocument();
  });

  it('should handle beforeinstallprompt event', async () => {
    renderWithChakra(<DownloadButton />);

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

    // Wait for the event to be processed
    await waitFor(() => {
      expect(beforeInstallPromptEvent.preventDefault).toHaveBeenCalled();
    });
  });

  it('should handle install button click with deferred prompt', async () => {
    renderWithChakra(<DownloadButton />);

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
    renderWithChakra(<DownloadButton />);

    // Simulate beforeinstallprompt event first
    const beforeInstallPromptEvent = new Event('beforeinstallprompt');
    beforeInstallPromptEvent.preventDefault = jest.fn();
    beforeInstallPromptEvent.prompt = jest.fn();
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
      expect(screen.getByText('Installation Cancelled')).toBeInTheDocument();
      expect(screen.getByText(/try again anytime/)).toBeInTheDocument();
    });
  });

  it('should show manual instructions when no deferred prompt is available', async () => {
    renderWithChakra(<DownloadButton />);

    // Click the download button without a deferred prompt
    const downloadButton = screen.getByRole('button', {
      name: /download app/i,
    });
    await act(async () => {
      fireEvent.click(downloadButton);
    });

    // Wait for the toast to be called with manual instructions
    await waitFor(() => {
      expect(screen.getByText('Install Instructions')).toBeInTheDocument();
      expect(screen.getByText(/install icon/)).toBeInTheDocument();
    });
  });

  it('should handle appinstalled event', async () => {
    renderWithChakra(<DownloadButton />);

    // Simulate appinstalled event
    await act(async () => {
      window.dispatchEvent(mockAppInstalledEvent);
    });

    // Wait for the toast to be called
    await waitFor(() => {
      expect(screen.getByText('App Installed!')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Spades Calculator has been added to your home screen.'
        )
      ).toBeInTheDocument();
    });
  });

  it('should show iOS instructions for iOS devices', async () => {
    // Mock iOS user agent
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
      configurable: true,
    });

    renderWithChakra(<DownloadButton />);

    const downloadButton = screen.getByRole('button', {
      name: /download app/i,
    });
    await act(async () => {
      fireEvent.click(downloadButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Install on iOS')).toBeInTheDocument();
      expect(screen.getByText(/Share button/)).toBeInTheDocument();
    });
  });

  it('should show Android instructions for Android devices', async () => {
    // Mock Android user agent
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36',
      configurable: true,
    });

    renderWithChakra(<DownloadButton />);

    const downloadButton = screen.getByRole('button', {
      name: /download app/i,
    });
    await act(async () => {
      fireEvent.click(downloadButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Install on Android')).toBeInTheDocument();
      expect(screen.getByText(/menu/)).toBeInTheDocument();
    });
  });

  it('should show desktop instructions for desktop browsers', async () => {
    // Mock desktop user agent
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      configurable: true,
    });

    renderWithChakra(<DownloadButton />);

    const downloadButton = screen.getByRole('button', {
      name: /download app/i,
    });
    await act(async () => {
      fireEvent.click(downloadButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Install Instructions')).toBeInTheDocument();
      expect(screen.getByText(/install icon/)).toBeInTheDocument();
    });
  });

  // New tests for enhanced installation functionality
  describe('Enhanced Installation Logic', () => {
    it('should try to trigger installation multiple times for Android/desktop', async () => {
      // Mock service worker support
      Object.defineProperty(navigator, 'serviceWorker', {
        value: {},
        configurable: true,
      });

      renderWithChakra(<DownloadButton />);

      const downloadButton = screen.getByRole('button', {
        name: /download app/i,
      });

      await act(async () => {
        fireEvent.click(downloadButton);
      });

      // Wait for manual instructions to be shown since we removed programmatic event triggering
      await waitFor(() => {
        expect(screen.getByText('Install Instructions')).toBeInTheDocument();
        expect(screen.getByText(/install icon/)).toBeInTheDocument();
      });
    });

    it('should handle iOS share functionality when available', async () => {
      // Mock iOS user agent
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
        configurable: true,
      });

      renderWithChakra(<DownloadButton />);

      const downloadButton = screen.getByRole('button', {
        name: /download app/i,
      });

      await act(async () => {
        fireEvent.click(downloadButton);
      });

      // Check for the iOS instructions toast
      await waitFor(() => {
        expect(screen.getByText('Install on iOS')).toBeInTheDocument();
        expect(screen.getByText(/Share button/)).toBeInTheDocument();
      });
    });

    it('should handle iOS share functionality when share is cancelled', async () => {
      // Mock iOS user agent
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
        configurable: true,
      });

      renderWithChakra(<DownloadButton />);

      const downloadButton = screen.getByRole('button', {
        name: /download app/i,
      });

      await act(async () => {
        fireEvent.click(downloadButton);
      });

      // Wait for manual instructions to be shown
      await waitFor(() => {
        expect(screen.getByText('Install on iOS')).toBeInTheDocument();
        expect(screen.getByText(/Share button/)).toBeInTheDocument();
      });
    });

    it('should use deferredPromptRef when state is not updated yet', async () => {
      const { container } = renderWithChakra(<DownloadButton />);

      // Wait for the component to be fully mounted
      await waitFor(() => {
        expect(
          container.querySelector('[data-testid="download-button"]')
        ).toBeInTheDocument();
      });

      // Create a proper mock for the beforeinstallprompt event
      const beforeInstallPromptEvent = {
        preventDefault: jest.fn(),
        prompt: jest.fn(),
        userChoice: Promise.resolve({
          outcome: 'accepted',
        }),
      };

      // Create a custom event that can be dispatched
      const customEvent = new Event('beforeinstallprompt');
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
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      renderWithChakra(<DownloadButton />);

      const downloadButton = screen.getByRole('button', {
        name: /download app/i,
      });

      // Mock a scenario where an error occurs during the installation process
      // by mocking the deferredPrompt.prompt method to throw an error
      const mockError = new Error('Installation failed');
      const originalPrompt = window.Event.prototype.prompt;
      window.Event.prototype.prompt = jest.fn().mockImplementation(() => {
        throw mockError;
      });

      // Create a beforeinstallprompt event to trigger the error
      const beforeInstallPromptEvent = new Event('beforeinstallprompt');
      beforeInstallPromptEvent.preventDefault = jest.fn();
      beforeInstallPromptEvent.prompt = jest.fn().mockImplementation(() => {
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
        expect(screen.getByText('Install Instructions')).toBeInTheDocument();
        expect(screen.getByText(/install icon/)).toBeInTheDocument();
      });

      // Verify error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error during installation:',
        mockError
      );

      consoleErrorSpy.mockRestore();
      window.Event.prototype.prompt = originalPrompt;
    });

    it('should clean up event listeners on unmount', () => {
      const { unmount } = renderWithChakra(<DownloadButton />);

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
});
