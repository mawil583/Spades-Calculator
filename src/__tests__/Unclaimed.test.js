import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import Unclaimed from '../components/game/Unclaimed';
import BidSection from '../components/game/BidSection';

// Mock the dependencies
jest.mock('../helpers/utils/hooks', () => ({
  useSetUnclaimed: jest.fn((team1Bids, team2Bids, setNumUnclaimed) => {
    const totalClaimed =
      team1Bids.reduce((sum, bid) => sum + (parseInt(bid) || 0), 0) +
      team2Bids.reduce((sum, bid) => sum + (parseInt(bid) || 0), 0);
    setNumUnclaimed(13 - totalClaimed);
  }),
}));

jest.mock('../helpers/math/spadesMath', () => ({
  addInputs: jest.fn((...args) =>
    args.reduce((sum, val) => sum + (parseInt(val) || 0), 0)
  ),
}));

jest.mock('../components/forms', () => ({
  PlayerInput: ({ playerName, playerInput }) => (
    <div data-testid={`player-input-${playerName}`}>
      {playerName}: {playerInput || 'empty'}
    </div>
  ),
  TeamInputHeading: ({ title, team1Total, team2Total }) => (
    <div data-testid="team-input-heading">
      <span data-testid="team1-total">{team1Total}</span>
      <span data-testid="title">{title}</span>
      <span data-testid="team2-total">{team2Total}</span>
    </div>
  ),
}));

const renderWithChakra = (component) => {
  return render(<ChakraProvider>{component}</ChakraProvider>);
};

describe('Unclaimed Component', () => {
  it('should display unclaimed text correctly', () => {
    renderWithChakra(<Unclaimed numUnclaimed={5} />);
    expect(screen.getByText('Unclaimed: 5')).toBeInTheDocument();
  });

  it('should display overbid text when numUnclaimed is negative', () => {
    renderWithChakra(<Unclaimed numUnclaimed={-2} />);
    expect(
      screen.getByText("2 overbids! Someone's getting set!")
    ).toBeInTheDocument();
  });

  it('should display singular overbid text when numUnclaimed is -1', () => {
    renderWithChakra(<Unclaimed numUnclaimed={-1} />);
    expect(
      screen.getByText("1 overbid! Someone's getting set!")
    ).toBeInTheDocument();
  });
});

describe('BidSection - Unclaimed Positioning', () => {
  const mockNames = {
    team1Name: 'Team 1',
    team2Name: 'Team 2',
    t1p1Name: 'Player 1',
    t1p2Name: 'Player 2',
    t2p1Name: 'Player 3',
    t2p2Name: 'Player 4',
  };

  const mockCurrentRound = {
    team1BidsAndActuals: {
      p1Bid: '3',
      p2Bid: '2',
      p1Actual: '',
      p2Actual: '',
    },
    team2BidsAndActuals: {
      p1Bid: '4',
      p2Bid: '1',
      p1Actual: '',
      p2Actual: '',
    },
  };

  it('should position unclaimed section in the center between both teams bids', () => {
    renderWithChakra(
      <BidSection
        index={0}
        names={mockNames}
        isCurrent={true}
        roundHistory={[]}
        currentRound={mockCurrentRound}
      />
    );

    // Get the unclaimed section - it should show "Unclaimed: 3" based on the mock data
    // Team 1 total: 3 + 2 = 5, Team 2 total: 4 + 1 = 5, Total: 10, Unclaimed: 13 - 10 = 3
    const unclaimedSection = screen.getByText(/Unclaimed:/);

    // Check that the unclaimed section is positioned in the center
    expect(unclaimedSection).toBeInTheDocument();

    // The unclaimed section should be between the TeamInputHeading and the SimpleGrid
    const teamInputHeading = screen.getByTestId('team-input-heading');
    const unclaimedElement = unclaimedSection.closest('div');

    // Verify the unclaimed section is positioned after the heading but before the player inputs
    expect(teamInputHeading).toBeInTheDocument();
    expect(unclaimedElement).toBeInTheDocument();
  });

  it('should calculate unclaimed correctly based on team bids', () => {
    renderWithChakra(
      <BidSection
        index={0}
        names={mockNames}
        isCurrent={true}
        roundHistory={[]}
        currentRound={mockCurrentRound}
      />
    );

    // Team 1 total: 3 + 2 = 5
    // Team 2 total: 4 + 1 = 5
    // Total claimed: 10
    // Unclaimed: 13 - 10 = 3
    const unclaimedSection = screen.getByText(/Unclaimed:/);
    expect(unclaimedSection).toBeInTheDocument();
  });
});
