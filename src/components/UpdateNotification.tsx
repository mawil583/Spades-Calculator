import { Box, Button, Text, VStack, HStack } from './ui';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X } from 'lucide-react';
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
    onRegisterError(error: Error) {
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

  return (
    <AnimatePresence>
      {(offlineReady || needRefresh) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            top: 'var(--app-spacing-4)',
            right: 'var(--app-spacing-4)',
            zIndex: 9999,
          }}
        >
          <Box
            bg="blue.600"
            color="white"
            px="var(--app-spacing-5)"
            py="var(--app-spacing-4)"
            borderRadius="xl"
            boxShadow="2xl"
            maxW="sm"
            border="1px solid"
            borderColor="blue.400"
          >
            <VStack gap="var(--app-spacing-4)" align="stretch">
              <HStack justify="space-between" align="center">
                <Text
                  fontWeight="extrabold"
                  fontSize="md"
                  letterSpacing="tight"
                >
                  {needRefresh
                    ? '🚀 New Version Available'
                    : '✨ Ready for Offline Use'}
                </Text>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={handleDismiss}
                  p="var(--app-spacing-1)"
                  minW="auto"
                  borderRadius="full"
                >
                  <X size={16} />
                </Button>
              </HStack>

              <Text fontSize="sm" opacity="0.9">
                {needRefresh
                  ? 'A new version of Spades Calculator is ready. Update now to get the latest features and improvements.'
                  : 'The app has been cached and is ready to work offline.'}
              </Text>

              <HStack gap="var(--app-spacing-2)">
                {needRefresh && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleUpdate}
                    flex="1"
                  >
                    <RefreshCw size={16} />
                    Update Now
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={handleDismiss}>
                  {needRefresh ? 'Later' : 'Dismiss'}
                </Button>
              </HStack>
            </VStack>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpdateNotification;
