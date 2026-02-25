import {
  createSystem,
  defaultConfig,
  defineRecipe,
  defineSlotRecipe,
} from '@chakra-ui/react';

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

const badgeRecipe = defineRecipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '13px',
    width: '24px',
    height: '24px',
    verticalAlign: 'middle',
  },
  variants: {
    variant: {
      dealer: {
        backgroundColor: 'dealerBadge',
        color: 'offWhite',
      },
    },
  },
  defaultVariants: {
    variant: 'dealer',
  },
});

export const system = createSystem(defaultConfig, {
  theme: {
    recipes: {
      button: buttonRecipe,
      input: inputRecipe,
      badge: badgeRecipe,
    },
    slotRecipes: {
      field: fieldSlotRecipe,
    },
    tokens: {
      colors: {
        team1: { value: team1Color },
        team2: { value: team2Color },
        offWhite: { value: '#F8F9FA' }, // Cleaner off-white
        errorRed: { value: errorRedColor },
        dealerBadge: { value: '#4d3596ff' }, // Richer Purple
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
    ':root': {
      '--app-team1': '{colors.team1}',
      '--app-team2': '{colors.team2}',
      '--app-bg': '{colors.bg}',
      '--app-off-white': '{colors.offWhite}',
      '--app-error-red': '{colors.errorRed}',
      '--app-premium-blue': '{colors.premiumBlue}',
      '--app-dealer-badge': '{colors.dealerBadge}',
      // Typography
      '--app-font-2xs': '10px',
      '--app-font-xs': '12px',
      '--app-font-sm': '14px',
      '--app-font-md': '16px',
      '--app-font-lg': '18px',
      '--app-font-xl': '20px',
      '--app-font-2xl': '24px',
      '--app-font-3xl': '30px',
      // Spacing
      '--app-spacing-0': '0px',
      '--app-spacing-1': '4px',
      '--app-spacing-2': '8px',
      '--app-spacing-3': '12px',
      '--app-spacing-4': '16px',
      '--app-spacing-5': '20px',
      '--app-spacing-6': '24px',
      '--app-spacing-8': '32px',
      '--app-spacing-10': '40px',
      // Radius
      '--app-radius-sm': '4px',
      '--app-radius-md': '8px',
      '--app-radius-lg': '10px',
    },
  },
});
