import { Center as ChakraCenter } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Center = forwardRef((props, ref) => <ChakraCenter ref={ref} {...props} />);
Center.displayName = 'Center';
