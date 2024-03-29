import React from 'react';
// Note: Chakra UI applies a border-width: 0; to the <body>, so none of the input boxes are visible
import {
  Input,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/react';
import 'core-js/es/promise';
import 'core-js/es/set';
import 'core-js/es/map';

import '../App.css';

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
    <div>
      <FormControl isInvalid={errors && touched} className={teamClassName}>
        <FormLabel style={{ paddingLeft: '5px' }} htmlFor="t1p1Name">
          {label}
        </FormLabel>
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
        {errors && touched ? (
          <FormErrorMessage>{errors}</FormErrorMessage>
        ) : null}
      </FormControl>
    </div>
  );
}

export default PlayerNameInput;
