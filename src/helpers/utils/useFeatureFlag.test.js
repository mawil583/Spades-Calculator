import { renderHook, act } from '@testing-library/react';
import { useFeatureFlag } from './useFeatureFlag';
import { FEATURE_FLAGS, setFeatureFlag } from './featureFlags';

describe('useFeatureFlag hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with the current flag value', () => {
    setFeatureFlag(FEATURE_FLAGS.TABLE_ROUND_UI, true);
    const { result } = renderHook(() => useFeatureFlag(FEATURE_FLAGS.TABLE_ROUND_UI));
    expect(result.current[0]).toBe(true);
  });

  it('should use default value if not set', () => {
    const { result } = renderHook(() => useFeatureFlag(FEATURE_FLAGS.TABLE_ROUND_UI));
    expect(result.current[0]).toBe(false);
  });

  it('should toggle the flag value', () => {
    const { result } = renderHook(() => useFeatureFlag(FEATURE_FLAGS.TABLE_ROUND_UI));
    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1]();
    });

    expect(result.current[0]).toBe(true);
    expect(localStorage.getItem(FEATURE_FLAGS.TABLE_ROUND_UI)).toBe('true');

    act(() => {
      result.current[1]();
    });

    expect(result.current[0]).toBe(false);
    expect(localStorage.getItem(FEATURE_FLAGS.TABLE_ROUND_UI)).toBe('false');
  });
});
