import React, { useEffect } from 'react';
import { Text, Radio, RadioGroup } from '@chakra-ui/react';

import {
  TAKES_BAGS,
  HELPS_TEAM_BID,
  NO_BAGS_NO_HELP,
} from '../helpers/constants';
import { useLocalStorage } from '../helpers/hooks';

function ScoreSetting() {
  const [nilRule, setNilRule] = useLocalStorage('nilScoringRule', TAKES_BAGS);

  useEffect(() => {
    setNilRule(TAKES_BAGS);
  }, []);
  return (
    <>
      <Text>Select your preferred scoring rules for nil.</Text>
      <RadioGroup onChange={setNilRule} value={nilRule}>
        <Radio value={TAKES_BAGS}>Takes Bags</Radio>
        <Radio value={HELPS_TEAM_BID}>Helps Team Bid</Radio>
        <Radio value={NO_BAGS_NO_HELP}>No Bags/No Help</Radio>
      </RadioGroup>
    </>
  );
}

export default ScoreSetting;
