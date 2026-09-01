import { vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from '../components/ui/provider';
import ScoreLimitInput from '../components/forms/ScoreLimitInput';

const renderInput = (minLimit = 520, onCancel?: () => void) => {
  const onSetLimit = vi.fn();
  render(
    <Provider>
      <ScoreLimitInput
        minLimit={minLimit}
        onSetLimit={onSetLimit}
        onCancel={onCancel}
      />
    </Provider>,
  );
  return { onSetLimit };
};

describe('ScoreLimitInput', () => {
  it('shows the floor error when a too-low limit is entered', () => {
    renderInput(520);

    const input = screen.getByTestId('score-limit-input');
    fireEvent.change(input, { target: { value: '500' } });

    expect(screen.getByText('Must be higher than 520')).toBeInTheDocument();
    expect(screen.getByTestId('setScoreLimitButton')).toBeDisabled();
  });

  it('accepts a limit just above the floor', () => {
    renderInput(520);

    const input = screen.getByTestId('score-limit-input');
    fireEvent.change(input, { target: { value: '521' } });

    expect(
      screen.queryByText('Must be higher than 520'),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('setScoreLimitButton')).not.toBeDisabled();
  });

  it('does not mark a cleared input as errored', () => {
    renderInput(520);

    const input = screen.getByTestId('score-limit-input');
    fireEvent.change(input, { target: { value: '600' } });
    fireEvent.change(input, { target: { value: '' } });

    expect(screen.queryByText('Required')).not.toBeInTheDocument();
    expect(screen.queryByText('Must be higher than 520')).not.toBeInTheDocument();
    expect(screen.getByTestId('setScoreLimitButton')).toBeDisabled();
  });

  it('submits a valid limit', () => {
    const { onSetLimit } = renderInput(520);

    const input = screen.getByTestId('score-limit-input');
    fireEvent.change(input, { target: { value: '600' } });
    fireEvent.click(screen.getByTestId('setScoreLimitButton'));

    expect(onSetLimit).toHaveBeenCalledWith(600);
  });

  it('submits on Enter', () => {
    const { onSetLimit } = renderInput(0);

    const input = screen.getByTestId('score-limit-input');
    fireEvent.change(input, { target: { value: '500' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onSetLimit).toHaveBeenCalledWith(500);
  });

  it('filters non-digit characters and caps the length', () => {
    const { onSetLimit } = renderInput(0);

    const input = screen.getByTestId('score-limit-input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '3a0b0c99999' } });

    expect(input.value).toBe('3009');
    fireEvent.click(screen.getByTestId('setScoreLimitButton'));
    expect(onSetLimit).toHaveBeenCalledWith(3009);
  });

  it('rejects zero and empty values', () => {
    const { onSetLimit } = renderInput(0);

    const input = screen.getByTestId('score-limit-input');
    fireEvent.change(input, { target: { value: '0' } });
    expect(screen.getByTestId('setScoreLimitButton')).toBeDisabled();

    fireEvent.change(input, { target: { value: '' } });
    expect(screen.getByTestId('setScoreLimitButton')).toBeDisabled();
    expect(onSetLimit).not.toHaveBeenCalled();
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
