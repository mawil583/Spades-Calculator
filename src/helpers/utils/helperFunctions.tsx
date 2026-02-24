import {
  possibleActuals,
  possibleBids,
  team1Styles,
  team2Styles,
} from './constants';

import type { Round, UpdateInputArgs } from '../../types';

export function getActualsErrorText(totalActuals: number) {
  const difference = 13 - totalActuals;
  const num = Math.abs(difference);
  const moreOrLess = difference >= 0 ? 'more' : 'less';

  let text = `The total amount of hands must always add up to 13. Yours totaled ${totalActuals}. You need ${num} ${moreOrLess} to continue.`;
  return text;
}

export function sIfPlural(num: number) {
  if (num > 1) {
    return 's';
  }
  return '';
}

export function getUnclaimedText(numUnclaimed: number, useTableUI = false) {
  const isSomeoneGettingSet = numUnclaimed < 0;
  if (isSomeoneGettingSet) {
    const numOverbid = Math.abs(numUnclaimed);
    if (useTableUI) {
      return `Overbids: ${numOverbid}`;
    }
    return `${numOverbid} overbid${sIfPlural(
      numOverbid
    )}! Someone's getting set!`;
  }
  return `Unclaimed: ${numUnclaimed}`;
}

export const getButtonValues = (type: string) => {
  if (type === 'Bid') {
    return possibleBids;
  }
  return possibleActuals;
};

export const getTeamStyle = (teamName: string) => {
  const storedNames = localStorage.getItem('names');
  if (!storedNames) return team1Styles;
  const { team1Name } = JSON.parse(storedNames);
  const style = teamName === team1Name ? team1Styles : team2Styles;
  return style;
};

// consider renaming
export const updateInput = ({ input, currentRound, fieldToUpdate }: UpdateInputArgs) => {
  const clonedCurrentRound: Round = {
    ...currentRound,
    team1BidsAndActuals: { ...currentRound.team1BidsAndActuals },
    team2BidsAndActuals: { ...currentRound.team2BidsAndActuals },
  };
  const [team, player] = fieldToUpdate.split('.');
  // @ts-ignore - this is a dynamic property access
  clonedCurrentRound[team][player] = input;
  return clonedCurrentRound;
};

interface GetEditedRoundHistoryArgs {
  index: number;
  updatedRound: Round;
  roundHistory: Round[];
}

export const getEditedRoundHistory = ({
  index,
  updatedRound,
  roundHistory,
}: GetEditedRoundHistoryArgs) => {
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
export const defaultLocalStorage = <T,>(key: string, value: T): T => {
  const item = window.localStorage.getItem(key);
  if (!item) {
    window.localStorage.setItem(key, JSON.stringify(value));
    return value;
  }
  return JSON.parse(item);
};

export const getLocalStorage = <T,>(key: string): T | null => {
  const item = window.localStorage.getItem(key);
  if (!item) return null;
  return JSON.parse(item);
};

export const setLocalStorage = <T,>(key: string, value: T) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const rotateArr = <T,>(arr: T[]): T[] => {
  const clonedArr = [...arr];
  if (clonedArr.length > 0) {
    clonedArr.push(clonedArr[0]);
    clonedArr.shift();
  }
  return clonedArr;
};
