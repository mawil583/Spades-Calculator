import React, { useState, useEffect } from 'react';
import { Box, Button, Text, VStack, HStack } from '@chakra-ui/react';
import { Download } from 'lucide-react';
import { toaster } from './toaster';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Check if the app is already installed
    const isInstalled =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (isInstalled) {
      return;
    }

    // Only show the prompt after a delay and if the user hasn't seen the download button
    const timer = setTimeout(() => {
      // Check if we should show the prompt (only if user has been on the page for a while)
      if (deferredPrompt) {
        setShowInstallPrompt(true);
      }
    }, 10000); // Show after 10 seconds if user is still on the page

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // Listen for the appinstalled event
    const handleAppInstalled = () => {
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      toaster.create({
        title: 'App Installed!',
        description: 'Spades Calculator has been added to your home screen.',
        type: 'success',
        duration: 3000,
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      clearTimeout(timer);
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Show manual installation instructions
      showManualInstallInstructions();
      return;
    }

    try {
      // Show the install prompt
      deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      await deferredPrompt.userChoice;

      // no-op: we don't need to log acceptance/dismissal

      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      console.error('Error showing install prompt:', error);
      showManualInstallInstructions();
    }
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
          'Tap the menu (⋮) in Brave, then "Add to Home Screen" or "Install App"';
      } else {
        title = 'Install on iOS';
        instructions =
          'Tap the Share button (📤) in Safari, then "Add to Home Screen"';
      }
    } else if (isAndroid) {
      if (isBrave) {
        title = 'Install in Brave Browser';
        instructions =
          'Tap the menu (⋮) in Brave, then "Add to Home Screen" or "Install App"';
      } else {
        title = 'Install on Android';
        instructions = 'Tap the menu (⋮) in Chrome, then "Add to Home Screen"';
      }
    } else {
      // Desktop browsers
      if (isBrave) {
        title = 'Install in Brave Browser';
        instructions =
          "Look for the install icon (↗️) in Brave's address bar, or tap the menu (⋮) and select 'Install Spades Calculator'";
      } else if (isChrome) {
        title = 'Install in Chrome';
        instructions =
          "Look for the install icon (↗️) in Chrome's address bar, or tap the menu (⋮) and select 'Install Spades Calculator'";
      } else if (isFirefox) {
        title = 'Install in Firefox';
        instructions =
          "Tap the menu (⋮) in Firefox and select 'Install Spades Calculator'";
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

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setDeferredPrompt(null);
  };

  if (!showInstallPrompt) {
    return null;
  }

  return (
    <Box
      data-testid="install-prompt"
      position="fixed"
      bottom="20px"
      left="50%"
      transform="translateX(-50%)"
      bg="gray.700"
      color="white"
      p={4}
      borderRadius="lg"
      boxShadow="lg"
      border="1px solid"
      borderColor="gray.600"
      zIndex={1000}
      maxW="400px"
      w="90%"
    >
      <VStack gap={3} align="stretch">
        <HStack justify="space-between" align="center">
          <Text fontWeight="bold" fontSize="sm">
            📱 Install Spades Calculator
          </Text>
          <Button
            data-testid="dismiss-install-prompt"
            size="sm"
            variant="ghost"
            color="gray.300"
            onClick={handleDismiss}
            _hover={{ bg: 'gray.600' }}
          >
            ✕
          </Button>
        </HStack>

        <Text fontSize="xs" color="gray.300">
          Add to your home screen for quick access and offline use
        </Text>

        <HStack gap={2}>
          <Button
            data-testid="install-app-button"
            colorPalette="blue"
            size="sm"
            onClick={handleInstallClick}
            flex={1}
          >
            <Download />
            Install App
          </Button>
          <Button variant="outline" size="sm" onClick={handleDismiss} flex={1}>
            Maybe Later
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default InstallPrompt;
