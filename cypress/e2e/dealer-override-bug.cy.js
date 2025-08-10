describe('Dealer Override Bug Fix', () => {
  beforeEach(() => {
    // Set up test data using the same pattern as working tests
    cy.visit('http://localhost:5173/', {
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
    cy.url().should('eq', 'http://localhost:5173/spades-calculator');
  });

  it('should not affect past round dealer when changing current round dealer', () => {
    // Complete first round with default dealer (Alice)
    // Use the same pattern as working tests
    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    // Enter actuals
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

    // Wait for animations to complete (600ms delay + 300ms animation = 900ms total)
    cy.wait(1000);

    // Change dealer for current round (round 2) to Charlie
    // First dealer badge is current round, last is past round
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

  it('should preserve dealer override when editing past rounds', () => {
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

    // Complete second round with different dealer
    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '5').click();

    // Wait for animations to complete
    cy.wait(1000);

    // Change dealer for current round (round 2) to Charlie
    // First dealer badge is current round
    cy.get('[data-cy=dealerBadge]').first().click();
    cy.get('[data-cy=dealerSelectionModal]').should('exist');
    cy.get('[data-cy=dealerOptionButton]').contains('Charlie').click();

    // Complete the second round
    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '5').click();

    // Wait for animations to complete
    cy.wait(1000);

    // Verify that both rounds have their correct dealers
    cy.get('[data-cy=dealerBadge]').should('have.length', 3);

    // The first round should still have Alice as dealer (default)
    // The second round should still have Charlie as dealer (override)
    // The third round should also have Charlie as dealer (override preserved)
    cy.get('[data-cy=dealerBadge]').last().should('be.visible'); // Past round
    cy.get('[data-cy=dealerBadge]').first().should('be.visible'); // Current round

    // Verify that the dealer override is preserved by checking that the current round
    // still has Charlie as dealer (the override should persist)
    cy.get('[data-cy=dealerBadge]').first().click();
    cy.get('[data-cy=dealerSelectionModal]').should('exist');
    // Charlie should still be selected as dealer
    cy.get('[data-cy=dealerCancelButton]').click();
  });

  it('should not allow dealer changes for past rounds', () => {
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

    // Wait for animations to complete
    cy.wait(1000);

    // Try to click dealer badge for past round (should not open modal)
    // Last dealer badge is past round
    cy.get('[data-cy=dealerBadge]').last().click();

    // Modal should not appear for past rounds
    cy.get('[data-cy=dealerSelectionModal]').should('not.exist');
  });
});
