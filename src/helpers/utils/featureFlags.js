// Feature flag definitions and utilities
export const FEATURE_FLAGS = {
  TABLE_ROUND_UI: 'featureFlag_tableRoundUI',
};

export const FLAG_DEFAULTS = {
  [FEATURE_FLAGS.TABLE_ROUND_UI]: false, // Original UI is default
};

export const getFeatureFlag = (flagKey) => {
  const item = localStorage.getItem(flagKey);
  if (item === null) return FLAG_DEFAULTS[flagKey] ?? false;
  return JSON.parse(item);
};

export const setFeatureFlag = (flagKey, value) => {
  localStorage.setItem(flagKey, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent('feature-flag-changed', { detail: { key: flagKey, value } }));
};
