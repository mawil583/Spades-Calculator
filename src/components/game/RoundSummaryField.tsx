import { Text, Stack } from '../ui';
import RoundSummarySubHeading from './RoundSummarySubHeading';

const RoundSummaryField = ({ label, value, color, children }) => (
  <Stack gap="var(--app-spacing-0)" alignItems="center" width="full">
    <RoundSummarySubHeading>{label}</RoundSummarySubHeading>
    <Text as="div" fontSize="var(--app-font-lg)" color={color}>
      {value ?? children}
    </Text>
  </Stack>
);

export default RoundSummaryField;
