import { Container as ChakraContainer } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Container = forwardRef((props, ref) => <ChakraContainer ref={ref} {...props} />);
Container.displayName = 'Container';
