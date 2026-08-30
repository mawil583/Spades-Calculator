import { Separator, Button, Text, Flex } from '../ui';

const ScoreLimitQuestion = ({
  question = 'Do you want to set a score limit for this game?',
  onYes,
  onNo,
}: {
  question?: string;
  onYes: () => void;
  onNo: () => void;
}) => {
  return (
    <div style={{ padding: 'var(--app-spacing-2)' }}>
      <Separator mb={4} />
      <Text style={{ marginBottom: 'var(--app-spacing-5)' }}>{question}</Text>
      <Flex direction={'row'} justifyContent={'space-between'}>
        <Button variant="secondary" onClick={onNo}>
          No
        </Button>
        <Button variant="primary" onClick={onYes}>
          Yes
        </Button>
      </Flex>
    </div>
  );
};

export default ScoreLimitQuestion;
