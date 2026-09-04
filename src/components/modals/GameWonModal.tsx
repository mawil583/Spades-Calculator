import { useState } from 'react';
import type { ReactNode } from 'react';
import { AppModal, Box, Button, Flex, Text } from '../ui';
import type { BoxProps } from '../ui/box';
import ScoreLimitFlow, { ScoreLimitFlowStep } from '../forms/ScoreLimitFlow';
import type { GameEndOutcome } from '../../types';

type GameWonPhase = 'result' | 'continueLimit' | 'newGameLimit';

interface GameWonModalProps {
  isOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  /**
   * What to announce: a winner or a tie at the limit. Null while the game
   * isn't over (the modal is then closed).
   */
  outcome: GameEndOutcome | null;
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
  outcome,
  scoreboard,
  onStartNewGameWithLimit,
  onSetNewLimit,
}: GameWonModalProps) {
  const [phase, setPhase] = useState<GameWonPhase>('result');
  const [limitStep, setLimitStep] = useState<ScoreLimitFlowStep>('ask');
  const [previousIsOpenValue, setPreviousIsOpenValue] = useState(isOpen);

  if (isOpen !== previousIsOpenValue) {
    setPreviousIsOpenValue(isOpen);
    if (!isOpen) {
      setPhase('result');
      setLimitStep('ask');
    }
  }

  const isTie = outcome?.kind === 'tie';
  const title =
    phase === 'result'
      ? isTie
        ? 'Overtime'
        : 'Game Over'
      : limitStep === 'enter'
        ? phase === 'continueLimit'
          ? 'Enter New Score Limit'
          : 'Enter Score Limit'
        : 'New Game';

  const resolveContinue = (limit: number | null) => {
    onSetNewLimit(limit);
    setIsModalOpen(false);
  };

  const resolveNewGame = (limit: number | null) => {
    setIsModalOpen(false);
    onStartNewGameWithLimit(limit);
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={setIsModalOpen}
      title={title}
      showCloseButton={limitStep !== 'enter'}
      contentProps={
        { 'data-testid': 'game-won-modal' } as BoxProps &
          Record<`data-${string}`, string>
      }
    >
      {phase === 'result' && outcome?.kind === 'tie' && (
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
              onClick={() => setPhase('newGameLimit')}
            >
              New Game
            </Button>
          </Flex>
        </div>
      )}
      {phase === 'result' && outcome?.kind === 'win' && (
        <div style={{ padding: 'var(--app-spacing-2)' }}>
          <div
            className={outcome.winnerTeam}
            data-testid={`winner-${outcome.winnerTeam}`}
          >
            <Flex direction={'column'} align={'center'} gap={2}>
              <span
                style={{
                  fontSize: 'var(--app-font-3xl)',
                  fontWeight: 'bold',
                  lineHeight: 1.2,
                }}
              >
                {outcome.winnerName} wins!
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
              onClick={() => setPhase('continueLimit')}
            >
              Continue
            </Button>
            <Button
              variant="primary"
              flex={1}
              onClick={() => setPhase('newGameLimit')}
            >
              New Game
            </Button>
          </Flex>
        </div>
      )}
      {phase === 'continueLimit' && (
        <ScoreLimitFlow
          isActive={isOpen}
          question="Would you like to set a new score limit?"
          minLimit={outcome?.kind === 'win' ? outcome.minLimit : 0}
          onResolve={resolveContinue}
          onStepChange={setLimitStep}
        />
      )}
      {phase === 'newGameLimit' && (
        <ScoreLimitFlow
          isActive={isOpen}
          onResolve={resolveNewGame}
          onStepChange={setLimitStep}
        />
      )}
    </AppModal>
  );
}

export default GameWonModal;
