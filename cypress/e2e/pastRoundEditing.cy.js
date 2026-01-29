describe('Bug Reproduction E2E', () => {
  beforeEach(() => {
    const names = {
      t1p1Name: 'Kim',
      t1p2Name: 'Clare',
      t2p1Name: 'Meredith',
      t2p2Name: 'Michael',
      team1Name: 'Team 1',
      team2Name: 'M Squared',
    };

    cy.visit('/spades-calculator', {
      onBeforeLoad(win) {
        // Clear all storage before setting test data
        win.localStorage.clear();
        win.sessionStorage.clear();
        
        // Set test data
        win.localStorage.setItem('names', JSON.stringify(names));
        win.localStorage.setItem('nilScoringRule', JSON.stringify('helps'));
      },
    });
  });

  it('should reproduce ErrorModal 0 actuals bug and NaN in Round Summary', () => {
    // 1. Enter Bids
    cy.get('[data-cy="bidButton"]').eq(0).click();
    cy.get('[data-cy="bidSelectionButton"]').contains('2').click();
    cy.get('[data-cy="bidButton"]').eq(1).click();
    cy.get('[data-cy="bidSelectionButton"]').contains('5').click();
    
    cy.get('[data-cy="bidButton"]').eq(0).click();
    cy.get('[data-cy="bidSelectionButton"]').contains('4').click();
    cy.get('[data-cy="bidButton"]').eq(0).click();
    cy.get('[data-cy="bidSelectionButton"]').contains('1').click();

    // 2. Use Team Actuals button to enter 7 for Team 1
    cy.get('[data-cy="actualSection"]').within(() => {
        cy.get('[data-cy="team1Total"]').click();
    });
    cy.get('[data-cy="actualSelectionButton"]').contains('7').click();

    // 3. Use Team Actuals button to enter 5 for M Squared
    cy.get('[data-cy="actualSection"]').within(() => {
        cy.get('[data-cy="team2Total"]').click();
    });
    cy.get('[data-cy="actualSelectionButton"]').contains('5').click();

    // 4. Verify ErrorModal shows up (total is 12, should be 13)
    cy.get('[data-cy="errorModalActualSection"]').should('be.visible');
    cy.contains("The total amount of hands must always add up to 13").should('be.visible');

    // BUG VERIFICATION: ErrorModal should show "7 Actuals 5" 
    cy.get('[data-cy="errorModalActualSection"]').within(() => {
      cy.get('[data-cy="team1Total"]').should('contain', '7');
      cy.get('[data-cy="team2Total"]').should('contain', '5');
      // Verify Michael has a value of 2 from the team total distribution
      cy.contains('Michael').parent().parent().within(() => {
        cy.get('[data-cy="playerInput"]').should('contain', '2');
      });
    });

    // 5. Enter Michael's actual as 3 to make total 13 and complete Round 1
    cy.get('[data-cy="errorModalActualSection"]').within(() => {
        cy.contains('Michael').parent().parent().find('[data-cy="playerInput"]').click();
    });
    // Wait for the InputModal to appear
    cy.get('[data-cy="bidSelectionModal"]').should('be.visible');
    cy.get('[data-cy="actualSelectionButton"]').contains('3').click();

    // 6. Round 1 should be in history, and we should be on Round 2
    cy.get('[data-cy="round"]').should('have.length.at.least', 1);
    cy.contains('Round 1').should('be.visible');
    cy.contains('Round 2').should('be.visible');

    // 7. Check that there are no NaN values in the historical round summary
    // Since Round 2 is at the top, we use .last() to target Round 1 history
    cy.get('[data-cy="round"]').last().within(() => {
        cy.contains('Score: NaN').should('not.exist');
        cy.contains('Bags: NaN').should('not.exist');
    });
  });

  it('should clear asterisk when auto-generated actual is manually edited in history', () => {
    // 1. Enter Bids
    cy.get('[data-cy="bidButton"]').eq(0).click();
    cy.get('[data-cy="bidSelectionButton"]').contains('2').click();
    cy.get('[data-cy="bidButton"]').eq(1).click();
    cy.get('[data-cy="bidSelectionButton"]').contains('5').click();
    
    cy.get('[data-cy="bidButton"]').eq(0).click();
    cy.get('[data-cy="bidSelectionButton"]').contains('4').click();
    cy.get('[data-cy="bidButton"]').eq(0).click();
    cy.get('[data-cy="bidSelectionButton"]').contains('2').click();

    // 2. Use Team Actuals button to enter 7 for Team 1 (marks as auto-generated)
    cy.get('[data-cy="actualSection"]').within(() => {
        cy.get('[data-cy="team1Total"]').click();
    });
    cy.get('[data-cy="actualSelectionButton"]').contains('7').click();

    // 3. Enter 6 for Team 2 to make total 13 and complete round
    cy.get('[data-cy="actualSection"]').within(() => {
        cy.get('[data-cy="team2Total"]').click();
    });
    cy.get('[data-cy="actualSelectionButton"]').contains('6').click();

    // 4. Round 1 should be in history with asterisks
    cy.get('[data-cy="round"]').should('have.length.at.least', 1);
    cy.contains('Round 1').should('be.visible');
    // We wait a bit for the animation to finish
    cy.wait(1000);
    
    // Kim (P1) should have 4*
    // Since Round 2 is at the top, we use .last() to target Round 1 history
    cy.get('[data-cy="round"]').last().within(() => {
        cy.contains('Kim').parent().parent().find('[data-cy="playerInput"]').should('contain', '4');
        cy.contains('Kim').parent().parent().find('[data-cy="playerInput"]').should('contain', '*');
    });

    // 5. Start Round 2 bids so Round 1 is definitely historical
    cy.get('[data-cy="bidButton"]').eq(0).click();
    cy.get('[data-cy="bidSelectionButton"]').contains('3').click();

    // 6. Edit Kim's actual in Round 1 (Historical)
    // Since Round 2 is at the top, we use .last() to target Round 1 history
    cy.get('[data-cy="round"]').last().within(() => {
        cy.contains('Kim').parent().parent().find('[data-cy="playerInput"]').click();
    });
    // Wait for the InputModal to appear
    cy.get('[data-cy="bidSelectionModal"]').should('be.visible');
    // Reselect 4 manually
    cy.get('[data-cy="actualSelectionButton"]').contains('4').click();
    // Wait for the UI to update
    cy.wait(500);

    // 7. BUG FIX VERIFICATION: The asterisk should NOT be there anymore
    // Since Round 2 is at the top, we use .last() to target Round 1 history
    cy.get('[data-cy="round"]').last().within(() => {
        cy.contains('Kim').parent().parent().find('[data-cy="playerInput"]').should('not.contain', '*');
        cy.contains('Kim').parent().parent().find('[data-cy="playerInput"]').should('contain', '4');
    });
  });
});
