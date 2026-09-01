import { useState } from 'react';
import type { BoxProps } from '../ui/box';
import { AppModal } from '../ui';
import ScoreLimitFlow, { ScoreLimitFlowStep } from '../forms/ScoreLimitFlow';

interface ScoreLimitModalProps {
  isOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  onDecline: () => void;
  onSetLimit: (limit: number) => void;
}

function ScoreLimitModal({
  isOpen,
  setIsModalOpen,
  onDecline,
  onSetLimit,
}: ScoreLimitModalProps) {
  const [step, setStep] = useState<ScoreLimitFlowStep>('ask');
  const [previousIsOpenValue, setPreviousIsOpenValue] = useState(isOpen);

  // Keep the step-derived title in sync when the modal reopens.
  if (isOpen !== previousIsOpenValue) {
    setPreviousIsOpenValue(isOpen);
    if (!isOpen) {
      setStep('ask');
    }
  }

  return (
    <AppModal
      isOpen={isOpen}
      onClose={setIsModalOpen}
      showCloseButton={step !== 'enter'}
      title={step === 'enter' ? 'Enter Score Limit' : 'New Game'}
      contentProps={
        { 'data-testid': 'score-limit-modal' } as BoxProps &
          Record<`data-${string}`, string>
      }
    >
      <ScoreLimitFlow
        isActive={isOpen}
        onResolve={(limit) => {
          setIsModalOpen(false);
          if (limit == null) {
            onDecline();
          } else {
            onSetLimit(limit);
          }
        }}
        onStepChange={setStep}
      />
    </AppModal>
  );
}

export default ScoreLimitModal;
