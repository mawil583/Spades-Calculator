import { vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from '../components/ui/provider';
import ScoreLimitModal from '../components/modals/ScoreLimitModal';

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <Provider>{component}</Provider>
    </BrowserRouter>,
  );
};

describe('ScoreLimitModal', () => {
  const setup = () => {
    const setIsModalOpen = vi.fn();
    const onDecline = vi.fn();
    const onSetLimit = vi.fn();
    renderWithProviders(
      <ScoreLimitModal
        isOpen={true}
        setIsModalOpen={setIsModalOpen}
        onDecline={onDecline}
        onSetLimit={onSetLimit}
      />,
    );
    return { setIsModalOpen, onDecline, onSetLimit };
  };

  it('asks whether the user wants to set a score limit', () => {
    setup();

    expect(screen.getByText('New Game')).toBeInTheDocument();
    expect(
      screen.getByText('Do you want to set a score limit for this game?'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument();
  });

  it('declines and closes when "No" is selected', () => {
    const { setIsModalOpen, onDecline, onSetLimit } = setup();

    fireEvent.click(screen.getByRole('button', { name: 'No' }));

    expect(setIsModalOpen).toHaveBeenCalledWith(false);
    expect(onDecline).toHaveBeenCalledTimes(1);
    expect(onSetLimit).not.toHaveBeenCalled();
  });

  it('swaps the question content for a numeric input when "Yes" is selected', () => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: 'Yes' }));

    expect(screen.getByText('Enter Score Limit')).toBeInTheDocument();
    expect(
      screen.queryByText('Do you want to set a score limit for this game?'),
    ).not.toBeInTheDocument();

    const input = screen.getByTestId('score-limit-input');
    expect(input).toHaveAttribute('inputmode', 'numeric');
    expect(input).toHaveAttribute('pattern', '[0-9]*');
  });

  it('confirms the entered limit when "Set Limit" is clicked', () => {
    const { onSetLimit, onDecline } = setup();

    fireEvent.click(screen.getByRole('button', { name: 'Yes' }));
    const input = screen.getByTestId('score-limit-input');
    fireEvent.change(input, { target: { value: '500' } });
    fireEvent.click(screen.getByTestId('setScoreLimitButton'));

    expect(onSetLimit).toHaveBeenCalledWith(500);
    expect(onDecline).not.toHaveBeenCalled();
  });

  it('shows a cancel button on the input step', () => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: 'Yes' }));

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('cancelling dismisses the modal and unsets the score limit', () => {
    const { setIsModalOpen, onDecline, onSetLimit } = setup();

    fireEvent.click(screen.getByRole('button', { name: 'Yes' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(setIsModalOpen).toHaveBeenCalledWith(false);
    expect(onDecline).toHaveBeenCalledTimes(1);
    expect(onSetLimit).not.toHaveBeenCalled();
  });

  it('keeps "Set Limit" disabled until a valid number is entered', () => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: 'Yes' }));
    const setLimitButton = screen.getByTestId('setScoreLimitButton');

    expect(setLimitButton).toBeDisabled();

    const input = screen.getByTestId('score-limit-input');
    fireEvent.change(input, { target: { value: '0' } });
    expect(setLimitButton).toBeDisabled();

    fireEvent.change(input, { target: { value: '250' } });
    expect(setLimitButton).not.toBeDisabled();
  });

  it('filters out non-digit characters from the input', () => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: 'Yes' }));
    const input = screen.getByTestId(
      'score-limit-input',
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '5a0b0c' } });

    expect(input.value).toBe('500');
  });
});
