import { vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from '../components/ui/provider';
import ScoreLimitFlow from '../components/forms/ScoreLimitFlow';
import type { ScoreLimitFlowStep } from '../components/forms/ScoreLimitFlow';

const renderFlow = (
  props: {
    isActive?: boolean;
    minLimit?: number;
    onResolve?: (limit: number | null) => void;
    onStepChange?: (step: ScoreLimitFlowStep) => void;
  } = {},
) => {
  const onResolve = props.onResolve ?? vi.fn();
  const ui = (overrides: Partial<typeof props> = {}) => (
    <Provider>
      <ScoreLimitFlow
        isActive={overrides.isActive ?? props.isActive ?? true}
        minLimit={overrides.minLimit ?? props.minLimit ?? 0}
        onResolve={onResolve}
        onStepChange={overrides.onStepChange ?? props.onStepChange}
      />
    </Provider>
  );
  const utils = render(ui());
  return { ...utils, rerenderFlow: (overrides: Partial<typeof props>) => utils.rerender(ui(overrides)), onResolve };
};

describe('ScoreLimitFlow', () => {
  it('starts on the ask step and emits it to the host', () => {
    const onStepChange = vi.fn();
    renderFlow({ onStepChange });

    expect(
      screen.getByText('Do you want to set a score limit for this game?'),
    ).toBeInTheDocument();
    expect(onStepChange).toHaveBeenCalledWith('ask');
  });

  it('moves to the numeric input step on "Yes" and emits the new step', () => {
    const onStepChange = vi.fn();
    renderFlow({ onStepChange });

    fireEvent.click(screen.getByRole('button', { name: 'Yes' }));

    expect(screen.getByTestId('score-limit-input')).toBeInTheDocument();
    expect(onStepChange).toHaveBeenCalledWith('enter');
  });

  it('resolves null on "No"', () => {
    const { onResolve } = renderFlow();

    fireEvent.click(screen.getByRole('button', { name: 'No' }));

    expect(onResolve).toHaveBeenCalledWith(null);
  });

  it('resolves the entered limit on "Set Limit"', () => {
    const { onResolve } = renderFlow();

    fireEvent.click(screen.getByRole('button', { name: 'Yes' }));
    fireEvent.change(screen.getByTestId('score-limit-input'), {
      target: { value: '500' },
    });
    fireEvent.click(screen.getByTestId('setScoreLimitButton'));

    expect(onResolve).toHaveBeenCalledWith(500);
  });

  it('resolves null on "Cancel" from the input step', () => {
    const { onResolve } = renderFlow();

    fireEvent.click(screen.getByRole('button', { name: 'Yes' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onResolve).toHaveBeenCalledWith(null);
  });

  it('passes minLimit through to the input floor', () => {
    renderFlow({ minLimit: 300 });

    fireEvent.click(screen.getByRole('button', { name: 'Yes' }));
    fireEvent.change(screen.getByTestId('score-limit-input'), {
      target: { value: '300' },
    });

    expect(screen.getByTestId('setScoreLimitButton')).toBeDisabled();
    expect(screen.getByText('Must be higher than 300')).toBeInTheDocument();
  });

  it('renders nothing while the host modal is closed', () => {
    renderFlow({ isActive: false });

    expect(
      screen.queryByText('Do you want to set a score limit for this game?'),
    ).not.toBeInTheDocument();
  });

  it('resets to the ask step when the host modal closes and reopens', () => {
    const onStepChange = vi.fn();
    const { rerenderFlow } = renderFlow({ onStepChange });

    // Walk to the input step…
    fireEvent.click(screen.getByRole('button', { name: 'Yes' }));
    expect(screen.getByTestId('score-limit-input')).toBeInTheDocument();

    // …close the host modal…
    rerenderFlow({ isActive: false });
    expect(
      screen.queryByText('Do you want to set a score limit for this game?'),
    ).not.toBeInTheDocument();

    // …and reopen: the flow must start over at the ask step, not the input.
    rerenderFlow({ isActive: true });
    expect(
      screen.getByText('Do you want to set a score limit for this game?'),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('score-limit-input')).not.toBeInTheDocument();
    expect(onStepChange).toHaveBeenLastCalledWith('ask');
  });
});
