import { Text, Stack } from "../ui";
import RoundSummarySubHeading from "./RoundSummarySubHeading";

import type { ReactNode } from "react";

interface RoundSummaryFieldProps {
  label: string;
  value?: string | number;
  color?: string;
  children?: ReactNode;
}

const RoundSummaryField = ({
  label,
  value,
  color,
  children,
}: RoundSummaryFieldProps) => (
  <Stack gap="var(--app-spacing-0)" alignItems="center" width="full">
    <RoundSummarySubHeading>{label}</RoundSummarySubHeading>
    <Text as="div" fontSize="var(--app-font-lg)" color={color}>
      {value ?? children}
    </Text>
  </Stack>
);

export default RoundSummaryField;
