import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Divider,
} from '@chakra-ui/react';

import ActualSection from './ActualSection';

function ActualsValidationModal({
  isOpen,
  setIsValid,
  totalActuals,
  index,
  setRound,
  t1p1Name,
  t1p2Name,
  t2p1Name,
  t2p2Name,
  isCurrent,
  roundHistory,
  currentRound,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsValid(true);
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Total actuals must equal 13. The actuals you've entered add up to{' '}
          {totalActuals}
        </ModalHeader>
        <ModalCloseButton />
        <Divider />
        <ModalBody style={{ padding: '5px' }}>
          <ActualSection
            index={index}
            setRound={setRound}
            t1p1Name={t1p1Name}
            t1p2Name={t1p2Name}
            t2p1Name={t2p1Name}
            t2p2Name={t2p2Name}
            isCurrent={isCurrent}
            roundHistory={roundHistory}
            currentRound={currentRound}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ActualsValidationModal;
