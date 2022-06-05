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

// BUG: try to set score outside of useEffect
import PlayerInput from './PlayerInput';

import { calculateRoundScore } from '../helpers/spadesMath';

function SpadesRound(props) {
  const { team1Name, team2Name, t1p1Name, t1p2Name, t2p1Name, t2p2Name } =
    props.values;

  const inputRef = useRef();
  const [team1RoundScore, setTeam1RoundScore] = useState(0);
  const [team2RoundScore, setTeam2RoundScore] = useState(0);
  const [team1GameScore, setTeam1GameScore] = useState(0);
  const [team1RoundBags, setTeam1Bags] = useState(0);
  const [team2RoundBags, setTeam2Bags] = useState(0);
  const [team2GameScore, setTeam2GameScore] = useState(0);
  const [isRoundFinished, setIsRoundFinished] = useState(false);
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const { isModalOpen, setIsModalOpen } = useState(false);

  // function moveFocusToCurrentRound() {
  //   inputRef.current.focus();
  // }

  // const formik = useFormik({
  //   initialValues: {
  //     team1BidsAndActuals: { p1Bid: '', p1Actual: '', p2Bid: '', p2Actual: '' },
  //     team2BidsAndActuals: { p1Bid: '', p1Actual: '', p2Bid: '', p2Actual: '' },
  //   },
  // });

  // const [team1BidsAndActuals, setTeam1BidsAndActuals] = useState({
  //   p1Bid: '',
  //   p1Actual: '',
  //   p2Bid: '',
  //   p2Actual: '',
  // });

  // team 1
  // const [t1p1Bid, setT1p1Bid] = useState('');
  // console.log(
  //   JSON.parse(sessionStorage.getItem('rounds'))[props.index]
  //     .team1BidsAndActuals.p1Bid
  // );
  console.log(props.index);
  const sessionRounds = JSON.parse(sessionStorage.getItem('rounds'));
  const sessionRound = sessionRounds ? sessionRounds[props.index] : undefined;
  const isStoredInSession = () => {
    if (sessionRound) {
      return true;
    }
    return false;
  };

  const [t1p1Bid, setT1p1Bid] = useState(
    isStoredInSession() ? sessionRound.team1BidsAndActuals.p1Bid : ''
  );
  // const [t1p2Bid, setT1p2Bid] = useState('');
  const [t1p2Bid, setT1p2Bid] = useState(
    isStoredInSession() ? sessionRound.team1BidsAndActuals.p2Bid : ''
  );
  // const [t1p1Actual, setT1p1Actual] = useState('');
  const [t1p1Actual, setT1p1Actual] = useState(
    isStoredInSession() ? sessionRound.team1BidsAndActuals.p1Actual : ''
  );
  // const [t1p2Actual, setT1p2Actual] = useState('');
  const [t1p2Actual, setT1p2Actual] = useState(
    isStoredInSession() ? sessionRound.team1BidsAndActuals.p2Actual : ''
  );
  const team1BidsAndActuals = {
    p1Bid: t1p1Bid,
    p2Bid: t1p2Bid,
    p1Actual: t1p1Actual,
    p2Actual: t1p2Actual,
  };
  const team1Setters = { setT1p1Bid, setT1p2Bid, setT1p1Actual, setT1p2Actual };

  // team 2
  // const [t2p1Bid, setT2p1Bid] = useState('');
  const [t2p1Bid, setT2p1Bid] = useState(
    isStoredInSession() ? sessionRound.team2BidsAndActuals.p1Bid : ''
  );
  // const [t2p2Bid, setT2p2Bid] = useState('');
  const [t2p2Bid, setT2p2Bid] = useState(
    isStoredInSession() ? sessionRound.team2BidsAndActuals.p2Bid : ''
  );
  // const [t2p1Actual, setT2p1Actual] = useState('');
  const [t2p1Actual, setT2p1Actual] = useState(
    isStoredInSession() ? sessionRound.team2BidsAndActuals.p1Actual : ''
  );
  // const [t2p2Actual, setT2p2Actual] = useState('');
  const [t2p2Actual, setT2p2Actual] = useState(
    isStoredInSession() ? sessionRound.team2BidsAndActuals.p2Actual : ''
  );
  const team2BidsAndActuals = {
    p1Bid: t2p1Bid,
    p2Bid: t2p2Bid,
    p1Actual: t2p1Actual,
    p2Actual: t2p2Actual,
  };
  const team2Setters = { setT2p1Bid, setT2p2Bid, setT2p1Actual, setT2p2Actual };

  // const [team2BidsAndActuals, setTeam2BidsAndActuals] = useState({
  //   p1Bid: '',
  //   p1Actual: '',
  //   p2Bid: '',
  //   p2Actual: '',
  // });

  const isNotDefaultValue = (value) => {
    return value !== '';
  };

  // useEffect(() => {
  //   moveFocusToCurrentRound();
  // }, []);

  /* 
  maybe split useEffect into 2 or 3

  1st useEffect sets IsRoundFinished

  2nd useEffect sets score and dependency is IsRoundFinished


  */

  useEffect(() => {
    // const team1InputVals = Object.values(formik.values.team1BidsAndActuals);
    const team1InputVals = Object.values(team1BidsAndActuals);
    // const team2InputVals = Object.values(formik.values.team2BidsAndActuals);
    const team2InputVals = Object.values(team2BidsAndActuals);
    const team1InputsAreEntered = team1InputVals.every(isNotDefaultValue);
    console.log({ team1InputsAreEntered });
    const team2InputsAreEntered = team2InputVals.every(isNotDefaultValue);
    const allBidsAndActualsAreEntered =
      team1InputsAreEntered && team2InputsAreEntered;
    console.log({ allBidsAndActualsAreEntered });
    if (allBidsAndActualsAreEntered) {
      // if (allBidsAndActualsAreEntered && props.roundHistory[props.index]) {
      console.log({ roundNumber: props.roundNumber });
      console.log('IF'); // this is happening on every refresh
      setIsRoundFinished(true);
      console.log({ bidsAndActuals: props.bidsAndActuals });
      // props.setBidsAndActuals([
      //   ...props.bidsAndActuals,
      //   { ...team1BidsAndActuals, ...team2BidsAndActuals },
      // ]);
      console.log({ roundHistory: props.roundHistory });
      console.log({ roundHistoryLength: props.roundHistory.length });
      console.log({
        newRoundHistory: [
          ...props.roundHistory,
          { team1BidsAndActuals, team2BidsAndActuals },
        ],
      });
      props.setRoundHistory([
        ...props.roundHistory,
        { team1BidsAndActuals, team2BidsAndActuals },
      ]);

      console.log({ team1BidsAndActuals });
      // set history here
      const roundScore = calculateRoundScore(
        team1BidsAndActuals,
        team2BidsAndActuals
      );
      console.log({ roundScore });
      // this causes infinite loop when roundScore is in dependency array
      setTeam1RoundScore(roundScore.team1RoundScore.score);
      setTeam2RoundScore(roundScore.team2RoundScore.score);
      console.log({ roundScore });
      // TODO: simplify. Maybe form an object instead of passing so many parameters
      // this also causes infinite loop when roundScore is in dependency array
      props.addRoundScoreToGameScore(
        roundScore.team1RoundScore.score,
        roundScore.team2RoundScore.score,
        roundScore.team1RoundScore.bags,
        roundScore.team2RoundScore.bags,
        // maybe pass setTeam1GameScore fn as parameter
        setTeam1GameScore,
        setTeam2GameScore,
        setTeam1Bags,
        setTeam2Bags
      );
      // props.setRoundHistory([
      //   ...props.roundHistory,
      //   { team1BidsAndActuals, team2BidsAndActuals },
      // ]);

      // gets set here
      // sessionStorage.setItem('rounds', JSON.stringify(props.roundHistory));
      /* 
      
      roundHistory shape:
    
      // each index of this array represents a different round
      [
        team1BidsAndActuals: team1BidsAndActuals,
        team2BidsAndActuals: team2BidsAndActuals,
      ]
      
      */
    }
  }, [
    t2p1Bid,
    t2p2Bid,
    t2p1Actual,
    t2p2Actual,
    t2p1Bid,
    t2p2Bid,
    t2p1Actual,
    t2p2Actual,
  ]);

  // this might be running twice
  useEffect(() => {
    console.log({ roundHistoryEffect: JSON.stringify(props.roundHistory) });
    // gets set here
    sessionStorage.setItem('rounds', JSON.stringify(props.roundHistory));
  }, [props.roundHistory]);
  // });

  // sessionStorage is in sync here
  useEffect(() => {
    console.log({
      sessionStorageRounds: JSON.parse(sessionStorage.getItem('rounds')),
    });
  }, [sessionStorage.getItem('rounds')]);

  // console.log({ roundHistory: props.roundHistory }); // only team 2
  return (
    <div>
      <Heading as={'h3'}>Round {props.roundNumber}</Heading>
      <Box>
        <Flex direction={'row'} height={'30px'}>
          <Box
            width={'100%'}
            borderBottom={'1px solid black'}
            mr={'5px'}
            ml={'5px'}
          >
            <Center>{team1Name}</Center>
          </Box>
          <Box
            width={'100%'}
            borderBottom={'1px solid gray'}
            mr={'5px'}
            ml={'5px'}
          >
            <Center>{team2Name}</Center>
          </Box>
        </Flex>
      </Box>

      <form>
        <div>
          <Container>
            {isRoundFinished ? (
              <div>
                <Center>
                  <Heading mt={'20px'} mb={'10px'} size={'lg'}>
                    Score
                  </Heading>
                </Center>
                <SimpleGrid columns={2} className='namesContainer'>
                  <Center>Round Score: {team1RoundScore}</Center>
                  <Center>Round Score: {team2RoundScore}</Center>
                  <Center>Game Score: {team1GameScore}</Center>
                  <Center>Game Score: {team2GameScore}</Center>
                  <Center>Bags: {team1RoundBags}</Center>
                  <Center>Bags: {team2RoundBags}</Center>
                </SimpleGrid>
              </div>
            ) : null}
            <Center>
              <Heading mt={'20px'} mb={'10px'} size={'md'}>
                Bids
              </Heading>
            </Center>
            <SimpleGrid columns={2} className='namesContainer'>
              <PlayerInput
                setValTo={setT1p1Bid}
                playerName={t1p1Name}
                val={t1p1Bid}
                id='team1BidsAndActuals.p1Bid'
                type={'Bid'}
              />
              <PlayerInput
                setValTo={setT2p1Bid}
                playerName={t2p1Name}
                val={t2p1Bid}
                id='team2BidsAndActuals.p1Bid'
                type={'Bid'}
              />
              <PlayerInput
                setValTo={setT1p2Bid}
                playerName={t1p2Name}
                val={t1p2Bid}
                id='team1BidsAndActuals.p2Bid'
                type={'Bid'}
              />
              <PlayerInput
                setValTo={setT2p2Bid}
                playerName={t2p2Name}
                val={t2p2Bid}
                id='team2BidsAndActuals.p2Bid'
                type={'Bid'}
              />
            </SimpleGrid>
            <Center>
              <hr
                style={{ width: '60%', color: '#808080', margin: '10px 0' }}
              />
            </Center>
            <Center>
              <Heading mt={'20px'} mb={'10px'} size={'md'}>
                Actuals
              </Heading>
            </Center>
            <SimpleGrid columns={2} className='namesContainer'>
              <PlayerInput
                setValTo={setT1p1Actual}
                id='team1BidsAndActuals.p1Actual'
                playerName={t1p1Name}
                val={t1p1Actual}
                type={'Actual'}
              />
              <PlayerInput
                setValTo={setT2p1Actual}
                id='team2BidsAndActuals.p1Actual'
                playerName={t2p1Name}
                val={t2p1Actual}
                type={'Actual'}
              />
              <PlayerInput
                setValTo={setT1p2Actual}
                playerName={t1p2Name}
                id='team1BidsAndActuals.p2Actual'
                val={t1p2Actual}
                type={'Actual'}
              />
              <PlayerInput
                setValTo={setT2p2Actual}
                playerName={t2p2Name}
                val={t2p2Actual}
                type={'Actual'}
                id='team2BidsAndActuals.p2Actual'
              />
            </SimpleGrid>
          </Container>
          <div></div>
        </div>

        {/* <div>
          <h2>
            {team2Name}
            {team2Score ? ` Score: ${team2Score}` : null}
          </h2>

          <br />
        </div> */}
      </form>
    </div>
  );
}

export default SpadesRound;
