import React, { useState } from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import { PlayerInput } from '../forms';
import { addInputs, isNotDefaultValue } from '../../helpers/math/spadesMath';
import { TeamInputHeading } from '../forms';
import { useValidateActuals } from '../../helpers/utils/hooks';
import { getActualsErrorText } from '../../helpers/utils/helperFunctions';
import { ErrorModal } from '../modals';

function ActualSection({
  index,
  names,
  isCurrent,
  roundHistory,
  currentRound,
}) {
  const { team1BidsAndActuals, team2BidsAndActuals } = currentRound;
  const [isValid, setIsValid] = useState(true);

  // Get bids to determine if team total editing should be enabled
  const team1Bids = [team1BidsAndActuals?.p1Bid, team1BidsAndActuals?.p2Bid];
  const team2Bids = [team2BidsAndActuals?.p1Bid, team2BidsAndActuals?.p2Bid];

  // Each team's editability will be determined individually in TeamInputHeading
  const isEditable = true;

  const team1Actuals = {
    p1Actual: team1BidsAndActuals?.p1Actual || '',
    p2Actual: team1BidsAndActuals?.p2Actual || '',
  };
  const team2Actuals = {
    p1Actual: team2BidsAndActuals?.p1Actual || '',
    p2Actual: team2BidsAndActuals?.p2Actual || '',
  };

  // Handle team total display logic
  const getTeamTotalDisplay = (teamActuals) => {
    const p1Actual = teamActuals.p1Actual;
    const p2Actual = teamActuals.p2Actual;

    // If both are empty, show 0
    if (p1Actual === '' && p2Actual === '') {
      return 0;
    }

    // Otherwise, calculate the actual total
    return addInputs(p1Actual, p2Actual);
  };

  const team1ActualTotal = getTeamTotalDisplay(team1Actuals);
  const team2ActualTotal = getTeamTotalDisplay(team2Actuals);

  const roundActuals = [
    team1Actuals.p1Actual,
    team1Actuals.p2Actual,
    team2Actuals.p1Actual,
    team2Actuals.p2Actual,
  ];

  // Handle validation for team total values
  const isTeamTotalValue = (value) => value === '';
  const allActualsAreSubmitted = roundActuals.every(
    (actual) => isNotDefaultValue(actual) && !isTeamTotalValue(actual)
  );

  // Calculate total for validation (only use numeric values)
  const getNumericTotal = (teamActuals) => {
    const p1Actual = teamActuals.p1Actual;
    const p2Actual = teamActuals.p2Actual;

    // If using team total, return 0 for validation (will be handled separately)
    if (isTeamTotalValue(p1Actual) || isTeamTotalValue(p2Actual)) {
      return 0;
    }

    return addInputs(p1Actual, p2Actual);
  };

  const team1NumericTotal = getNumericTotal(team1Actuals);
  const team2NumericTotal = getNumericTotal(team2Actuals);
  const totalActuals = team1NumericTotal + team2NumericTotal;

  useValidateActuals(allActualsAreSubmitted, totalActuals, setIsValid);

  const errorMessage = getActualsErrorText(totalActuals);

  return (
    <div data-cy="actualSection" data-testid="actualSection">
      <ErrorModal
        isOpen={!isValid}
        setIsModalOpen={setIsValid}
        index={index}
        names={names}
        isCurrent={isCurrent}
        roundHistory={roundHistory}
        currentRound={currentRound}
        errorMessage={errorMessage}
      />
      <TeamInputHeading
        team1Total={team1ActualTotal}
        team2Total={team2ActualTotal}
        title="Actuals"
        team1Bids={team1Bids}
        team2Bids={team2Bids}
        isEditable={isEditable}
        index={index}
        isCurrent={isCurrent}
        currentRound={currentRound}
        roundHistory={roundHistory}
      />
      <SimpleGrid
        columns={2}
        className="namesContainer"
        style={{ marginTop: '5px' }}
      >
        <PlayerInput
          roundHistory={roundHistory}
          teamName={names.team1Name}
          index={index}
          isCurrent={isCurrent}
          type={'Actual'}
          playerName={names.t1p1Name}
          currentRound={currentRound}
          inputId="team1BidsAndActuals.p1Actual"
          dealerId="team1BidsAndActuals.p1Bid"
          fieldToUpdate={'team1BidsAndActuals.p1Actual'}
          playerInput={team1BidsAndActuals?.p1Actual}
          teamClassName="team1"
        />
        <PlayerInput
          roundHistory={roundHistory}
          teamName={names.team2Name}
          index={index}
          isCurrent={isCurrent}
          currentRound={currentRound}
          inputId="team2BidsAndActuals.p1Actual"
          dealerId="team2BidsAndActuals.p1Bid"
          fieldToUpdate={'team2BidsAndActuals.p1Actual'}
          teamClassName="team2"
          playerName={names.t2p1Name}
          playerInput={team2BidsAndActuals?.p1Actual}
          type={'Actual'}
        />
        <PlayerInput
          teamName={names.team1Name}
          roundHistory={roundHistory}
          index={index}
          isCurrent={isCurrent}
          currentRound={currentRound}
          playerName={names.t1p2Name}
          inputId="team1BidsAndActuals.p2Actual"
          dealerId="team1BidsAndActuals.p2Bid"
          fieldToUpdate={'team1BidsAndActuals.p2Actual'}
          playerInput={team1BidsAndActuals?.p2Actual}
          type={'Actual'}
          teamClassName="team1"
        />
        <PlayerInput
          teamName={names.team2Name}
          roundHistory={roundHistory}
          index={index}
          isCurrent={isCurrent}
          currentRound={currentRound}
          playerName={names.t2p2Name}
          playerInput={team2BidsAndActuals?.p2Actual}
          type={'Actual'}
          inputId="team2BidsAndActuals.p2Actual"
          dealerId="team2BidsAndActuals.p2Bid"
          fieldToUpdate={'team2BidsAndActuals.p2Actual'}
          teamClassName="team2"
        />
      </SimpleGrid>
    </div>
  );
}

export default ActualSection;
