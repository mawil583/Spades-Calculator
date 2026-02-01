import { AppModal } from '../ui';
import { ScoreSetting, UIModeSetting } from '../game';
import { Box } from '../ui';

const SettingsModal = ({ isOpen, setIsOpen }) => {
  return (
    <AppModal
      isOpen={isOpen}
      onClose={setIsOpen}
      title="Settings"
    >
      <Box mb={6}>
        <UIModeSetting />
      </Box>
      <Box>
        <ScoreSetting />
      </Box>
    </AppModal>
  );
};

export default SettingsModal;
