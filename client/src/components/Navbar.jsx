import React , { useState } from 'react';
import { IconButton, Button } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

import WarningModal from './WarningModal';

const Navbar = () => {
  const navigate = useNavigate();
  const handleNavigateHome = () => {
      navigate('/');
    };
  const resetGameWithSamePlayers = () => {
  setIsModalOpen(true);
  };
  const [isOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <WarningModal
          isOpen={isOpen}
          setIsModalOpen={setIsModalOpen}
        />
      <div
        style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: '-15px',
          }}
          >
        <IconButton
          variant='outline'
          onClick={handleNavigateHome}
          fontSize='25px'
          style={{ width: '60px' }}
          icon={<ArrowBackIcon />}
          />
        <Button onClick={resetGameWithSamePlayers}>New Game</Button>
      </div>
    </>
  );
};

export default Navbar;