import { createSystem, defaultConfig, defineRecipe } from '@chakra-ui/react';

const buttonRecipe = defineRecipe({
  base: {
    border: '1px solid',
    borderColor: '#4A5568',
    transition: 'all 0.2s',
    borderRadius: '10px',
    fontWeight: 'bold',
    letterSpacing: 'wide',
  },
  variants: {
    variant: {
      outline: {
        bg: '#2d3748', // Match the dark button background in the image
        color: 'white',
        borderColor: '#4A5568',
        _hover: {
          bg: '#1a202c',
          borderColor: 'white',
        },
        _active: {
          bg: 'blackAlpha.700',
        },
        '@media (hover: none)': {
          _hover: {
            bg: 'transparent',
            transform: 'none',
          },
        },
      },
    },
  },
  defaultVariants: {
    variant: 'outline',
  },
});

export const system = createSystem(defaultConfig, {
  theme: {
    recipes: {
      button: buttonRecipe,
    },
    tokens: {
      colors: {
        team1: { value: '#ffc100' },
        team2: { value: '#f06c9b' },
      },
    },
    semanticTokens: {
      colors: {
        bg: { value: '#252d3d' }, // Closer to the navy blue in the image
        fg: { value: '{colors.gray.50}' },
      },
    },
  },
  globalCss: {
    'html, body': {
      bg: '#252d3d',
      color: 'gray.50',
      height: '100%',
    },
    'input': {
      bg: 'rgba(255, 255, 255, 0.03) !important',
      border: '1px solid rgba(255, 255, 255, 0.1) !important',
      borderRadius: '8px',
      '::placeholder': {
        color: 'gray.500',
        opacity: 1, /* Firefox */
      },
      _focus: {
        borderColor: 'rgba(255, 255, 255, 0.3) !important',
        boxShadow: 'none !important',
      },
      _invalid: {
        borderColor: '#FC8181 !important', // red.300
        boxShadow: '0 0 0 1px #FC8181 !important',
      }
    },
    'label': {
      color: 'inherit !important',
      fontSize: '15px !important',
      fontWeight: '700 !important',
      marginBottom: '6px !important',
      display: 'block',
      opacity: '0.9',
    }
  },
});
