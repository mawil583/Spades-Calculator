import { Badge as ChakraBadge } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Badge = forwardRef((props, ref) => {
  return <ChakraBadge ref={ref} {...props} />;
});

Badge.displayName = 'Badge';
