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
          <ModalHeader>
            Select {playerName}'s {type}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody style={{ padding: '5px' }}>
            <ButtonGrid
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
