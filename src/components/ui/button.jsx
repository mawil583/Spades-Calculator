import { Button as ChakraButton } from '@chakra-ui/react';
import React from 'react';

export const Button = React.forwardRef((props, ref) => {
  const { ...rest } = props;
  return <ChakraButton ref={ref} {...rest} />;
});
Button.displayName = 'Button';
