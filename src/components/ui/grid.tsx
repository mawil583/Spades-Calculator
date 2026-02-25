import {
  SimpleGrid as ChakraSimpleGrid,
  Grid as ChakraGrid,
  GridItem as ChakraGridItem,
  type SimpleGridProps,
  type GridProps,
  type GridItemProps,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

export const SimpleGrid = forwardRef<HTMLDivElement, SimpleGridProps>(
  (props, ref) => <ChakraSimpleGrid ref={ref} {...props} />,
);
SimpleGrid.displayName = 'SimpleGrid';
export const Grid = forwardRef<HTMLDivElement, GridProps>((props, ref) => (
  <ChakraGrid ref={ref} {...props} />
));
Grid.displayName = 'Grid';
export const GridItem = forwardRef<HTMLDivElement, GridItemProps>(
  (props, ref) => <ChakraGridItem ref={ref} {...props} />,
);
GridItem.displayName = 'GridItem';
