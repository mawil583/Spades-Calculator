describe('Home Page Reset', () => {
    beforeEach(() => {
        // Clear local storage to start fresh
        cy.clearLocalStorage();
        cy.visit('/');
    });

    it('should clear inputs when selecting Different Teams after New Game', () => {
        // 1. Enter names
        // Team Name inputs use click-to-edit.
        // We click the div (which has the data-cy) to enter edit mode, then type in the input (which replaces it).
        cy.get('[data-cy="team1NameInput"]').click();
        cy.get('input[data-cy="team1NameInput"]').clear().type('Team A');
        cy.get('input[data-cy="team1NameInput"]').blur();

        cy.get('[data-cy="team2NameInput"]').click();
        cy.get('input[data-cy="team2NameInput"]').clear().type('Team B');
        cy.get('input[data-cy="team2NameInput"]').blur();
        cy.get('#t1p1Name').type('Alice');
        cy.get('#t1p2Name').type('Bob');
        cy.get('#t2p1Name').type('Charlie');
        cy.get('#t2p2Name').type('Dave');

        // 2. Start Game (New Game button only visible if game data exists)
        // We need to start a game to create history/current round
        cy.get('[data-cy="startButton"]').click();
        
        // Ensure we are on calculator page
        cy.url().should('include', '/spades-calculator');

        // 3. Enter a bid to create game state (current round data)
        // Just need to trigger "hasGameData" logic on Home Page
        // Assuming calculator page has inputs for bids
        // Click the player 1 bid button (id matches fieldToUpdate in PlayerInput)
        cy.get('[id="team1BidsAndActuals.p1Bid"]').click();
        
        // Wait for modal and select '1'
        cy.get('[data-cy="bidSelectionModal"]').should('be.visible');
        cy.get('button').contains('1').click();
        
        // We probably don't need to finish round, just having data in currentRound might be enough
        // depending on logic: "roundHistory.length > 0 || currentRound && (some values...)"
        
        // 4. Go back to Home Page
        cy.visit('/'); // or click Back button if available

        // 5. Verify "New Game" button is visible
        cy.get('[data-cy="newGameButton"]').should('be.visible');

        // 6. Click New Game -> Different Teams
        cy.get('[data-cy="newGameButton"]').click();
        cy.contains('Different Teams').click();

        // 7. Assert inputs are empty
        // Different Teams should reset to defaults: "Team 1", "Team 2", and empty players
        // We check the input value (even if hidden)
        cy.get('#team1Name').should('have.text', 'Team 1');
        cy.get('#team2Name').should('have.text', 'Team 2');
        cy.get('#t1p1Name').should('have.value', '');
        cy.get('#t1p2Name').should('have.value', '');
        cy.get('#t2p1Name').should('have.value', '');
        cy.get('#t2p2Name').should('have.value', '');
        
        // Assert "Start" button is back
        cy.get('[data-cy="startButton"]').should('be.visible');
    });
});
