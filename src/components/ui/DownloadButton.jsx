import React, { useState, useEffect, useRef } from 'react';
import { Button, Box, Text, VStack, useToast } from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';

const DownloadButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isCheckingInstall, setIsCheckingInstall] = useState(true);
  const toast = useToast();
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
          toast({
            title: 'App Already Installed',
            description:
              'Spades Calculator is already installed on your device.',
            status: 'info',
            duration: 3000,
            isClosable: true,
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
        toast({
          title: 'App Installed!',
          description: 'Spades Calculator has been added to your home screen.',
          status: 'success',
          duration: 3000,
          isClosable: true,
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
  }, [toast]);

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
            toast({
              title: 'Installation Started!',
              description:
                'Please follow the browser prompts to complete the installation.',
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
          } else {
            toast({
              title: 'Installation Cancelled',
              description:
                'You can try again anytime by clicking the download button.',
              status: 'info',
              duration: 3000,
              isClosable: true,
            });
          }
        } else {
          // If userChoice is not available, show a generic success message
          toast({
            title: 'Installation Prompt Shown',
            description:
              'Please follow the browser prompts to complete the installation.',
            status: 'info',
            duration: 3000,
            isClosable: true,
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

    toast({
      title: title,
      description: instructions,
      status: 'info',
      duration: 8000,
      isClosable: true,
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

    toast({
      title: title,
      description: instructions,
      status: 'info',
      duration: 8000,
      isClosable: true,
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
        <VStack spacing={3}>
          <Text fontWeight="bold" fontSize="lg">
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
        <VStack spacing={3}>
          <Text fontWeight="bold" fontSize="lg">
            🔍 Checking Installation Status...
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box
      data-testid="download-button"
      bg="gray.700"
      color="white"
      p={4}
      borderRadius="lg"
      boxShadow="lg"
      border="1px solid"
      borderColor="gray.600"
      mb={4}
    >
      <VStack spacing={3}>
        <Text fontWeight="bold" fontSize="lg">
          📱 Download Spades Calculator App
        </Text>
        <Text fontSize="sm" color="gray.300" textAlign="center">
          Add to your home screen for quick access and offline use
        </Text>
        <Button
          data-testid="download-app-button"
          leftIcon={<DownloadIcon />}
          colorScheme="blue"
          size="lg"
          onClick={handleInstallClick}
          w="full"
          _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
          transition="all 0.2s"
        >
          Download App
        </Button>
      </VStack>
    </Box>
  );
};

export default DownloadButton;
