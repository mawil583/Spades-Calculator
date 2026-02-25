import { AppModal } from '../ui';
import { ActualSection } from '../game';
import type { Round } from '../../types';

interface ActualsValidationModalProps {
  isOpen: boolean;
  setIsValid: (isValid: boolean) => void;
  totalActuals: number;
  index: number;
  t1p1Name: string;
  t1p2Name: string;
  t2p1Name: string;
  t2p2Name: string;
  isCurrent: boolean;
  roundHistory: Round[];
  currentRound: Round;
}

function ActualsValidationModal({
  isOpen,
  setIsValid,
  totalActuals,
  index,
  t1p1Name,
  t1p2Name,
  t2p1Name,
  t2p2Name,
  isCurrent,
  roundHistory,
  currentRound,
}: ActualsValidationModalProps) {
  return (
    <AppModal
      isOpen={isOpen}
      onClose={() => setIsValid(true)}
      title={`Total actuals must equal 13. The actuals you've entered add up to ${totalActuals}`}
      headerStyle={{ fontSize: 'md', fontWeight: 'medium' }}
    >
      <ActualSection
        index={index}
        names={{
          team1Name: 'Team 1',
          team2Name: 'Team 2',
          t1p1Name,
          t1p2Name,
          t2p1Name,
          t2p2Name,
        }}
        isCurrent={isCurrent}
        roundHistory={roundHistory}
        currentRound={currentRound}
      />
    </AppModal>
  );
}

export default ActualsValidationModal;
