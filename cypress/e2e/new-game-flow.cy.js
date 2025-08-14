describe('New Game Flow', () => {
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
    cy.contains('Score').should('be.visible');
  });

  describe('when there is no round history', () => {
    it('should show only the team selection modal when clicking New Game', () => {
      // Wait for the New Game button to be available
      cy.get('button').contains('New Game').should('be.visible');

      // Click the New Game button
      cy.get('button').contains('New Game').click();

      // Should show the team question directly (no data warning)
      cy.contains('Would you like to keep the same teams?').should(
        'be.visible'
      );
      cy.contains('Different Teams').should('be.visible');
      cy.contains('Same Teams').should('be.visible');

      // Should not show the data warning
      cy.contains('Are you sure?').should('not.exist');
      cy.contains('This will permanently delete your game data.').should(
        'not.exist'
      );
    });

    it('should navigate to home page with empty input fields after selecting "Different Teams"', () => {
      // Wait for the New Game button to be available
      cy.get('button').contains('New Game').should('be.visible');

      // Click the New Game button
      cy.get('button').contains('New Game').click();

      // Click Different Teams
      cy.contains('Different Teams').click();

      // Should navigate to home page
      cy.url().should('eq', Cypress.config().baseUrl + '/');

      // Should show the Start button (indicating we're on the home page)
      cy.get('button[data-cy="startButton"]').should('be.visible');

      // Verify all player name input fields are empty
      cy.get('#t1p1Name').should('have.value', '');
      cy.get('#t1p2Name').should('have.value', '');
      cy.get('#t2p1Name').should('have.value', '');
      cy.get('#t2p2Name').should('have.value', '');

      // Verify team name inputs have default values
      cy.get('#team1Name').should('have.value', 'Team 1');
      cy.get('#team2Name').should('have.value', 'Team 2');
    });

    it('should handle "Same Teams" selection', () => {
      // Wait for the New Game button to be available
      cy.get('button').contains('New Game').should('be.visible');

      // Click the New Game button
      cy.get('button').contains('New Game').click();

      // Click Same Teams
      cy.contains('Same Teams').click();

      // Should stay on the spades calculator page
      cy.url().should('eq', Cypress.config().baseUrl + '/spades-calculator');
    });
  });

  describe('modal accessibility', () => {
    it('should close modal when pressing ESC key', () => {
      // Wait for the New Game button to be available
      cy.get('button').contains('New Game').should('be.visible');

      // Click the New Game button
      cy.get('button').contains('New Game').click();

      // Should show the team question modal
      cy.contains('Would you like to keep the same teams?').should(
        'be.visible'
      );

      // Press ESC key to close the modal
      cy.get('body').type('{esc}');

      // Modal should be closed
      cy.contains('Would you like to keep the same teams?').should('not.exist');
    });
  });

  describe('actual section visibility after new game', () => {
    it('should hide actual section when starting new game with same teams after entering bids', () => {
      // Wait for bid buttons to be available
      cy.get('[data-cy="bidButton"]').should('have.length', 4);

      // Enter bids for both teams to make actual section appear
      // Click on the first bid button to open modal
      cy.get('[data-cy="bidButton"]').eq(0).click();
      cy.get('[data-cy="bidSelectionButton"]').contains('3').click();

      cy.wait(500);

      // Click on the second bid button to open modal
      cy.get('[data-cy="bidButton"]').eq(0).click();
      cy.get('[data-cy="bidSelectionButton"]').contains('2').click();

      cy.wait(500);

      // Click on the third bid button to open modal
      cy.get('[data-cy="bidButton"]').eq(0).click();
      cy.get('[data-cy="bidSelectionButton"]').contains('4').click();

      cy.wait(500);

      // Click on the fourth bid button to open modal
      cy.get('[data-cy="bidButton"]').eq(0).click();
      cy.get('[data-cy="bidSelectionButton"]').contains('4').click();

      // Verify actual section is visible
      cy.get('[data-cy="actualSection"]').should('be.visible');

      // Click New Game button
      cy.get('button').contains('New Game').click();

      // Click Same Teams
      cy.contains('Same Teams').click();

      // Verify we're still on the spades calculator page
      cy.url().should('eq', Cypress.config().baseUrl + '/spades-calculator');

      // Verify actual section is NOT visible (should be hidden after new game)
      cy.get('[data-cy="actualSection"]').should('not.exist');

      // Verify bid inputs are empty (confirming reset worked)
      cy.get('[data-cy="bidButton"]').should('have.length', 4);
    });
  });
});
