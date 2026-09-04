import { useContext, useState } from 'react';
import { Text } from '../ui';
import { GlobalContext } from '../../store/GlobalContext';
import { useFinishedGameScores } from '../../helpers/utils/hooks';
import EditScoreLimitModal from '../modals/EditScoreLimitModal';

/**
 * The board's score-limit readout. Players (not viewers) can click it to set
 * or change the limit; a replacement must beat the would-be winner's score
 * once someone has reached the current limit.
 */
function ScoreLimitDisplay() {
  const { scoreLimit, setScoreLimit, role } = useContext(GlobalContext);
  const { team1, team2 } = useFinishedGameScores();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const leadingScore = Math.max(team1, team2);
  // Once someone has reached the limit, the game is over for them — a new
  // limit must beat the (would-be) winner's current score. With no limit set
  // (or nobody there yet), any positive limit is allowed.
  const minLimit =
    scoreLimit != null && leadingScore >= scoreLimit ? leadingScore : 0;
  const canEdit = role !== 'viewer';

  return (
    <>
      <Text
        as="button"
        fontSize="sm"
        lineHeight="1.2"
        opacity={0.8}
        data-testid="score-limit-display"
        cursor={canEdit ? 'pointer' : 'default'}
        onClick={canEdit ? () => setIsEditOpen(true) : undefined}
        _hover={canEdit ? { textDecoration: 'underline' } : undefined}
        aria-disabled={!canEdit}
      >
        Score limit: {scoreLimit ?? '∞'}
      </Text>
      {canEdit && (
        <EditScoreLimitModal
          isOpen={isEditOpen}
          setIsModalOpen={setIsEditOpen}
          title={scoreLimit == null ? 'Set Score Limit' : 'Edit Score Limit'}
          minLimit={minLimit}
          onSetLimit={setScoreLimit}
        />
      )}
    </>
  );
}

export default ScoreLimitDisplay;
