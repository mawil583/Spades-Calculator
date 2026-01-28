import React, { useState, useContext } from 'react';
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

  // State to track if the user has clicked "Continue" on the data warning
  const [hasClickedContinue, setHasClickedContinue] = useState(false);
  const [previousIsOpenValue, setPreviousIsOpenValue] = useState(isOpen);

  // Derived visibility state
  const showDataWarning = isOpen && hasRoundHistory && !hasClickedContinue;
  const showNewPlayer = isOpen && (!hasRoundHistory || hasClickedContinue);

  // Adjust state during render when isOpen changes
  if (isOpen !== previousIsOpenValue) {
    setPreviousIsOpenValue(isOpen);
    if (!isOpen) {
      setHasClickedContinue(false);
    }
  }

  const onCancel = () => {
    setIsModalOpen(false);
  };

  const onContinue = () => {
    setHasClickedContinue(true);
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
        {showDataWarning && (
          <DataWarningQuestion onContinue={onContinue} onCancel={onCancel} />
        )}
        {showNewPlayer && (
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
