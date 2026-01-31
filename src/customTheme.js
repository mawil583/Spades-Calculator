import { createSystem, defaultConfig, defineRecipe, defineSlotRecipe } from '@chakra-ui/react';

export const team1Color = '#ffc100';
export const team2Color = '#f06c9b';
export const offWhiteColor = '#ebf5ee';
export const errorRedColor = '#f95050';
export const premiumBlueColor = '#2d3748';

const buttonRecipe = defineRecipe({
  base: {
    transition: 'all 0.2s',
    borderRadius: '10px',
    fontWeight: 'bold',
    letterSpacing: 'wide',
    color: 'white',
    _active: {
      transform: 'scale(0.98)',
    },
  },
  variants: {
    variant: {
      outline: {
        bg: 'premiumBlue',
        border: '1px solid',
        borderColor: 'gray.300', // lighter border for contrast
        color: 'white', // ensure text is white
        _hover: {
          bg: '#1a202c',
          borderColor: 'white',
        },
        _active: {
          bg: 'blackAlpha.700',
        },
      },
      ghost: {
        bg: 'transparent',
        border: 'none',
        color: 'gray.200',
        _hover: {
          bg: 'rgba(255, 255, 255, 0.08)',
          color: 'white',
        },
        _active: {
          bg: 'rgba(255, 255, 255, 0.12)',
        },
      },
      solid: {
        bg: 'blue.600',
        _hover: {
          bg: 'blue.700',
        },
      },
      team1Outline: {
        bg: 'premiumBlue',
        border: '1px solid',
        borderColor: 'team1',
        color: 'team1',
        _hover: {
          bg: '#1a202c',
          borderColor: 'team1',
        },
        _active: {
          bg: 'blackAlpha.700',
        },
      },
      team2Outline: {
        bg: 'premiumBlue',
        border: '1px solid',
        borderColor: 'team2',
        color: 'team2',
        _hover: {
          bg: '#1a202c',
          borderColor: 'team2',
        },
        _active: {
          bg: 'blackAlpha.700',
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
        team1: { value: team1Color },
        team2: { value: team2Color },
        offWhite: { value: offWhiteColor },
        errorRed: { value: errorRedColor },
        dealerBadge: { value: 'rgba(159, 122, 234, 0.3)' },
        premiumBlue: { value: premiumBlueColor },
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
