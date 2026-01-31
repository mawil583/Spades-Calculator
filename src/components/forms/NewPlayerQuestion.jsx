
import { Separator, Button, Flex } from '../ui';

const NewPlayerQuestion = ({ onDifferentTeams, onSameTeams }) => {
  return (
    <div style={{ padding: '10px' }}>
      <Separator mb={4} />
      <Flex direction={'row'} justifyContent={'space-evenly'} gap={4}>
        <Button
          variant="outline"
          onClick={onDifferentTeams}
        >
          Different Teams
        </Button>
        <Button
          variant="outline"
          onClick={onSameTeams}
        >
          Same Teams
        </Button>
      </Flex>
    </div>
  );
};

export default NewPlayerQuestion;
