import React from 'react';
import {
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Divider,
  Button,
  Text,
  Flex,
} from '@chakra-ui/react';

const DataWarningQuestion = ({ onContinue, onCancel }) => {
  return (
    <>
      <ModalHeader style={{ color: '#ebf5ee', backgroundColor: '#464f51' }}>
        Are you sure?
      </ModalHeader>
      <ModalCloseButton onClick={onCancel} />
      <Divider />
      <ModalBody
        style={{
          padding: '15px',
          color: '#ebf5ee',
          backgroundColor: '#464f51',
        }}
      >
        <Text style={{ marginBottom: '10px' }}>
          This will permanently delete your game data.
        </Text>
        <Flex direction={'row'} justifyContent={'space-between'}>
          <Button
            variant="outline"
            style={{ backgroundColor: '#464f51', color: '#ebf5ee' }}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            style={{ backgroundColor: '#464f51', color: '#ebf5ee' }}
            onClick={onContinue}
          >
            Continue
          </Button>
        </Flex>
      </ModalBody>
    </>
  );
};

export default DataWarningQuestion;
