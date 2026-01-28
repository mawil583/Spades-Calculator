import React from 'react';
import {
  Center,
  Editable,
  EditableInput,
  EditablePreview,
} from '@chakra-ui/react';

function TeamNameInput({ id, teamName, handleChange, teamClassName }) {
  return (
    <div>
      <Editable
        value={teamName}
        onChange={(nextValue) => handleChange({ target: { id, value: nextValue } })}
        mt={2}
        fontSize="lg"
        fontWeight="bold"
        placeholder={teamName}
        className={teamClassName}
        data-cy={id + 'Input'}
      >
        <Center>
          <EditablePreview />
          <EditableInput
            type="text"
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
