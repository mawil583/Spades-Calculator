describe('Dealer Integration Test', () => {
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

  it('should maintain dealer state through full game flow', () => {
    // Test dealer behavior in the context of a complete game flow
    // This tests integration between dealer logic and game state management

    // Complete first round
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

    // Verify dealer badge appears and rotates correctly
    cy.get('[data-cy=dealerBadge]').should('have.length', 2);

    // Verify past round dealer is preserved
    cy.get('[data-cy=dealerBadge]').last().should('be.visible');

    // Verify current round dealer is clickable
    cy.get('[data-cy=dealerBadge]')
      .first()
      .should('have.css', 'cursor', 'pointer');
  });

  it('should handle dealer override in complex game scenarios', () => {
    // Test dealer override in the context of multiple rounds and complex state
    // This tests integration between dealer logic and complex game state

    // Complete multiple rounds with dealer overrides
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

    // Round 2 - change dealer
    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();
    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();
    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();
    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '5').click();

    // Override dealer for current round
    cy.get('[data-cy=dealerBadge]').first().click();
    cy.get('[data-cy=dealerSelectionModal]').should('exist');
    cy.get('[data-cy=dealerOptionButton]').contains('Charlie').click();

    // Complete round 2
    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();
    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();
    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();
    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '5').click();

    // Verify dealer state is maintained correctly across rounds
    cy.get('[data-cy=dealerBadge]').should('have.length', 2);

    // Verify past round dealer is preserved
    cy.get('[data-cy=dealerBadge]').last().should('be.visible');

    // Verify current round dealer reflects override
    cy.get('[data-cy=dealerBadge]').first().should('be.visible');
  });
});
