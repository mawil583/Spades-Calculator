import { Box as ChakraBox } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Box = forwardRef((props, ref) => <ChakraBox ref={ref} {...props} />);
Box.displayName = 'Box';
