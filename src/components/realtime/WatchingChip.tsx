import { Box, Flex, Text, Stack } from '../ui';

interface WatchingChipProps {
  isOpen: boolean;
  onToggle: () => void;
  onSwitchSeat: () => void;
  onLeave: () => void;
}

/**
 * Compact viewer status pill. Shows only a live dot + "Watching" so it fits
 * next to the title and hamburger on narrow phones (iPhone SE). Tapping it
 * opens a small menu with the viewer's two actions — "Switch seat" and
 * "Leave" — instead of rendering both buttons inline (which overflowed).
 *
 * Controlled: the parent (Header) owns `isOpen` so opening this menu can close
 * the hamburger menu (and vice-versa) — the two must never be open at once or
 * one eclipses the other.
 */
const WatchingChip = ({
  isOpen,
  onToggle,
  onSwitchSeat,
  onLeave,
}: WatchingChipProps) => {
  return (
    <Box position="relative" flexShrink={0}>
      <Flex
        data-testid="watching-chip"
        align="center"
        gap={1.5}
        bg="whiteAlpha.100"
        border="1px solid"
        borderColor="whiteAlpha.200"
        borderRadius="full"
        px={2}
        py={0.5}
        cursor="pointer"
        onClick={onToggle}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <Box
          data-testid="live-dot"
          w="8px"
          h="8px"
          borderRadius="full"
          bg="red.400"
          flexShrink={0}
        />
        <Text fontSize="xs" fontWeight="semibold" whiteSpace="nowrap">
          Watching
        </Text>
      </Flex>

      {isOpen && (
        <>
          <Box
            position="fixed"
            top="0"
            left="0"
            w="100vw"
            h="100vh"
            zIndex="100"
            onClick={onToggle}
          />
          <Box
            position="absolute"
            top="100%"
            right="0"
            mt={2}
            bg="bg"
            border="1px solid"
            borderColor="whiteAlpha.200"
            borderRadius="md"
            boxShadow="xl"
            overflow="hidden"
            minW="160px"
            zIndex="110"
          >
            <Stack gap={0}>
              <Flex
                data-testid="switch-seat-option"
                px={4}
                py={3}
                align="center"
                cursor="pointer"
                _hover={{ bg: 'whiteAlpha.100' }}
                onClick={onSwitchSeat}
              >
                <Text fontSize="md">Switch seat</Text>
              </Flex>
              <Flex
                data-testid="leave-option"
                px={4}
                py={3}
                align="center"
                cursor="pointer"
                _hover={{ bg: 'whiteAlpha.100' }}
                onClick={onLeave}
              >
                <Text fontSize="md">Leave</Text>
              </Flex>
            </Stack>
          </Box>
        </>
      )}
    </Box>
  );
};

export default WatchingChip;
