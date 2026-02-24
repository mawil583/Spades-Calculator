import {
  Separator as ChakraSeparator,
  type SeparatorProps,
} from "@chakra-ui/react";
import { forwardRef } from "react";

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  (props, ref) => <ChakraSeparator ref={ref} {...props} />,
);
Separator.displayName = "Separator";
