import React from 'react';
import { Center, Heading, Flex, Box } from '@chakra-ui/react';
import { team1Styles, team2Styles } from '../helpers/constants';

function RoundHeading({ roundNumber, team1Name, team2Name }) {
  return (
    <div>
      <Heading style={{ fontSize: '25px' }} as={'h3'}>
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
            <Center style={team1Styles}>
              <Heading size='15px'>{team1Name}</Heading>
            </Center>
          </Box>
          <Box
            width={'100%'}
            borderBottom={'1px solid gray'}
            mr={'5px'}
            ml={'5px'}
          >
            <Center style={team2Styles}>
              <Heading size='15px'>{team2Name}</Heading>
            </Center>
          </Box>
        </Flex>
      </Box>
    </div>
  );
}

export default RoundHeading;
