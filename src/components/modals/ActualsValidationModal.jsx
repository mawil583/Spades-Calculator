import React from 'react';
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogCloseTrigger,
} from '../ui/dialog';
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
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => {
        if (!e.open) setIsValid(true);
      }}
    >
      <DialogContent>
        <DialogHeader>
          Total actuals must equal 13. The actuals you&apos;ve entered add up to{' '}
          {totalActuals}
        </DialogHeader>
        <DialogCloseTrigger />
        <DialogBody style={{ padding: '5px' }}>
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
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}

export default ActualsValidationModal;
