import { useState, useContext } from 'react';
import type { BoxProps } from '../ui/box';
import { useNavigate } from 'react-router-dom';
import { AppModal } from '../ui';
import {
  initialNames,
  initialFirstDealerOrder,
} from '../../helpers/utils/constants';
import { GlobalContext } from '../../store/GlobalContext';
import DataWarningQuestion from '../forms/DataWarningQuestion';
import NewPlayerQuestion from '../forms/NewPlayerQuestion';
import ScoreLimitFlow from '../forms/ScoreLimitFlow';
import type { ScoreLimitFlowStep } from '../forms/ScoreLimitFlow';

interface WarningModalProps {
  isOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  resetNames?: (names: typeof initialNames) => void;
}

function WarningModal({
  isOpen,
  setIsModalOpen,
  resetNames,
}: WarningModalProps) {
  const navigate = useNavigate();
  const {
    startNewGame,
    setNames,
    setRoundHistory,
    resetCurrentRound,
    setFirstDealerOrder,
    roundHistory,
  } = useContext(GlobalContext);
  const hasRoundHistory = roundHistory.length > 0;

  // State to track if the user has clicked "Continue" on the data warning
  const [hasClickedContinue, setHasClickedContinue] = useState(false);
  const [isSettingScoreLimit, setIsSettingScoreLimit] = useState(false);
  const [isEnteringScoreLimit, setIsEnteringScoreLimit] = useState(false);
  const [previousIsOpenValue, setPreviousIsOpenValue] = useState(isOpen);

  // Derived visibility state
  const showDataWarning = isOpen && hasRoundHistory && !hasClickedContinue;
  const showNewPlayer =
    isOpen && (!hasRoundHistory || hasClickedContinue) && !isSettingScoreLimit;
  const showScoreLimit = isOpen && isSettingScoreLimit;

  // Adjust state during render when isOpen changes
  if (isOpen !== previousIsOpenValue) {
    setPreviousIsOpenValue(isOpen);
    if (!isOpen) {
      setHasClickedContinue(false);
      setIsSettingScoreLimit(false);
      setIsEnteringScoreLimit(false);
    }
  }

  const onCancel = () => {
    setIsModalOpen(false);
  };

  const onContinue = () => {
    setHasClickedContinue(true);
  };

  // "Same Teams" now funnels through the optional score-limit prompt before
  // the game actually resets; nothing is cleared until that answer lands.
  const onSameTeams = () => {
    setIsSettingScoreLimit(true);
  };

  const finishSameTeams = (limit: number | null) => {
    startNewGame(limit);
    setIsModalOpen(false);
    navigate('/spades-calculator');
  };

  const onDifferentTeams = () => {
    setRoundHistory([]);
    resetCurrentRound();
    if (resetNames) {
      resetNames(initialNames);
    } else {
      setNames(initialNames);
    }
    setFirstDealerOrder(initialFirstDealerOrder);
    setIsModalOpen(false);
    navigate('/');
  };

  const onScoreLimitStepChange = (step: ScoreLimitFlowStep) => {
    setIsEnteringScoreLimit(step === 'enter');
  };

  const title = showDataWarning
    ? 'Are you sure?'
    : isSettingScoreLimit
      ? isEnteringScoreLimit
        ? 'Enter Score Limit'
        : 'New Game'
      : 'Would you like to keep the same teams?';

  return (
    <AppModal
      isOpen={isOpen}
      onClose={setIsModalOpen}
      title={title}
      showCloseButton={!isEnteringScoreLimit}
      contentProps={
        { 'data-testid': 'warning-modal' } as BoxProps &
          Record<`data-${string}`, string>
      }
    >
      {showDataWarning && (
        <DataWarningQuestion onContinue={onContinue} onCancel={onCancel} />
      )}
      {showNewPlayer && (
        <NewPlayerQuestion
          onDifferentTeams={onDifferentTeams}
          onSameTeams={onSameTeams}
        />
      )}
      {showScoreLimit && (
        <ScoreLimitFlow
          isActive={isOpen}
          onResolve={finishSameTeams}
          onStepChange={onScoreLimitStepChange}
        />
      )}
    </AppModal>
  );
}

export default WarningModal;
