import { Text as ChakraText, Heading as ChakraHeading } from '@chakra-ui/react';
import React from 'react';

export const Text = React.forwardRef((props, ref) => <ChakraText ref={ref} {...props} />);
Text.displayName = 'Text';
export const Heading = React.forwardRef((props, ref) => <ChakraHeading ref={ref} {...props} />);
Heading.displayName = 'Heading';
