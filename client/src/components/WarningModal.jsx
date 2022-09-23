import React, { useState, useEffect, useContext } from 'react';
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

import { initialNames, initialFirstDealerOrder } from '../helpers/constants';
import { GlobalContext } from '../helpers/GlobalContext';
import { rotateArr } from '../helpers/helperFunctions';

function WarningModal({ isOpen, setIsModalOpen, hasRoundHistory }) {
  const navigate = useNavigate();
  const {
    resetCurrentRound,
    setRoundHistory,
    setFirstDealerOrder,
    firstDealerOrder,
    roundHistory,
  } = useContext(GlobalContext);
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
  };

  const onSameTeams = () => {
    if (roundHistory.length > 0) {
      setFirstDealerOrder(rotateArr(firstDealerOrder));
    }
    // the following two function reset state. Make naming conventions consistent
    resetCurrentRound();
    setRoundHistory([]);
    setIsDataWarningQuestionVisible(false);
    setIsNewPlayerQuestionVisible(true);
    setIsModalOpen(false);
    resetCurrentRound();
  };

  const onDifferentTeams = () => {
    localStorage.setItem('names', JSON.stringify(initialNames));
    setFirstDealerOrder(initialFirstDealerOrder);
    setIsNewPlayerQuestionVisible(false);
    setIsModalOpen(false);
    navigate('/');
  };

  const DataWarningQuestion = () => {
    return (
      <Collapse in={isDataWarningQuestionVisible}>
        <ModalHeader style={{ color: '#ebf5ee', backgroundColor: '#464f51' }}>
          Are you sure?
        </ModalHeader>
        <ModalCloseButton />
        <Divider />
        <ModalBody
          style={{
            padding: '15px',
            color: '#ebf5ee',
            backgroundColor: '#464f51',
          }}
        >
          <Text style={{ marginBottom: '10px' }}>
            This will permanently delete your game data.
          </Text>
          <Flex direction={'row'} justifyContent={'space-between'}>
            <Button
              variant='outline'
              style={{ backgroundColor: '#464f51', color: '#ebf5ee' }}
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              variant='outline'
              style={{ backgroundColor: '#464f51', color: '#ebf5ee' }}
              onClick={onContinue}
            >
              Continue
            </Button>
          </Flex>
        </ModalBody>
      </Collapse>
    );
  };
  const NewPlayerQuestion = () => {
    return (
      <Collapse in={isNewPlayerQuestionVisible}>
        <ModalHeader style={{ color: '#ebf5ee', backgroundColor: '#464f51' }}>
          Would you like to keep the same teams?
        </ModalHeader>
        <Divider />
        <ModalBody
          style={{
            padding: '15px',
            color: '#ebf5ee',
            backgroundColor: '#464f51',
          }}
        >
          <Flex direction={'row'} justifyContent={'space-evenly'}>
            <Button
              variant='outline'
              style={{ backgroundColor: '#464f51', color: '#ebf5ee' }}
              onClick={onDifferentTeams}
            >
              Different Teams
            </Button>
            <Button
              variant='outline'
              style={{ backgroundColor: '#464f51', color: '#ebf5ee' }}
              onClick={onSameTeams}
            >
              Same Teams
            </Button>
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
      style={{ color: '#ebf5ee', backgroundColor: '#464f51' }}
    >
      <ModalOverlay />
      <ModalContent>
        {/* consider making these react components */}
        {DataWarningQuestion()}
        {NewPlayerQuestion()}
      </ModalContent>
    </Modal>
  );
}

export default WarningModal;
