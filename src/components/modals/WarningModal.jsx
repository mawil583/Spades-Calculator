import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, ModalOverlay, ModalContent } from '@chakra-ui/react';
import {
  initialNames,
  initialFirstDealerOrder,
} from '../../helpers/utils/constants';
import { GlobalContext } from '../../helpers/context/GlobalContext';
import { rotateArr } from '../../helpers/utils/helperFunctions';
import { DataWarningQuestion, NewPlayerQuestion } from '../forms';

function WarningModal({ isOpen, setIsModalOpen, resetNames }) {
  const navigate = useNavigate();
  const {
    resetCurrentRound,
    setRoundHistory,
    setFirstDealerOrder,
    firstDealerOrder,
    roundHistory,
  } = useContext(GlobalContext);
  const hasRoundHistory = roundHistory.length > 0;

  const [isDataWarningQuestionVisible, setIsDataWarningQuestionVisible] =
    useState(false);
  const [isNewPlayerQuestionVisible, setIsNewPlayerQuestionVisible] =
    useState(false);

  // Reset modal state when it opens or closes
  useEffect(() => {
    if (isOpen) {
      if (hasRoundHistory) {
        setIsDataWarningQuestionVisible(true);
        setIsNewPlayerQuestionVisible(false);
      } else {
        setIsDataWarningQuestionVisible(false);
        setIsNewPlayerQuestionVisible(true);
      }
    } else {
      // Reset state when modal closes
      setIsDataWarningQuestionVisible(false);
      setIsNewPlayerQuestionVisible(false);
    }
  }, [isOpen, hasRoundHistory]);

  const onCancel = () => {
    setIsModalOpen(false);
  };

  const onContinue = () => {
    setIsDataWarningQuestionVisible(false);
    setIsNewPlayerQuestionVisible(true);
  };

  const onSameTeams = () => {
    if (hasRoundHistory) {
      setFirstDealerOrder(rotateArr(firstDealerOrder));
    }
    resetCurrentRound();
    setRoundHistory([]);
    setIsModalOpen(false);
    navigate('/spades-calculator');
  };

  const onDifferentTeams = () => {
    setRoundHistory([]);
    resetCurrentRound();
    if (resetNames) {
      resetNames(initialNames);
    } else {
      localStorage.setItem('names', JSON.stringify(initialNames));
    }
    setFirstDealerOrder(initialFirstDealerOrder);
    setIsModalOpen(false);
    navigate('/');
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      style={{ color: '#ebf5ee', backgroundColor: '#464f51' }}
    >
      <ModalOverlay />
      <ModalContent>
        {isDataWarningQuestionVisible && (
          <DataWarningQuestion onContinue={onContinue} onCancel={onCancel} />
        )}
        {isNewPlayerQuestionVisible && (
          <NewPlayerQuestion
            onDifferentTeams={onDifferentTeams}
            onSameTeams={onSameTeams}
          />
        )}
      </ModalContent>
    </Modal>
  );
}

export default WarningModal;
