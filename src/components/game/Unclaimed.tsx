import { useContext, useState } from 'react';
import { Text, Flex } from '../ui';
import { getUnclaimedText } from '../../helpers/utils/helperFunctions';
import { useFeatureFlag } from '../../helpers/utils/useFeatureFlag';
import { FEATURE_FLAGS } from '../../helpers/utils/featureFlags';
import { useGameScores } from '../../helpers/utils/hooks';
import { GlobalContext } from '../../store/GlobalContext';
import EditScoreLimitModal from '../modals/EditScoreLimitModal';

interface UnclaimedProps {
  numUnclaimed: number;
}

function Unclaimed({ numUnclaimed }: UnclaimedProps) {
  const [useTableRoundUI] = useFeatureFlag(FEATURE_FLAGS.TABLE_ROUND_UI);
  const { scoreLimit, setScoreLimit, role } = useContext(GlobalContext);
  const { team1Score, team2Score } = useGameScores();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const text = getUnclaimedText(numUnclaimed, useTableRoundUI);
  const leadingScore = Math.max(
    team1Score.teamScore,
    team2Score.teamScore,
  );
  // Once someone has reached the limit, the game is over for them — a new
  // limit must beat the (would-be) winner's current score. With no limit set
  // (or nobody there yet), any positive limit is allowed.
  const minLimit =
    scoreLimit != null && leadingScore >= scoreLimit ? leadingScore : 0;
  const canEdit = role !== 'viewer';

  return (
    <Flex direction="column" align="center">
      <Text>{text}</Text>
      <Text
        fontSize="sm"
        opacity={0.8}
        data-testid="score-limit-display"
        cursor={canEdit ? 'pointer' : 'default'}
        onClick={canEdit ? () => setIsEditOpen(true) : undefined}
        _hover={canEdit ? { textDecoration: 'underline' } : undefined}
        role={canEdit ? 'button' : undefined}
      >
        Score limit: {scoreLimit ?? '∞'}
      </Text>
      {canEdit && (
        <EditScoreLimitModal
          isOpen={isEditOpen}
          setIsModalOpen={setIsEditOpen}
          minLimit={minLimit}
          onSetLimit={setScoreLimit}
        />
      )}
    </Flex>
  );
}

export default Unclaimed;
