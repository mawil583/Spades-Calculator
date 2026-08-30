import { useState } from 'react';
import { Field, Input, Button, Flex } from '../ui';

const MAX_SCORE_LIMIT_DIGITS = 4;

interface ScoreLimitInputProps {
  onSetLimit: (limit: number) => void;
  /** Renders a Cancel button; cancelling proceeds with no score limit. */
  onCancel?: () => void;
}

const ScoreLimitInput = ({
  onSetLimit,
  onCancel,
}: ScoreLimitInputProps) => {
  const [value, setValue] = useState('');

  const digitsOnly = (raw: string) =>
    raw.replace(/\D/g, '').slice(0, MAX_SCORE_LIMIT_DIGITS);

  const isValidLimit = value !== '' && parseInt(value, 10) > 0;

  const confirm = () => {
    if (!isValidLimit) return;
    onSetLimit(parseInt(value, 10));
  };

  return (
    <div style={{ padding: 'var(--app-spacing-2)' }}>
      <Field
        label="Score limit"
        helperText="The first team to reach this score wins."
        mb={4}
      >
        <Input
          value={value}
          onChange={(e) => setValue(digitsOnly(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') confirm();
          }}
          inputMode="numeric"
          pattern="[0-9]*"
          type="text"
          placeholder="e.g. 500"
          data-testid="score-limit-input"
          autoFocus
        />
      </Field>
      <Flex
        direction={'row'}
        justifyContent={onCancel ? 'space-between' : 'flex-end'}
        gap={4}
      >
        {onCancel && (
          <Button variant="secondary" type="button" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          variant="primary"
          onClick={confirm}
          disabled={!isValidLimit}
          data-cy="setScoreLimitButton"
          data-testid="setScoreLimitButton"
        >
          Set Limit
        </Button>
      </Flex>
    </div>
  );
};

export default ScoreLimitInput;
