import React from 'react';
import { Center } from '../ui/center';

function TeamNameInput({ id, teamName, handleChange, teamClassName }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [value, setValue] = React.useState(teamName);
  const inputRef = React.useRef(null);

  // Sync internal state with external prop
  React.useEffect(() => {
    setValue(teamName);
  }, [teamName]);

  // Focus and select text when entering edit mode
  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const onCommit = () => {
    setIsEditing(false);
    if (value !== teamName) {
      handleChange({ target: { id, value } });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onCommit();
    }
  };

  return (
    <Center width="100%" mt={4}>
      {isEditing ? (
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onCommit}
          onKeyDown={handleKeyDown}
          className={teamClassName}
          id={id}
          data-cy={id + 'Input'}
          style={{
            fontSize: 'var(--chakra-fontSizes-xl)',
            fontWeight: 'bold',
            textAlign: 'center',
            width: '100%',
            background: 'transparent',
            border: '1px solid transparent', // maintain sizing
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className={teamClassName}
          id={id}
          data-cy={id + 'Input'}
          style={{
            fontSize: 'var(--chakra-fontSizes-xl)',
            fontWeight: 'bold',
            textAlign: 'center',
            width: '100%',
            cursor: 'pointer',
          }}
        >
          {value || 'Enter Team Name'}
        </div>
      )}
    </Center>
  );
}

export default TeamNameInput;
