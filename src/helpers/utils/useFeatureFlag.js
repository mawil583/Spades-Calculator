import { useState, useEffect } from 'react';
import { getFeatureFlag, setFeatureFlag } from './featureFlags';

export function useFeatureFlag(flagKey) {
  const [isEnabled, setIsEnabled] = useState(() => getFeatureFlag(flagKey));

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.detail.key === flagKey) {
        setIsEnabled(event.detail.value);
      }
    };

    window.addEventListener('feature-flag-changed', handleStorageChange);
    return () => window.removeEventListener('feature-flag-changed', handleStorageChange);
  }, [flagKey]);

  const toggle = () => {
    const newValue = !isEnabled;
    setFeatureFlag(flagKey, newValue);
    // State update is handled by the event listener now
  };

  return [isEnabled, toggle];
}
