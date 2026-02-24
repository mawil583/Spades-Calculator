
import { Heading, Text, Flex } from '../ui';

interface SettingDescriptionProps {
  title: string;
  desc: string | React.ReactNode;
}

function SettingDescription({ title, desc }: SettingDescriptionProps) {
  return (
    <Flex flexDirection={'column'} mb={4}>
      <Heading fontSize='xl'>{title}</Heading>
      <Text mt={4}>{desc}</Text>
    </Flex>
  );
}

export default SettingDescription;
