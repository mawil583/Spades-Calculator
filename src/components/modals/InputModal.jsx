
import { AppModal, ButtonGrid } from '../ui';

function InputModal({
  index,
  isCurrent,
  playerName,
  isOpen,
  setIsModalOpen,
  type,
  typeLabel,
  fieldToUpdate,
  currentRound,
  roundHistory,
  onCustomUpdate,
}) {
  return (
    <AppModal
      isOpen={isOpen}
      onClose={setIsModalOpen}
      title={`Select ${playerName}'s ${typeLabel || type}`}
      contentProps={{
        'data-cy': 'bidSelectionModal',
        'data-testid': 'bidSelectionModal',
      }}
    >
      <ButtonGrid
        isCurrent={isCurrent}
        fieldToUpdate={fieldToUpdate}
        currentRound={currentRound}
        roundHistory={roundHistory}
        setIsModalOpen={setIsModalOpen}
        type={type}
        index={index}
        onCustomUpdate={onCustomUpdate}
      />
    </AppModal>
  );
}

export default InputModal;
