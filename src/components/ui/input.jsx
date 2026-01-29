import { Input as ChakraInput } from '@chakra-ui/react';
import React from 'react';

export const Input = React.forwardRef((props, ref) => <ChakraInput ref={ref} {...props} />);
Input.displayName = 'Input';
