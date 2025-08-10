import { getEditedRoundHistory } from '../helpers/utils/helperFunctions';

// Test the helper function directly
describe('ButtonGrid - roundHistory Error Handling', () => {
  let warnSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    // Silence expected warnings from guard logic during these tests
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    if (warnSpy) warnSpy.mockRestore();
  });

  it('should handle roundHistory error when roundHistory is not an array', () => {
    // This should not throw an error anymore
    expect(() => {
      getEditedRoundHistory({
        index: 0,
        updatedRound: {},
        roundHistory: null,
      });
    }).not.toThrow();
  });

  it('should handle roundHistory error when roundHistory is undefined', () => {
    // This should not throw an error anymore
    expect(() => {
      getEditedRoundHistory({
        index: 0,
        updatedRound: {},
        roundHistory: undefined,
      });
    }).not.toThrow();
  });

  it('should handle roundHistory error when roundHistory is not iterable', () => {
    // This should not throw an error anymore
    expect(() => {
      getEditedRoundHistory({
        index: 0,
        updatedRound: {},
        roundHistory: 'not an array',
      });
    }).not.toThrow();
  });
});
