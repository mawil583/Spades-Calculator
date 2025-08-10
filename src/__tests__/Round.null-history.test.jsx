import React from 'react';
import { render } from '@testing-library/react';
import Round from '../components/game/Round';
import { GlobalContext } from '../helpers/context/GlobalContext';

const MockProvider = ({ children, contextValue }) => (
  <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>
);

describe('Round component - null safety', () => {
  beforeEach(() => {
    // minimal localStorage setup expected by Round
    localStorage.setItem(
      'names',
      JSON.stringify({ team1Name: 'Team 1', team2Name: 'Team 2' })
    );
    localStorage.setItem('nilScoringRule', JSON.stringify('HELPS_TEAM_BID'));
  });

  it('does not crash when roundHistory contains null at target index', () => {
    const ctx = {
      currentRound: {
        team1BidsAndActuals: { p1Bid: '', p2Bid: '', p1Actual: '', p2Actual: '' },
        team2BidsAndActuals: { p1Bid: '', p2Bid: '', p1Actual: '', p2Actual: '' },
      },
      resetCurrentRound: jest.fn(),
      setRoundHistory: jest.fn(),
    };

    const { container } = render(
      <MockProvider contextValue={ctx}>
        <Round isCurrent={false} roundHistory={[null]} roundIndex={0} />
      </MockProvider>
    );

    // Should render nothing for this invalid past round (no crash)
    expect(container.firstChild).toBeNull();
  });
});
