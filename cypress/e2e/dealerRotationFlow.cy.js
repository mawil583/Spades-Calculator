describe('Dealer Rotation Flow with Override', () => {
  beforeEach(() => {
    // Set up initial player names in localStorage so the spades calculator page loads
    const initialNames = {
      t1p1Name: 'Alice',
      t1p2Name: 'Bob',
      t2p1Name: 'Charlie',
      t2p2Name: 'Diana',
      team1Name: 'Team 1',
      team2Name: 'Team 2',
    };

    // Set the names in localStorage
    cy.window().then((win) => {
      win.localStorage.setItem('names', JSON.stringify(initialNames));
    });

    // Visit the spades calculator page
    cy.visit('/spades-calculator');

    // Wait for the page to load and check if we're on the right page
    cy.get('[data-testid="game-score-container"]').should('be.visible');
  });

  it('should handle dealer rotation with override correctly', () => {
    // Check if we need to click "New Game" first
    cy.get('body').then(($body) => {
      // Open menu first to check for "New Game"
      cy.get('[aria-label="Open Menu"]').click();
      if ($body.find(':contains("New Game")').length > 0) {
        cy.contains('New Game').click();
        cy.contains('Same Teams').click();
      } else {
        // Close menu if New Game not found/needed
        cy.get('[aria-label="Open Menu"]').click();
      }
    });

    // Round 1: Enter all bids and actuals
    // Team 1 bids
    cy.get('[data-cy="bidButton"]').eq(0).click(); // Alice's bid
    cy.get('[data-cy="bidSelectionButton"]').contains('3').click();

    cy.get('[data-cy="bidButton"]').eq(0).click(); // Bob's bid
    cy.get('[data-cy="bidSelectionButton"]').contains('4').click();

    // Team 2 bids
    cy.get('[data-cy="bidButton"]').eq(0).click(); // Charlie's bid
    cy.get('[data-cy="bidSelectionButton"]').contains('2').click();

    cy.get('[data-cy="bidButton"]').eq(0).click(); // Diana's bid
    cy.get('[data-cy="bidSelectionButton"]').contains('4').click();

    // Wait for actuals to appear and enter them
    cy.get('[data-cy="actualButton"]').should('be.visible');

    // Team 1 actuals
    cy.get('[data-cy="actualButton"]').eq(0).click(); // Alice's actual
    cy.get('[data-cy="actualSelectionButton"]').contains('3').click();

    cy.get('[data-cy="actualButton"]').eq(0).click(); // Bob's actual
    cy.get('[data-cy="actualSelectionButton"]').contains('4').click();

    // Team 2 actuals
    cy.get('[data-cy="actualButton"]').eq(0).click(); // Charlie's actual
    cy.get('[data-cy="actualSelectionButton"]').contains('2').click();

    cy.get('[data-cy="actualButton"]').eq(0).click(); // Diana's actual
    cy.get('[data-cy="actualSelectionButton"]').contains('4').click();

    // Round 2 should now be visible
    cy.contains('Round 2').should('be.visible');

    // Assert that dealer is t2p1 (Charlie) at start of round 2
    cy.get('[data-cy="dealerBadge"]').should('be.visible');
    cy.contains('Charlie')
      .parent()
      .find('[data-cy="dealerBadge"]')
      .should('exist');

    // Before bidding, do dealer override to t1p1 (Alice)
    cy.get('[data-cy="dealerBadge"]').first().click();

    // Select Alice (t1p1) as dealer from the modal
    cy.get('[data-cy="dealerOptionButton"]').contains('Alice').click();

    // Verify dealer badge moved to Alice
    cy.contains('Alice')
      .parent()
      .find('[data-cy="dealerBadge"]')
      .should('exist');
    cy.contains('Charlie')
      .parent()
      .find('[data-cy="dealerBadge"]')
      .should('not.exist');

    // Enter all bids and actuals for round 2
    // Team 1 bids
    cy.get('[data-cy="bidButton"]').eq(0).click(); // Alice's bid
    cy.get('[data-cy="bidSelectionButton"]').contains('2').click();

    cy.get('[data-cy="bidButton"]').eq(0).click(); // Bob's bid
    cy.get('[data-cy="bidSelectionButton"]').contains('3').click();

    // Team 2 bids
    cy.get('[data-cy="bidButton"]').eq(0).click(); // Charlie's bid
    cy.get('[data-cy="bidSelectionButton"]').contains('4').click();

    cy.get('[data-cy="bidButton"]').eq(0).click(); // Diana's bid
    cy.get('[data-cy="bidSelectionButton"]').contains('4').click();

    // Wait for actuals to appear and enter them
    cy.get('[data-cy="actualButton"]').should('be.visible');

    // Team 1 actuals
    cy.get('[data-cy="actualButton"]').eq(0).click(); // Alice's actual
    cy.get('[data-cy="actualSelectionButton"]').contains('2').click();

    cy.get('[data-cy="actualButton"]').eq(0).click(); // Bob's actual
    cy.get('[data-cy="actualSelectionButton"]').contains('3').click();

    // Team 2 actuals
    cy.get('[data-cy="actualButton"]').eq(0).click(); // Charlie's actual
    cy.get('[data-cy="actualSelectionButton"]').contains('4').click();

    cy.get('[data-cy="actualButton"]').eq(0).click(); // Diana's actual
    cy.get('[data-cy="actualSelectionButton"]').contains('4').click();

    // Round 3 should now be visible
    cy.contains('Round 3').should('be.visible');

    // Assert that round 3 begins with t2p1 (Charlie) as dealer again
    cy.get('[data-cy="dealerBadge"]').should('be.visible');
    cy.contains('Charlie')
      .parent()
      .find('[data-cy="dealerBadge"]')
      .should('exist');

    // Enter valid bids and actuals for round 3
    // Team 1 bids
    cy.get('[data-cy="bidButton"]').eq(0).click(); // Alice's bid
    cy.get('[data-cy="bidSelectionButton"]').contains('1').click();

    cy.get('[data-cy="bidButton"]').eq(0).click(); // Bob's bid
    cy.get('[data-cy="bidSelectionButton"]').contains('5').click();

    // Team 2 bids
    cy.get('[data-cy="bidButton"]').eq(0).click(); // Charlie's bid
    cy.get('[data-cy="bidSelectionButton"]').contains('3').click();

    cy.get('[data-cy="bidButton"]').eq(0).click(); // Diana's bid
    cy.get('[data-cy="bidSelectionButton"]').contains('4').click();

    // Wait for actuals to appear and enter them
    cy.get('[data-cy="actualButton"]').should('be.visible');

    // Team 1 actuals
    cy.get('[data-cy="actualButton"]').eq(0).click(); // Alice's actual
    cy.get('[data-cy="actualSelectionButton"]').contains('1').click();

    cy.get('[data-cy="actualButton"]').eq(0).click(); // Bob's actual
    cy.get('[data-cy="actualSelectionButton"]').contains('5').click();

    // Team 2 actuals
    cy.get('[data-cy="actualButton"]').eq(0).click(); // Charlie's actual
    cy.get('[data-cy="actualSelectionButton"]').contains('3').click();

    cy.get('[data-cy="actualButton"]').eq(0).click(); // Diana's actual
    cy.get('[data-cy="actualSelectionButton"]').contains('4').click();

    // Round 4 should now be visible
    cy.contains('Round 4').should('be.visible');

    // Assert that round 4 begins with dealer as t1p2 (Bob)
    cy.get('[data-cy="dealerBadge"]').should('be.visible');
    cy.contains('Bob').parent().find('[data-cy="dealerBadge"]').should('exist');
  });
});
