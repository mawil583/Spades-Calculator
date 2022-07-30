import React from 'react';
import { Box, Text, Flex, Center, SimpleGrid } from '@chakra-ui/react';

function SettingExample({ score, bags, p1Bid, p1Actual, p2Bid, p2Actual }) {
  return (
    <>
      <SimpleGrid columns={2} style={{ marginBottom: '10px' }}>
        <Box borderBottom={'1px solid black'} mr={'5px'} ml={'5px'}>
          <Center>Teammate 1</Center>
        </Box>
        <Box borderBottom={'1px solid gray'} mr={'5px'} ml={'5px'}>
          <Center>Teammate 2</Center>
        </Box>
        <Box mr={'5px'} ml={'5px'}>
          <Text>
            Bid: <strong>{p1Bid}</strong>
          </Text>
          <Text>
            Made: <strong>{p1Actual}</strong>
          </Text>
        </Box>
        <Box mr={'5px'} ml={'5px'}>
          <Text>
            Bid: <strong>{p2Bid}</strong>
          </Text>
          <Text>
            Made: <strong>{p2Actual}</strong>
          </Text>
        </Box>
      </SimpleGrid>
      <Box mr={'5px'} ml={'5px'} mb={6}>
        <Flex direction={'row'} justifyContent={'center'}>
          <Text style={{ fontSize: '18px' }}>
            Score: <strong>{score}</strong>
          </Text>
          <Text style={{ marginLeft: '10px', fontSize: '18px' }}>
            Bags: <strong>{bags}</strong>
          </Text>
        </Flex>
      </Box>
    </>
  );
}

export default SettingExample;
