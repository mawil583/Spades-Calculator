import { Center as ChakraCenter, type CenterProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Center = forwardRef<HTMLDivElement, CenterProps>((props, ref) => <ChakraCenter ref={ref} {...props} />);
Center.displayName = 'Center';
