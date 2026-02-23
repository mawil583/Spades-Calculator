// @ts-nocheck
import { Input as ChakraInput } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Input = forwardRef((props, ref) => <ChakraInput ref={ref} {...props} />);
Input.displayName = 'Input';
