import { Text } from "../ui";

import type { ReactNode } from "react";

interface RoundSummarySubHeadingProps {
  children: ReactNode;
  color?: string;
}

const RoundSummarySubHeading = ({
  children,
  color = "gray.400",
}: RoundSummarySubHeadingProps) => (
  <Text
    color={color}
    fontSize="var(--app-font-xs)"
    fontWeight="bold"
    textTransform="uppercase"
  >
    {children}
  </Text>
);

export default RoundSummarySubHeading;
