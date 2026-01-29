import React from 'react';
import {
  DialogHeader,
  DialogBody,
} from '../ui/dialog';
import { Separator, Button, Text, Flex } from '@chakra-ui/react';

const DataWarningQuestion = ({ onContinue, onCancel }) => {
  return (
    <>
      <DialogHeader style={{ color: '#ebf5ee', backgroundColor: '#464f51' }}>
        Are you sure?
      </DialogHeader>
      <Separator />
      <DialogBody
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
      </DialogBody>
    </>
  );
};

export default DataWarningQuestion;
