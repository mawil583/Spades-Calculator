import React, { useState, useEffect, useContext } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { initialNames, initialFirstDealerOrder } from '../helpers/constants';
import { GlobalContext } from '../helpers/GlobalContext';
import { rotateArr } from '../helpers/helperFunctions';
import DataWarningQuestion from './DataWarningQuestion';
import NewPlayerQuestion from './NewPlayerQuestion';

function WarningModal({ isOpen, setIsModalOpen }) {
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
    if (hasRoundHistory) {
      setFirstDealerOrder(rotateArr(firstDealerOrder));
    }
    // the following two function reset state. Make naming conventions consistent
    // also, these two functions are in onDifferentTeams(). Try to make DRY
    resetCurrentRound();
    setRoundHistory([]);
    setIsDataWarningQuestionVisible(false);
    setIsNewPlayerQuestionVisible(true);
    setIsModalOpen(false);
    resetCurrentRound();
  };

  const onDifferentTeams = () => {
    setRoundHistory([]);
    resetCurrentRound();
    localStorage.setItem('names', JSON.stringify(initialNames));
    setFirstDealerOrder(initialFirstDealerOrder);
    setIsNewPlayerQuestionVisible(false);
    setIsModalOpen(false);
    navigate('/');
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
        <DataWarningQuestion isDataWarningQuestionVisible={isDataWarningQuestionVisible} onContinue={onContinue} onCancel={onCancel} />
        <NewPlayerQuestion isNewPlayerQuestionVisible={isNewPlayerQuestionVisible} onDifferentTeams={onDifferentTeams} onSameTeams={onSameTeams} />
      </ModalContent>
    </Modal>
  );
}

export default WarningModal;
