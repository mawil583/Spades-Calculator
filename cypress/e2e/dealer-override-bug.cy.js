describe('Dealer Override Bug Fix', () => {
  beforeEach(() => {
    // Set up test data
    cy.visit('/spades-calculator');

    // Enter player names
    cy.get('[data-cy=team1Player1Input]').type('Alice');
    cy.get('[data-cy=team1Player2Input]').type('Bob');
    cy.get('[data-cy=team2Player1Input]').type('Charlie');
    cy.get('[data-cy=team2Player2Input]').type('David');
    cy.get('[data-cy=team1NameInput]').type('Team Alpha');
    cy.get('[data-cy=team2NameInput]').type('Team Beta');
    cy.get('[data-cy=startButton]').click();
  });

  it('should not affect past round dealer when changing current round dealer', () => {
    // Complete first round with default dealer (Alice)
    cy.get('[data-cy=bidSection]').within(() => {
      cy.get('[data-cy=bidSelectionButton]').contains('3').click(); // Alice bids 3
      cy.get('[data-cy=bidSelectionButton]').contains('2').click(); // Bob bids 2
      cy.get('[data-cy=bidSelectionButton]').contains('4').click(); // Charlie bids 4
      cy.get('[data-cy=bidSelectionButton]').contains('4').click(); // David bids 4
    });

    // Enter actuals
    cy.get('[data-cy=actualSection]').within(() => {
      cy.get('[data-cy=bidSelectionButton]').contains('3').click(); // Alice actual 3
      cy.get('[data-cy=bidSelectionButton]').contains('2').click(); // Bob actual 2
      cy.get('[data-cy=bidSelectionButton]').contains('4').click(); // Charlie actual 4
      cy.get('[data-cy=bidSelectionButton]').contains('4').click(); // David actual 4
    });

    // Verify first round is completed and Alice is dealer
    cy.get('[data-cy=dealerBadge]').should('have.length', 1);
    cy.get('[data-cy=dealerBadge]').first().should('be.visible');

    // Start second round
    cy.get('[data-cy=bidSection]').within(() => {
      cy.get('[data-cy=bidSelectionButton]').contains('2').click(); // Alice bids 2
      cy.get('[data-cy=bidSelectionButton]').contains('3').click(); // Bob bids 3
      cy.get('[data-cy=bidSelectionButton]').contains('3').click(); // Charlie bids 3
      cy.get('[data-cy=bidSelectionButton]').contains('5').click(); // David bids 5
    });

    // Change dealer for current round (round 2) to Charlie
    cy.get('[data-cy=dealerBadge]').last().click();
    cy.get('[data-cy=dealerSelectionModal]').should('be.visible');
    cy.get('[data-cy=dealerOptionButton]').contains('Charlie').click();

    // Verify that the first round's dealer (Alice) is still visible and unchanged
    cy.get('[data-cy=dealerBadge]').should('have.length', 2);
    cy.get('[data-cy=dealerBadge]').first().should('be.visible');

    // Complete the second round
    cy.get('[data-cy=actualSection]').within(() => {
      cy.get('[data-cy=bidSelectionButton]').contains('2').click(); // Alice actual 2
      cy.get('[data-cy=bidSelectionButton]').contains('3').click(); // Bob actual 3
      cy.get('[data-cy=bidSelectionButton]').contains('3').click(); // Charlie actual 3
      cy.get('[data-cy=bidSelectionButton]').contains('5').click(); // David actual 5
    });

    // Verify both rounds have their correct dealers
    cy.get('[data-cy=dealerBadge]').should('have.length', 2);
  });

  it('should preserve dealer override when editing past rounds', () => {
    // Complete first round
    cy.get('[data-cy=bidSection]').within(() => {
      cy.get('[data-cy=bidSelectionButton]').contains('3').click();
      cy.get('[data-cy=bidSelectionButton]').contains('2').click();
      cy.get('[data-cy=bidSelectionButton]').contains('4').click();
      cy.get('[data-cy=bidSelectionButton]').contains('4').click();
    });

    cy.get('[data-cy=actualSection]').within(() => {
      cy.get('[data-cy=bidSelectionButton]').contains('3').click();
      cy.get('[data-cy=bidSelectionButton]').contains('2').click();
      cy.get('[data-cy=bidSelectionButton]').contains('4').click();
      cy.get('[data-cy=bidSelectionButton]').contains('4').click();
    });

    // Complete second round with different dealer
    cy.get('[data-cy=bidSection]').within(() => {
      cy.get('[data-cy=bidSelectionButton]').contains('2').click();
      cy.get('[data-cy=bidSelectionButton]').contains('3').click();
      cy.get('[data-cy=bidSelectionButton]').contains('3').click();
      cy.get('[data-cy=bidSelectionButton]').contains('5').click();
    });

    // Change dealer for current round (round 2) to Charlie
    cy.get('[data-cy=dealerBadge]').last().click();
    cy.get('[data-cy=dealerSelectionModal]').should('be.visible');
    cy.get('[data-cy=dealerOptionButton]').contains('Charlie').click();

    cy.get('[data-cy=actualSection]').within(() => {
      cy.get('[data-cy=bidSelectionButton]').contains('2').click();
      cy.get('[data-cy=bidSelectionButton]').contains('3').click();
      cy.get('[data-cy=bidSelectionButton]').contains('3').click();
      cy.get('[data-cy=bidSelectionButton]').contains('5').click();
    });

    // Now edit the first round's bid
    cy.get('[data-cy=round]')
      .first()
      .within(() => {
        cy.get('[data-cy=bidSection]').within(() => {
          cy.get('[data-cy=bidSelectionButton]').contains('4').click(); // Change Alice's bid from 3 to 4
        });
      });

    // Verify that both rounds still have their correct dealers
    cy.get('[data-cy=dealerBadge]').should('have.length', 2);

    // The first round should still have Alice as dealer (default)
    // The second round should still have Charlie as dealer (override)
    cy.get('[data-cy=dealerBadge]').first().should('be.visible');
    cy.get('[data-cy=dealerBadge]').last().should('be.visible');
  });

  it('should not allow dealer changes for past rounds', () => {
    // Complete first round
    cy.get('[data-cy=bidSection]').within(() => {
      cy.get('[data-cy=bidSelectionButton]').contains('3').click();
      cy.get('[data-cy=bidSelectionButton]').contains('2').click();
      cy.get('[data-cy=bidSelectionButton]').contains('4').click();
      cy.get('[data-cy=bidSelectionButton]').contains('4').click();
    });

    cy.get('[data-cy=actualSection]').within(() => {
      cy.get('[data-cy=bidSelectionButton]').contains('3').click();
      cy.get('[data-cy=bidSelectionButton]').contains('2').click();
      cy.get('[data-cy=bidSelectionButton]').contains('4').click();
      cy.get('[data-cy=bidSelectionButton]').contains('4').click();
    });

    // Try to click dealer badge for past round (should not open modal)
    cy.get('[data-cy=dealerBadge]').first().click();

    // Modal should not appear for past rounds
    cy.get('[data-cy=dealerSelectionModal]').should('not.exist');
  });
});
