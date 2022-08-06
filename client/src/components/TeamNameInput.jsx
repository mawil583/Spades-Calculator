import React from 'react';
import {
  Center,
  Editable,
  EditableInput,
  EditablePreview,
} from '@chakra-ui/react';
import { getTeamClassName } from '../helpers/helperFunctions';

function TeamNameInput({ id, teamName, handleChange }) {
  const teamClassName = getTeamClassName(teamName);
  return (
    <div>
      <Editable
        defaultValue={teamName}
        mt={2}
        fontSize='lg'
        fontWeight='bold'
        placeholder={teamName}
        className={teamClassName}
        // style={{ backgroundColor: '#464f51', color: '#ebf5ee' }}
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
