import { Text, Flex } from '../ui';
import { getUnclaimedText } from '../../helpers/utils/helperFunctions';
import { useFeatureFlag } from '../../helpers/utils/useFeatureFlag';
import { FEATURE_FLAGS } from '../../helpers/utils/featureFlags';
import ScoreLimitDisplay from './ScoreLimitDisplay';

interface UnclaimedProps {
  numUnclaimed: number;
}

function Unclaimed({ numUnclaimed }: UnclaimedProps) {
  const [useTableRoundUI] = useFeatureFlag(FEATURE_FLAGS.TABLE_ROUND_UI);

  const text = getUnclaimedText(numUnclaimed, useTableRoundUI);

  return (
    <Flex direction="column" align="center" gap={0.5}>
      <Text lineHeight="1.2">{text}</Text>
      <ScoreLimitDisplay />
    </Flex>
  );
}

export default Unclaimed;
