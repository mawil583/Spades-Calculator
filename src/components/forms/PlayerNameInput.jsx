import React from 'react';
import { Input } from '../ui/input';
import { Field } from '../ui/field';

import '../../App.css';

function PlayerNameInput({
  teamClassName,
  id,
  label,
  placeholder,
  playerName,
  errors,
  touched,
  handleChange,
}) {
  return (
    <div className={teamClassName} style={{ color: 'inherit' }}>
      <Field
        label={label}
        invalid={!!(errors && touched)}
        errorText={errors}
        pb={4}
        color={teamClassName === 'team1' ? '#ffc100' : '#f06c9b'}
      >
        <Input
          px={1}
          placeholder={`${placeholder ? placeholder : ''}`}
          type="text"
          value={playerName}
          onChange={handleChange}
          id={id}
          name={id}
          data-cy={id + 'Input'}
        />
      </Field>
    </div>
  );
}

export default PlayerNameInput;
