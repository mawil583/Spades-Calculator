export function actualsErrorText(allActualsAreSubmitted, totalActuals) {
  const trickCountIsTooLow = allActualsAreSubmitted && totalActuals < 13;
  let text = `${totalActuals}`;
  if (trickCountIsTooLow) {
    text = 'only ' + text;
  }
  return `Error: You can't take ${text}!`;
}
