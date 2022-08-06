import React from 'react';
import { Center, Heading, Flex, Text } from '@chakra-ui/react';

import { getTeamClassName } from '../helpers/helperFunctions';
import '../App.css';

function TeamScore({ teamName, teamScore, teamBags }) {
  const className = getTeamClassName(teamName);
  return (
    <Flex
      direction={'column'}
      style={{ lineHeight: '45px' }}
      className={className}
    >
      <Center>
        <Heading as={'h2'} size='md' mb={0}>
          {teamName}
        </Heading>
      </Center>
      <Center>
        <Text fontSize={'4xl'}>{teamScore}</Text>
      </Center>
      <Center>
        <Text fontSize={'md'} style={{ lineHeight: '15px' }}>
          {teamBags} bags
        </Text>
      </Center>
    </Flex>
  );
}

export default TeamScore;
