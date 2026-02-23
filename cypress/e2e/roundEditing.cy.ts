describe('Bug Reproduction E2E', () => {
  const setupTest = (useTableUI = false) => {
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
        // Set UI Mode flag BEFORE load
        win.localStorage.setItem('featureFlag_tableRoundUI', JSON.stringify(useTableUI));
      },
    });
  };

  const checkOverlay = (modalSelector) => {
    // Assert only one overlay exists
    cy.get('[data-testid="modal-backdrop"]').should('have.length', 1);

    // Assert overlay is behind the modal
    cy.get('[data-testid="modal-backdrop"]').then($overlay => {
      cy.get(modalSelector).then($modal => {
          const overlayZ = parseInt($overlay.css('z-index'));
          const modalZ = parseInt($modal.css('z-index'));
          // If we can get z-indices, check them
          if (!isNaN(overlayZ) && !isNaN(modalZ)) {
            expect(modalZ).to.be.gte(overlayZ);
          }
      });
    });
  };

  describe('Classic UI', () => {
    beforeEach(() => {
        setupTest(false);
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

    it('should allow editing a past round error without overlay blocking', () => {
      // 1. Play through Round 1 to create history
      // Bids
      cy.get('[data-cy="bidButton"]').eq(0).click();
      cy.get('[data-cy="bidSelectionButton"]').contains('3').click();
      cy.get('[data-cy="bidButton"]').eq(1).click();
      cy.get('[data-cy="bidSelectionButton"]').contains('4').click();
      cy.get('[data-cy="bidButton"]').eq(0).click(); // p2 team 1
      cy.get('[data-cy="bidSelectionButton"]').contains('3').click();
      cy.get('[data-cy="bidButton"]').eq(0).click(); // p2 team 2
      cy.get('[data-cy="bidSelectionButton"]').contains('3').click();

      // Actuals (Total 13)
      cy.get('[data-cy="actualSection"]').first().within(() => {
        cy.get('[data-cy="team1Total"]').click();
      });
      cy.get('[data-cy="actualSelectionButton"]').contains('7').click(); 
      cy.get('[data-cy="actualSection"]').first().within(() => {
        cy.get('[data-cy="team2Total"]').click();
      });
      cy.get('[data-cy="actualSelectionButton"]').contains('6').click();

      // Confirm we are on Round 2
      cy.contains('Round 2').should('be.visible');

      // 2. Go back to Round 1 (History) and create an error
      // Use .last() to target the history round
      cy.get('[data-cy="round"]').last().scrollIntoView().within(() => {
        // Click Team 1 Actuals
        // Filter by :visible and take first to absolutely avoid duplicates
        cy.get('[data-cy="team1Total"]').filter(':visible').first().click({ force: true });
      });

      // Enter '5' -> Total 5+6=11 (Error: != 13)
      // Wait for modal to be visible
      cy.get('[data-cy="bidSelectionModal"]', { timeout: 10000 }).should('be.visible');

      // ASSERTION 1: Input Modal Overlay Check
      checkOverlay('[data-cy="bidSelectionModal"]');

      cy.get('[data-cy="actualSelectionButton"]').contains('5').click();

      // 3. Verify Error Modal appears
      cy.get('[data-cy="errorModalActualSection"]', { timeout: 10000 }).should('be.visible');

      // ASSERTION 2: Error Modal Overlay Check
      checkOverlay('[data-cy="errorModalActualSection"]');
      
      // 4. Click to fix it INSIDE the Error Modal
      cy.get('[data-cy="errorModalActualSection"]').within(() => {
        cy.get('[data-cy="team1Total"]').filter(':visible').first().click({ force: true });
      });

      // 5. Verify the InputModal appears and is usable
      cy.get('[data-cy="bidSelectionModal"]').should('be.visible');

      // ASSERTION 3: Input Modal (Fix) Overlay Check
      checkOverlay('[data-cy="bidSelectionModal"]');
      
      // 6. Select the correct value '7' to fix the error
      cy.get('[data-cy="actualSelectionButton"]').filter(':visible').contains('7').click();

      // 7. Verify Error Modal is GONE (because data is valid now: 7+6=13)
      cy.get('[data-cy="errorModalActualSection"]').should('not.exist');
      
      // 8. Verify the value is updated in the round history view
      cy.get('[data-cy="round"]').last().within(() => {
          cy.contains('7').should('exist');
      });
    });
  });

  describe('Table UI', () => {
    beforeEach(() => {
        setupTest(true);
    });

  it('should not show double overlays when fixing an error from the error modal (Current Round)', () => {
    // 1. Enter Bids (Standard flow to get to actuals)
    // We need 4 bids.
    cy.get('[data-cy="bidButton"]').eq(0).click();
    cy.get('[data-cy="bidSelectionButton"]').contains('3').click();
    cy.get('[data-cy="bidButton"]').eq(0).click(); // Click next available bidButton
    cy.get('[data-cy="bidSelectionButton"]').contains('3').click();
    cy.get('[data-cy="bidButton"]').eq(0).click(); 
    cy.get('[data-cy="bidSelectionButton"]').contains('3').click();
    cy.get('[data-cy="bidButton"]').eq(0).click(); 
    cy.get('[data-cy="bidSelectionButton"]').contains('3').click();

    // 2. Click "Total Made" (Team 1)
    cy.get('[data-cy="team1TotalMade"]').click();
    cy.get('[data-cy="bidSelectionModal"]').should('be.visible');

    // 3. Enter '5' (Valid for now)
    cy.get('[data-cy="actualSelectionButton"]').contains('5').click();
    cy.get('[data-cy="bidSelectionModal"]').should('not.exist');

    // 4. Enter '5' for Team 2 (Total 10 != 13) -> Trigger Error
    cy.get('[data-cy="team2TotalMade"]').click();
    cy.get('[data-cy="bidSelectionModal"]').should('be.visible');
    cy.get('[data-cy="actualSelectionButton"]').contains('5').click();
    cy.get('[data-cy="bidSelectionModal"]').should('not.exist');

    // 5. Error Modal should appear
    cy.get('[data-cy="errorModalActualSection"]').should('be.visible');
    checkOverlay('[data-cy="errorModalActualSection"]');

    // 6. Click to Fix (inside Error Modal)
    // We click p1 in Error Modal - it has data-cy="playerInput" inside ErrorModal
    cy.get('[data-cy="errorModalActualSection"]').within(() => {
        cy.get('[data-cy="playerInput"]').first().click();
    });

    // 7. Input Modal should appear.
    cy.get('[data-cy="bidSelectionModal"]').should('be.visible');

    // 8. CRITICAL ASSERTION: Check overlays
    checkOverlay('[data-cy="bidSelectionModal"]');

    // 9. Fix the value (Select 6 -> 6+2+3+2=13)
    cy.get('[data-cy="actualSelectionButton"]').contains('6').click();
    cy.get('[data-cy="bidSelectionModal"]').should('not.exist');

    // 10. Error should be gone
    cy.get('[data-cy="errorModalActualSection"]').should('not.exist');
  });
  });
});
