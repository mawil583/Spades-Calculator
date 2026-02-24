import { IconButton as ChakraIconButton, type IconButtonProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => <ChakraIconButton ref={ref} {...props} />);
IconButton.displayName = 'IconButton';
