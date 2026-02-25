import { useRef } from 'react';
import { AppModal, ButtonGrid } from '../ui';
import { Box } from '../ui';
import type { Round, InputValue } from '../../types';
import type { BoxProps } from '../ui/box';

export interface InputModalProps {
  index?: number | string;
  isCurrent: boolean;
  playerName: string;
  isOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  type: 'Bid' | 'Actual';
  typeLabel?: string;
  fieldToUpdate: string;
  currentRound: Round;
  roundHistory?: Round[];
  onCustomUpdate?: (input: InputValue) => void;
}

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
}: InputModalProps) {
  const containerRef = useRef(null);

  return (
    <AppModal
      isOpen={isOpen}
      onClose={setIsModalOpen}
      title={`Select ${playerName}'s ${typeLabel || type}`}
      initialFocusEl={() => containerRef.current}
      contentProps={
        {
          'data-cy': 'bidSelectionModal',
          'data-testid': 'bidSelectionModal',
        } as BoxProps & Record<`data-${string}`, string>
      }
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
