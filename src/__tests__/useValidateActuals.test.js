import { renderHook } from '@testing-library/react';
import { useValidateActuals } from '../helpers/utils/hooks';

describe('useValidateActuals', () => {
  let mockSetIsValid;

  beforeEach(() => {
    mockSetIsValid = jest.fn();
  });

  it('sets isValid to false when all actuals are submitted and total is not 13', () => {
    renderHook(() => useValidateActuals(true, 14, mockSetIsValid));

    expect(mockSetIsValid).toHaveBeenCalledWith(false);
  });

  it('sets isValid to true when all actuals are submitted and total is 13', () => {
    renderHook(() => useValidateActuals(true, 13, mockSetIsValid));

    expect(mockSetIsValid).toHaveBeenCalledWith(true);
  });

  it('sets isValid to false when not all actuals are submitted but total exceeds 13', () => {
    renderHook(() => useValidateActuals(false, 14, mockSetIsValid));

    expect(mockSetIsValid).toHaveBeenCalledWith(false);
  });

  it('sets isValid to true when not all actuals are submitted and total is 13 or less', () => {
    renderHook(() => useValidateActuals(false, 13, mockSetIsValid));

    expect(mockSetIsValid).toHaveBeenCalledWith(true);
  });

  it('sets isValid to true when not all actuals are submitted and total is less than 13', () => {
    renderHook(() => useValidateActuals(false, 10, mockSetIsValid));

    expect(mockSetIsValid).toHaveBeenCalledWith(true);
  });

  it('updates validation when total changes', () => {
    const { rerender } = renderHook(
      ({ allActualsAreSubmitted, totalActuals }) =>
        useValidateActuals(
          allActualsAreSubmitted,
          totalActuals,
          mockSetIsValid
        ),
      {
        initialProps: { allActualsAreSubmitted: true, totalActuals: 13 },
      }
    );

    expect(mockSetIsValid).toHaveBeenCalledWith(true);

    // Change total to invalid value
    rerender({ allActualsAreSubmitted: true, totalActuals: 14 });
    expect(mockSetIsValid).toHaveBeenCalledWith(false);
  });

  it('updates validation when allActualsAreSubmitted changes', () => {
    const { rerender } = renderHook(
      ({ allActualsAreSubmitted, totalActuals }) =>
        useValidateActuals(
          allActualsAreSubmitted,
          totalActuals,
          mockSetIsValid
        ),
      {
        initialProps: { allActualsAreSubmitted: false, totalActuals: 14 },
      }
    );

    expect(mockSetIsValid).toHaveBeenCalledWith(false);

    // Change to all submitted
    rerender({ allActualsAreSubmitted: true, totalActuals: 14 });
    expect(mockSetIsValid).toHaveBeenCalledWith(false);
  });

  it('handles edge case of total being 0', () => {
    renderHook(() => useValidateActuals(false, 0, mockSetIsValid));

    expect(mockSetIsValid).toHaveBeenCalledWith(true);
  });

  it('handles edge case of total being exactly 13 when not all submitted', () => {
    renderHook(() => useValidateActuals(false, 13, mockSetIsValid));

    expect(mockSetIsValid).toHaveBeenCalledWith(true);
  });
});
