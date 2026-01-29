import { Box as ChakraBox } from '@chakra-ui/react';
import React from 'react';

export const Box = React.forwardRef((props, ref) => <ChakraBox ref={ref} {...props} />);
Box.displayName = 'Box';
