import React from 'react';
import { Center } from '@chakra-ui/react';

function Divider({ className }) {
  return (
    <Center className={className}>
      <hr style={{ width: '60%', color: '#808080' }} />
    </Center>
  );
}

export default Divider;
