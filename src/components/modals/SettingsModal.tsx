import { useState } from 'react';
import { AppModal } from '../ui';
import { ScoreSetting, UIModeSetting } from '../game';
import { Box, Button } from '../ui';
import { ScoreSettingsContent } from './ScoreSettingsModal';
import { ArrowLeft } from 'lucide-react';

const SettingsModal = ({ isOpen, setIsOpen }) => {
  const [view, setView] = useState('main'); // 'main' | 'scoreHelp'

  const handleClose = () => {
    setIsOpen(false);
    // Reset view slightly after closing for smooth transition next open
    setTimeout(() => setView('main'), 300);
  };

  const handleOpenScoreHelp = () => {
    setView('scoreHelp');
  };

  const handleBack = () => {
    setView('main');
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={handleClose}
      title={view === 'main' ? "Settings" : "Score Settings"}
    >
      {view === 'main' ? (
        <>
          <Box mb={6}>
            <UIModeSetting />
          </Box>
          <Box>
            <ScoreSetting onOpenScoreHelp={handleOpenScoreHelp} />
          </Box>
        </>
      ) : (
        <Box>
          <Button 
            onClick={handleBack} 
            variant="ghost" 
            mb={4} 
            pl={0}
            leftIcon={<ArrowLeft size={16} />}
            size="sm"
          >
            Back
          </Button>
          <ScoreSettingsContent />
        </Box>
      )}
    </AppModal>
  );
};

export default SettingsModal;
