
import {
  DialogHeader,
  DialogBody,
} from '../ui/dialog';
import { Separator, Button, Text, Flex } from '../ui';

const DataWarningQuestion = ({ onContinue, onCancel }) => {
  return (
    <>
      <DialogHeader>
        Are you sure?
      </DialogHeader>
      <Separator />
      <DialogBody style={{ padding: '15px' }}>
        <Text style={{ marginBottom: '10px' }}>
          This will permanently delete your game data.
        </Text>
        <Flex direction={'row'} justifyContent={'space-between'}>
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={onContinue}
          >
            Continue
          </Button>
        </Flex>
      </DialogBody>
    </>
  );
};

export default DataWarningQuestion;
