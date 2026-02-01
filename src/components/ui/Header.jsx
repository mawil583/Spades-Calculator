import { useState } from 'react';
import { Flex, Box, Text, IconButton, Stack } from './';
import { Menu as MenuIcon, Settings, Download } from 'lucide-react';
import { SettingsModal } from '../modals';
import { usePWAInstall } from '../../helpers/utils/usePWAInstall';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { handleInstallClick, isInstalled } = usePWAInstall();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
    setIsMenuOpen(false);
  };

  const handleDownloadClick = () => {
    handleInstallClick();
    setIsMenuOpen(false);
  };

  return (
    <Box as="header" width="100%" py={0} position="relative" zIndex={100}>
      <Flex justify="space-between" align="center">
        <Text fontSize="var(--app-font-xl)" fontWeight="bold" letterSpacing="tight">
          SpadesCalculator
        </Text>
        <IconButton 
          variant="ghost" 
          onClick={toggleMenu} 
          aria-label="Open Menu"
        >
          <MenuIcon size={24} />
        </IconButton>
      </Flex>

      {isMenuOpen && (
        <Box
          position="absolute"
          top="100%"
          right="0"
          mt={0}
          bg="bg"
          border="1px solid"
          borderColor="whiteAlpha.200"
          borderRadius="md"
          boxShadow="xl"
          overflow="hidden"
          minW="200px"
        >
          <Stack gap={0}>
            <Flex
              px={4}
              py={3}
              align="center"
              cursor="pointer"
              _hover={{ bg: 'whiteAlpha.100' }}
              onClick={handleSettingsClick}
              gap={3}
            >
              <Settings size={18} />
              <Text fontSize="md">Settings</Text>
            </Flex>
            {!isInstalled && (
              <Flex
                px={4}
                py={3}
                align="center"
                cursor="pointer"
                _hover={{ bg: 'whiteAlpha.100' }}
                onClick={handleDownloadClick}
                gap={3}
              >
                <Download size={18} />
                <Text fontSize="md">Offline Download</Text>
              </Flex>
            )}
          </Stack>
        </Box>
      )}

      <SettingsModal isOpen={isSettingsOpen} setIsOpen={setIsSettingsOpen} />
    </Box>
  );
};

export default Header;
