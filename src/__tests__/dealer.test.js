import {
  rotateDealerOrder,
  getCurrentDealerId,
} from '../helpers/math/spadesMath';
import { expect } from 'chai';

test('rotateDealerOrder returns a new array with the order rotated', () => {
  const initialOrder = ['p1', 'p2', 'p3', 'p4'];
  const rotatedOnce = rotateDealerOrder(initialOrder);
  expect(rotatedOnce).deep.equals(['p2', 'p3', 'p4', 'p1']);

  const rotatedTwice = rotateDealerOrder(rotatedOnce);
  expect(rotatedTwice).deep.equals(['p3', 'p4', 'p1', 'p2']);

  // Check if the original array is not mutated
  expect(initialOrder).deep.equals(['p1', 'p2', 'p3', 'p4']);
});

test('rotateDealerOrder handles empty array', () => {
  const emptyOrder = [];
  const rotatedEmpty = rotateDealerOrder(emptyOrder);
  expect(rotatedEmpty).deep.equals([]);
});

test('rotateDealerOrder handles single element array', () => {
  const singleElementOrder = ['p1'];
  const rotatedSingle = rotateDealerOrder(singleElementOrder);
  expect(rotatedSingle).deep.equals(['p1']);
});

describe('Dealer Override Functionality', () => {
  const mockFirstDealerOrder = [
    'team1BidsAndActuals.p1Bid',
    'team1BidsAndActuals.p2Bid',
    'team2BidsAndActuals.p1Bid',
    'team2BidsAndActuals.p2Bid',
  ];

  test('dealer override for current round should not affect past rounds', () => {
    const roundHistory = [
      {
        team1BidsAndActuals: {
          p1Bid: '3',
          p2Bid: '2',
          p1Actual: '3',
          p2Actual: '2',
        },
        team2BidsAndActuals: {
          p1Bid: '4',
          p2Bid: '4',
          p1Actual: '4',
          p2Actual: '4',
        },
        dealerOverride: null, // No override for round 0
      },
      {
        team1BidsAndActuals: {
          p1Bid: '2',
          p2Bid: '3',
          p1Actual: '2',
          p2Actual: '3',
        },
        team2BidsAndActuals: {
          p1Bid: '3',
          p2Bid: '5',
          p1Actual: '3',
          p2Actual: '5',
        },
        dealerOverride: null, // No override for round 1
      },
    ];

    // Test dealer calculation for past rounds (should use normal rotation)
    const dealerForRound0 = getCurrentDealerId({
      dealerIdHistory: [
        'team1BidsAndActuals.p1Bid',
        'team1BidsAndActuals.p2Bid',
      ],
      index: 0,
      isCurrent: false,
      firstDealerOrder: mockFirstDealerOrder,
      roundHistory,
    });

    const dealerForRound1 = getCurrentDealerId({
      dealerIdHistory: [
        'team1BidsAndActuals.p1Bid',
        'team1BidsAndActuals.p2Bid',
      ],
      index: 1,
      isCurrent: false,
      firstDealerOrder: mockFirstDealerOrder,
      roundHistory,
    });

    // Round 0 should have the first dealer
    expect(dealerForRound0).to.equal('team1BidsAndActuals.p1Bid');
    // Round 1 should have the second dealer
    expect(dealerForRound1).to.equal('team1BidsAndActuals.p2Bid');
  });

  test('dealer override for current round should be respected', () => {
    const currentRoundWithOverride = {
      dealerOverride: 'team2BidsAndActuals.p1Bid', // Override to Charlie
    };

    const dealerForCurrentRound = getCurrentDealerId({
      dealerIdHistory: [
        'team1BidsAndActuals.p1Bid',
        'team1BidsAndActuals.p2Bid',
      ],
      index: 2,
      isCurrent: true,
      firstDealerOrder: mockFirstDealerOrder,
      dealerOverride: currentRoundWithOverride.dealerOverride,
    });

    // Current round should use the override
    expect(dealerForCurrentRound).to.equal('team2BidsAndActuals.p1Bid');
  });

  test('dealer override in round history should be respected for past rounds', () => {
    const roundHistoryWithOverride = [
      {
        team1BidsAndActuals: {
          p1Bid: '3',
          p2Bid: '2',
          p1Actual: '3',
          p2Actual: '2',
        },
        team2BidsAndActuals: {
          p1Bid: '4',
          p2Bid: '4',
          p1Actual: '4',
          p2Actual: '4',
        },
        dealerOverride: 'team2BidsAndActuals.p2Bid', // Override to David for round 0
      },
    ];

    const dealerForRound0 = getCurrentDealerId({
      dealerIdHistory: ['team1BidsAndActuals.p1Bid'],
      index: 0,
      isCurrent: false,
      firstDealerOrder: mockFirstDealerOrder,
      roundHistory: roundHistoryWithOverride,
    });

    // Round 0 should use the override from history
    expect(dealerForRound0).to.equal('team2BidsAndActuals.p2Bid');
  });

  test('editing a past round should not affect dealer override of other rounds', async () => {
    // Import the updateInput function to test it directly
    const { updateInput } = await import(
      '../helpers/utils/helperFunctions.jsx'
    );

    // Create a round history with different dealer overrides
    const roundHistory = [
      {
        team1BidsAndActuals: {
          p1Bid: '3',
          p2Bid: '2',
          p1Actual: '3',
          p2Actual: '2',
        },
        team2BidsAndActuals: {
          p1Bid: '4',
          p2Bid: '4',
          p1Actual: '4',
          p2Actual: '4',
        },
        dealerOverride: 'team1BidsAndActuals.p2Bid', // Round 0 has Bob as dealer
      },
      {
        team1BidsAndActuals: {
          p1Bid: '2',
          p2Bid: '3',
          p1Actual: '2',
          p2Actual: '3',
        },
        team2BidsAndActuals: {
          p1Bid: '3',
          p2Bid: '5',
          p1Actual: '3',
          p2Actual: '5',
        },
        dealerOverride: 'team2BidsAndActuals.p1Bid', // Round 1 has Charlie as dealer
      },
    ];

    // Edit round 0 (change a bid)
    const updatedRound0 = updateInput({
      input: '5',
      currentRound: roundHistory[0],
      fieldToUpdate: 'team1BidsAndActuals.p1Bid',
    });

    // Verify that the dealer override is preserved in round 0
    expect(updatedRound0.dealerOverride).to.equal('team1BidsAndActuals.p2Bid');

    // Verify that round 1's dealer override is not affected
    expect(roundHistory[1].dealerOverride).to.equal(
      'team2BidsAndActuals.p1Bid'
    );

    // Edit round 1 (change an actual)
    const updatedRound1 = updateInput({
      input: '6',
      currentRound: roundHistory[1],
      fieldToUpdate: 'team2BidsAndActuals.p2Actual',
    });

    // Verify that the dealer override is preserved in round 1
    expect(updatedRound1.dealerOverride).to.equal('team2BidsAndActuals.p1Bid');

    // Verify that round 0's dealer override is not affected
    expect(roundHistory[0].dealerOverride).to.equal(
      'team1BidsAndActuals.p2Bid'
    );
  });

  test('updateInput should preserve dealerOverride when it is null', async () => {
    const { updateInput } = await import(
      '../helpers/utils/helperFunctions.jsx'
    );

    const roundWithNullOverride = {
      team1BidsAndActuals: {
        p1Bid: '3',
        p2Bid: '2',
        p1Actual: '3',
        p2Actual: '2',
      },
      team2BidsAndActuals: {
        p1Bid: '4',
        p2Bid: '4',
        p1Actual: '4',
        p2Actual: '4',
      },
      dealerOverride: null,
    };

    const updatedRound = updateInput({
      input: '5',
      currentRound: roundWithNullOverride,
      fieldToUpdate: 'team1BidsAndActuals.p1Bid',
    });

    // Verify that null dealerOverride is preserved
    expect(updatedRound.dealerOverride).to.equal(null);
  });

  test('updateInput should handle rounds without dealerOverride property', async () => {
    const { updateInput } = await import(
      '../helpers/utils/helperFunctions.jsx'
    );

    const roundWithoutOverride = {
      team1BidsAndActuals: {
        p1Bid: '3',
        p2Bid: '2',
        p1Actual: '3',
        p2Actual: '2',
      },
      team2BidsAndActuals: {
        p1Bid: '4',
        p2Bid: '4',
        p1Actual: '4',
        p2Actual: '4',
      },
      // No dealerOverride property
    };

    const updatedRound = updateInput({
      input: '5',
      currentRound: roundWithoutOverride,
      fieldToUpdate: 'team1BidsAndActuals.p1Bid',
    });

    // Verify that the round is updated correctly without adding dealerOverride
    expect(updatedRound.team1BidsAndActuals.p1Bid).to.equal('5');
    expect(updatedRound).to.not.have.property('dealerOverride');
  });
});
