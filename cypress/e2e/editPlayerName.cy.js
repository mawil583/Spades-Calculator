

describe('Player Name Editing Flow', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('should update player names in the game when edited after going back', () => {
    // 1. Enter initial names
    const initialPlayerNames = {
      t1p1Name: 'Alice',
      t1p2Name: 'Bob',
      t2p1Name: 'Charlie',
      t2p2Name: 'Diana',
    };

    cy.get('#t1p1Name').type(initialPlayerNames.t1p1Name);
    cy.get('#t1p2Name').type(initialPlayerNames.t1p2Name);
    cy.get('#t2p1Name').type(initialPlayerNames.t2p1Name);
    cy.get('#t2p2Name').type(initialPlayerNames.t2p2Name);

    // 2. Click Start
    cy.get('button[data-cy="startButton"]').click();

    // 3. Verify on spades-calculator page
    cy.url().should('include', '/spades-calculator');

    // 4. Verify initial names are visible (assuming they are displayed somewhere)
    // We verify one of them at least.
    cy.contains(initialPlayerNames.t1p1Name).should('be.visible');

    // 5. Navigate back to home page
    // Using the title link in the header as the back button was removed
    cy.contains('SpadesCalculator').click();

    // 6. Edit one of the names
    const newName = 'AliceEdited';
    cy.get('#t1p1Name').clear().type(newName);

    // 7. Click Continue (or Start)
    // Since names are already there, it might show "Continue" if logic persists, or "Start"
    // NameForm logic: hasGameData check. "JSON.stringify(names) !== JSON.stringify(initialNames)"
    // So it should show "Continue" or "New Game" buttons if logic holds?
    // Actually, NameForm.jsx: hasGameData includes names != initialNames.
    // If it has game data, it shows 'New Game' and 'Continue'.
    // If we just edited names, we want to click 'Continue'.
    cy.get('button[data-cy="continueButton"]').click();

    // 8. Verify on spades-calculator page
    cy.url().should('include', '/spades-calculator');

    // 9. Assert that the edited name is visible
    // Note: We check for newName and verify Alice doesn't appear as a standalone text
    // (not as part of AliceEdited)
    cy.contains(newName).should('be.visible');
    // Use regex for exact match - \b is word boundary  
    cy.get('body').invoke('text').should('not.match', /\bAlice\b(?!Edited)/);
  });
});
