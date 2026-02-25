import { Input as ChakraInput, type InputProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => (
  <ChakraInput ref={ref} {...props} />
));
Input.displayName = 'Input';
