import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

import { ButtonGrid } from '../ui';

function InputModal({
  index,
  isCurrent,
  playerName,
  isOpen,
  setIsModalOpen,
  type,
  fieldToUpdate,
  currentRound,
  roundHistory,
  onCustomUpdate,
}) {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        returnFocusOnClose={false}
      >
        <div>
          <ModalOverlay />
          <ModalContent
            data-cy="bidSelectionModal"
            data-testid="bidSelectionModal"
          >
            <ModalHeader>
              Select {playerName}&apos;s {type}
            </ModalHeader>
            <ModalCloseButton style={{ color: '#ebf5ee' }} />
            <ModalBody style={{ padding: '5px' }}>
              <ButtonGrid
                isCurrent={isCurrent}
                fieldToUpdate={fieldToUpdate}
                currentRound={currentRound}
                roundHistory={roundHistory}
                setIsModalOpen={setIsModalOpen}
                type={type}
                index={index}
                onCustomUpdate={onCustomUpdate}
              />
            </ModalBody>
          </ModalContent>
        </div>
      </Modal>
    </>
  );
}

export default InputModal;
