import { useState } from 'react';
import { Field, Input, Button, Flex } from '../ui';

const MAX_SCORE_LIMIT_DIGITS = 4;

interface ScoreLimitInputProps {
  /**
   * The floor the new limit must clear — the winner's current score when a
   * game has ended, or 0 when there is no score to beat yet.
   */
  minLimit?: number;
  onSetLimit: (limit: number) => void;
  /** Renders a Cancel button; an empty field is allowed and never errored. */
  onCancel?: () => void;
}

function ScoreLimitInput({
  minLimit = 0,
  onSetLimit,
  onCancel,
}: ScoreLimitInputProps) {
  const [value, setValue] = useState('');

  const digitsOnly = (raw: string) =>
    raw.replace(/\D/g, '').slice(0, MAX_SCORE_LIMIT_DIGITS);

  const parsed = value === '' ? null : parseInt(value, 10);
  const isValidLimit = parsed !== null && parsed > minLimit;
  const showError = parsed !== null && !isValidLimit;

  const confirm = () => {
    if (!isValidLimit) return;
    onSetLimit(parsed as number);
  };

  return (
    <div style={{ padding: 'var(--app-spacing-2)' }}>
      <Field
        label="Score limit"
        helperText={
          minLimit > 0
            ? `Must be higher than ${minLimit}.`
            : 'The first team to reach this score wins.'
        }
        errorText={showError ? `Must be higher than ${minLimit}` : undefined}
        invalid={showError}
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
}

export default ScoreLimitInput;
