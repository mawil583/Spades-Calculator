import React from 'react';
import { SimpleGrid, Center, Heading } from '@chakra-ui/react';

import { team1Styles, team2Styles } from '../helpers/constants';

function RoundSummary({
  team2Name,
  team1Name,
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
        <Center style={team1Styles}>Score: {team1RoundScore}</Center>
        <Center style={team2Styles}>Score: {team2RoundScore}</Center>
        {/* consider adding Game Score and Game bags as accordion */}
        {/* <Center>Game Score: {team1GameScore}</Center>
        <Center>Game Score: {team2GameScore}</Center> */}
        <Center style={team1Styles}>Bags: {team1RoundBags}</Center>
        <Center style={team2Styles}>Bags: {team2RoundBags}</Center>
      </SimpleGrid>
    </div>
  );
}

export default RoundSummary;
