import { Button as ChakraButton } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Button = forwardRef((props, ref) => {
  const { ...rest } = props;
  return <ChakraButton ref={ref} {...rest} />;
});
Button.displayName = 'Button';
