
import {
  DialogHeader,
  DialogBody,
} from '../ui/dialog';
import { Separator, Button, Flex } from '../ui';

const NewPlayerQuestion = ({ onDifferentTeams, onSameTeams }) => {
  return (
    <>
    <>
      <DialogHeader>
        Would you like to keep the same teams?
      </DialogHeader>
      <Separator />
      <DialogBody style={{ padding: '15px' }}>
        <Flex direction={'row'} justifyContent={'space-evenly'}>
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
      </DialogBody>
    </>
    </>
  );
};

export default NewPlayerQuestion;
