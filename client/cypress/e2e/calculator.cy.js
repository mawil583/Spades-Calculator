describe('Test the input form', () => {
  it('Visits the /spades-calculator page and gets redirected if there are no names in localStorage', () => {
    // Visit the Spades calculator page
    cy.visit('http://localhost:3000/spades-calculator');

    // Assert that we were redirected to the input form page
    cy.url().should('eq', 'http://localhost:3000/');
  });

  it('redirects to /spades-calculator when names are entered and you click start', () => {
    shouldRedirectWhenNamesEnteredAndClickStart();
  });

  it('can place bid properly', () => {
    shouldRedirectWhenNamesEnteredAndClickStart();
    // Assert that there are 4 player buttons on the page
    cy.get('[data-cy=bidButton]').should('have.length', 4);
    
    // click first bid button
    cy.get('[data-cy=bidButton]').first().click();

    // Assert that the modal has opened
    cy.get('[data-cy=bidSelectionModal]').should('exist');

    // bid 1
    cy.get('[data-cy=bidSelectionButton]').eq(2).click();
  
    // Assert that the modal has closed
    cy.get('[data-cy=bidSelectionModal]').should('not.exist');
  
    // Assert that the card text is now on the player button
    cy.get('[data-cy=playerInput]').first().should('have.text', '1');
  });
});

function shouldRedirectWhenNamesEnteredAndClickStart() {
  // Visit the app
  cy.visit('http://localhost:3000/');

    // enter all player names
    cy.get('[data-cy=t1p1NameInput]').type('Mike');
    cy.get('[data-cy=t1p2NameInput]').type('Kim');
    cy.get('[data-cy=t2p1NameInput]').type('Mom');
    cy.get('[data-cy=t2p2NameInput]').type('Dad');

  // Find the start button and click it
  cy.get('[data-cy=startButton]').click();

  // Assert that we were redirected to the Spades calculator page
  cy.url().should('eq', 'http://localhost:3000/spades-calculator');
}