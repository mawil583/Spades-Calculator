import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppModal, Button, Text, Stack, Flex } from '../ui';
import { Copy, Check } from 'lucide-react';
import { GlobalContext } from '../../store/GlobalContext';

interface ShareWatchProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal that starts a leader watch session (if none exists) and exposes the
 * shareable "watch" URL. Triggered from the header's "Share to watch" menu item
 * so it never collides with the mobile hamburger menu.
 */
const ShareWatch = ({ isOpen, onClose }: ShareWatchProps) => {
  const { startLeaderSession, sessionId, role } = useContext(GlobalContext);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startingRef = useRef(false);

  // Start a leader session the moment the modal opens. Errors are surfaced to
  // the user instead of failing silently (previously an unhandled rejection
  // left the button doing nothing).
  useEffect(() => {
    if (!isOpen) return;
    if (role === 'leader' && sessionId) return; // already a leader w/ session
    if (startingRef.current) return;
    startingRef.current = true;
    startLeaderSession()
      .then(() => setError(null))
      .catch((err) => {
        console.error('Failed to start watch session:', err);
        setError(
          'Could not start the session. Check that Firebase is configured and the database rules allow it, then try again.',
        );
      })
      .finally(() => {
        startingRef.current = false;
      });
  }, [isOpen, role, sessionId, startLeaderSession]);

  // copied is reset on close via handleClose + on copy timeout (setTimeout in handleCopy)
  const shareLink = sessionId
    ? `${window.location.origin}/spades-calculator?session=${sessionId}`
    : null;

  const handleClose = useCallback(() => {
    setCopied(false);
    onClose();
  }, [onClose]);

  const handleCopy = useCallback(async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Clipboard write failed:', e);
    }
  }, [shareLink]);

  return (
    <AppModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Watch live"
      bodyStyle={{ pt: 4, px: 5, pb: 5 }}
    >
      <Stack gap={4}>
        <Text fontSize="sm" color="offWhite">
          Send this link to anyone at the table. On their phone they will see
          the live board read-only, and can pick the seat they are sitting in.
        </Text>
        {error ? (
          <Text fontSize="sm" color="red.300">
            {error}
          </Text>
        ) : shareLink ? (
          <>
            <Flex
              align="center"
              justify="space-between"
              gap={2}
              p={3}
              border="1px solid"
              borderColor="whiteAlpha.200"
              borderRadius="md"
              bg="blackAlpha.300"
            >
              <Text fontSize="sm" color="whiteAlpha.800" wordBreak="break-all">
                {shareLink}
              </Text>
              <Button
                onClick={handleCopy}
                variant="primary"
                size="sm"
                minW="6.5rem"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </Flex>
            <Text fontSize="xs" color="whiteAlpha.500">
              Tip: open this link in a private/incognito window to preview the
              viewer experience yourself.
            </Text>
          </>
        ) : (
          <Text fontSize="sm">Starting session…</Text>
        )}
      </Stack>
    </AppModal>
  );
};

export default ShareWatch;
