import { Separator, Button, Text, Flex } from '../ui';

const DataWarningQuestion = ({
  onContinue,
  onCancel,
}: {
  onContinue: () => void;
  onCancel: () => void;
}) => {
  return (
    <div style={{ padding: 'var(--app-spacing-2)' }}>
      <Separator mb={4} />
      <Text style={{ marginBottom: 'var(--app-spacing-5)' }}>
        This will permanently delete your game data.
      </Text>
      <Flex direction={'row'} justifyContent={'space-between'}>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="dangerOutline" onClick={onContinue}>
          Continue
        </Button>
      </Flex>
    </div>
  );
};

export default DataWarningQuestion;
