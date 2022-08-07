import React, { useState } from 'react';
import { Text, Radio, RadioGroup, Stack, IconButton } from '@chakra-ui/react';
import { QuestionIcon } from '@chakra-ui/icons';

import {
  TAKES_BAGS,
  HELPS_TEAM_BID,
  NO_BAGS_NO_HELP,
} from '../helpers/constants';
import { useLocalStorage } from '../helpers/hooks';
import ScoreSettingsModal from './ScoreSettingsModal';

function ScoreSetting() {
  const [nilRule, setNilRule] = useLocalStorage('nilScoringRule', TAKES_BAGS);
  const [isOpen, setIsModalOpen] = useState(false);
  const handleClick = () => {
    setIsModalOpen(true);
  };
  return (
    <>
      <ScoreSettingsModal isOpen={isOpen} setIsModalOpen={setIsModalOpen} />
      <Text fontSize='lg' mt={3}>
        Select your preferred scoring rules for failed nil.{' '}
        {
          <IconButton
            style={{ height: 'auto', verticalAlign: 'baseline' }}
            size='lg'
            variant='ghost'
            onClick={handleClick}
            icon={<QuestionIcon />}
          />
        }
      </Text>
      <RadioGroup onChange={setNilRule} value={nilRule}>
        <Stack>
          <Radio value={TAKES_BAGS}>Takes Bags</Radio>
          <Radio value={HELPS_TEAM_BID}>Helps Team Bid</Radio>
          <Radio value={NO_BAGS_NO_HELP}>No Bags/No Help</Radio>
        </Stack>
      </RadioGroup>
    </>
  );
}

export default ScoreSetting;
