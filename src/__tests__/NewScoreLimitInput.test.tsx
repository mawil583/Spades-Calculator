import { vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from '../components/ui/provider';
import NewScoreLimitInput from '../components/forms/NewScoreLimitInput';

const renderInput = (
  minLimit = 520,
  onCancel?: () => void,
) => {
  const onSetLimit = vi.fn();
  render(
    <Provider>
      <NewScoreLimitInput
        minLimit={minLimit}
        onSetLimit={onSetLimit}
        onCancel={onCancel}
      />
    </Provider>,
  );
  return { onSetLimit };
};

describe('NewScoreLimitInput', () => {
  it('shows the floor error when a too-low limit is entered', async () => {
    renderInput(520);

    const input = screen.getByTestId('score-limit-input');
    fireEvent.change(input, { target: { value: '500' } });

    expect(
      await screen.findByText('Must be higher than 520'),
    ).toBeInTheDocument();
  });

  it('does not run validation when the input blurs untouched', () => {
    renderInput(520);

    const input = screen.getByTestId('score-limit-input');
    input.focus();
    fireEvent.blur(input);

    expect(screen.queryByText('Required')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Must be higher than 520'),
    ).not.toBeInTheDocument();
  });

  it('does not mark a cleared input as required', async () => {
    renderInput(520);

    const input = screen.getByTestId('score-limit-input');
    fireEvent.change(input, { target: { value: '600' } });
    fireEvent.change(input, { target: { value: '' } });

    expect(screen.queryByText('Required')).not.toBeInTheDocument();
    expect(screen.queryByText('Please enter a number')).not.toBeInTheDocument();
    expect(screen.getByTestId('setScoreLimitButton')).toBeDisabled();
  });

  it('submits a valid limit through formik', async () => {
    const { onSetLimit } = renderInput(520);

    const input = screen.getByTestId('score-limit-input');
    fireEvent.change(input, { target: { value: '600' } });
    const button = await screen.findByTestId('setScoreLimitButton');
    await waitFor(() => expect(button).not.toBeDisabled());
    fireEvent.click(button);

    await waitFor(() => expect(onSetLimit).toHaveBeenCalledWith(600));
  });

  it('shows a cancel button when a cancel handler is provided', () => {
    const onCancel = vi.fn();
    renderInput(520, onCancel);

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('hides the cancel button when no handler is provided', () => {
    renderInput(520);

    expect(
      screen.queryByRole('button', { name: 'Cancel' }),
    ).not.toBeInTheDocument();
  });
});
