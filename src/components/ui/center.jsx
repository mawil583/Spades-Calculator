import { Center as ChakraCenter } from '@chakra-ui/react';
import React from 'react';

export const Center = React.forwardRef((props, ref) => <ChakraCenter ref={ref} {...props} />);
Center.displayName = 'Center';
