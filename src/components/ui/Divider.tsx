import { Center } from '@chakra-ui/react';

function Divider({ className }: { className?: string }) {
  return (
    <Center className={className}>
      <hr style={{ width: '60%', color: 'var(--chakra-colors-gray-500)' }} />
    </Center>
  );
}

export default Divider;
