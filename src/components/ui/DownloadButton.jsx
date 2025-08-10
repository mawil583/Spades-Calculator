import React, { useState, useEffect, useRef } from 'react';
import { Button, Box, Text, VStack, useToast } from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';

const DownloadButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const toast = useToast();
  const deferredPromptRef = useRef(null);

  useEffect(() => {
    // Check if the app is already installed
    const checkIfInstalled = () => {
      try {
        const installed =
          window.matchMedia('(display-mode: standalone)').matches ||
          window.navigator.standalone === true;
        setIsInstalled(installed);
      } catch (error) {
        console.log('Error checking if installed:', error);
        setIsInstalled(false);
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

      // If no deferred prompt, try to trigger installation programmatically
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);

      if (isIOS) {
        // For iOS, try to trigger the share sheet
        if (navigator.share && typeof navigator.share === 'function') {
          try {
            await navigator.share({
              title: 'Spades Calculator',
              text: 'Add Spades Calculator to your home screen for quick access',
              url: window.location.href,
            });
            toast({
              title: 'Share Menu Opened',
              description:
                'Look for "Add to Home Screen" in the share options.',
              status: 'info',
              duration: 5000,
              isClosable: true,
            });
            return;
          } catch (error) {
            // Share was cancelled or failed, continue to manual instructions
            console.log('Share failed:', error);
          }
        }
      } else if (isAndroid || !isIOS) {
        // For Android and desktop, show manual instructions
        // The beforeinstallprompt event should be handled by the browser
        // We don't need to programmatically trigger it
      }

      // If all else fails, show manual instructions
      showManualInstallInstructions();
    } catch (error) {
      console.error('Error during installation:', error);
      showManualInstallInstructions();
    }
  };

  const showManualInstallInstructions = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    let instructions = '';

    if (isIOS) {
      instructions =
        'Tap the Share button (📤) in Safari, then "Add to Home Screen"';
    } else if (isAndroid) {
      instructions = 'Tap the menu (⋮) in Chrome, then "Add to Home Screen"';
    } else {
      instructions =
        "Look for the share/install icon (↗️) in your browser's address bar";
    }

    toast({
      title: 'Install Instructions',
      description: instructions,
      status: 'info',
      duration: 5000,
      isClosable: true,
    });
  };

  // Don't show the button if the app is already installed
  if (isInstalled) {
    return null;
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
