import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Field, Input, Button, Flex } from '../ui';

const MAX_SCORE_LIMIT_DIGITS = 4;

interface NewScoreLimitInputProps {
  /**
   * The floor the new limit must clear — the winner's current score when a
   * game has ended, or 0 when there is no score to beat yet.
   */
  minLimit?: number;
  onSetLimit: (limit: number) => void;
  /** Renders a Cancel button; an empty field is allowed and never errored. */
  onCancel?: () => void;
}

function NewScoreLimitInput({
  minLimit = 0,
  onSetLimit,
  onCancel,
}: NewScoreLimitInputProps) {
  const formik = useFormik({
    initialValues: { scoreLimit: '' },
    enableReinitialize: true,
    validationSchema: Yup.object({
      scoreLimit: Yup.number()
        .transform((value, originalValue) =>
          originalValue === '' || originalValue === null ? undefined : value,
        )
        .typeError('Please enter a number')
        .notRequired()
        .integer('Must be a whole number')
        .moreThan(minLimit, `Must be higher than ${minLimit}`),
    }),
    onSubmit: (values) => {
      onSetLimit(parseInt(values.scoreLimit, 10));
    },
  });

  const isEmpty = formik.values.scoreLimit === '';

  return (
    <form onSubmit={formik.handleSubmit}>
      <div style={{ padding: 'var(--app-spacing-2)' }}>
        <Field
          label="New score limit"
          helperText={
            minLimit > 0
              ? `Must be higher than ${minLimit}.`
              : 'The first team to reach this score wins.'
          }
          errorText={formik.errors.scoreLimit ?? undefined}
          invalid={Boolean(formik.errors.scoreLimit)}
          mb={4}
        >
          <Input
            value={formik.values.scoreLimit}
            onChange={(e) => {
              const digits = e.target.value
                .replace(/\D/g, '')
                .slice(0, MAX_SCORE_LIMIT_DIGITS);
              formik.setFieldValue('scoreLimit', digits, true);
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
            type="submit"
            disabled={isEmpty || !formik.isValid}
            data-cy="setScoreLimitButton"
            data-testid="setScoreLimitButton"
          >
            Set Limit
          </Button>
        </Flex>
      </div>
    </form>
  );
}

export default NewScoreLimitInput;
