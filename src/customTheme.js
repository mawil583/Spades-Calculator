import { extendTheme, defineStyle, defineStyleConfig } from '@chakra-ui/react';

const outline = defineStyle({
  bg: 'gray.700',
  _hover: {
    bg: 'blackAlpha.500',
  },
  _active: {
    bg: 'blackAlpha.500',
  },
  // this applies style only to devices that can NOT easily hover (ie. phones/tablets)
  '@media (hover: none)': {
    _hover: {
      bg: 'gray.700',
    },
    _active: {
      bg: 'gray.700',
    },
  },
});

const Button = defineStyleConfig({
  variants: { outline },
  defaultProps: {
    variant: 'outline',
  },
  baseStyle: {
    border: '1px solid #ebf5ee',
  },
});

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

export const customTheme = extendTheme({
  config,
  components: { Button },
  styles: {
    global: {
      // styles for the html <body>
      'html, body': {
        bg: 'gray.700',
        color: 'gray.50',
        bgColor: 'gray.700',
        height: '100%',
      },
    },
  },
  colors: {
    team1: '#ffc100',
    team2: '#f06c9b',
  },
});
