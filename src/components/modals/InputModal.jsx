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
}) {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      >
        <div data-cy="bidSelectionModal">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              Select {playerName}'s {type}
            </ModalHeader>
            <ModalCloseButton style={{ color: '#ebf5ee' }} />
            <ModalBody style={{ padding: '5px' }}>
              <ButtonGrid
                isCurrent={isCurrent}
                fieldToUpdate={fieldToUpdate}
                currentRound={currentRound}
                setIsModalOpen={setIsModalOpen}
                type={type}
                index={index}
              />
            </ModalBody>
          </ModalContent>
        </div>
      </Modal>
    </>
  );
}

export default InputModal;
