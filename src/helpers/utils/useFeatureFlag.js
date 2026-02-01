import { useState } from 'react';
import { getFeatureFlag, setFeatureFlag } from './featureFlags';

export function useFeatureFlag(flagKey) {
  const [isEnabled, setIsEnabled] = useState(() => getFeatureFlag(flagKey));

  const toggle = () => {
    const newValue = !isEnabled;
    setFeatureFlag(flagKey, newValue);
    setIsEnabled(newValue);
  };

  return [isEnabled, toggle];
}
