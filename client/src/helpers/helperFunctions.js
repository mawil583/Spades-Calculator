import {
  possibleActuals,
  possibleBids,
  team1Styles,
  team2Styles,
} from './constants';

export function actualsErrorText(allActualsAreSubmitted, totalActuals) {
  const trickCountIsTooLow = allActualsAreSubmitted && totalActuals < 13;
  let text = `${totalActuals}`;
  if (trickCountIsTooLow) {
    text = 'only ' + text;
  }
  return `Error: You can't take ${text}!`;
}

export function sIfPlural(num) {
  if (num > 1) {
    return 's';
  }
  return '';
}

export function getUnclaimedText(numUnclaimed) {
  const isSomeoneGettingSet = numUnclaimed < 0;
  if (isSomeoneGettingSet) {
    const numOverbid = Math.abs(numUnclaimed);
    return `${numOverbid} overbid${sIfPlural(
      numOverbid
    )}! Someone's getting set!`;
  }
  return `Unclaimed: ${numUnclaimed}`;
}

export const getButtonValues = (type) => {
  if (type === 'Bid') {
    return possibleBids;
  }
  return possibleActuals;
};

export const getTeamClassName = (teamName) => {
  const { team1Name } = JSON.parse(localStorage.getItem('names'));
  const className = teamName === team1Name ? 'team1' : 'team2';
  return className;
};

export const getTeamStyle = (teamName) => {
  const { team1Name } = JSON.parse(localStorage.getItem('names'));
  const style = teamName === team1Name ? team1Styles : team2Styles;
  return style;
};

export const updateInput = ({ input, currentRound, fieldToUpdate }) => {
  const clonedCurrentRound = { ...currentRound };
  const [team, player] = fieldToUpdate.split('.');
  clonedCurrentRound[team][player] = input;
  return clonedCurrentRound;
};
