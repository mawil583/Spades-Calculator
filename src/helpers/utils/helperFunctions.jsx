import {
  possibleActuals,
  possibleBids,
  team1Styles,
  team2Styles,
} from './constants';

export function getActualsErrorText(totalActuals) {
  const difference = 13 - totalActuals;
  const num = Math.abs(difference);
  const moreOrLess = difference >= 0 ? 'more' : 'less';

  let text = `The total amount of hands must always add up to 13. Yours totaled ${totalActuals}. You need ${num} ${moreOrLess} to continue.`;
  return text;
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

export const getTeamStyle = (teamName) => {
  const { team1Name } = JSON.parse(localStorage.getItem('names'));
  const style = teamName === team1Name ? team1Styles : team2Styles;
  return style;
};

// consider renaming
export const updateInput = ({ input, currentRound, fieldToUpdate }) => {
  const clonedCurrentRound = {
    ...currentRound,
    team1BidsAndActuals: { ...currentRound.team1BidsAndActuals },
    team2BidsAndActuals: { ...currentRound.team2BidsAndActuals },
  };
  const [team, player] = fieldToUpdate.split('.');
  clonedCurrentRound[team][player] = input;
  return clonedCurrentRound;
};

export const getEditedRoundHistory = ({
  index,
  updatedRound,
  roundHistory,
}) => {
  // Ensure roundHistory is an array
  if (!Array.isArray(roundHistory)) {
    console.warn('roundHistory is not an array, initializing as empty array');
    roundHistory = [];
  }

  const clonedRoundHistory = [...roundHistory];
  clonedRoundHistory[index] = updatedRound;
  return clonedRoundHistory;
};

/* 
if there's anything in localStorage, then return that value;
otherwise, set a default value for that key in localStorage
*/
export const defaultLocalStorage = (key, value) => {
  const item = window.localStorage.getItem(key);
  if (!item) {
    window.localStorage.setItem(key, JSON.stringify(value));
    return value;
  }
  return JSON.parse(item);
};

export const getLocalStorage = (key) => {
  const item = window.localStorage.getItem(key);
  return JSON.parse(item);
};

export const setLocalStorage = (key, value) => {
  const item = window.localStorage.getItem(key);
  if (!item) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const rotateArr = (arr) => {
  const clonedArr = [...arr];
  clonedArr.push(clonedArr[0]);
  clonedArr.shift();
  return clonedArr;
};
