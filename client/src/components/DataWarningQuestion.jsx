import React from 'react';
import {
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Divider,
  Button, 
  Collapse,
  Text,
  Flex,
} from '@chakra-ui/react';


const DataWarningQuestion = ({isDataWarningQuestionVisible, onContinue, onCancel}) => {
    return (
      <Collapse in={isDataWarningQuestionVisible}>
        <ModalHeader style={{ color: '#ebf5ee', backgroundColor: '#464f51' }}>
          Are you sure?
        </ModalHeader>
        <ModalCloseButton />
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
              variant='outline'
              style={{ backgroundColor: '#464f51', color: '#ebf5ee' }}
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              variant='outline'
              style={{ backgroundColor: '#464f51', color: '#ebf5ee' }}
              onClick={onContinue}
            >
              Continue
            </Button>
          </Flex>
        </ModalBody>
      </Collapse>
    );
  };

  export default DataWarningQuestion