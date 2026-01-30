import { Separator as ChakraSeparator } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Separator = forwardRef((props, ref) => <ChakraSeparator ref={ref} {...props} />);
Separator.displayName = 'Separator';
