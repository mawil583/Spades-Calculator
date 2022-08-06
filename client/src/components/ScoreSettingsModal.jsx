import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Divider,
} from '@chakra-ui/react';

import SettingDescription from './SettingDescription';
import SettingExample from './SettingExample';

function ScoreSettingsModal({ isOpen, setIsModalOpen }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsModalOpen(false);
      }}
      style={{ backgroundColor: '#464f51' }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader style={{ backgroundColor: '#464f51' }}>
          Failed-Nil Settings
        </ModalHeader>
        <ModalCloseButton />
        <Divider />
        <ModalBody style={{ padding: '5px', backgroundColor: '#464f51' }}>
          <SettingDescription
            title='Takes Bags'
            desc={`Overtricks on a failed Nil count directly as bags and do NOT count towards team's total score. Each player's score is evaluated independently.`}
          />
          <SettingExample
            p1Bid={'Nil'}
            p1Actual='1'
            p2Bid='1'
            p2Actual='0'
            score={-109}
            bags={1}
          />
          <SettingExample
            p1Bid={'Nil'}
            p1Actual='2'
            p2Bid='1'
            p2Actual='0'
            score={-108}
            bags={2}
          />
          <SettingDescription
            title='Helps Team Bid'
            desc={`Any overtricks are added to the Nil bidder’s partner’s trick count. Nil bidder can still earn bags if team's total bid is higher than team's total made.`}
          />
          <SettingExample
            p1Bid={'Nil'}
            p1Actual='1'
            p2Bid='1'
            p2Actual='0'
            score={-90}
            bags={0}
          />
          <SettingExample
            p1Bid={'Nil'}
            p1Actual='2'
            p2Bid='1'
            p2Actual='0'
            score={-89}
            bags={1}
          />
          <SettingDescription
            title='No Bags/No Help'
            desc={`Bags are not added to a failed Nil bidder’s score nor are they added to the team score. Bags can only come from non-nil bidder.`}
          />
          <SettingExample
            p1Bid={'Nil'}
            p1Actual='1'
            p2Bid='1'
            p2Actual='0'
            score={-110}
            bags={0}
          />
          <SettingExample
            p1Bid={'Nil'}
            p1Actual='3'
            p2Bid='1'
            p2Actual='2'
            score={-89}
            bags={1}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ScoreSettingsModal;
