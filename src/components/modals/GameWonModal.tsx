import { useState } from 'react';
import type { ReactNode } from 'react';
import { AppModal, Box, Button, Flex, Text } from '../ui';
import type { BoxProps } from '../ui/box';
import ScoreLimitQuestion from '../forms/ScoreLimitQuestion';
import ScoreLimitInput from '../forms/ScoreLimitInput';
import NewScoreLimitInput from '../forms/NewScoreLimitInput';

type GameWonPhase =
  | 'result'
  | 'askNewLimit'
  | 'enterNewLimit'
  | 'newGameAskLimit'
  | 'newGameEnterLimit';

interface GameWonModalProps {
  isOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  /** Tie at the limit shows the overtime prompt instead of a winner. */
  isTie: boolean;
  winnerTeam: 'team1' | 'team2';
  winnerName: string;
  /** The winner's current score — a replacement limit must be higher. */
  minLimit: number;
  /** Final tallies (e.g. the GameScore component) so players see the margin. */
  scoreboard?: ReactNode;
  /**
   * "New Game" always lands here after the score-limit prompt resolves:
   * null wipes the limit, a number starts the rematch with it.
   */
  onStartNewGameWithLimit: (limit: number | null) => void;
  /** Continue → new limit confirmed (null = keep playing without one). */
  onSetNewLimit: (limit: number | null) => void;
}

function GameWonModal({
  isOpen,
  setIsModalOpen,
  isTie,
  winnerTeam,
  winnerName,
  minLimit,
  scoreboard,
  onStartNewGameWithLimit,
  onSetNewLimit,
}: GameWonModalProps) {
  const [phase, setPhase] = useState<GameWonPhase>('result');
  const [previousIsOpenValue, setPreviousIsOpenValue] = useState(isOpen);

  if (isOpen !== previousIsOpenValue) {
    setPreviousIsOpenValue(isOpen);
    if (!isOpen) {
      setPhase('result');
    }
  }

  const onStartNewGame = (limit: number | null) => {
    setIsModalOpen(false);
    onStartNewGameWithLimit(limit);
  };

  const title =
    phase === 'result'
      ? isTie
        ? 'Overtime'
        : 'Game Over'
      : phase === 'askNewLimit' || phase === 'newGameAskLimit'
        ? 'New Game'
        : phase === 'enterNewLimit'
          ? 'Enter New Score Limit'
          : 'Enter Score Limit';

  return (
    <AppModal
      isOpen={isOpen}
      onClose={setIsModalOpen}
      title={title}
      showCloseButton={
        phase !== 'enterNewLimit' && phase !== 'newGameEnterLimit'
      }
      contentProps={
        { 'data-testid': 'game-won-modal' } as BoxProps &
          Record<`data-${string}`, string>
      }
    >
      {phase === 'result' && isTie && (
        <div
          style={{ padding: 'var(--app-spacing-2)' }}
          data-testid="tie-content"
        >
          <Flex direction={'column'} align={'center'} gap={2}>
            <span
              style={{
                fontSize: 'var(--app-font-3xl)',
                fontWeight: 'bold',
                lineHeight: 1.2,
              }}
            >
              It&apos;s a tie!
            </span>
            <span style={{ fontSize: 'var(--app-font-md)' }}>
              Continue into overtime?
            </span>
          </Flex>
          {scoreboard && (
            <Box mt={4} width="100%">
              {scoreboard}
            </Box>
          )}
          <Flex direction={'row'} justifyContent={'space-between'} mt={6}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Continue
            </Button>
            <Button
              variant="primary"
              onClick={() => setPhase('newGameAskLimit')}
            >
              New Game
            </Button>
          </Flex>
        </div>
      )}
      {phase === 'result' && !isTie && (
        <div style={{ padding: 'var(--app-spacing-2)' }}>
          <div className={winnerTeam} data-testid={`winner-${winnerTeam}`}>
            <Flex direction={'column'} align={'center'} gap={2}>
              <span
                style={{
                  fontSize: 'var(--app-font-3xl)',
                  fontWeight: 'bold',
                  lineHeight: 1.2,
                }}
              >
                {winnerName} wins!
              </span>
            </Flex>
          </div>
          {scoreboard && (
            <Box mt={4} width="100%">
              {scoreboard}
            </Box>
          )}
          <Text
            mt={4}
            fontSize="var(--app-font-md)"
            textAlign={'center'}
            display={'block'}
          >
            Do you want to continue the current game, or start a new one?
          </Text>
          <Flex direction={'row'} gap={4} mt={4}>
            <Button
              variant="secondary"
              flex={1}
              onClick={() => setPhase('askNewLimit')}
            >
              Continue
            </Button>
            <Button
              variant="primary"
              flex={1}
              onClick={() => setPhase('newGameAskLimit')}
            >
              New Game
            </Button>
          </Flex>
        </div>
      )}
      {phase === 'askNewLimit' && (
        <ScoreLimitQuestion
          question="Would you like to set a new score limit?"
          onYes={() => setPhase('enterNewLimit')}
          onNo={() => {
            // Continuing without a new limit means playing without one.
            onSetNewLimit(null);
            setIsModalOpen(false);
          }}
        />
      )}
      {phase === 'enterNewLimit' && (
        <NewScoreLimitInput
          minLimit={minLimit}
          onSetLimit={(limit) => {
            onSetNewLimit(limit);
            setIsModalOpen(false);
          }}
          onCancel={() => {
            // Backing out means continuing without any score limit.
            onSetNewLimit(null);
            setIsModalOpen(false);
          }}
        />
      )}
      {phase === 'newGameAskLimit' && (
        <ScoreLimitQuestion
          onYes={() => setPhase('newGameEnterLimit')}
          onNo={() => onStartNewGame(null)}
        />
      )}
      {phase === 'newGameEnterLimit' && (
        <ScoreLimitInput
          onSetLimit={(limit) => onStartNewGame(limit)}
          onCancel={() => onStartNewGame(null)}
        />
      )}
    </AppModal>
  );
}

export default GameWonModal;
