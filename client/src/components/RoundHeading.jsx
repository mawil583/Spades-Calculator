import React from 'react';
import { Center, Heading, Flex, Box } from '@chakra-ui/react';

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
            borderBottom={'1px solid black'}
            mr={'5px'}
            ml={'5px'}
          >
            <Center>{team1Name}</Center>
          </Box>
          <Box
            width={'100%'}
            borderBottom={'1px solid gray'}
            mr={'5px'}
            ml={'5px'}
          >
            <Center>{team2Name}</Center>
          </Box>
        </Flex>
      </Box>
    </div>
  );
}

export default RoundHeading;
