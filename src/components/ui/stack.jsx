import { Stack as ChakraStack, VStack as ChakraVStack, HStack as ChakraHStack } from '@chakra-ui/react';
import React from 'react';

export const Stack = React.forwardRef((props, ref) => <ChakraStack ref={ref} {...props} />);
Stack.displayName = 'Stack';
export const VStack = React.forwardRef((props, ref) => <ChakraVStack ref={ref} {...props} />);
VStack.displayName = 'VStack';
export const HStack = React.forwardRef((props, ref) => <ChakraHStack ref={ref} {...props} />);
HStack.displayName = 'HStack';
