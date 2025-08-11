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
  const toast = useToast();

  useEffect(() => {
    // Check if service worker is supported
    if (
      'serviceWorker' in navigator &&
      typeof navigator.serviceWorker.ready !== 'undefined'
    ) {
      navigator.serviceWorker.ready
        .then((reg) => {
          // Listen for updates
          if (reg && typeof reg.addEventListener === 'function') {
            reg.addEventListener('updatefound', () => {
              const newWorker = reg.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (
                    newWorker.state === 'installed' &&
                    navigator.serviceWorker.controller
                  ) {
                    // New content is available
                    setWaitingWorker(newWorker);
                    setShowUpdateNotification(true);
                  }
                });
              }
            });
          }
        })
        .catch((error) => {
          console.log('Service worker ready error:', error);
        });
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      // Send message to service worker to skip waiting
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });

      // Listen for the controllerchange event
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Reload the page to use the new service worker
        window.location.reload();
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
              colorScheme="whiteAlpha"
              leftIcon={<RepeatIcon />}
              onClick={handleUpdate}
              flex="1"
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
