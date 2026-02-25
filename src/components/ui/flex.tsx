import { Flex as ChakraFlex, type FlexProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Flex = forwardRef<HTMLDivElement, FlexProps>((props, ref) => (
  <ChakraFlex ref={ref} {...props} />
));
Flex.displayName = 'Flex';
