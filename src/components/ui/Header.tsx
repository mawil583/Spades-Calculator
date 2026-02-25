import { useState } from 'react';
import { Flex, Box, Text, IconButton, Stack } from './';
import { Menu as MenuIcon, Settings, Download, RotateCcw } from 'lucide-react';
import { SettingsModal, WarningModal } from '../modals';
import { usePWAInstall } from '../../helpers/utils/usePWAInstall';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { GlobalContext } from '../../helpers/context/GlobalContext';
import {
  hasPlayerNamesEntered,
  hasRoundProgress,
} from '../../helpers/math/spadesMath';
import { getNames } from '../../helpers/utils/storage';
import { initialNames } from '../../helpers/utils/constants';

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const { roundHistory, currentRound, setRoundHistory, resetCurrentRound } =
    useContext(GlobalContext);
  const { handleInstallClick, isInstalled } = usePWAInstall();

  const names = getNames() ?? initialNames;
  const hasAnyData =
    hasPlayerNamesEntered(names) ||
    hasRoundProgress(roundHistory, currentRound);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
    setIsMenuOpen(false);
  };

  const handleDownloadClick = () => {
    handleInstallClick();
    setIsMenuOpen(false);
  };

  const handleNewGameClick = () => {
    if (hasAnyData) {
      setIsWarningModalOpen(true);
    } else {
      // If no data to clear, just ensure everything is reset and stay on/go to home
      setRoundHistory([]);
      resetCurrentRound();
      navigate('/');
    }
    setIsMenuOpen(false);
  };

  const handleNavigateHome = () => {
    navigate('/');
  };

  return (
    <Box as="header" width="100%" py={0} position="relative" zIndex={100}>
      <Flex
        justify="space-between"
        align="center"
        position="relative"
        zIndex={110}
      >
        <Text
          fontSize="var(--app-font-xl)"
          fontWeight="bold"
          letterSpacing="tight"
          cursor="pointer"
          onClick={handleNavigateHome}
        >
          SpadesCalculator
        </Text>
        <IconButton variant="ghost" onClick={toggleMenu} aria-label="Open Menu">
          <MenuIcon size={24} />
        </IconButton>
      </Flex>

      {isMenuOpen && (
        <>
          <Box
            position="fixed"
            top="0"
            left="0"
            w="100vw"
            h="100vh"
            zIndex="100"
            onClick={() => setIsMenuOpen(false)}
          />
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
            zIndex="110"
          >
            <Stack gap={0}>
              <Flex
                px={4}
                py={3}
                align="center"
                cursor="pointer"
                _hover={{ bg: 'whiteAlpha.100' }}
                onClick={handleNewGameClick}
                gap={3}
              >
                <RotateCcw size={18} />
                <Text fontSize="md">New Game</Text>
              </Flex>
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
        </>
      )}

      <SettingsModal isOpen={isSettingsOpen} setIsOpen={setIsSettingsOpen} />
      <WarningModal
        isOpen={isWarningModalOpen}
        setIsModalOpen={setIsWarningModalOpen}
      />
    </Box>
  );
};

export default Header;
