import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

import ButtonGrid from './ButtonGrid';

function InputModal({
  isCurrent,
  playerName,
  isOpen,
  setIsModalOpen,
  type,
  setRound,
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
        <ModalOverlay />
        <ModalContent>
          <ModalHeader style={{ color: 'black' }}>
            Select {playerName}'s {type}
          </ModalHeader>
          <ModalCloseButton style={{ color: 'black' }} />
          <ModalBody style={{ padding: '5px' }}>
            <ButtonGrid
              isCurrent={isCurrent}
              setRound={setRound}
              fieldToUpdate={fieldToUpdate}
              currentRound={currentRound}
              setIsModalOpen={setIsModalOpen}
              type={type}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default InputModal;
