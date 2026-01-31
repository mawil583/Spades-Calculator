
import { Separator, Button, Text, Flex } from '../ui';

const DataWarningQuestion = ({ onContinue, onCancel }) => {
  return (
    <div style={{ padding: '10px' }}>
      <Separator mb={4} />
      <Text style={{ marginBottom: '20px' }}>
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
    </div>
  );
};

export default DataWarningQuestion;
