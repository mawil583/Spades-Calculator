import { useRef } from 'react';
import { AppModal, ButtonGrid } from '../ui';
import { Box } from '../ui';

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
  const containerRef = useRef(null);

  return (
    <AppModal
      isOpen={isOpen}
      onClose={setIsModalOpen}
      title={`Select ${playerName}'s ${typeLabel || type}`}
      initialFocusEl={() => containerRef.current}
      contentProps={{
        'data-cy': 'bidSelectionModal',
        'data-testid': 'bidSelectionModal',
      }}
    >
      <Box ref={containerRef} tabIndex={-1} css={{ outline: 'none' }}>
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
      </Box>
    </AppModal>
  );
}

export default InputModal;
