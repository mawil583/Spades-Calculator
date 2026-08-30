import { AppModal } from '../ui';
import NewScoreLimitInput from '../forms/NewScoreLimitInput';
import type { BoxProps } from '../ui/box';

interface EditScoreLimitModalProps {
  isOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  /** The floor the new limit must clear (winner's current score, or 0). */
  minLimit: number;
  onSetLimit: (limit: number) => void;
}

function EditScoreLimitModal({
  isOpen,
  setIsModalOpen,
  minLimit,
  onSetLimit,
}: EditScoreLimitModalProps) {
  return (
    <AppModal
      isOpen={isOpen}
      onClose={setIsModalOpen}
      title="Edit Score Limit"
      contentProps={
        { 'data-testid': 'edit-score-limit-modal' } as BoxProps &
          Record<`data-${string}`, string>
      }
    >
      <NewScoreLimitInput
        minLimit={minLimit}
        onSetLimit={(limit) => {
          onSetLimit(limit);
          setIsModalOpen(false);
        }}
        onCancel={() => setIsModalOpen(false)}
      />
    </AppModal>
  );
}

export default EditScoreLimitModal;
