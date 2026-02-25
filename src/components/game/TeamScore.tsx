import { Center, Heading, Flex, Text } from '../ui';
import type { TeamScore as TeamScoreType } from '../../types';

import '../../App.css';

interface TeamScoreProps {
  teamName: string;
  scoreObj: TeamScoreType;
  teamClassName?: string;
}

function TeamScore({ teamName, scoreObj, teamClassName }: TeamScoreProps) {
  return (
    <Flex
      direction={'column'}
      style={{ lineHeight: '45px' }}
      className={teamClassName}
    >
      <Center>
        <Heading as={'h2'} size="md" mb={0}>
          {teamName}
        </Heading>
      </Center>
      <Center>
        <Text fontSize={'4xl'}>{scoreObj.teamScore}</Text>
      </Center>
      <Center>
        <Text fontSize={'md'} style={{ lineHeight: '15px' }}>
          {scoreObj.teamBags} bags
        </Text>
      </Center>
    </Flex>
  );
}

export default TeamScore;
