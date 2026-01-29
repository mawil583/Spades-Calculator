import { Container as ChakraContainer } from '@chakra-ui/react';
import React from 'react';

export const Container = React.forwardRef((props, ref) => <ChakraContainer ref={ref} {...props} />);
Container.displayName = 'Container';
