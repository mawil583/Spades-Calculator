import { Stack as ChakraStack, VStack as ChakraVStack, HStack as ChakraHStack } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Stack = forwardRef((props, ref) => <ChakraStack ref={ref} {...props} />);
Stack.displayName = 'Stack';
export const VStack = forwardRef((props, ref) => <ChakraVStack ref={ref} {...props} />);
VStack.displayName = 'VStack';
export const HStack = forwardRef((props, ref) => <ChakraHStack ref={ref} {...props} />);
HStack.displayName = 'HStack';
