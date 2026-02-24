import { Box as ChakraBox, type BoxProps } from "@chakra-ui/react";
import { forwardRef } from "react";

export type { BoxProps };

export const Box = forwardRef<HTMLDivElement, BoxProps>((props, ref) => (
  <ChakraBox ref={ref} {...props} />
));
Box.displayName = "Box";
