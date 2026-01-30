import { SimpleGrid as ChakraSimpleGrid, Grid as ChakraGrid, GridItem as ChakraGridItem } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const SimpleGrid = forwardRef((props, ref) => <ChakraSimpleGrid ref={ref} {...props} />);
SimpleGrid.displayName = 'SimpleGrid';
export const Grid = forwardRef((props, ref) => <ChakraGrid ref={ref} {...props} />);
Grid.displayName = 'Grid';
export const GridItem = forwardRef((props, ref) => <ChakraGridItem ref={ref} {...props} />);
GridItem.displayName = 'GridItem';
