describe('Round history editing does not drop earlier rounds', () => {
  it('reproduces the 14-actuals error, edits to 13, and keeps Round 1 visible', () => {
    // Navigate to app and enter names
    cy.visit('http://localhost:3000/', {
      onBeforeLoad(win) {
        delete win.navigator.__proto__.serviceWorker;
        win.localStorage.clear();
      },
    });

    cy.get('[data-cy=t1p1NameInput]').type('Mike');
    cy.get('[data-cy=t1p2NameInput]').type('Kim');
    cy.get('[data-cy=t2p1NameInput]').type('Mom');
    cy.get('[data-cy=t2p2NameInput]').type('Dad');
    cy.get('[data-cy=startButton]').click();
    cy.url().should('eq', 'http://localhost:3000/spades-calculator');

    // Round 1: all bids 3
    bid('team1BidsAndActuals.p1Bid', '3');
    bid('team2BidsAndActuals.p1Bid', '3');
    bid('team1BidsAndActuals.p2Bid', '3');
    bid('team2BidsAndActuals.p2Bid', '3');

    // Round 1: actuals -> 3,3,3,4 (totals 13)
    actual('team1BidsAndActuals.p1Actual', '3');
    actual('team2BidsAndActuals.p1Actual', '3');
    actual('team1BidsAndActuals.p2Actual', '3');
    actual('team2BidsAndActuals.p2Actual', '4');

    // Assert Round 1 exists
    cy.contains('h3', 'Round 1').should('exist');

    // Round 2: all bids 3
    bid('team1BidsAndActuals.p1Bid', '3');
    bid('team2BidsAndActuals.p1Bid', '3');
    bid('team1BidsAndActuals.p2Bid', '3');
    bid('team2BidsAndActuals.p2Bid', '3');

    // Round 2: actuals -> 3,3,3,5 (totals 14) triggers error modal
    actual('team1BidsAndActuals.p1Actual', '3');
    actual('team2BidsAndActuals.p1Actual', '3');
    actual('team1BidsAndActuals.p2Actual', '3');
    actual('team2BidsAndActuals.p2Actual', '5');

    // Assert error modal triggered with correct message
    cy.contains(
      'The total amount of hands must always add up to 13. Yours totaled 14. Correct this before moving on.'
    ).should('exist');

    // Assert Round 2 exists (current, with invalid actuals - no new round created yet)
    cy.get('.round')
      .first()
      .within(() => {
        cy.contains('h3', 'Round 2').should('exist');
        // Should have all inputs (bids and actuals) since they were entered
        cy.get('[data-cy=playerInput]').should('have.length', 8);
        // Should not have bid buttons since all bids are entered
        cy.get('[data-cy=bidButton]').should('have.length', 0);
        // Should have actuals section since all actuals were entered (even if invalid)
        cy.get('[data-cy=actualSection]').should('exist');
      });

    // Assert Round 1 exists with all values entered
    getRoundByHeading('Round 1').within(() => {
      cy.get('[data-cy=playerInput]').should('have.length', 8);
    });

    // Edit the 5 to a 4 in Round 2 actuals (click inside the error modal)
    cy.get('[role=dialog]').contains('[data-cy=playerInput]', '5').click();
    cy.get('[data-cy=bidSelectionModal]').should('exist');
    cy.contains('[data-cy=bidSelectionButton]', '4').click();
    cy.get('[data-cy=bidSelectionModal]').should('not.exist');

    // Error modal goes away
    cy.contains(
      'The total amount of hands must always add up to 13. Yours totaled 14. Correct this before moving on.'
    ).should('not.exist');

    // After correction, Round 2 should be completed and Round 3 should be current
    cy.get('.round')
      .first()
      .within(() => {
        cy.contains('h3', 'Round 3').should('exist');
        // Should only have bid buttons, no actuals section
        cy.get('[data-cy=bidButton]').should('have.length', 4);
        cy.get('[data-cy=actualSection]').should('not.exist');
        // Should not have any player inputs (since no actuals section)
        cy.get('[data-cy=playerInput]').should('have.length', 0);
      });

    // Ensure Round 1 is still visible (was disappearing before fix)
    cy.contains('h3', 'Round 1').should('exist');
  });

  it('prevents next round from showing actuals section when current round has invalid actuals', () => {
    // Navigate to app and enter names
    cy.visit('http://localhost:3000/', {
      onBeforeLoad(win) {
        delete win.navigator.__proto__.serviceWorker;
        win.localStorage.clear();
      },
    });

    cy.get('[data-cy=t1p1NameInput]').type('Mike');
    cy.get('[data-cy=t1p2NameInput]').type('Kim');
    cy.get('[data-cy=t2p1NameInput]').type('Mom');
    cy.get('[data-cy=t2p2NameInput]').type('Dad');
    cy.get('[data-cy=startButton]').click();
    cy.url().should('eq', 'http://localhost:3000/spades-calculator');

    // Round 1: all bids 3
    bid('team1BidsAndActuals.p1Bid', '3');
    bid('team2BidsAndActuals.p1Bid', '3');
    bid('team1BidsAndActuals.p2Bid', '3');
    bid('team2BidsAndActuals.p2Bid', '3');

    // Round 1: actuals -> 3,3,3,5 (totals 14) triggers error modal
    actual('team1BidsAndActuals.p1Actual', '3');
    actual('team2BidsAndActuals.p1Actual', '3');
    actual('team1BidsAndActuals.p2Actual', '3');
    actual('team2BidsAndActuals.p2Actual', '5');

    // Assert error modal is triggered
    cy.contains(
      'The total amount of hands must always add up to 13. Yours totaled 14. Correct this before moving on.'
    ).should('exist');

    // CRITICAL TEST: Ensure the current round (Round 1) shows actuals section with invalid data
    // This was the bug - the next round was incorrectly showing both bid and actual sections
    cy.get('.round')
      .first()
      .within(() => {
        cy.contains('h3', 'Round 1').should('exist');
        // Should have all inputs (bids and actuals) since they were entered
        cy.get('[data-cy=playerInput]').should('have.length', 8);
        // Should not have bid buttons since all bids are entered
        cy.get('[data-cy=bidButton]').should('have.length', 0);
        // Should have actuals section since all actuals were entered (even if invalid)
        cy.get('[data-cy=actualSection]').should('exist');
      });

    // Verify Round 1 still exists and has all inputs
    getRoundByHeading('Round 1').within(() => {
      cy.get('[data-cy=playerInput]').should('have.length', 8);
    });
  });

  it('ensures next round only shows bid section after correcting error modal', () => {
    // Navigate to app and enter names
    cy.visit('http://localhost:3000/', {
      onBeforeLoad(win) {
        delete win.navigator.__proto__.serviceWorker;
        win.localStorage.clear();
      },
    });

    cy.get('[data-cy=t1p1NameInput]').type('Mike');
    cy.get('[data-cy=t1p2NameInput]').type('Kim');
    cy.get('[data-cy=t2p1NameInput]').type('Mom');
    cy.get('[data-cy=t2p2NameInput]').type('Dad');
    cy.get('[data-cy=startButton]').click();
    cy.url().should('eq', 'http://localhost:3000/spades-calculator');

    // Round 1: all bids 3
    bid('team1BidsAndActuals.p1Bid', '3');
    bid('team2BidsAndActuals.p1Bid', '3');
    bid('team1BidsAndActuals.p2Bid', '3');
    bid('team2BidsAndActuals.p2Bid', '3');

    // Round 1: actuals -> 3,3,3,5 (totals 14) triggers error modal
    actual('team1BidsAndActuals.p1Actual', '3');
    actual('team2BidsAndActuals.p1Actual', '3');
    actual('team1BidsAndActuals.p2Actual', '3');
    actual('team2BidsAndActuals.p2Actual', '5');

    // Assert error modal is triggered
    cy.contains(
      'The total amount of hands must always add up to 13. Yours totaled 14. Correct this before moving on.'
    ).should('exist');

    // Correct the invalid actual in the error modal (change 5 to 4)
    cy.get('[role=dialog]').contains('[data-cy=playerInput]', '5').click();
    cy.get('[data-cy=bidSelectionModal]').should('exist');
    cy.contains('[data-cy=bidSelectionButton]', '4').click();
    cy.get('[data-cy=bidSelectionModal]').should('not.exist');

    // Error modal should disappear
    cy.contains(
      'The total amount of hands must always add up to 13. Yours totaled 14. Correct this before moving on.'
    ).should('not.exist');

    // CRITICAL TEST: After correcting the error modal, the next round (Round 2) should only show bid section
    // This was the bug - the next round was incorrectly showing both bid and actual sections
    cy.get('.round')
      .first()
      .within(() => {
        cy.contains('h3', 'Round 2').should('exist');
        // Should only have bid buttons, no actuals section
        cy.get('[data-cy=bidButton]').should('have.length', 4);
        cy.get('[data-cy=actualSection]').should('not.exist');
        // Should not have any player inputs (since no actuals section)
        cy.get('[data-cy=playerInput]').should('have.length', 0);
      });

    // Verify Round 1 was completed and exists with all inputs
    getRoundByHeading('Round 1').within(() => {
      cy.get('[data-cy=playerInput]').should('have.length', 8);
    });

    // Verify Round 1 has the corrected values (4 instead of 5)
    getRoundByHeading('Round 1').within(() => {
      cy.contains('[data-cy=playerInput]', '4').should('exist');
      cy.contains('[data-cy=playerInput]', '5').should('not.exist');
    });
  });
});

// Helpers
function bid(id, val) {
  cy.get(`[data-cy=bidButton][id="${id}"]`).click();
  cy.contains('[data-cy=bidSelectionButton]', val.toString()).click();
}

function actual(id, val) {
  cy.get(`[data-cy=bidButton][id="${id}"]`).click();
  cy.contains('[data-cy=bidSelectionButton]', val.toString()).click();
}

function getRoundByHeading(headingText) {
  // Find the .round that contains the heading text
  return cy.contains('.round h3', headingText).parents('.round').first();
}

// no-op
