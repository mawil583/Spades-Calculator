import {
  setLocalStorage,
  getLocalStorage,
} from '../helpers/utils/helperFunctions';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('Team Total Storage', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.clear.mockClear();
  });

  describe('team total localStorage operations', () => {
    it('should save team total to localStorage', () => {
      const teamTotal = 8;
      const key = 'team1ActualTotal';

      setLocalStorage(key, teamTotal);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        key,
        JSON.stringify(teamTotal)
      );
    });

    it('should retrieve team total from localStorage', () => {
      const teamTotal = 8;
      const key = 'team1ActualTotal';

      localStorageMock.getItem.mockReturnValue(JSON.stringify(teamTotal));

      const retrieved = getLocalStorage(key);

      expect(localStorageMock.getItem).toHaveBeenCalledWith(key);
      expect(retrieved).toBe(teamTotal);
    });

    it('should handle team total of "Total entered" in storage', () => {
      const teamTotalDisplay = 'Total entered';
      const teamTotalValue = 8;
      const key = 'team1ActualTotal';

      // Store the actual numeric value
      setLocalStorage(key, teamTotalValue);

      // Store the display value separately
      setLocalStorage('team1ActualTotalDisplay', teamTotalDisplay);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        key,
        JSON.stringify(teamTotalValue)
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'team1ActualTotalDisplay',
        JSON.stringify(teamTotalDisplay)
      );
    });

    it('should retrieve both numeric value and display value', () => {
      const teamTotalValue = 8;
      const teamTotalDisplay = 'Total entered';

      localStorageMock.getItem
        .mockReturnValueOnce(JSON.stringify(teamTotalValue))
        .mockReturnValueOnce(JSON.stringify(teamTotalDisplay));

      const retrievedValue = getLocalStorage('team1ActualTotal');
      const retrievedDisplay = getLocalStorage('team1ActualTotalDisplay');

      expect(retrievedValue).toBe(teamTotalValue);
      expect(retrievedDisplay).toBe(teamTotalDisplay);
    });
  });

  describe('team total persistence', () => {
    it('should persist team total across page reloads', () => {
      const teamTotal = 6;
      const key = 'team1ActualTotal';

      // Simulate saving
      setLocalStorage(key, teamTotal);

      // Simulate page reload by clearing mocks and setting up retrieval
      localStorageMock.setItem.mockClear();
      localStorageMock.getItem.mockReturnValue(JSON.stringify(teamTotal));

      // Simulate retrieving after reload
      const retrieved = getLocalStorage(key);

      expect(retrieved).toBe(teamTotal);
    });
  });
});
