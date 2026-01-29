import { IconButton as ChakraIconButton } from '@chakra-ui/react';
import React from 'react';

export const IconButton = React.forwardRef((props, ref) => <ChakraIconButton ref={ref} {...props} />);
IconButton.displayName = 'IconButton';
