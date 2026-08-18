import { renderHook } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { useIndependentTeamScoring } from '../helpers/utils/hooks';
import type { Round, InputValue } from '../types';

// A round where every bid and actual is filled and actuals sum to 13 — i.e. the
// exact shape that triggers the auto-complete side effect.
const completeRound = {
  team1BidsAndActuals: { p1Bid: '3', p2Bid: '4', p1Actual: '3', p2Actual: '4' },
  team2BidsAndActuals: { p1Bid: '2', p2Bid: '3', p1Actual: '2', p2Actual: '4' },
} as Round;

const isNotDefault = (v: InputValue) => v !== '';

describe('useIndependentTeamScoring — viewer is read-only', () => {
  it('does not complete the round when role is viewer', () => {
    const setRoundHistory = vi.fn();
    const resetCurrentRound = vi.fn();

    renderHook(() =>
      useIndependentTeamScoring(
        completeRound,
        resetCurrentRound,
        isNotDefault,
        setRoundHistory,
        [],
        'viewer',
      ),
    );

    expect(setRoundHistory).not.toHaveBeenCalled();
    expect(resetCurrentRound).not.toHaveBeenCalled();
  });

  it('still completes the round for the leader', () => {
    const setRoundHistory = vi.fn();
    const resetCurrentRound = vi.fn();

    renderHook(() =>
      useIndependentTeamScoring(
        completeRound,
        resetCurrentRound,
        isNotDefault,
        setRoundHistory,
        [],
        'leader',
      ),
    );

    expect(setRoundHistory).toHaveBeenCalled();
    expect(resetCurrentRound).toHaveBeenCalled();
  });
});
