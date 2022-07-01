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

function BidModal({ playerName, isOpen, setIsModalOpen, type, setValTo }) {
  const possibleBids = [
    'Blind Nil',
    'Nil',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
  ];

  const possibleActuals = [
    0,
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
  ];

  const availableSelections = () => {
    if (type === 'Bid') {
      return possibleBids;
    }
    return possibleActuals;
  };

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
          <ModalHeader>
            Select {playerName}'s {type}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody style={{ padding: '5px' }}>
            <SimpleGrid columns={3} spacingX={2} spacingY={4}>
              {availableSelections().map((bid, i) => {
                return (
                  <Button
                    key={i}
                    onClick={() => {
                      setValTo(bid);
                      setIsModalOpen(false);
                    }}
                  >
                    {bid}
                  </Button>
                );
              })}
            </SimpleGrid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default BidModal;
