import { expect } from 'chai';
import {
  getCurrentDealerId,
  getDealerIdHistory,
} from '../helpers/math/spadesMath';
import type { Round } from '../types';
import { initialFirstDealerOrder } from '../helpers/utils/constants';

describe('Dealer Rotation Unit Tests', () => {
  describe('Natural dealer rotation without overrides', () => {
    test('should rotate dealers correctly through 5+ rounds', () => {
      // Round 0: t1p1 should be dealer
      const round0Dealer = getCurrentDealerId({
        dealerIdHistory: [],
        index: 0,
        isCurrent: true,
        firstDealerOrder: initialFirstDealerOrder,
      });
      expect(round0Dealer).to.equal('team1BidsAndActuals.p1Bid');

      // Round 1: t2p1 should be dealer
      const round1Dealer = getCurrentDealerId({
        dealerIdHistory: ['team1BidsAndActuals.p1Bid'],
        index: 1,
        isCurrent: true,
        firstDealerOrder: initialFirstDealerOrder,
      });
      expect(round1Dealer).to.equal('team2BidsAndActuals.p1Bid');

      // Round 2: t1p2 should be dealer
      const round2Dealer = getCurrentDealerId({
        dealerIdHistory: [
          'team1BidsAndActuals.p1Bid',
          'team2BidsAndActuals.p1Bid',
        ],
        index: 2,
        isCurrent: true,
        firstDealerOrder: initialFirstDealerOrder,
      });
      expect(round2Dealer).to.equal('team1BidsAndActuals.p2Bid');

      // Round 3: t2p2 should be dealer
      const round3Dealer = getCurrentDealerId({
        dealerIdHistory: [
          'team1BidsAndActuals.p1Bid',
          'team2BidsAndActuals.p1Bid',
          'team1BidsAndActuals.p2Bid',
        ],
        index: 3,
        isCurrent: true,
        firstDealerOrder: initialFirstDealerOrder,
      });
      expect(round3Dealer).to.equal('team2BidsAndActuals.p2Bid');

      // Round 4: t1p1 should be dealer (cycle back)
      const round4Dealer = getCurrentDealerId({
        dealerIdHistory: [
          'team1BidsAndActuals.p1Bid',
          'team2BidsAndActuals.p1Bid',
          'team1BidsAndActuals.p2Bid',
          'team2BidsAndActuals.p2Bid',
        ],
        index: 4,
        isCurrent: true,
        firstDealerOrder: initialFirstDealerOrder,
      });
      expect(round4Dealer).to.equal('team1BidsAndActuals.p1Bid');

      // Round 5: t2p1 should be dealer
      const round5Dealer = getCurrentDealerId({
        dealerIdHistory: [
          'team1BidsAndActuals.p1Bid',
          'team2BidsAndActuals.p1Bid',
          'team1BidsAndActuals.p2Bid',
          'team2BidsAndActuals.p2Bid',
          'team1BidsAndActuals.p1Bid',
        ],
        index: 5,
        isCurrent: true,
        firstDealerOrder: initialFirstDealerOrder,
      });
      expect(round5Dealer).to.equal('team2BidsAndActuals.p1Bid');
    });
  });

  describe('Dealer rotation with overrides', () => {
    test('should respect dealer overrides for current round', () => {
      // Round 0 with override to t1p2
      const round0Dealer = getCurrentDealerId({
        dealerIdHistory: [],
        index: 0,
        isCurrent: true,
        firstDealerOrder: initialFirstDealerOrder,
        dealerOverride: 'team1BidsAndActuals.p2Bid',
      });
      expect(round0Dealer).to.equal('team1BidsAndActuals.p2Bid');

      // Round 1 should be t2p2 (next dealer after Bob's override)
      const round1Dealer = getCurrentDealerId({
        dealerIdHistory: ['team1BidsAndActuals.p2Bid'], // Previous round had override
        index: 1,
        isCurrent: true,
        firstDealerOrder: initialFirstDealerOrder,
      });
      expect(round1Dealer).to.equal('team2BidsAndActuals.p2Bid');
    });

    test('should respect dealer overrides for past rounds', () => {
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
          dealerOverride: 'team1BidsAndActuals.p2Bid', // Round 0 had Bob as dealer
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
          dealerOverride: null, // Round 1 had no override
        },
      ];

      // Round 0 should show Bob as dealer (from override)
      const round0Dealer = getCurrentDealerId({
        dealerIdHistory: [
          'team1BidsAndActuals.p2Bid',
          'team2BidsAndActuals.p1Bid',
        ],
        index: 0,
        isCurrent: false,
        firstDealerOrder: initialFirstDealerOrder,
        roundHistory,
      });
      expect(round0Dealer).to.equal('team1BidsAndActuals.p2Bid');

      // Round 1 should show Charlie as dealer (natural rotation)
      const round1Dealer = getCurrentDealerId({
        dealerIdHistory: [
          'team1BidsAndActuals.p2Bid',
          'team2BidsAndActuals.p1Bid',
        ],
        index: 1,
        isCurrent: false,
        firstDealerOrder: initialFirstDealerOrder,
        roundHistory,
      });
      expect(round1Dealer).to.equal('team2BidsAndActuals.p1Bid');
    });
  });

  describe('Edge cases', () => {
    test('should handle dealer overrides that coincide with natural rotation', () => {
      // Round 0: natural dealer is t1p1, override to t1p2
      const round0Dealer = getCurrentDealerId({
        dealerIdHistory: [],
        index: 0,
        isCurrent: true,
        firstDealerOrder: initialFirstDealerOrder,
        dealerOverride: 'team1BidsAndActuals.p2Bid',
      });
      expect(round0Dealer).to.equal('team1BidsAndActuals.p2Bid');

      // Round 1: natural dealer would be t2p1, but override to t1p1
      const round1Dealer = getCurrentDealerId({
        dealerIdHistory: ['team1BidsAndActuals.p2Bid'],
        index: 1,
        isCurrent: true,
        firstDealerOrder: initialFirstDealerOrder,
        dealerOverride: 'team1BidsAndActuals.p1Bid',
      });
      expect(round1Dealer).to.equal('team1BidsAndActuals.p1Bid');

      // Round 2: natural dealer would be t1p2, but override to t2p2
      const round2Dealer = getCurrentDealerId({
        dealerIdHistory: [
          'team1BidsAndActuals.p2Bid',
          'team1BidsAndActuals.p1Bid',
        ],
        index: 2,
        isCurrent: true,
        firstDealerOrder: initialFirstDealerOrder,
        dealerOverride: 'team2BidsAndActuals.p2Bid',
      });
      expect(round2Dealer).to.equal('team2BidsAndActuals.p2Bid');
    });

    test('should handle multiple rounds with overrides and verify past rounds remain unchanged', () => {
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
          dealerOverride: 'team1BidsAndActuals.p2Bid', // Round 0: Bob
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
          dealerOverride: 'team2BidsAndActuals.p2Bid', // Round 1: David
        },
        {
          team1BidsAndActuals: {
            p1Bid: '1',
            p2Bid: '4',
            p1Actual: '1',
            p2Actual: '4',
          },
          team2BidsAndActuals: {
            p1Bid: '2',
            p2Bid: '6',
            p1Actual: '2',
            p2Actual: '6',
          },
          dealerOverride: 'team1BidsAndActuals.p1Bid', // Round 2: Alice
        },
      ];

      // Verify past rounds still have their correct dealers
      const round0Dealer = getCurrentDealerId({
        dealerIdHistory: [
          'team1BidsAndActuals.p2Bid',
          'team2BidsAndActuals.p2Bid',
          'team1BidsAndActuals.p1Bid',
        ],
        index: 0,
        isCurrent: false,
        firstDealerOrder: initialFirstDealerOrder,
        roundHistory,
      });
      expect(round0Dealer).to.equal('team1BidsAndActuals.p2Bid'); // Bob

      const round1Dealer = getCurrentDealerId({
        dealerIdHistory: [
          'team1BidsAndActuals.p2Bid',
          'team2BidsAndActuals.p2Bid',
          'team1BidsAndActuals.p1Bid',
        ],
        index: 1,
        isCurrent: false,
        firstDealerOrder: initialFirstDealerOrder,
        roundHistory,
      });
      expect(round1Dealer).to.equal('team2BidsAndActuals.p2Bid'); // David

      const round2Dealer = getCurrentDealerId({
        dealerIdHistory: [
          'team1BidsAndActuals.p2Bid',
          'team2BidsAndActuals.p2Bid',
          'team1BidsAndActuals.p1Bid',
        ],
        index: 2,
        isCurrent: false,
        firstDealerOrder: initialFirstDealerOrder,
        roundHistory,
      });
      expect(round2Dealer).to.equal('team1BidsAndActuals.p1Bid'); // Alice

      // Round 3: next dealer after Alice should be Charlie (t2p1)
      const round3Dealer = getCurrentDealerId({
        dealerIdHistory: [
          'team1BidsAndActuals.p2Bid',
          'team2BidsAndActuals.p2Bid',
          'team1BidsAndActuals.p1Bid',
        ],
        index: 3,
        isCurrent: true,
        firstDealerOrder: initialFirstDealerOrder,
      });
      expect(round3Dealer).to.equal('team2BidsAndActuals.p1Bid'); // Charlie
    });
  });

  describe('getDealerIdHistory function', () => {
    test('should calculate dealer history correctly', () => {
      const roundHistory: Round[] = [
        { team1BidsAndActuals: { p1Bid: '', p2Bid: '', p1Actual: '', p2Actual: '' }, team2BidsAndActuals: { p1Bid: '', p2Bid: '', p1Actual: '', p2Actual: '' } },
        { team1BidsAndActuals: { p1Bid: '', p2Bid: '', p1Actual: '', p2Actual: '' }, team2BidsAndActuals: { p1Bid: '', p2Bid: '', p1Actual: '', p2Actual: '' } },
        { team1BidsAndActuals: { p1Bid: '', p2Bid: '', p1Actual: '', p2Actual: '' }, team2BidsAndActuals: { p1Bid: '', p2Bid: '', p1Actual: '', p2Actual: '' } },
      ];

      const dealerIdHistory = getDealerIdHistory(
        roundHistory,
        initialFirstDealerOrder
      );

      // Should have 3 dealers in history
      expect(dealerIdHistory).to.have.length(3);

      // Round 0: t1p1
      expect(dealerIdHistory[0]).to.equal('team1BidsAndActuals.p1Bid');

      // Round 1: t2p1
      expect(dealerIdHistory[1]).to.equal('team2BidsAndActuals.p1Bid');

      // Round 2: t1p2
      expect(dealerIdHistory[2]).to.equal('team1BidsAndActuals.p2Bid');
    });

    test('should calculate dealer history correctly with overrides', () => {
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
          dealerOverride: 'team1BidsAndActuals.p2Bid', // Round 0: Bob instead of Alice
        },
      ];

      const dealerIdHistory = getDealerIdHistory(
        roundHistory,
        initialFirstDealerOrder
      );

      // Should have 1 dealer in history
      expect(dealerIdHistory).to.have.length(1);

      // Round 0: t1p2 (Bob) due to override
      expect(dealerIdHistory[0]).to.equal('team1BidsAndActuals.p2Bid');
    });
  });

  describe('Critical bug scenario', () => {
    test('should correctly rotate dealer after round 0 override', () => {
      // This test reproduces the exact bug scenario described by the user

      // Round 0: Override from t1p1 (Alice) to t1p2 (Bob)
      const round0Dealer = getCurrentDealerId({
        dealerIdHistory: [],
        index: 0,
        isCurrent: true,
        firstDealerOrder: initialFirstDealerOrder,
        dealerOverride: 'team1BidsAndActuals.p2Bid',
      });
      expect(round0Dealer).to.equal('team1BidsAndActuals.p2Bid'); // Bob

      // After completing round 0, round 1 should have t2p2 (David) as dealer
      // NOT t1p2 (Bob) - that would be wrong!
      const round1Dealer = getCurrentDealerId({
        dealerIdHistory: ['team1BidsAndActuals.p2Bid'], // Bob was dealer in round 0
        index: 1,
        isCurrent: true,
        firstDealerOrder: initialFirstDealerOrder,
      });
      expect(round1Dealer).to.equal('team2BidsAndActuals.p2Bid'); // David
    });
  });
});
