import React from 'react';
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogCloseTrigger,
  DialogBackdrop,
} from '../ui/dialog';

import { X } from 'lucide-react';

import { ButtonGrid } from '../ui';

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
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => setIsModalOpen(e.open)}
    >
      <DialogBackdrop style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0, 0, 0, 0.6)' }} />
      <DialogContent
        data-cy="bidSelectionModal"
        data-testid="bidSelectionModal"
        style={{
          backgroundColor: '#2D3748',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <DialogHeader fontSize="2xl" fontWeight="bold">
          Select {playerName}&apos;s {typeLabel || type}
        </DialogHeader>
        <DialogCloseTrigger style={{ color: '#ebf5ee', top: '10px', right: '10px' }}>
          <X size={24} />
        </DialogCloseTrigger>
        <DialogBody style={{ padding: '5px' }}>
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
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}

export default InputModal;
