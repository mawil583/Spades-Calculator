
import { AppModal } from '../ui';
import { ActualSection } from '../game';

function ActualsValidationModal({
  isOpen,
  setIsValid,
  totalActuals,
  index,
  setRound,
  t1p1Name,
  t1p2Name,
  t2p1Name,
  t2p2Name,
  isCurrent,
  roundHistory,
  currentRound,
}) {
  return (
    <AppModal
      isOpen={isOpen}
      onClose={() => setIsValid(true)}
      title={`Total actuals must equal 13. The actuals you've entered add up to ${totalActuals}`}
      headerStyle={{ fontSize: 'md', fontWeight: 'medium' }}
    >
      <ActualSection
        index={index}
        setRound={setRound}
        t1p1Name={t1p1Name}
        t1p2Name={t1p2Name}
        t2p1Name={t2p1Name}
        t2p2Name={t2p2Name}
        isCurrent={isCurrent}
        roundHistory={roundHistory}
        currentRound={currentRound}
      />
    </AppModal>
  );
}

export default ActualsValidationModal;
