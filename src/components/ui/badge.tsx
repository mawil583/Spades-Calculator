import { Badge as ChakraBadge, type BadgeProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

/** Custom variants defined in customTheme.ts badgeRecipe */
type CustomBadgeVariant = 'dealer';

export interface CustomBadgeProps extends Omit<BadgeProps, 'variant'> {
  variant?: BadgeProps['variant'] | CustomBadgeVariant;
}

export const Badge = forwardRef<HTMLSpanElement, CustomBadgeProps>((props, ref) => {
  return <ChakraBadge ref={ref} {...(props as BadgeProps)} />;
});

Badge.displayName = 'Badge';
