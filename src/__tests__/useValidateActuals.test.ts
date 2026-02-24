import { vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useValidateActuals } from '../helpers/utils/hooks';

describe('useValidateActuals with nil bids', () => {
  it("should set isValid to false when someone goes nil and all actuals are entered but don't add up to 13", () => {
    const setIsValid = vi.fn();

    // Test case: Player 1 goes nil (actual = 0), others bid normally
    // Bids: nil, 3, 4, 5 (total = 12)
    // Actuals: 0, 4, 5, 5 (total = 14, should be 13)
    const allActualsAreSubmitted = true;
    const totalActuals = 14; // 0 + 4 + 5 + 5 = 14

    renderHook(() =>
      useValidateActuals(allActualsAreSubmitted, totalActuals, setIsValid)
    );

    expect(setIsValid).toHaveBeenCalledWith(false);
  });

  it('should set isValid to false when someone goes nil and all actuals are entered but add up to less than 13', () => {
    const setIsValid = vi.fn();

    // Test case: Player 1 goes nil (actual = 0), others bid normally
    // Bids: nil, 3, 4, 5 (total = 12)
    // Actuals: 0, 3, 4, 5 (total = 12, should be 13)
    const allActualsAreSubmitted = true;
    const totalActuals = 12; // 0 + 3 + 4 + 5 = 12

    renderHook(() =>
      useValidateActuals(allActualsAreSubmitted, totalActuals, setIsValid)
    );

    expect(setIsValid).toHaveBeenCalledWith(false);
  });

  it('should set isValid to true when someone goes nil and all actuals are entered and add up to exactly 13', () => {
    const setIsValid = vi.fn();

    // Test case: Player 1 goes nil (actual = 0), others bid normally
    // Bids: nil, 3, 4, 5 (total = 12)
    // Actuals: 0, 3, 4, 6 (total = 13, correct)
    const allActualsAreSubmitted = true;
    const totalActuals = 13; // 0 + 3 + 4 + 6 = 13

    renderHook(() =>
      useValidateActuals(allActualsAreSubmitted, totalActuals, setIsValid)
    );

    expect(setIsValid).toHaveBeenCalledWith(true);
  });

  it('should set isValid to true when not all actuals are submitted yet', () => {
    const setIsValid = vi.fn();

    // Test case: Not all actuals are submitted yet
    const allActualsAreSubmitted = false;
    const totalActuals = 8; // Some actuals entered but not all

    renderHook(() =>
      useValidateActuals(allActualsAreSubmitted, totalActuals, setIsValid)
    );

    expect(setIsValid).toHaveBeenCalledWith(true);
  });

  it('should set isValid to false when not all actuals are submitted but total exceeds 13', () => {
    const setIsValid = vi.fn();

    // Test case: Not all actuals are submitted but total already exceeds 13
    const allActualsAreSubmitted = false;
    const totalActuals = 15; // Too many already

    renderHook(() =>
      useValidateActuals(allActualsAreSubmitted, totalActuals, setIsValid)
    );

    expect(setIsValid).toHaveBeenCalledWith(false);
  });
});
