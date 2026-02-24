import { vi } from 'vitest';
import { getEditedRoundHistory } from '../helpers/utils/helperFunctions';
import type { Round } from '../types';

// Test the helper function directly
describe('ButtonGrid - roundHistory Error Handling', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    // Silence expected warnings from guard logic during these tests
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
  });

  afterEach(() => {
    if (warnSpy) warnSpy.mockRestore();
  });

  it('should handle roundHistory error when roundHistory is not an array', () => {
    // This should not throw an error anymore
    expect(() => {
      getEditedRoundHistory({
        index: 0,
        updatedRound: {} as unknown as Round,
        roundHistory: null as unknown as Round[],
      });
    }).not.toThrow();
  });

  it('should handle roundHistory error when roundHistory is undefined', () => {
    // This should not throw an error anymore
    expect(() => {
      getEditedRoundHistory({
        index: 0,
        updatedRound: {} as unknown as Round,
        roundHistory: undefined as unknown as Round[],
      });
    }).not.toThrow();
  });

  it('should handle roundHistory error when roundHistory is not iterable', () => {
    // This should not throw an error anymore
    expect(() => {
      getEditedRoundHistory({
        index: 0,
        updatedRound: {} as unknown as Round,
        roundHistory: 'not an array' as unknown as Round[],
      });
    }).not.toThrow();
  });
});
