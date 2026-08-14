import { Separator, Button, Flex } from '../ui';

const NewPlayerQuestion = ({
  onDifferentTeams,
  onSameTeams,
}: {
  onDifferentTeams: () => void;
  onSameTeams: () => void;
}) => {
  return (
    <div style={{ padding: 'var(--app-spacing-2)' }}>
      <Separator mb={4} />
      <Flex direction={'row'} justifyContent={'space-evenly'} gap={4}>
        <Button variant="secondary" onClick={onDifferentTeams}>
          Different Teams
        </Button>
        <Button variant="secondary" onClick={onSameTeams}>
          Same Teams
        </Button>
      </Flex>
    </div>
  );
};

export default NewPlayerQuestion;
