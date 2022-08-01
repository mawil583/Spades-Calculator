import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Divider,
  Button,
  Collapse,
  Text,
  Flex,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { defaultNames } from '../helpers/constants';

function WarningModal({
  isOpen,
  setIsModalOpen,
  setRoundHistory,
  hasRoundHistory,
}) {
  const navigate = useNavigate();
  const [isDataWarningQuestionVisible, setIsDataWarningQuestionVisible] =
    useState(hasRoundHistory ? true : false);
  const [isNewPlayerQuestionVisible, setIsNewPlayerQuestionVisible] = useState(
    isDataWarningQuestionVisible ? false : true
  );

  useEffect(() => {
    if (hasRoundHistory) {
      setIsDataWarningQuestionVisible(true);
      setIsNewPlayerQuestionVisible(false);
    }
  }, [hasRoundHistory]);

  const onCancel = () => {
    setIsModalOpen(false);
  };
  const onContinue = () => {
    setIsDataWarningQuestionVisible(false);
    setIsNewPlayerQuestionVisible(true);
    setRoundHistory([]);
  };
  const onSameTeams = () => {
    setIsDataWarningQuestionVisible(false);
    setIsNewPlayerQuestionVisible(true);
    setIsModalOpen(false);
  };
  const onDifferentTeams = () => {
    localStorage.setItem('names', JSON.stringify(defaultNames));
    setIsNewPlayerQuestionVisible(false);
    setIsModalOpen(false);
    navigate('/');
  };

  const DataWarningQuestion = () => {
    return (
      <Collapse in={isDataWarningQuestionVisible}>
        <ModalHeader>Are you sure?</ModalHeader>
        <ModalCloseButton />
        <Divider />
        <ModalBody style={{ padding: '15px' }}>
          <Text style={{ marginBottom: '10px' }}>
            This will permanently delete your game data.
          </Text>
          <Flex direction={'row'} justifyContent={'space-between'}>
            <Button onClick={onCancel}>Cancel</Button>
            <Button onClick={onContinue}>Continue</Button>
          </Flex>
        </ModalBody>
      </Collapse>
    );
  };
  const NewPlayerQuestion = () => {
    return (
      <Collapse in={isNewPlayerQuestionVisible}>
        <ModalHeader>Would you like to keep the same teams?</ModalHeader>
        <Divider />
        <ModalBody style={{ padding: '15px' }}>
          <Flex direction={'row'} justifyContent={'space-evenly'}>
            <Button onClick={onSameTeams}>Same Teams</Button>
            <Button onClick={onDifferentTeams}>Different Teams</Button>
          </Flex>
        </ModalBody>
      </Collapse>
    );
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsModalOpen(false);
      }}
    >
      <ModalOverlay />
      <ModalContent>
        {DataWarningQuestion()}
        {NewPlayerQuestion()}
      </ModalContent>
    </Modal>
  );
}

export default WarningModal;
