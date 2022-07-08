import React from 'react';
import { Center, Heading, Flex, Text } from '@chakra-ui/react';

function TeamScore({ teamName, teamScore, teamBags }) {
  return (
    <Flex direction={'column'}>
      <Center>
        <Heading as={'h2'} size='md'>
          {teamName}
        </Heading>
      </Center>
      <Center>
        <Text fontSize={'5xl'}>{teamScore}</Text>
      </Center>
      <Center>
        <Text fontSize={'md'}>{teamBags} bags</Text>
      </Center>
    </Flex>
  );
}

export default TeamScore;
