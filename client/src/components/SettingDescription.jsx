import React from 'react';
import { Heading, Text, Flex } from '@chakra-ui/react';

function SettingDescription({ title, desc }) {
  return (
    <Flex flexDirection={'column'} mb={4}>
      <Heading fontSize='xl'>{title}</Heading>
      <Text mt={4}>{desc}</Text>
    </Flex>
  );
}

export default SettingDescription;
