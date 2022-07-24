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
    console.log('if');
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
