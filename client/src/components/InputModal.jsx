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
        <ModalOverlay />
        <ModalContent>
          <ModalHeader style={{ backgroundColor: '#464f51', color: '#ebf5ee' }}>
            Select {playerName}'s {type}
          </ModalHeader>
          <ModalCloseButton style={{ color: '#ebf5ee' }} />
          <ModalBody style={{ padding: '5px', backgroundColor: '#464f51' }}>
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
      </Modal>
    </>
  );
}

export default InputModal;
