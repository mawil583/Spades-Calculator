import { extendTheme, defineStyle, defineStyleConfig } from '@chakra-ui/react';

const outline = defineStyle({
  // this applies these styles only to devices that can easily hover (ie. not phones/tablets)
  '@media (hover: hover)': {
    bg: 'gray.700',
    _hover: {
      bg: 'blackAlpha.500',
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
      },
    },
  },
  colors: {
    team1: '#ffc100',
    team2: '#f06c9b',
  },
});
