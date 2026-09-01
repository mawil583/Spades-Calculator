import { AppModal } from '../ui';
import ScoreLimitInput from '../forms/ScoreLimitInput';
import type { BoxProps } from '../ui/box';

interface EditScoreLimitModalProps {
  isOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  /** "Edit" when a limit exists, "Set" when there is none yet. */
  title?: string;
  /** The floor the new limit must clear (winner's current score, or 0). */
  minLimit: number;
  onSetLimit: (limit: number) => void;
}

function EditScoreLimitModal({
  isOpen,
  setIsModalOpen,
  title = 'Edit Score Limit',
  minLimit,
  onSetLimit,
}: EditScoreLimitModalProps) {
  return (
    <AppModal
      isOpen={isOpen}
      onClose={setIsModalOpen}
      title={title}
      contentProps={
        { 'data-testid': 'edit-score-limit-modal' } as BoxProps &
          Record<`data-${string}`, string>
      }
    >
      <ScoreLimitInput
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
