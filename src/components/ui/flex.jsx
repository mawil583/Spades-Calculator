import { Flex as ChakraFlex } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Flex = forwardRef((props, ref) => <ChakraFlex ref={ref} {...props} />);
Flex.displayName = 'Flex';
