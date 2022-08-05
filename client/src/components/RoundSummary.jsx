import React from 'react';
import { SimpleGrid, Center, Heading } from '@chakra-ui/react';

function RoundSummary({
  team1RoundScore,
  team2RoundScore,
  // team1GameScore,
  // team2GameScore,
  team1RoundBags,
  team2RoundBags,
}) {
  return (
    <div>
      <Center>
        <Heading mt={'20px'} mb={'10px'} size={'lg'}>
          Round Summary
        </Heading>
      </Center>
      <SimpleGrid columns={2} className='namesContainer'>
        <Center>Score: {team1RoundScore}</Center>
        <Center>Score: {team2RoundScore}</Center>
        {/* consider adding Game Score and Game bags as accordion */}
        {/* <Center>Game Score: {team1GameScore}</Center>
        <Center>Game Score: {team2GameScore}</Center> */}
        <Center>Bags: {team1RoundBags}</Center>
        <Center>Bags: {team2RoundBags}</Center>
      </SimpleGrid>
    </div>
  );
}

export default RoundSummary;
