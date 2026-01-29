import { SimpleGrid as ChakraSimpleGrid, Grid as ChakraGrid, GridItem as ChakraGridItem } from '@chakra-ui/react';
import React from 'react';

export const SimpleGrid = React.forwardRef((props, ref) => <ChakraSimpleGrid ref={ref} {...props} />);
SimpleGrid.displayName = 'SimpleGrid';
export const Grid = React.forwardRef((props, ref) => <ChakraGrid ref={ref} {...props} />);
Grid.displayName = 'Grid';
export const GridItem = React.forwardRef((props, ref) => <ChakraGridItem ref={ref} {...props} />);
GridItem.displayName = 'GridItem';
