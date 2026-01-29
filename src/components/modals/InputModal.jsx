import React from 'react';
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
      contentStyle={{
        backgroundColor: '#2D3748',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
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
