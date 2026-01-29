import { Flex as ChakraFlex } from '@chakra-ui/react';
import React from 'react';

export const Flex = React.forwardRef((props, ref) => <ChakraFlex ref={ref} {...props} />);
Flex.displayName = 'Flex';
