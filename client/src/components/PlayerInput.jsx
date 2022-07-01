import React, { useEffect, useState, useRef } from 'react';
import { useFormik } from 'formik';
import {
  Container,
  Stack,
  HStack,
  VStack,
  Button,
  SimpleGrid,
  Center,
  Input,
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
  Heading,
  Flex,
  Text,
  Divider,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';

import BidModal from './BidModal';

const PlayerInput = ({ playerName, val, id, type, setValTo }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <BidModal
        playerName={playerName}
        isOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        type={type}
        setValTo={setValTo}
      />
      <Flex my={'5px'} direction={'row'} justify={'space-around'}>
        <label style={{ marginRight: '15px' }} htmlFor='p1Bid'>
          {playerName}
        </label>
        {val === '' ? (
          <Button
            onClick={() => {
              setIsModalOpen(true);
            }}
            value={val}
            id={id}
            name={id}
          >
            {type}
          </Button>
        ) : (
          val
        )}
      </Flex>
    </>
  );
};

export default PlayerInput;
