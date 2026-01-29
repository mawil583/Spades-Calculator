import React from 'react';
import { Center } from '../ui/center';
import { EditableRoot, EditableInput, EditablePreview } from '../ui/editable';

function TeamNameInput({ id, teamName, handleChange, teamClassName }) {
  // Use key to force re-render when external teamName changes (e.g. reset)
  return (
    <Center width="100%" mt={4}>
      <EditableRoot
        key={teamName}
        defaultValue={teamName}
        onValueCommit={(details) => handleChange({ target: { id, value: details.value } })}
        fontSize="xl"
        fontWeight="bold"
        placeholder={teamName}
        className={teamClassName}
        data-cy={id + 'Input'}
        textAlign="center"
        width="100%"
        selectAllOnFocus
        submitOnBlur={false}
      >
        <EditablePreview 
          width="100%" 
          style={{ textAlign: 'center', display: 'block' }} 
          cursor="pointer" 
        />
        <EditableInput
          id={id}
          width="100%"
          style={{ textAlign: 'center' }}
        />
      </EditableRoot>
    </Center>
  );
}

export default TeamNameInput;
