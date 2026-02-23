import { Text } from '../ui';

const RoundSummarySubHeading = ({ children, color = 'gray.400' }) => (
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
