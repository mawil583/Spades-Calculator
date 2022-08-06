import React from 'react';
import { Center, Heading, Flex, Box } from '@chakra-ui/react';
import { team1Styles, team2Styles } from '../helpers/constants';

function RoundHeading({ roundNumber, team1Name, team2Name }) {
  return (
    <div>
      <Heading size='lg' as={'h3'}>
        Round {roundNumber}
      </Heading>
      <Box>
        <Flex direction={'row'} height={'30px'}>
          <Box
            width={'100%'}
            borderBottom={'1px solid gray'}
            mr={'5px'}
            ml={'5px'}
          >
            <Center style={team1Styles}>{team1Name}</Center>
          </Box>
          <Box
            width={'100%'}
            borderBottom={'1px solid gray'}
            mr={'5px'}
            ml={'5px'}
          >
            <Center style={team2Styles}>{team2Name}</Center>
          </Box>
        </Flex>
      </Box>
    </div>
  );
}

export default RoundHeading;
