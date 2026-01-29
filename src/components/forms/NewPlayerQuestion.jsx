import React from 'react';
import {
  DialogHeader,
  DialogBody,
} from '../ui/dialog';
import { Separator, Button, Flex } from '@chakra-ui/react';

const NewPlayerQuestion = ({ onDifferentTeams, onSameTeams }) => {
  return (
    <>
      <DialogHeader style={{ color: '#ebf5ee', backgroundColor: '#464f51' }}>
        Would you like to keep the same teams?
      </DialogHeader>
      <Separator />
      <DialogBody
        style={{
          padding: '15px',
          color: '#ebf5ee',
          backgroundColor: '#464f51',
        }}
      >
        <Flex direction={'row'} justifyContent={'space-evenly'}>
          <Button
            variant="outline"
            style={{ backgroundColor: '#464f51', color: '#ebf5ee' }}
            onClick={onDifferentTeams}
          >
            Different Teams
          </Button>
          <Button
            variant="outline"
            style={{ backgroundColor: '#464f51', color: '#ebf5ee' }}
            onClick={onSameTeams}
          >
            Same Teams
          </Button>
        </Flex>
      </DialogBody>
    </>
  );
};

export default NewPlayerQuestion;
