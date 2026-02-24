import { useRef } from 'react';
import { Button, VStack } from '../ui';
import { AppModal } from '../ui';
import type { BoxProps } from '../ui/box';

interface DealerOption {
  id: string;
  label: string;
}

export interface DealerSelectionModalProps {
  isOpen: boolean;
  onClose: (isOpen: boolean) => void;
  dealerOptions: DealerOption[];
  onSelectDealer: (id: string) => void;
}

const DealerSelectionModal = ({
  isOpen,
  onClose,
  dealerOptions,
  onSelectDealer
}: DealerSelectionModalProps) => {
  const containerRef = useRef(null);

  return (
    <AppModal
      isOpen={isOpen}
      onClose={() => onClose(false)}
      title="Select the dealer"
      initialFocusEl={() => containerRef.current}
      contentProps={{
        'data-cy': 'dealerSelectionModal',
        'data-testid': 'dealerSelectionModal',
      } as BoxProps & Record<`data-${string}`, string>}
    >
      <VStack align="stretch" gap={3} p={2} ref={containerRef} tabIndex={-1} css={{ outline: 'none' }}>
        {dealerOptions.map((opt) => (
          <Button
            key={opt.id}
            data-cy="dealerOptionButton"
            data-testid="dealerOptionButton"
            data-player-id={opt.id}
            onClick={() => onSelectDealer(opt.id)}
            variant="outline"
          >
            {opt.label}
          </Button>
        ))}
        <Button
          data-cy="dealerCancelButton"
          data-testid="dealerCancelButton"
          variant="ghost"
          onClick={() => onClose(false)}
          mt={2}
        >
          Cancel
        </Button>
      </VStack>
    </AppModal>
  );
};

export default DealerSelectionModal;
