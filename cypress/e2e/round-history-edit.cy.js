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

    // Assert Round 3 exists (current, empty inputs)
    cy.get('.round')
      .first()
      .within(() => {
        cy.contains('h3', 'Round 3').should('exist');
        cy.get('[data-cy=playerInput]').should('have.length', 0);
        cy.get('[data-cy=bidButton]').should('have.length', 4);
        cy.get('[data-cy=actualSection]').should('not.exist');
      });

    // Assert Round 2 exists with all values entered
    getRoundByHeading('Round 2').within(() => {
      cy.get('[data-cy=playerInput]').should('have.length', 8);
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

    // Ensure Round 1 is still visible (was disappearing before fix)
    cy.contains('h3', 'Round 1').should('exist');
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
