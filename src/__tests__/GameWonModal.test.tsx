import { vi } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  within,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from '../components/ui/provider';
import GameWonModal from '../components/modals/GameWonModal';
import type { GameEndOutcome } from '../types';

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <Provider>{component}</Provider>
    </BrowserRouter>,
  );
};

const winOutcome = (
  overrides: Partial<Extract<GameEndOutcome, { kind: 'win' }>> = {},
): GameEndOutcome => ({
  kind: 'win',
  winnerTeam: 'team1',
  winnerName: 'Team 1',
  minLimit: 260,
  ...overrides,
});

const tieOutcome = (at = 500): GameEndOutcome => ({ kind: 'tie', at });

describe('GameWonModal', () => {
  const setup = (overrides: { outcome?: GameEndOutcome | null } = {}) => {
    const setIsModalOpen = vi.fn();
    const onStartNewGameWithLimit = vi.fn();
    const onSetNewLimit = vi.fn();
    renderWithProviders(
      <GameWonModal
        isOpen={true}
        setIsModalOpen={setIsModalOpen}
        outcome={overrides.outcome ?? winOutcome()}
        onStartNewGameWithLimit={onStartNewGameWithLimit}
        onSetNewLimit={onSetNewLimit}
      />,
    );
    return { setIsModalOpen, onStartNewGameWithLimit, onSetNewLimit };
  };

  it('announces the winning team without the points sentence', () => {
    setup();

    expect(screen.getByText('Game Over')).toBeInTheDocument();
    expect(screen.getByText('Team 1 wins!')).toBeInTheDocument();
    expect(
      screen.queryByText(/beating the 260-point limit/),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/reached \d+ points/),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New Game' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
  });

  it('asks whether to continue the current game or start a new one', () => {
    setup();

    expect(
      screen.getByText(
        'Do you want to continue the current game, or start a new one?',
      ),
    ).toBeInTheDocument();
  });

  it('does not color code the continue-or-new-game question', () => {
    setup();

    const question = screen.getByText(
      'Do you want to continue the current game, or start a new one?',
    );
    expect(question.closest('.team1')).toBeNull();

    const announcement = screen.getByTestId('winner-team1');
    expect(announcement).toHaveClass('team1');
  });

  it('applies the team color coding to the announcement', () => {
    const { unmount } = renderWithProviders(
      <GameWonModal
        isOpen={true}
        setIsModalOpen={vi.fn()}
        outcome={winOutcome()}
        onStartNewGameWithLimit={vi.fn()}
        onSetNewLimit={vi.fn()}
      />,
    );
    expect(screen.getByTestId('winner-team1')).toHaveClass('team1');
    unmount();

    renderWithProviders(
      <GameWonModal
        isOpen={true}
        setIsModalOpen={vi.fn()}
        outcome={winOutcome({ winnerTeam: 'team2', winnerName: 'Team 2' })}
        onStartNewGameWithLimit={vi.fn()}
        onSetNewLimit={vi.fn()}
      />,
    );
    expect(screen.getByTestId('winner-team2')).toHaveClass('team2');
  });

  it('renders the scoreboard inside the modal when provided', () => {
    renderWithProviders(
      <GameWonModal
        isOpen={true}
        setIsModalOpen={vi.fn()}
        outcome={winOutcome()}
        scoreboard={<div data-testid="modal-scoreboard">final tallies</div>}
        onStartNewGameWithLimit={vi.fn()}
        onSetNewLimit={vi.fn()}
      />,
    );

    const modal = screen.getByTestId('game-won-modal');
    expect(modal).toBeInTheDocument();
    expect(within(modal).getByTestId('modal-scoreboard')).toBeInTheDocument();
  });

  it('sizes "Continue" the same as "New Game"', () => {
    setup();

    const continueButton = screen.getByRole('button', { name: 'Continue' });
    const newGameButton = screen.getByRole('button', { name: 'New Game' });

    expect(continueButton).toHaveStyle({ flex: '1 1 0%' });
    expect(newGameButton).toHaveStyle({ flex: '1 1 0%' });
  });

  describe('Continue (new score limit flow)', () => {
    it('swaps the content to ask about a new score limit', () => {
      setup();

      fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

      expect(
        screen.getByText('Would you like to set a new score limit?'),
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Continue' }),
      ).not.toBeInTheDocument();
    });

    it('resets the limit to infinity and dismisses on "No"', () => {
      const { setIsModalOpen, onSetNewLimit } = setup();

      fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
      fireEvent.click(screen.getByRole('button', { name: 'No' }));

      expect(onSetNewLimit).toHaveBeenCalledWith(null);
      expect(setIsModalOpen).toHaveBeenCalledWith(false);
    });

    it('shows the numeric keypad input with a cancel button after "Yes"', () => {
      setup();

      fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
      fireEvent.click(screen.getByRole('button', { name: 'Yes' }));

      expect(screen.getByText('Enter New Score Limit')).toBeInTheDocument();
      const input = screen.getByTestId('score-limit-input');
      expect(input).toHaveAttribute('inputmode', 'numeric');
      expect(input).toHaveAttribute('pattern', '[0-9]*');
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('cancelling dismisses the modal and clears the score limit', () => {
      const { setIsModalOpen, onSetNewLimit } = setup();

      fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
      fireEvent.click(screen.getByRole('button', { name: 'Yes' }));
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(onSetNewLimit).toHaveBeenCalledWith(null);
      expect(setIsModalOpen).toHaveBeenCalledWith(false);
    });

    it('does not mark an empty input as required', () => {
      setup();

      fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
      fireEvent.click(screen.getByRole('button', { name: 'Yes' }));

      const input = screen.getByTestId('score-limit-input');
      fireEvent.change(input, { target: { value: '600' } });
      fireEvent.change(input, { target: { value: '' } });

      expect(screen.queryByText('Required')).not.toBeInTheDocument();
      expect(
        screen.queryByText('Please enter a number'),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('setScoreLimitButton')).toBeDisabled();
    });

    it('rejects a new limit that is not higher than the winner score', () => {
      setup();

      fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
      fireEvent.click(screen.getByRole('button', { name: 'Yes' }));

      const input = screen.getByTestId('score-limit-input');
      fireEvent.change(input, { target: { value: '260' } });

      expect(
        screen.getByText('Must be higher than 260'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('setScoreLimitButton')).toBeDisabled();
    });

    it('saves a higher limit on submit', () => {
      const { onSetNewLimit, setIsModalOpen } = setup();

      fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
      fireEvent.click(screen.getByRole('button', { name: 'Yes' }));

      const input = screen.getByTestId('score-limit-input');
      fireEvent.change(input, { target: { value: '500' } });

      const setLimitButton = screen.getByTestId('setScoreLimitButton');
      expect(setLimitButton).not.toBeDisabled();
      fireEvent.click(setLimitButton);

      expect(onSetNewLimit).toHaveBeenCalledWith(500);
      expect(setIsModalOpen).toHaveBeenCalledWith(false);
    });

    it('filters non-digit characters from the input', () => {
      setup();

      fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
      fireEvent.click(screen.getByRole('button', { name: 'Yes' }));

      const input = screen.getByTestId('score-limit-input') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '3a0b0c' } });

      expect(input.value).toBe('300');
    });
  });

  describe('New Game (from the win modal)', () => {
    it('prompts for a score limit instead of starting immediately', () => {
      const { onStartNewGameWithLimit } = setup();

      fireEvent.click(screen.getByRole('button', { name: 'New Game' }));

      expect(
        screen.getByText('Do you want to set a score limit for this game?'),
      ).toBeInTheDocument();
      expect(onStartNewGameWithLimit).not.toHaveBeenCalled();
    });

    it('starts the new game without a limit when "No" is selected', () => {
      const { setIsModalOpen, onStartNewGameWithLimit } = setup();

      fireEvent.click(screen.getByRole('button', { name: 'New Game' }));
      fireEvent.click(screen.getByRole('button', { name: 'No' }));

      expect(onStartNewGameWithLimit).toHaveBeenCalledWith(null);
      expect(setIsModalOpen).toHaveBeenCalledWith(false);
    });

    it('starts the new game with the entered limit when "Yes" is selected', () => {
      const { setIsModalOpen, onStartNewGameWithLimit } = setup();

      fireEvent.click(screen.getByRole('button', { name: 'New Game' }));
      fireEvent.click(screen.getByRole('button', { name: 'Yes' }));

      expect(screen.getByText('Enter Score Limit')).toBeInTheDocument();
      const input = screen.getByTestId('score-limit-input');
      expect(input).toHaveAttribute('inputmode', 'numeric');

      fireEvent.change(input, { target: { value: '400' } });
      fireEvent.click(screen.getByTestId('setScoreLimitButton'));

      expect(onStartNewGameWithLimit).toHaveBeenCalledWith(400);
      expect(setIsModalOpen).toHaveBeenCalledWith(false);
    });

    it('shows a cancel button on the input step that unsets the limit', () => {
      const { setIsModalOpen, onStartNewGameWithLimit } = setup();

      fireEvent.click(screen.getByRole('button', { name: 'New Game' }));
      fireEvent.click(screen.getByRole('button', { name: 'Yes' }));

      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(onStartNewGameWithLimit).toHaveBeenCalledWith(null);
      expect(setIsModalOpen).toHaveBeenCalledWith(false);
    });
  });

  describe('tie at the score limit', () => {
    const tieSetup = (overrides: { outcome?: GameEndOutcome | null } = {}) =>
      setup({ outcome: tieOutcome(), ...overrides });

    it('offers overtime instead of a winner', () => {
      tieSetup();

      expect(screen.getByText('Overtime')).toBeInTheDocument();
      expect(screen.getByText("It's a tie!")).toBeInTheDocument();
      expect(screen.getByText('Continue into overtime?')).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Yes' }),
      ).not.toBeInTheDocument();
    });

    it('shows the scoreboard and both actions', () => {
      renderWithProviders(
        <GameWonModal
          isOpen={true}
          setIsModalOpen={vi.fn()}
          outcome={tieOutcome()}
          scoreboard={<div data-testid="modal-scoreboard">final tallies</div>}
          onStartNewGameWithLimit={vi.fn()}
          onSetNewLimit={vi.fn()}
        />,
      );

      const modal = screen.getByTestId('game-won-modal');
      expect(within(modal).getByTestId('modal-scoreboard')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Continue' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'New Game' }),
      ).toBeInTheDocument();
    });

    it('continues into overtime by dismissing the modal', () => {
      const { setIsModalOpen, onStartNewGameWithLimit } = tieSetup();

      fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

      expect(setIsModalOpen).toHaveBeenCalledWith(false);
      expect(onStartNewGameWithLimit).not.toHaveBeenCalled();
    });

    it('prompts for a score limit when "New Game" is selected', () => {
      const { onStartNewGameWithLimit } = tieSetup();

      fireEvent.click(screen.getByRole('button', { name: 'New Game' }));

      expect(
        screen.getByText('Do you want to set a score limit for this game?'),
      ).toBeInTheDocument();
      expect(onStartNewGameWithLimit).not.toHaveBeenCalled();
    });

    it('starts the new game without a limit when "No" is selected', () => {
      const { setIsModalOpen, onStartNewGameWithLimit } = tieSetup();

      fireEvent.click(screen.getByRole('button', { name: 'New Game' }));
      fireEvent.click(screen.getByRole('button', { name: 'No' }));

      expect(onStartNewGameWithLimit).toHaveBeenCalledWith(null);
      expect(setIsModalOpen).toHaveBeenCalledWith(false);
    });

    it('starts the new game with the entered limit when "Yes" is selected', () => {
      const { setIsModalOpen, onStartNewGameWithLimit } = tieSetup();

      fireEvent.click(screen.getByRole('button', { name: 'New Game' }));
      fireEvent.click(screen.getByRole('button', { name: 'Yes' }));

      expect(screen.getByText('Enter Score Limit')).toBeInTheDocument();
      const input = screen.getByTestId('score-limit-input');
      expect(input).toHaveAttribute('inputmode', 'numeric');

      fireEvent.change(input, { target: { value: '400' } });
      fireEvent.click(screen.getByTestId('setScoreLimitButton'));

      expect(onStartNewGameWithLimit).toHaveBeenCalledWith(400);
      expect(setIsModalOpen).toHaveBeenCalledWith(false);
    });
  });
});
