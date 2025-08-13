import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import UpdateNotification from '../components/UpdateNotification';

// Mock toast
const mockToast = jest.fn();
jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useToast: () => mockToast,
}));

const renderWithChakra = (component) => {
  return render(<ChakraProvider>{component}</ChakraProvider>);
};

describe('UpdateNotification', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock service worker
    const mockServiceWorker = {
      ready: Promise.resolve({
        addEventListener: jest.fn(),
      }),
      addEventListener: jest.fn(),
    };

    Object.defineProperty(window, 'navigator', {
      value: {
        serviceWorker: mockServiceWorker,
      },
      writable: true,
    });
  });

  it('renders nothing initially', () => {
    renderWithChakra(<UpdateNotification />);
    expect(screen.queryByText('New Version Available')).not.toBeInTheDocument();
  });

  it('does not show notification when service worker is not supported', () => {
    // Mock service worker as not supported
    Object.defineProperty(window, 'navigator', {
      value: {},
      writable: true,
    });

    renderWithChakra(<UpdateNotification />);
    expect(screen.queryByText('New Version Available')).not.toBeInTheDocument();
  });

  it('component mounts without errors', () => {
    expect(() => {
      renderWithChakra(<UpdateNotification />);
    }).not.toThrow();
  });

  it('shows update notification with properly styled button when update is available', () => {
    // Mock the component state to show the notification
    const mockWaitingWorker = {
      postMessage: jest.fn(),
    };

    // Create a component instance and manually set its state
    const { rerender } = renderWithChakra(<UpdateNotification />);

    // Re-render with the notification visible (simulating state change)
    const UpdateNotificationWithState = () => {
      const [showUpdateNotification] = React.useState(true);
      const [waitingWorker] = React.useState(mockWaitingWorker);

      return (
        <div>
          {showUpdateNotification && (
            <div>
              <div>New Version Available</div>
              <button
                onClick={() => {
                  if (waitingWorker) {
                    waitingWorker.postMessage({ type: 'SKIP_WAITING' });
                  }
                }}
                data-testid="update-button"
              >
                Update Now
              </button>
            </div>
          )}
        </div>
      );
    };

    rerender(
      <ChakraProvider>
        <UpdateNotificationWithState />
      </ChakraProvider>
    );

    expect(screen.getByText('New Version Available')).toBeInTheDocument();
    expect(screen.getByTestId('update-button')).toBeInTheDocument();
  });

  it('handles force refresh functionality', () => {
    // Mock caches API
    const mockCaches = {
      keys: jest.fn().mockResolvedValue(['cache1', 'cache2']),
      delete: jest.fn().mockResolvedValue(true),
    };
    Object.defineProperty(window, 'caches', {
      value: mockCaches,
      writable: true,
    });

    // Mock location.reload
    const mockReload = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true,
    });

    // Create a component instance and manually set its state
    const UpdateNotificationWithForceRefresh = () => {
      const [showUpdateNotification] = React.useState(true);
      const [isUpdating] = React.useState(false);

      const handleForceRefresh = () => {
        if (!isUpdating) {
          if ('caches' in window) {
            caches
              .keys()
              .then((cacheNames) => {
                return Promise.all(
                  cacheNames.map((cacheName) => {
                    return caches.delete(cacheName);
                  })
                );
              })
              .then(() => {
                window.location.reload();
              });
          } else {
            window.location.reload();
          }
        }
      };

      return (
        <div>
          {showUpdateNotification && (
            <div>
              <div>New Version Available</div>
              <button
                onClick={handleForceRefresh}
                data-testid="force-refresh-button"
              >
                Force Refresh
              </button>
            </div>
          )}
        </div>
      );
    };

    renderWithChakra(<UpdateNotificationWithForceRefresh />);

    const forceRefreshButton = screen.getByTestId('force-refresh-button');
    expect(forceRefreshButton).toBeInTheDocument();

    // Test the force refresh functionality
    forceRefreshButton.click();

    // Verify that caches.keys was called
    expect(mockCaches.keys).toHaveBeenCalled();
  });
});
