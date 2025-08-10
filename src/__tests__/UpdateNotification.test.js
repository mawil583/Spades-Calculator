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
});
