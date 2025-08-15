import React from 'react';
import { Center, Heading, Flex, Box } from '@chakra-ui/react';
import { team1Styles, team2Styles } from '../../helpers/utils/constants';

function RoundHeading({ roundNumber, names }) {
  return (
    <div>
      <Heading style={{ fontSize: '25px' }} as={'h3'}>
        Round {roundNumber}
      </Heading>
      <Box mb={'8px'}>
        <Flex direction={'row'} height={'30px'}>
          <Box
            width={'100%'}
            borderBottom={'1px solid gray'}
            mr={'5px'}
            ml={'5px'}
          >
            <Center style={team1Styles}>
              <Heading size="15px">{names.team1Name}</Heading>
            </Center>
          </Box>
          <Box
            width={'100%'}
            borderBottom={'1px solid gray'}
            mr={'5px'}
            ml={'5px'}
          >
            <Center style={team2Styles}>
              <Heading size="15px">{names.team2Name}</Heading>
            </Center>
          </Box>
        </Flex>
      </Box>
    </div>
  );
}

export default RoundHeading;
