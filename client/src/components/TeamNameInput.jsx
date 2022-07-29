import React from 'react';
import {
  Center,
  Editable,
  EditableInput,
  EditablePreview,
} from '@chakra-ui/react';

function TeamNameInput({ teamName, handleChange }) {
  return (
    <div>
      <Editable
        defaultValue={teamName}
        mt={2}
        fontSize='lg'
        fontWeight='bold'
        placeholder={teamName}
      >
        <Center>
          <EditablePreview />
          <EditableInput
            type='text'
            value={teamName}
            onChange={handleChange}
            id='team1Name'
            name='team1Name'
          />
        </Center>
      </Editable>
    </div>
  );
}

export default TeamNameInput;
