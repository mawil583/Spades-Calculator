'use strict';

import type { PropsWithChildren } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { ColorModeProvider } from './color-mode';
import { system } from '../../customTheme';

export function Provider(props: PropsWithChildren) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
