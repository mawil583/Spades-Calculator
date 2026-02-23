import { useState, useEffect, useRef } from 'react';
import { Button, Box, Text, VStack } from './';
import { Download } from 'lucide-react';
import { toaster } from './toaster';

const DownloadButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isCheckingInstall, setIsCheckingInstall] = useState(true);
  const deferredPromptRef = useRef(null);

  useEffect(() => {
    // Check if the app is already installed
    const checkIfInstalled = () => {
      try {
        // Multiple ways to detect if the app is installed
        const isStandalone = window.matchMedia(
          '(display-mode: standalone)'
        ).matches;
        const isIOSStandalone = window.navigator.standalone === true;
        const isInApp =
          window.navigator.userAgent.includes('wv') ||
          (window.navigator.userAgent.includes('Mobile') &&
            !window.navigator.userAgent.includes('Safari'));

        const installed = isStandalone || isIOSStandalone || isInApp;
        setIsInstalled(installed);
        setIsCheckingInstall(false);

        // If already installed, show a message
        if (installed) {
          toaster.create({
            title: 'App Already Installed',
            description:
              'Spades Calculator is already installed on your device.',
            type: 'info',
            duration: 3000,
          });
        }
      } catch (error) {
        console.log('Error checking if installed:', error);
        setIsInstalled(false);
        setIsCheckingInstall(false);
      }
    };

    checkIfInstalled();

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      try {
        e.preventDefault();
        setDeferredPrompt(e);
        deferredPromptRef.current = e;
      } catch (error) {
        console.log('Error handling beforeinstallprompt:', error);
      }
    };

    // Listen for the appinstalled event
    const handleAppInstalled = () => {
      try {
        setIsInstalled(true);
        setDeferredPrompt(null);
        deferredPromptRef.current = null;
        toaster.create({
          title: 'App Installed!',
          description: 'Spades Calculator has been added to your home screen.',
          type: 'success',
          duration: 3000,
        });
      } catch (error) {
        console.log('Error handling appinstalled:', error);
      }
    };

    // Only add event listeners if window is available
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);

      return () => {
        window.removeEventListener(
          'beforeinstallprompt',
          handleBeforeInstallPrompt
        );
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    try {
      // First, try to use the deferred prompt if available
      const currentDeferredPrompt = deferredPromptRef.current || deferredPrompt;
      if (currentDeferredPrompt && currentDeferredPrompt.prompt) {
        currentDeferredPrompt.prompt();

        // Check if userChoice exists and is a Promise
        if (
          currentDeferredPrompt.userChoice &&
          typeof currentDeferredPrompt.userChoice.then === 'function'
        ) {
          const { outcome } = await currentDeferredPrompt.userChoice;

          if (outcome === 'accepted') {
            toaster.create({
              title: 'Installation Started!',
              description:
                'Please follow the browser prompts to complete the installation.',
              type: 'success',
              duration: 3000,
            });
          } else {
            toaster.create({
              title: 'Installation Cancelled',
              description:
                'You can try again anytime by clicking the download button.',
              type: 'info',
              duration: 3000,
            });
          }
        } else {
          // If userChoice is not available, show a generic success message
          toaster.create({
            title: 'Installation Prompt Shown',
            description:
              'Please follow the browser prompts to complete the installation.',
            type: 'info',
            duration: 3000,
          });
        }

        setDeferredPrompt(null);
        deferredPromptRef.current = null;
        return;
      }

      // If no deferred prompt, detect browser and show appropriate instructions
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      const isBrave =
        navigator.brave?.isBrave() || /Brave/.test(navigator.userAgent);
      const isChrome = /Chrome/.test(navigator.userAgent) && !isBrave;
      const isSafari =
        /Safari/.test(navigator.userAgent) && !isChrome && !isBrave;
      const isFirefox = /Firefox/.test(navigator.userAgent);

      // For mobile browsers, show specific instructions instead of using share sheet
      if (isIOS || isAndroid) {
        showMobileInstallInstructions(
          isIOS,
          isAndroid,
          isBrave,
          isChrome,
          isSafari,
          isFirefox
        );
        return;
      }

      // For desktop browsers, show manual instructions
      showManualInstallInstructions();
    } catch (error) {
      console.error('Error during installation:', error);
      showManualInstallInstructions();
    }
  };

  const showMobileInstallInstructions = (
    isIOS,
    isAndroid,
    isBrave,
    isChrome,
    isSafari,
    isFirefox
  ) => {
    let instructions = '';
    let title = 'Install Instructions';

    if (isIOS) {
      if (isBrave) {
        title = 'Install in Brave Browser';
        instructions =
          'Tap the menu (⋯) in Brave, then look for "Add to Home Screen" or "Install App". If you don\'t see these options, try tapping "Share" first.';
      } else if (isSafari) {
        title = 'Install in Safari';
        instructions = 'Tap the Share button (📤), then "Add to Home Screen"';
      } else if (isChrome) {
        title = 'Install in Chrome';
        instructions = 'Tap the menu (⋯), then "Add to Home Screen"';
      } else {
        title = 'Install on iOS';
        instructions =
          'Tap the Share button (📤) in your browser, then "Add to Home Screen"';
      }
    } else if (isAndroid) {
      if (isBrave) {
        title = 'Install in Brave Browser';
        instructions =
          'Tap the menu (⋯) in Brave, then look for "Add to Home Screen" or "Install App". If you don\'t see these options, try tapping "Share" first.';
      } else if (isChrome) {
        title = 'Install in Chrome';
        instructions = 'Tap the menu (⋯), then "Add to Home Screen"';
      } else if (isFirefox) {
        title = 'Install in Firefox';
        instructions = 'Tap the menu (⋯), then "Add to Home Screen"';
      } else {
        title = 'Install on Android';
        instructions =
          'Tap the menu (⋯) in your browser, then "Add to Home Screen"';
      }
    }

    toaster.create({
      title: title,
      description: instructions,
      type: 'info',
      duration: 8000,
    });
  };

  const showManualInstallInstructions = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const isBrave =
      navigator.brave?.isBrave() || /Brave/.test(navigator.userAgent);
    const isChrome = /Chrome/.test(navigator.userAgent) && !isBrave;
    const isFirefox = /Firefox/.test(navigator.userAgent);

    let instructions = '';
    let title = 'Install Instructions';

    if (isIOS) {
      if (isBrave) {
        title = 'Install in Brave Browser';
        instructions =
          'Tap the menu (⋯) in Brave, then look for "Add to Home Screen" or "Install App". If you don\'t see these options, try tapping "Share" first.';
      } else {
        title = 'Install on iOS';
        instructions =
          'Tap the Share button (📤) in Safari, then "Add to Home Screen"';
      }
    } else if (isAndroid) {
      if (isBrave) {
        title = 'Install in Brave Browser';
        instructions =
          'Tap the menu (⋯) in Brave, then look for "Add to Home Screen" or "Install App". If you don\'t see these options, try tapping "Share" first.';
      } else {
        title = 'Install on Android';
        instructions = 'Tap the menu (⋯) in Chrome, then "Add to Home Screen"';
      }
    } else {
      // Desktop browsers
      if (isBrave) {
        title = 'Install in Brave Browser';
        instructions =
          "Look for the install icon (↗️) in Brave's address bar, or tap the menu (⋯) and select 'Install Spades Calculator'";
      } else if (isChrome) {
        title = 'Install in Chrome';
        instructions =
          "Look for the install icon (↗️) in Chrome's address bar, or tap the menu (⋯) and select 'Install Spades Calculator'";
      } else if (isFirefox) {
        title = 'Install in Firefox';
        instructions =
          "Tap the menu (⋯) in Firefox and select 'Install Spades Calculator'";
      } else {
        title = 'Install Instructions';
        instructions =
          "Look for the share/install icon (↗️) in your browser's address bar";
      }
    }

    toaster.create({
      title: title,
      description: instructions,
      type: 'info',
      duration: 8000,
    });
  };

  // Don't show the button if the app is already installed
  if (isInstalled) {
    return (
      <Box
        data-testid="already-installed-message"
        bg="green.700"
        color="white"
        p={4}
        borderRadius="lg"
        boxShadow="lg"
        border="1px solid"
        borderColor="green.600"
        mb={4}
      >
        <VStack gap={3}>
          <Text fontWeight="bold" fontSize="var(--app-font-lg)">
            ✅ App Already Installed
          </Text>
          <Text fontSize="sm" color="green.200" textAlign="center">
            Spades Calculator is already installed on your device
          </Text>
        </VStack>
      </Box>
    );
  }

  // Show loading state while checking installation status
  if (isCheckingInstall) {
    return (
      <Box
        data-testid="checking-installation"
        bg="gray.700"
        color="white"
        p={4}
        borderRadius="lg"
        boxShadow="lg"
        border="1px solid"
        borderColor="gray.600"
        mb={4}
      >
        <VStack gap={3}>
          <Text fontWeight="bold" fontSize="var(--app-font-lg)">
            🔍 Checking Installation Status...
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box
      data-testid="download-button"
      bg="premiumBlue"
      color="white"
      p={6}
      borderRadius="xl"
      boxShadow="2xl"
      border="1px solid"
      borderColor="var(--app-spacing-1)" // Using spacing as a proxy for alpha or just using a variable
      mb={10}
      mx={2}
    >
      <VStack gap={4}>
        <Text fontWeight="bold" fontSize="var(--app-font-xl)" letterSpacing="tight">
          📱 Download Spades Calculator App
        </Text>
        <Text fontSize="sm" color="gray.300" textAlign="center" px={4}>
          Add to your home screen for quick access and offline use
        </Text>
        <Button
          data-testid="download-app-button"
          variant="outline"
          size="lg"
          onClick={handleInstallClick}
          w="full"
          height="54px"
          fontSize="md"
          fontWeight="bold"
        >
          <Download size={22} />
          Download App
        </Button>
      </VStack>
    </Box>
  );
};

export default DownloadButton;
