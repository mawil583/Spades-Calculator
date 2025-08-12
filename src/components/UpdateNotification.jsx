import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  useToast,
  SlideFade,
  Icon,
} from '@chakra-ui/react';
import { RepeatIcon, CloseIcon } from '@chakra-ui/icons';

const UpdateNotification = () => {
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Listen for service worker update events from the global event system
    const handleServiceWorkerUpdate = (event) => {
      const { registration } = event.detail;

      // Get the waiting worker from the registration
      if (registration.waiting) {
        setWaitingWorker(registration.waiting);
        setShowUpdateNotification(true);
      }
    };

    // Add event listener for service worker updates
    if (window.serviceWorkerUpdateEvent) {
      window.serviceWorkerUpdateEvent.addEventListener(
        'serviceWorkerUpdate',
        handleServiceWorkerUpdate
      );
    }

    // Cleanup function
    return () => {
      if (window.serviceWorkerUpdateEvent) {
        window.serviceWorkerUpdateEvent.removeEventListener(
          'serviceWorkerUpdate',
          handleServiceWorkerUpdate
        );
      }
    };
  }, []);

  const handleUpdate = () => {
    if (waitingWorker && !isUpdating) {
      setIsUpdating(true);

      // Send message to service worker to skip waiting
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });

      // Listen for the controllerchange event
      const handleControllerChange = () => {
        // Reload the page to use the new service worker
        window.location.reload();
      };

      navigator.serviceWorker.addEventListener(
        'controllerchange',
        handleControllerChange
      );

      // Show a toast to indicate the update is in progress
      toast({
        title: 'Updating...',
        description: 'The app is being updated. Please wait.',
        status: 'info',
        duration: 2000,
        isClosable: false,
      });
    }
  };

  const handleDismiss = () => {
    setShowUpdateNotification(false);
    toast({
      title: 'Update Dismissed',
      description: 'You can update later by refreshing the page.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  if (!showUpdateNotification) {
    return null;
  }

  return (
    <SlideFade in={showUpdateNotification} offsetY="20px">
      <Box
        position="fixed"
        top="4"
        right="4"
        zIndex="9999"
        bg="blue.500"
        color="white"
        p="4"
        borderRadius="lg"
        boxShadow="lg"
        maxW="sm"
        border="1px solid"
        borderColor="blue.600"
      >
        <VStack spacing="3" align="stretch">
          <HStack justify="space-between" align="start">
            <Text fontWeight="bold" fontSize="sm">
              New Version Available
            </Text>
            <Button
              size="sm"
              variant="ghost"
              color="white"
              _hover={{ bg: 'blue.600' }}
              onClick={handleDismiss}
              p="0"
              minW="auto"
            >
              <Icon as={CloseIcon} boxSize="3" />
            </Button>
          </HStack>

          <Text fontSize="sm" opacity="0.9">
            A new version of Spades Calculator is ready. Update now to get the
            latest features and improvements.
          </Text>

          <HStack spacing="2">
            <Button
              size="sm"
              bg="white"
              color="blue.500"
              _hover={{ bg: 'gray.100' }}
              _active={{ bg: 'gray.200' }}
              leftIcon={<RepeatIcon />}
              onClick={handleUpdate}
              flex="1"
              isLoading={isUpdating}
              loadingText="Updating..."
            >
              Update Now
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDismiss}
              _hover={{ bg: 'blue.600' }}
            >
              Later
            </Button>
          </HStack>
        </VStack>
      </Box>
    </SlideFade>
  );
};

export default UpdateNotification;
