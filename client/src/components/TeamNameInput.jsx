import React from 'react';
import {
  Center,
  Editable,
  EditableInput,
  EditablePreview,
} from '@chakra-ui/react';

function TeamNameInput({ id, teamName, handleChange }) {
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
            id={id}
            name={id}
          />
        </Center>
      </Editable>
    </div>
  );
}

export default TeamNameInput;
