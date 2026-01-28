import React from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  SlideFade,
  Icon,
} from '@chakra-ui/react';
import { RepeatIcon, CloseIcon } from '@chakra-ui/icons';
import { useRegisterSW } from 'virtual:pwa-register/react';

const UpdateNotification = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered() {
      console.log('SW Registered');
    },
    onRegisterError(error) {
      console.error('SW registration error', error);
    },
  });

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  const handleDismiss = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) {
    return null;
  }

  return (
    <SlideFade in={offlineReady || needRefresh} offsetY="20px">
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
              {needRefresh ? 'New Version Available' : 'Ready for Offline Use'}
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
            {needRefresh
              ? 'A new version of Spades Calculator is ready. Update now to get the latest features and improvements.'
              : 'The app has been cached and is ready to work offline.'}
          </Text>

          <HStack spacing="2">
            {needRefresh && (
              <Button
                size="sm"
                bg="white"
                color="blue.500"
                _hover={{ bg: 'gray.100' }}
                _active={{ bg: 'gray.200' }}
                leftIcon={<RepeatIcon />}
                onClick={handleUpdate}
                flex="1"
              >
                Update Now
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDismiss}
              _hover={{ bg: 'blue.600' }}
            >
              {needRefresh ? 'Later' : 'Dismiss'}
            </Button>
          </HStack>
        </VStack>
      </Box>
    </SlideFade>
  );
};

export default UpdateNotification;
