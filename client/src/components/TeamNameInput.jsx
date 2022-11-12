import React from 'react';
import {
  Center,
  Editable,
  EditableInput,
  EditablePreview,
} from '@chakra-ui/react';

<<<<<<< HEAD
function TeamNameInput({ id, teamName, handleChange }) {
=======
function TeamNameInput({ id, teamName, handleChange, teamClassName }) {
>>>>>>> fixed color bug and deleted dumb function
  return (
    <div>
      <Editable
        defaultValue={teamName}
        mt={2}
        fontSize='lg'
        fontWeight='bold'
        placeholder={teamName}
<<<<<<< HEAD
        className={id}
=======
        className={teamClassName}
>>>>>>> fixed color bug and deleted dumb function
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
