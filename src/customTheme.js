import { createSystem, defaultConfig, defineRecipe, defineSlotRecipe } from '@chakra-ui/react';

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

const inputRecipe = defineRecipe({
  base: {
    bg: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    _placeholder: {
      color: 'gray.500',
      opacity: 1,
    },
    _focus: {
      borderColor: 'rgba(255, 255, 255, 0.3)',
      boxShadow: 'none',
    },
    _invalid: {
      borderColor: 'red.400',
      boxShadow: '0 0 0 1px {colors.red.400}',
    },
  },
});

const fieldSlotRecipe = defineSlotRecipe({
  slots: ['root', 'label', 'helperText', 'errorText'],
  base: {
    label: {
      color: 'inherit',
      fontSize: '15px',
      fontWeight: '700',
      marginBottom: '6px',
      display: 'block',
      opacity: '0.9',
    },
    errorText: {
      color: 'red.400',
    },
  },
});

export const system = createSystem(defaultConfig, {
  theme: {
    recipes: {
      button: buttonRecipe,
      input: inputRecipe,
    },
    slotRecipes: {
      field: fieldSlotRecipe,
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
      bg: 'bg',
      color: 'gray.50',
      height: '100%',
    },
  },
});
