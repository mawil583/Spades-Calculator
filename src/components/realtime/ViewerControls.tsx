import { AppModal, Button, Text, Stack } from '../ui';
import { GlobalContext } from '../../store/GlobalContext';
import { SEAT_ORDER } from '../../helpers/utils/perspective';
import { useContext } from 'react';
import type { Seat as SeatType, Names } from '../../types';

interface ViewerControlsProps {
  isOpen: boolean;
  onClose: () => void;
}

const SEAT_KEY: Record<SeatType, keyof Names> = {
  t1p1: 't1p1Name',
  t1p2: 't1p2Name',
  t2p1: 't2p1Name',
  t2p2: 't2p2Name',
};

/**
 * Modal seat-picker for a read-only viewer. Opens automatically on first load
 * (and from the Header hamburger menu). When the viewer picks a seat on Team 2,
 * the whole board is mirrored (team swap) so they see it from their own
 * perspective.
 */
const ViewerControls = ({ isOpen, onClose }: ViewerControlsProps) => {
  const { names, seat, setSeat } = useContext(GlobalContext);

  const handleSelect = (s: SeatType) => {
    setSeat(s);
    onClose();
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title="Your seat"
      bodyStyle={{ pt: 4, px: 5, pb: 5 }}
    >
      <Stack gap={3}>
        <Text fontSize="sm" color="offWhite">
          Choose which seat you are sitting at. The board will rotate to match
          your perspective.
        </Text>
        {SEAT_ORDER.map((s) => (
          <Button
            key={s}
            onClick={() => handleSelect(s)}
            variant={seat === s ? 'primary' : 'secondary'}
            width="full"
            justifyContent="center"
          >
            <Text fontSize="sm">{names[SEAT_KEY[s]]}</Text>
          </Button>
        ))}
      </Stack>
    </AppModal>
  );
};

export default ViewerControls;
