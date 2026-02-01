import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogCloseTrigger } from '../ui/dialog';
import { ScoreSetting, UIModeSetting } from '../game';
import { Box } from '../ui';

const SettingsModal = ({ isOpen, setIsOpen }) => {
  return (
    <DialogRoot open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
      <DialogContent bg="bg">
        <DialogHeader>
          <DialogTitle fontSize="var(--app-font-xl)">Settings</DialogTitle>
          <DialogCloseTrigger color="white" />
        </DialogHeader>
        <DialogBody pb={10}>
          <Box mb={6}>
            <UIModeSetting />
          </Box>
          <Box>
            <ScoreSetting />
          </Box>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default SettingsModal;
