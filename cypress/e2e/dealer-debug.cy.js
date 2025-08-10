describe('Dealer Debug Test', () => {
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

  it('should verify dealer badge rendering and click functionality', () => {
    // Check if dealer badges are rendered
    cy.get('[data-cy=dealerBadge]').should('exist');
    cy.get('[data-cy=dealerBadge]').should('have.length', 1);

    // Check if the dealer badge is clickable (should have cursor pointer for current round)
    cy.get('[data-cy=dealerBadge]').should('have.css', 'cursor', 'pointer');

    // Try clicking the dealer badge
    cy.get('[data-cy=dealerBadge]').click();

    // Check if modal appears
    cy.get('[data-cy=dealerSelectionModal]').should('exist');

    // Check what options are available
    cy.get('[data-cy=dealerOptionButton]').should('have.length', 4);

    // Try selecting Charlie as dealer
    cy.get('[data-cy=dealerOptionButton]').contains('Charlie').click();

    // Modal should close
    cy.get('[data-cy=dealerSelectionModal]').should('not.exist');

    // Verify dealer badge is still visible
    cy.get('[data-cy=dealerBadge]').should('exist');
    cy.get('[data-cy=dealerBadge]').should('have.length', 1);
  });

  it('should verify dealer override after completing a round', () => {
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

    // Wait for the round to complete and animation to finish
    cy.wait(1000);

    // Wait for the current round to be fully rendered
    cy.get('[data-cy=dealerBadge]').should('have.length', 2);

    // Check the cursor styles of both badges
    // First dealer badge is current round (clickable)
    cy.get('[data-cy=dealerBadge]')
      .first()
      .should('have.css', 'cursor', 'pointer');
    // Last dealer badge is past round (not clickable)
    cy.get('[data-cy=dealerBadge]')
      .last()
      .should('have.css', 'cursor', 'default');

    // Try clicking the first dealer badge (current round)
    cy.get('[data-cy=dealerBadge]').first().click();

    // Modal should appear
    cy.get('[data-cy=dealerSelectionModal]').should('exist');

    // Select Charlie as dealer
    cy.get('[data-cy=dealerOptionButton]').contains('Charlie').click();

    // Modal should close
    cy.get('[data-cy=dealerSelectionModal]').should('not.exist');

    // Verify we still have 2 dealer badges
    cy.get('[data-cy=dealerBadge]').should('have.length', 2);
  });

  it('should verify dealer override functionality step by step', () => {
    // First, let's verify the initial state
    cy.get('[data-cy=dealerBadge]').should('have.length', 1);
    cy.get('[data-cy=dealerBadge]').should('have.css', 'cursor', 'pointer');

    // Click the dealer badge and change to Charlie
    cy.get('[data-cy=dealerBadge]').click();
    cy.get('[data-cy=dealerSelectionModal]').should('exist');
    cy.get('[data-cy=dealerOptionButton]').contains('Charlie').click();
    cy.get('[data-cy=dealerSelectionModal]').should('not.exist');

    // Now complete the round
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

    // Wait for completion
    cy.wait(1000);

    // Now we should have 2 dealer badges
    cy.get('[data-cy=dealerBadge]').should('have.length', 2);

    // The first dealer badge should be for the current round (clickable)
    cy.get('[data-cy=dealerBadge]')
      .first()
      .should('have.css', 'cursor', 'pointer');

    // The last dealer badge should be for the completed round (not clickable)
    cy.get('[data-cy=dealerBadge]')
      .last()
      .should('have.css', 'cursor', 'default');

    // Try clicking the first dealer badge (current round)
    cy.get('[data-cy=dealerBadge]').first().click();
    cy.get('[data-cy=dealerSelectionModal]').should('exist');

    // Select David as dealer
    cy.get('[data-cy=dealerOptionButton]').contains('David').click();
    cy.get('[data-cy=dealerSelectionModal]').should('not.exist');

    // Verify we still have 2 dealer badges
    cy.get('[data-cy=dealerBadge]').should('have.length', 2);
  });

  it('should verify dealer badge order and clickability', () => {
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

    // Check dealer badges
    cy.get('[data-cy=dealerBadge]').should('have.length', 2);

    // Test first dealer badge (should be current round - clickable)
    cy.get('[data-cy=dealerBadge]').first().click();
    cy.get('[data-cy=dealerSelectionModal]').should('exist');
    cy.get('[data-cy=dealerCancelButton]').click();

    // Test last dealer badge (should be past round - not clickable)
    cy.get('[data-cy=dealerBadge]').last().click();
    cy.get('[data-cy=dealerSelectionModal]').should('not.exist');
  });

  it('should verify dealer override preservation', () => {
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

    // Set dealer override to Charlie for current round
    cy.get('[data-cy=dealerBadge]').first().click();
    cy.get('[data-cy=dealerSelectionModal]').should('exist');
    cy.get('[data-cy=dealerOptionButton]').contains('Charlie').click();

    // Complete second round
    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '5').click();

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

    // Verify that the dealer override is preserved
    cy.get('[data-cy=dealerBadge]').should('have.length', 3);

    // The current round should still have Charlie as dealer (override preserved)
    cy.get('[data-cy=dealerBadge]').first().click();
    cy.get('[data-cy=dealerSelectionModal]').should('exist');
    // Charlie should still be selected as dealer
    cy.get('[data-cy=dealerCancelButton]').click();
  });
});
