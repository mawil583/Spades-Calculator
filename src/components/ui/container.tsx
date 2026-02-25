import {
  Container as ChakraContainer,
  type ContainerProps,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (props, ref) => <ChakraContainer ref={ref} {...props} />,
);
Container.displayName = 'Container';
