import React from 'react';
import {
  ModalHeader,
  ModalBody,
  Divider,
  Button,
  Flex,
} from '@chakra-ui/react';

const NewPlayerQuestion = ({ onDifferentTeams, onSameTeams }) => {
  return (
    <>
      <ModalHeader style={{ color: '#ebf5ee', backgroundColor: '#464f51' }}>
        Would you like to keep the same teams?
      </ModalHeader>
      <Divider />
      <ModalBody
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
      </ModalBody>
    </>
  );
};

export default NewPlayerQuestion;
