import {
  Text as ChakraText,
  Heading as ChakraHeading,
  type TextProps,
  type HeadingProps,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  (props, ref) => <ChakraText ref={ref} {...props} />,
);
Text.displayName = 'Text';
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (props, ref) => <ChakraHeading ref={ref} {...props} />,
);
Heading.displayName = 'Heading';
