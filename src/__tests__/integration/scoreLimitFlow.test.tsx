import { vi } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from '../../components/ui/provider';
import NameForm from '../../components/forms/NameForm';
import SpadesCalculator from '../../pages/SpadesCalculator';
import { GlobalContext } from '../../store/GlobalContext';
import type { GlobalContextValue, Round } from '../../types';
import { EMPTY_ROUND } from '../../helpers/utils/constants';
import { createMockGlobalContext } from '../utils/mockContext';

const { mockedNavigate } = vi.hoisted(() => ({
  mockedNavigate: vi.fn(),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

const renderWithProviders = (
  component: React.ReactNode,
  contextValue: GlobalContextValue,
) => {
  return render(
    <BrowserRouter>
      <Provider>
        <GlobalContext.Provider value={contextValue}>
          {component}
        </GlobalContext.Provider>
      </Provider>
    </BrowserRouter>,
  );
};

const fillPlayerNames = () => {
  const ids = ['t1p1Name', 't1p2Name', 't2p1Name', 't2p2Name'];
  ids.forEach((id, i) => {
    const input = document.querySelector(
      `[data-cy="${id}Input"]`,
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: `Player ${i + 1}` } });
  });
};

describe('score limit flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedNavigate.mockClear();
    window.localStorage.clear();
  });

  describe('when a new user starts a game', () => {
    const freshStartContext = (overrides: Partial<GlobalContextValue> = {}) =>
      createMockGlobalContext({
        names: {
          team1Name: 'Team 1',
          team2Name: 'Team 2',
          t1p1Name: '',
          t1p2Name: '',
          t2p1Name: '',
          t2p2Name: '',
        },
        roundHistory: [],
        currentRound: EMPTY_ROUND,
        ...overrides,
      });

    const submitForm = (label: 'Start' | 'Continue') => {
      const button = screen.getByRole('button', { name: label });
      const form = button.closest('form') as HTMLFormElement;
      fireEvent.submit(form);
    };

    it('asks about a score limit instead of navigating immediately', async () => {
      const contextValue = freshStartContext();
      renderWithProviders(<NameForm />, contextValue);

      fillPlayerNames();
      submitForm('Start');

      expect(
        await screen.findByText(
          'Do you want to set a score limit for this game?',
        ),
      ).toBeInTheDocument();
      expect(contextValue.setNames).toHaveBeenCalledTimes(1);
      expect(mockedNavigate).not.toHaveBeenCalled();
    });

    it('proceeds without a limit when "No" is selected', async () => {
      const contextValue = freshStartContext();
      renderWithProviders(<NameForm />, contextValue);

      fillPlayerNames();
      submitForm('Start');
      fireEvent.click(await screen.findByRole('button', { name: 'No' }));

      expect(contextValue.setScoreLimit).toHaveBeenCalledWith(null);
      expect(mockedNavigate).toHaveBeenCalledWith(
        '/spades-calculator',
        expect.anything(),
      );
    });

    it('swaps to a numeric keypad input when "Yes" is selected and saves the limit', async () => {
      const contextValue = freshStartContext();
      renderWithProviders(<NameForm />, contextValue);

      fillPlayerNames();
      submitForm('Start');
      fireEvent.click(await screen.findByRole('button', { name: 'Yes' }));

      const input = screen.getByTestId(
        'score-limit-input',
      ) as HTMLInputElement;
      expect(input).toHaveAttribute('inputmode', 'numeric');

      fireEvent.change(input, { target: { value: '500' } });
      fireEvent.click(screen.getByTestId('setScoreLimitButton'));

      expect(contextValue.setScoreLimit).toHaveBeenCalledWith(500);
      expect(mockedNavigate).toHaveBeenCalledWith(
        '/spades-calculator',
        expect.anything(),
      );
    });

    it('does not ask again for an existing game ("Continue")', async () => {
      const contextValue = createMockGlobalContext();
      renderWithProviders(<NameForm />, contextValue);

      submitForm('Continue');

      await waitFor(() => {
        expect(mockedNavigate).toHaveBeenCalledWith(
          '/spades-calculator',
          expect.anything(),
        );
      });
      expect(
        screen.queryByText('Do you want to set a score limit for this game?'),
      ).not.toBeInTheDocument();
    });
  });

  describe('when a team reaches the score limit on the board', () => {
    const winningRoundHistory: Round[] = [0, 1, 2, 3].map(() => ({
      team1BidsAndActuals: {
        p1Bid: '8',
        p2Bid: '5',
        p1Actual: '8',
        p2Actual: '5',
      },
      team2BidsAndActuals: {
        p1Bid: '1',
        p2Bid: '1',
        p1Actual: '0',
        p2Actual: '0',
      },
      dealerOverride: null,
      autoGeneratedActuals: {
        team1P1: false,
        team1P2: false,
        team2P1: false,
        team2P2: false,
      },
    }));

    const boardContext = (overrides: Partial<GlobalContextValue> = {}) =>
      createMockGlobalContext({
        scoreLimit: 500,
        roundHistory: winningRoundHistory,
        currentRound: EMPTY_ROUND,
        firstDealerOrder: [
          'team1BidsAndActuals.p1Bid',
          'team2BidsAndActuals.p1Bid',
          'team1BidsAndActuals.p2Bid',
          'team2BidsAndActuals.p2Bid',
        ],
        ...overrides,
      }) as GlobalContextValue;

    it('announces the winner in their team color and offers a new game', async () => {
      const contextValue = boardContext();
      renderWithProviders(<SpadesCalculator />, contextValue);

      expect(await screen.findByText('Game Over')).toBeInTheDocument();
      expect(screen.getByText('Team 1 wins!')).toBeInTheDocument();
      expect(screen.getByTestId('winner-team1')).toHaveClass('team1');
      expect(
        screen.getByRole('button', { name: 'New Game' }),
      ).toBeInTheDocument();
    });

    it('clears the score limit when continuing without a new one', async () => {
      const contextValue = boardContext();
      renderWithProviders(<SpadesCalculator />, contextValue);

      fireEvent.click(await screen.findByRole('button', { name: 'Continue' }));
      fireEvent.click(await screen.findByRole('button', { name: 'No' }));

      await waitFor(() => {
        expect(contextValue.setScoreLimit).toHaveBeenCalledWith(null);
      });
    });

    it('shows the game score inside the win modal so the margin is visible', async () => {
      const contextValue = boardContext();
      renderWithProviders(<SpadesCalculator />, contextValue);

      const modal = await screen.findByTestId('game-won-modal');
      const scoreboard = within(modal).getByTestId('game-score-container');
      expect(within(scoreboard).getByText('520')).toBeInTheDocument();
    });

    it("doesn't announce a winner until BOTH teams have entered actuals, even if one already crossed", async () => {
      // Team 1 has 100 pts banked (5+5 made) and the limit is 100, but Team 2
      // is still missing an actual: no winner yet.
      const partialRound: Round = {
        team1BidsAndActuals: {
          p1Bid: '5',
          p2Bid: '5',
          p1Actual: '5',
          p2Actual: '5',
        },
        team2BidsAndActuals: {
          p1Bid: '2',
          p2Bid: '1',
          p1Actual: '2',
          p2Actual: '',
        },
        dealerOverride: null,
        autoGeneratedActuals: {
          team1P1: false,
          team1P2: false,
          team2P1: false,
          team2P2: false,
        },
      };
      const firstView = renderWithProviders(
        <SpadesCalculator />,
        boardContext({ scoreLimit: 100, roundHistory: [], currentRound: partialRound }),
      );
      await screen.findAllByText('Team 1');
      expect(screen.queryByText('Game Over')).not.toBeInTheDocument();
      firstView.unmount();

      // Once Team 2's last actual lands (actuals total 13), the round is done
      // and Team 1's 100 points win it.
      const completedRound = {
        ...partialRound,
        team2BidsAndActuals: {
          ...partialRound.team2BidsAndActuals,
          p2Actual: '1',
        },
      } as Round;
      renderWithProviders(
        <SpadesCalculator />,
        boardContext({
          scoreLimit: 100,
          roundHistory: [],
          currentRound: completedRound,
        }),
      );

      expect(await screen.findByText('Game Over')).toBeInTheDocument();
      expect(screen.getByText('Team 1 wins!')).toBeInTheDocument();
    });

    it('does not announce a winner while both teams are under the limit', async () => {
      const contextValue = boardContext({ roundHistory: [] });
      renderWithProviders(<SpadesCalculator />, contextValue);

      await screen.findAllByText('Team 1');
      expect(screen.queryByText('Game Over')).not.toBeInTheDocument();
    });

    it('prompts for a score limit and wipes the old one when "New Game" is selected', async () => {
      const contextValue = boardContext();
      renderWithProviders(<SpadesCalculator />, contextValue);

      fireEvent.click(
        await screen.findByRole('button', { name: 'New Game' }),
      );

      expect(
        await screen.findByText(
          'Do you want to set a score limit for this game?',
        ),
      ).toBeInTheDocument();
      expect(contextValue.resetCurrentRound).not.toHaveBeenCalled();
      expect(contextValue.setRoundHistory).not.toHaveBeenCalled();
    });

    it('starts the new game without a limit when "No" is selected', async () => {
      const contextValue = boardContext();
      renderWithProviders(<SpadesCalculator />, contextValue);

      fireEvent.click(
        await screen.findByRole('button', { name: 'New Game' }),
      );
      fireEvent.click(await screen.findByRole('button', { name: 'No' }));

      expect(contextValue.setScoreLimit).toHaveBeenCalledWith(null);
      expect(contextValue.resetCurrentRound).toHaveBeenCalled();
      expect(contextValue.setRoundHistory).toHaveBeenCalledWith([]);
    });

    it('starts the new game with the entered limit when "Yes" is selected', async () => {
      const contextValue = boardContext();
      renderWithProviders(<SpadesCalculator />, contextValue);

      fireEvent.click(
        await screen.findByRole('button', { name: 'New Game' }),
      );
      fireEvent.click(await screen.findByRole('button', { name: 'Yes' }));

      const input = screen.getByTestId('score-limit-input');
      fireEvent.change(input, { target: { value: '400' } });
      fireEvent.click(screen.getByTestId('setScoreLimitButton'));

      await waitFor(() => {
        expect(contextValue.setScoreLimit).toHaveBeenCalledWith(400);
      });
      expect(contextValue.resetCurrentRound).toHaveBeenCalled();
      expect(contextValue.setRoundHistory).toHaveBeenCalledWith([]);
    });

    it('never shows the game-over or overtime modals to viewers of a shared board', async () => {
      const contextValue = boardContext({
        role: 'viewer',
        isViewerSynced: true,
      });
      renderWithProviders(<SpadesCalculator />, contextValue);

      await screen.findAllByText('Team 1');
      expect(screen.queryByText('Game Over')).not.toBeInTheDocument();
      expect(screen.queryByText('Team 1 wins!')).not.toBeInTheDocument();
      expect(screen.queryByTestId('game-won-modal')).not.toBeInTheDocument();
    });

    it('shows the infinity symbol when no score limit is set', async () => {
      const contextValue = boardContext({ scoreLimit: null, roundHistory: [] });
      renderWithProviders(<SpadesCalculator />, contextValue);

      await screen.findAllByText('Team 1');
      expect(
        screen.getAllByTestId('score-limit-display')[0],
      ).toHaveTextContent('Score limit: ∞');
    });

    it('lets a player set a limit from the infinity display via the edit modal', async () => {
      const contextValue = boardContext({ scoreLimit: null, roundHistory: [] });
      renderWithProviders(<SpadesCalculator />, contextValue);

      fireEvent.click(
        (await screen.findAllByTestId('score-limit-display'))[0],
      );
      const editModal = await screen.findByTestId('edit-score-limit-modal');

      const input = within(editModal).getByTestId(
        'score-limit-input',
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: '300' } });
      const setButton = within(editModal).getByTestId('setScoreLimitButton');
      await waitFor(() => expect(setButton).not.toBeDisabled());
      fireEvent.click(setButton);

      await waitFor(() => {
        expect(contextValue.setScoreLimit).toHaveBeenCalledWith(300);
      });
    });

    it('shows the score limit under the unclaimed count on the board', async () => {
      const contextValue = boardContext();
      renderWithProviders(<SpadesCalculator />, contextValue);

      await screen.findAllByText('Team 1');
      expect(
        screen.getAllByTestId('score-limit-display')[0],
      ).toHaveTextContent('Score limit: 500');
    });

    it('opens an edit modal when the score limit is clicked, flooring at the winner score', async () => {
      const contextValue = boardContext();
      renderWithProviders(<SpadesCalculator />, contextValue);

      fireEvent.click(
        (await screen.findAllByTestId('score-limit-display'))[0],
      );

      const editModal = await screen.findByTestId('edit-score-limit-modal');
      expect(within(editModal).getByText('Edit Score Limit')).toBeInTheDocument();

      // Team 1 has 520 pts: anything at or below that is rejected.
      const input = within(editModal).getByTestId(
        'score-limit-input',
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: '520' } });
      expect(
        await within(editModal).findByText('Must be higher than 520'),
      ).toBeInTheDocument();

      fireEvent.change(input, { target: { value: '600' } });
      const setButton = within(editModal).getByTestId('setScoreLimitButton');
      await waitFor(() => expect(setButton).not.toBeDisabled());
      fireEvent.click(setButton);

      await waitFor(() => {
        expect(contextValue.setScoreLimit).toHaveBeenCalledWith(600);
      });
    });

    it('does not open the edit modal for viewers', async () => {
      const contextValue = boardContext({
        role: 'viewer',
        isViewerSynced: true,
      });
      renderWithProviders(<SpadesCalculator />, contextValue);

      const display = (await screen.findAllByTestId('score-limit-display'))[0];
      expect(display).not.toHaveAttribute('role', 'button');
      fireEvent.click(display);

      expect(
        screen.queryByTestId('edit-score-limit-modal'),
      ).not.toBeInTheDocument();
    });

    it('shows the score limit on the board in viewer mode too', async () => {
      const contextValue = boardContext({
        role: 'viewer',
        isViewerSynced: true,
      });
      renderWithProviders(<SpadesCalculator />, contextValue);

      await screen.findAllByText('Team 1');
      expect(
        screen.getAllByTestId('score-limit-display')[0],
      ).toHaveTextContent('Score limit: 500');
    });

    it('offers overtime when both teams finish tied at the limit', async () => {
      // Two completed rounds where both teams bank 110: r1 team1 makes 13
      // (130) while team2 goes set (-20), r2 the reverse.
      const tiedRoundHistory: Round[] = [
        {
          team1BidsAndActuals: {
            p1Bid: '6',
            p2Bid: '7',
            p1Actual: '6',
            p2Actual: '7',
          },
          team2BidsAndActuals: {
            p1Bid: '1',
            p2Bid: '1',
            p1Actual: '0',
            p2Actual: '0',
          },
          dealerOverride: null,
          autoGeneratedActuals: {
            team1P1: false,
            team1P2: false,
            team2P1: false,
            team2P2: false,
          },
        },
        {
          team1BidsAndActuals: {
            p1Bid: '1',
            p2Bid: '1',
            p1Actual: '0',
            p2Actual: '0',
          },
          team2BidsAndActuals: {
            p1Bid: '8',
            p2Bid: '5',
            p1Actual: '8',
            p2Actual: '5',
          },
          dealerOverride: null,
          autoGeneratedActuals: {
            team1P1: false,
            team1P2: false,
            team2P1: false,
            team2P2: false,
          },
        },
      ];
      const contextValue = boardContext({
        scoreLimit: 100,
        roundHistory: tiedRoundHistory,
      });
      renderWithProviders(<SpadesCalculator />, contextValue);

      expect(await screen.findByText('Overtime')).toBeInTheDocument();
      expect(screen.getByText("It's a tie!")).toBeInTheDocument();
      expect(
        screen.getByText('Continue into overtime?'),
      ).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

      await waitFor(() => {
        expect(screen.queryByText("It's a tie!")).not.toBeInTheDocument();
      });
      expect(screen.queryByTestId('game-won-modal')).not.toBeInTheDocument();
    });

    it('starts a new game from the overtime prompt', async () => {
      const tiedRoundHistory: Round[] = [
        {
          team1BidsAndActuals: {
            p1Bid: '6',
            p2Bid: '7',
            p1Actual: '6',
            p2Actual: '7',
          },
          team2BidsAndActuals: {
            p1Bid: '1',
            p2Bid: '1',
            p1Actual: '0',
            p2Actual: '0',
          },
          dealerOverride: null,
          autoGeneratedActuals: {
            team1P1: false,
            team1P2: false,
            team2P1: false,
            team2P2: false,
          },
        },
        {
          team1BidsAndActuals: {
            p1Bid: '1',
            p2Bid: '1',
            p1Actual: '0',
            p2Actual: '0',
          },
          team2BidsAndActuals: {
            p1Bid: '8',
            p2Bid: '5',
            p1Actual: '8',
            p2Actual: '5',
          },
          dealerOverride: null,
          autoGeneratedActuals: {
            team1P1: false,
            team1P2: false,
            team2P1: false,
            team2P2: false,
          },
        },
      ];
      const contextValue = boardContext({
        scoreLimit: 100,
        roundHistory: tiedRoundHistory,
      });
      renderWithProviders(<SpadesCalculator />, contextValue);

      fireEvent.click(
        await screen.findByRole('button', { name: 'New Game' }),
      );

      expect(
        await screen.findByText(
          'Do you want to set a score limit for this game?',
        ),
      ).toBeInTheDocument();
      expect(contextValue.resetCurrentRound).not.toHaveBeenCalled();
      expect(contextValue.setRoundHistory).not.toHaveBeenCalled();
    });

    it('starts the new game without a limit when "No" is selected from overtime', async () => {
      const tiedRoundHistory: Round[] = [
        {
          team1BidsAndActuals: {
            p1Bid: '6',
            p2Bid: '7',
            p1Actual: '6',
            p2Actual: '7',
          },
          team2BidsAndActuals: {
            p1Bid: '1',
            p2Bid: '1',
            p1Actual: '0',
            p2Actual: '0',
          },
          dealerOverride: null,
          autoGeneratedActuals: {
            team1P1: false,
            team1P2: false,
            team2P1: false,
            team2P2: false,
          },
        },
        {
          team1BidsAndActuals: {
            p1Bid: '1',
            p2Bid: '1',
            p1Actual: '0',
            p2Actual: '0',
          },
          team2BidsAndActuals: {
            p1Bid: '8',
            p2Bid: '5',
            p1Actual: '8',
            p2Actual: '5',
          },
          dealerOverride: null,
          autoGeneratedActuals: {
            team1P1: false,
            team1P2: false,
            team2P1: false,
            team2P2: false,
          },
        },
      ];
      const contextValue = boardContext({
        scoreLimit: 100,
        roundHistory: tiedRoundHistory,
      });
      renderWithProviders(<SpadesCalculator />, contextValue);

      fireEvent.click(
        await screen.findByRole('button', { name: 'New Game' }),
      );
      fireEvent.click(await screen.findByRole('button', { name: 'No' }));

      expect(contextValue.setScoreLimit).toHaveBeenCalledWith(null);
      expect(contextValue.resetCurrentRound).toHaveBeenCalled();
      expect(contextValue.setRoundHistory).toHaveBeenCalledWith([]);
    });

    it('starts the new game with the entered limit when "Yes" is selected from overtime', async () => {
      const tiedRoundHistory: Round[] = [
        {
          team1BidsAndActuals: {
            p1Bid: '6',
            p2Bid: '7',
            p1Actual: '6',
            p2Actual: '7',
          },
          team2BidsAndActuals: {
            p1Bid: '1',
            p2Bid: '1',
            p1Actual: '0',
            p2Actual: '0',
          },
          dealerOverride: null,
          autoGeneratedActuals: {
            team1P1: false,
            team1P2: false,
            team2P1: false,
            team2P2: false,
          },
        },
        {
          team1BidsAndActuals: {
            p1Bid: '1',
            p2Bid: '1',
            p1Actual: '0',
            p2Actual: '0',
          },
          team2BidsAndActuals: {
            p1Bid: '8',
            p2Bid: '5',
            p1Actual: '8',
            p2Actual: '5',
          },
          dealerOverride: null,
          autoGeneratedActuals: {
            team1P1: false,
            team1P2: false,
            team2P1: false,
            team2P2: false,
          },
        },
      ];
      const contextValue = boardContext({
        scoreLimit: 100,
        roundHistory: tiedRoundHistory,
      });
      renderWithProviders(<SpadesCalculator />, contextValue);

      fireEvent.click(
        await screen.findByRole('button', { name: 'New Game' }),
      );
      fireEvent.click(await screen.findByRole('button', { name: 'Yes' }));

      const input = screen.getByTestId('score-limit-input');
      fireEvent.change(input, { target: { value: '400' } });
      fireEvent.click(screen.getByTestId('setScoreLimitButton'));

      await waitFor(() => {
        expect(contextValue.setScoreLimit).toHaveBeenCalledWith(400);
      });
      expect(contextValue.resetCurrentRound).toHaveBeenCalled();
      expect(contextValue.setRoundHistory).toHaveBeenCalledWith([]);
    });

    it('closes the edit modal on the first X click without triggering validation', async () => {
      // No game-over state: the edit modal opens on its own, as a player
      // would see it after dismissing the winner announcement.
      const contextValue = boardContext({ roundHistory: [] });
      renderWithProviders(<SpadesCalculator />, contextValue);

      fireEvent.click(
        (await screen.findAllByTestId('score-limit-display'))[0],
      );
      await screen.findByTestId('edit-score-limit-modal');

      fireEvent.click(await screen.findByRole('button', { name: /close/i }));

      await waitFor(() => {
        expect(
          screen.queryByTestId('edit-score-limit-modal'),
        ).not.toBeInTheDocument();
      });
      expect(screen.queryByText('Required')).not.toBeInTheDocument();
    });
  });
});
