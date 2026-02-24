
import { Input } from '../ui/input';
import { Field } from '../ui/field';

import '../../App.css';

interface PlayerNameInputProps {
  teamClassName: string;
  id: string;
  label: string;
  placeholder?: string;
  playerName: string;
  errors?: string;
  touched?: boolean;
  handleKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function PlayerNameInput({
  teamClassName,
  id,
  label,
  placeholder,
  playerName,
  errors,
  touched,
  handleChange,
}: PlayerNameInputProps) {
  return (
    <div className={teamClassName} style={{ color: 'inherit' }}>
      <Field
        label={label}
        invalid={!!(errors && touched)}
        errorText={errors}
        pb={4}
        color={teamClassName === 'team1' ? 'team1' : 'team2'}
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
          fontSize="lg"
        />
      </Field>
    </div>
  );
}

export default PlayerNameInput;
