// @ts-nocheck
import { Text as ChakraText, Heading as ChakraHeading } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Text = forwardRef((props, ref) => <ChakraText ref={ref} {...props} />);
Text.displayName = 'Text';
export const Heading = forwardRef((props, ref) => <ChakraHeading ref={ref} {...props} />);
Heading.displayName = 'Heading';
