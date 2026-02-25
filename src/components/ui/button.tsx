import { Button as ChakraButton, type ButtonProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

/** Custom variants defined in customTheme.ts buttonRecipe */
type CustomButtonVariant = 'team1Outline' | 'team2Outline';

export interface CustomButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: ButtonProps['variant'] | CustomButtonVariant;
}

export const Button = forwardRef<HTMLButtonElement, CustomButtonProps>(
  (props, ref) => {
    return <ChakraButton ref={ref} {...(props as ButtonProps)} />;
  },
);
Button.displayName = 'Button';
