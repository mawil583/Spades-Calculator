import { IconButton as ChakraIconButton } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const IconButton = forwardRef((props, ref) => <ChakraIconButton ref={ref} {...props} />);
IconButton.displayName = 'IconButton';
