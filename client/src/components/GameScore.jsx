import React from 'react';
import {
  Container,
  Stack,
  HStack,
  VStack,
  Button,
  SimpleGrid,
  Center,
  Heading,
  Flex,
  Text,
} from '@chakra-ui/react';

function GameScore({ formVals, team1Score, team1Bags, team2Score, team2Bags }) {
  return (
    <Container py={10} borderBottom={'1px solid black'}>
      <Center>
        <Heading as='h2' size='lg' style={{ textDecoration: 'underline' }}>
          Score
        </Heading>
      </Center>
      <SimpleGrid columns={2}>
        <Flex direction={'column'}>
          <Center>
            <Heading as={'h2'} size='md'>
              {formVals.team1Name}
            </Heading>
          </Center>
          <Center>
            <Text fontSize={'5xl'}>{team1Score}</Text>
          </Center>
          <Center>
            <Text fontSize={'md'}>{team1Bags} bags</Text>
          </Center>
        </Flex>
        <Flex direction={'column'}>
          <Center>
            <Heading as={'h2'} size='md'>
              {formVals.team2Name}
            </Heading>
          </Center>
          <Center>
            <Text fontSize={'5xl'}>{team2Score}</Text>
          </Center>
          <Center>
            <Text fontSize={'md'}>{team2Bags} bags</Text>
          </Center>
        </Flex>
      </SimpleGrid>
    </Container>
  );
}

export default GameScore;
