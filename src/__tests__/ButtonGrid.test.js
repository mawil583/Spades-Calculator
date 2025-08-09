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
    // Import the helper function directly to test it
    const {
      getEditedRoundHistory,
    } = require('../helpers/utils/helperFunctions');

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
    const {
      getEditedRoundHistory,
    } = require('../helpers/utils/helperFunctions');

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
    const {
      getEditedRoundHistory,
    } = require('../helpers/utils/helperFunctions');

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
