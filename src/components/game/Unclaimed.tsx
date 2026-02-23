
import { Text, Center } from '../ui';
import { getUnclaimedText } from '../../helpers/utils/helperFunctions';
import { useFeatureFlag } from '../../helpers/utils/useFeatureFlag';
import { FEATURE_FLAGS } from '../../helpers/utils/featureFlags';

function Unclaimed({ numUnclaimed }) {
  const [useTableRoundUI] = useFeatureFlag(FEATURE_FLAGS.TABLE_ROUND_UI);
  const text = getUnclaimedText(numUnclaimed, useTableRoundUI);
  return (
    <Center>
      <Text>{text}</Text>
    </Center>
  );
}

export default Unclaimed;
