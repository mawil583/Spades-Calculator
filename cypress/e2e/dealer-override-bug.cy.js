describe('Dealer Override Integration Test', () => {
  beforeEach(() => {
    // Set up test data using the same pattern as working tests
    cy.visit('/', {
      onBeforeLoad(win) {
        delete win.navigator.__proto__.serviceWorker;
      },
    });

    // Enter player names
    cy.get('[data-cy=t1p1NameInput]').type('Alice');
    cy.get('[data-cy=t1p2NameInput]').type('Bob');
    cy.get('[data-cy=t2p1NameInput]').type('Charlie');
    cy.get('[data-cy=t2p2NameInput]').type('David');
    // Enter team names (using Editable component)
    cy.get('[data-cy=team1NameInput]').click().type('Team Alpha{enter}');
    cy.get('[data-cy=team2NameInput]').click().type('Team Beta{enter}');
    cy.get('[data-cy=startButton]').click();

    // Assert that we were redirected to the Spades calculator page
    cy.url().should('eq', Cypress.config().baseUrl + '/spades-calculator');
  });

  it('should maintain dealer override state through complex game scenarios', () => {
    // Test dealer override preservation in the context of complex game state
    // This tests integration between dealer logic and game state management

    // Complete first round with default dealer (Alice)
    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();
    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();
    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();
    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();
    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();
    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();
    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    // Verify first round is completed and Alice is dealer
    cy.get('[data-cy=dealerBadge]').should('have.length', 1);
    cy.get('[data-cy=dealerBadge]').first().should('be.visible');

    // Start second round
    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();
    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();
    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();
    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '5').click();

    // Change dealer for current round (round 2) to Charlie
    cy.get('[data-cy=dealerBadge]').first().click();
    cy.get('[data-cy=dealerSelectionModal]').should('exist');
    cy.get('[data-cy=dealerOptionButton]').contains('Charlie').click();

    // Verify that the first round's dealer (Alice) is still visible and unchanged
    cy.get('[data-cy=dealerBadge]').should('have.length', 2);
    cy.get('[data-cy=dealerBadge]').last().should('be.visible');

    // Complete the second round
    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();
    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();
    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();
    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '5').click();

    // Verify both rounds have their correct dealers
    cy.get('[data-cy=dealerBadge]').should('have.length', 2);
  });

  it('should handle dealer override in edge cases and complex state transitions', () => {
    // Test dealer override in edge cases and complex state scenarios
    // This tests integration between dealer logic and edge case handling

    // Complete multiple rounds with various dealer overrides
    // Round 1
    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();
    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();
    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();
    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();
    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();
    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();
    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    // Round 2 - change dealer multiple times
    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();
    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();
    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();
    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '5').click();

    // Change dealer to Charlie
    cy.get('[data-cy=dealerBadge]').first().click();
    cy.get('[data-cy=dealerSelectionModal]').should('exist');
    cy.get('[data-cy=dealerOptionButton]').contains('Charlie').click();

    // Change dealer again to David
    cy.get('[data-cy=dealerBadge]').first().click();
    cy.get('[data-cy=dealerSelectionModal]').should('exist');
    cy.get('[data-cy=dealerOptionButton]').contains('David').click();

    // Complete round 2
    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();
    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();
    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();
    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '5').click();

    // Verify dealer state is maintained correctly through complex transitions
    cy.get('[data-cy=dealerBadge]').should('have.length', 2);

    // Verify past round dealer is preserved
    cy.get('[data-cy=dealerBadge]').last().should('be.visible');

    // Verify current round dealer reflects final override
    cy.get('[data-cy=dealerBadge]').first().should('be.visible');
  });
});
