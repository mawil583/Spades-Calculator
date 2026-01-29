import React, { useState } from 'react';
import { Button, IconButton } from '@chakra-ui/react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WarningModal from '../modals/WarningModal';

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
      <WarningModal isOpen={isOpen} setIsModalOpen={setIsModalOpen} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: '-15px',
        }}
      >
        <IconButton
          variant="outline"
          onClick={handleNavigateHome}
          fontSize="25px"
          style={{ width: '60px' }}
          borderColor="#4A5568"
          borderWidth="1px"
          color="white"
        >
          <ArrowLeft />
        </IconButton>
        <Button 
          onClick={resetGameWithSamePlayers}
          variant="outline"
          borderColor="#4A5568"
          borderWidth="1px"
          color="white"
        >
          New Game
        </Button>
      </div>
    </>
  );
};

export default Navbar;
