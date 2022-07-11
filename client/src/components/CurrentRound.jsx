import React, { useState, useEffect, createContext } from 'react';
import { Container } from '@chakra-ui/react';
import RoundSummary from './RoundSummary';
import BidSection from './BidSection';
import ActualSection from './ActualSection';
import RoundHeading from './RoundHeading';
import Divider from './Divider';

import { calculateRoundScoreNew } from '../helpers/spadesMath';
export const SelectContext = createContext();

function CurrentRound(props) {
  const { team1Name, team2Name, t1p1Name, t1p2Name, t2p1Name, t2p2Name } =
    props.values;

  const [team1RoundScore, setTeam1RoundScore] = useState(0);
  const [team2RoundScore, setTeam2RoundScore] = useState(0);
  const [team1GameScore, setTeam1GameScore] = useState(0);
  const [team2GameScore, setTeam2GameScore] = useState(0);
  const [team1RoundBags, setTeam1RoundBags] = useState(0);
  const [team2RoundBags, setTeam2RoundBags] = useState(0);
  const [isRoundFinished, setIsRoundFinished] = useState(false);

  // team 1
  const [t1p1Bid, setT1p1Bid] = useState('');
  const [t1p2Bid, setT1p2Bid] = useState('');
  const [t1p1Actual, setT1p1Actual] = useState('');
  const [t1p2Actual, setT1p2Actual] = useState('');
  const team1BidsAndActuals = {
    p1Bid: t1p1Bid,
    p2Bid: t1p2Bid,
    p1Actual: t1p1Actual,
    p2Actual: t1p2Actual,
  };

  // team 2
  const [t2p1Bid, setT2p1Bid] = useState('');
  const [t2p2Bid, setT2p2Bid] = useState('');
  const [t2p1Actual, setT2p1Actual] = useState('');
  const [t2p2Actual, setT2p2Actual] = useState('');
  const team2BidsAndActuals = {
    p1Bid: t2p1Bid,
    p2Bid: t2p2Bid,
    p1Actual: t2p1Actual,
    p2Actual: t2p2Actual,
  };

  const isNotDefaultValue = (value) => {
    return value !== '';
  };

  const resetRoundValues = () => {
    setTeam1RoundScore(0);
    setTeam2RoundScore(0);
    setTeam1RoundBags(0);
    setTeam2RoundBags(0);
    setIsRoundFinished(false);
    setT1p1Bid('');
    setT1p2Bid('');
    setT1p1Actual('');
    setT1p2Actual('');
    setT2p1Bid('');
    setT2p2Bid('');
    setT2p1Actual('');
    setT2p2Actual('');
  };

  useSetScoreWhenRoundIsFinished(
    team1BidsAndActuals,
    team2BidsAndActuals,
    isNotDefaultValue,
    setIsRoundFinished,
    props,
    setTeam1RoundScore,
    setTeam2RoundScore,
    setTeam1GameScore,
    setTeam2GameScore,
    setTeam1RoundBags,
    setTeam2RoundBags,
    resetRoundValues,
    t1p1Bid,
    t1p2Bid,
    t1p1Actual,
    t1p2Actual,
    t2p1Bid,
    t2p2Bid,
    t2p1Actual,
    t2p2Actual
  );

  return (
    <div>
      <RoundHeading props={props} team1Name={team1Name} team2Name={team2Name} />
      <form>
        <div>
          <Container>
            {isRoundFinished && (
              <RoundSummary
                team1RoundScore={team1RoundScore}
                team2RoundScore={team2RoundScore}
                team1GameScore={team1GameScore}
                team2GameScore={team2GameScore}
                team1RoundBags={team1RoundBags}
                team2RoundBags={team2RoundBags}
              />
            )}
            <BidSection
              setT1p1Bid={setT1p1Bid}
              team1BidsAndActuals={team1BidsAndActuals}
              team2BidsAndActuals={team2BidsAndActuals}
              setT2p1Bid={setT2p1Bid}
              setT1p2Bid={setT1p2Bid}
              t1p1Name={t1p1Name}
              t1p2Name={t1p2Name}
              setT2p2Bid={setT2p2Bid}
              t2p1Name={t2p1Name}
              t2p2Name={t2p2Name}
            />
            <Divider />
            <ActualSection
              team1BidsAndActuals={team1BidsAndActuals}
              team2BidsAndActuals={team2BidsAndActuals}
              setT1p1Actual={setT1p1Actual}
              t1p1Name={t1p1Name}
              props={props}
              setT2p1Actual={setT2p1Actual}
              t2p1Name={t2p1Name}
              setT1p2Actual={setT1p2Actual}
              t1p2Name={t1p2Name}
              setT2p2Actual={setT2p2Actual}
              t2p2Name={t2p2Name}
            />
          </Container>
          <div></div>
        </div>
      </form>
    </div>
  );
}

export default CurrentRound;

function useSetScoreWhenRoundIsFinished(
  team1BidsAndActuals,
  team2BidsAndActuals,
  isNotDefaultValue,
  setIsRoundFinished,
  props,
  setTeam1RoundScore,
  setTeam2RoundScore,
  setTeam1GameScore,
  setTeam2GameScore,
  setTeam1RoundBags,
  setTeam2RoundBags,
  resetRoundValues,
  t1p1Bid,
  t1p2Bid,
  t1p1Actual,
  t1p2Actual,
  t2p1Bid,
  t2p2Bid,
  t2p1Actual,
  t2p2Actual
) {
  useEffect(() => {
    const team1InputVals = Object.values(team1BidsAndActuals);
    const team2InputVals = Object.values(team2BidsAndActuals);
    const team1InputsAreEntered = team1InputVals.every(isNotDefaultValue);
    const team2InputsAreEntered = team2InputVals.every(isNotDefaultValue);
    const allBidsAndActualsAreEntered =
      team1InputsAreEntered && team2InputsAreEntered;
    if (allBidsAndActualsAreEntered) {
      setIsRoundFinished(true);
      props.setTeam1BidsAndActuals({
        t1p1Bid,
        t1p2Bid,
        t1p1Actual,
        t1p2Actual,
      });
      props.setTeam2BidsAndActuals({
        t2p1Bid,
        t2p2Bid,
        t2p1Actual,
        t2p2Actual,
      });

      const team1RoundScore = calculateRoundScoreNew(
        team1BidsAndActuals.p1Bid,
        team1BidsAndActuals.p2Bid,
        team1BidsAndActuals.p1Actual,
        team1BidsAndActuals.p2Actual
      );
      const team2RoundScore = calculateRoundScoreNew(
        team2BidsAndActuals.p1Bid,
        team2BidsAndActuals.p2Bid,
        team2BidsAndActuals.p1Actual,
        team2BidsAndActuals.p2Actual
      );

      setTeam1RoundScore(team1RoundScore.score);
      setTeam2RoundScore(team2RoundScore.score);
      props.addRoundScoreToGameScore(
        team1RoundScore.score,
        team2RoundScore.score,
        team1RoundScore.bags,
        team2RoundScore.bags,
        setTeam1GameScore,
        setTeam2GameScore,
        setTeam1RoundBags,
        setTeam2RoundBags
      );
      props.setRoundHistory([
        ...props.roundHistory,
        { team1BidsAndActuals, team2BidsAndActuals },
      ]);
      localStorage.setItem(
        'roundHistory',
        JSON.stringify([
          ...props.roundHistory,
          { team1BidsAndActuals, team2BidsAndActuals },
        ])
      );
      resetRoundValues();
    }
  }, [
    t1p1Bid,
    t1p2Bid,
    t1p1Actual,
    t1p2Actual,
    t2p1Bid,
    t2p2Bid,
    t2p1Actual,
    t2p2Actual,
  ]);
}
