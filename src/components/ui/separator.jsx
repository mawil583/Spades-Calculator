import { Separator as ChakraSeparator } from '@chakra-ui/react';
import React from 'react';

export const Separator = React.forwardRef((props, ref) => <ChakraSeparator ref={ref} {...props} />);
Separator.displayName = 'Separator';
