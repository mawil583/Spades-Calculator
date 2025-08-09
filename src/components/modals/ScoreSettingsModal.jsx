import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { SettingDescription, SettingExample } from '../game';

function ScoreSettingsModal({ isOpen, setIsModalOpen }) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Score Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody style={{ padding: '5px' }}>
            <SettingDescription />
            <SettingExample />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ScoreSettingsModal;
