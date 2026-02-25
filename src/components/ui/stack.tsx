import {
  Stack as ChakraStack,
  VStack as ChakraVStack,
  HStack as ChakraHStack,
  type StackProps,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Stack = forwardRef<HTMLDivElement, StackProps>((props, ref) => (
  <ChakraStack ref={ref} {...props} />
));
Stack.displayName = 'Stack';
export const VStack = forwardRef<HTMLDivElement, StackProps>((props, ref) => (
  <ChakraVStack ref={ref} {...props} />
));
VStack.displayName = 'VStack';
export const HStack = forwardRef<HTMLDivElement, StackProps>((props, ref) => (
  <ChakraHStack ref={ref} {...props} />
));
HStack.displayName = 'HStack';
