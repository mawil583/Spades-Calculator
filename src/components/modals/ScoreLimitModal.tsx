import { useState } from 'react';
import type { BoxProps } from '../ui/box';
import { AppModal } from '../ui';
import ScoreLimitQuestion from '../forms/ScoreLimitQuestion';
import ScoreLimitInput from '../forms/ScoreLimitInput';

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
  const [isEnteringLimit, setIsEnteringLimit] = useState(false);
  const [previousIsOpenValue, setPreviousIsOpenValue] = useState(isOpen);

  if (isOpen !== previousIsOpenValue) {
    setPreviousIsOpenValue(isOpen);
    if (!isOpen) {
      setIsEnteringLimit(false);
    }
  }

  const onNo = () => {
    setIsModalOpen(false);
    onDecline();
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={setIsModalOpen}
      showCloseButton={!isEnteringLimit}
      title={isEnteringLimit ? 'Enter Score Limit' : 'New Game'}
      contentProps={
        { 'data-testid': 'score-limit-modal' } as BoxProps &
          Record<`data-${string}`, string>
      }
    >
      {!isEnteringLimit && (
        <ScoreLimitQuestion onYes={() => setIsEnteringLimit(true)} onNo={onNo} />
      )}
      {isEnteringLimit && (
        <ScoreLimitInput
          onSetLimit={onSetLimit}
          onCancel={onNo}
        />
      )}
    </AppModal>
  );
}

export default ScoreLimitModal;
