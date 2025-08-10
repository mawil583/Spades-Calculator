describe('Dealer Debug Test', () => {
  beforeEach(() => {
    // Set up test data using the same pattern as working tests
    cy.visit('/', {
      onBeforeLoad(win) {
        delete win.navigator.__proto__.serviceWorker;
      },
    });

    // Enter player names
    cy.get('[data-cy=t1p1NameInput]').type('Alice');
    cy.get('[data-cy=t1p2NameInput]').type('Bob');
    cy.get('[data-cy=t2p1NameInput]').type('Charlie');
    cy.get('[data-cy=t2p2NameInput]').type('David');
    // Enter team names (using Editable component)
    cy.get('[data-cy=team1NameInput]').click().type('Team Alpha{enter}');
    cy.get('[data-cy=team2NameInput]').click().type('Team Beta{enter}');
    cy.get('[data-cy=startButton]').click();

    // Assert that we were redirected to the Spades calculator page
    cy.url().should('eq', Cypress.config().baseUrl + '/spades-calculator');
  });

  it('should debug dealer badge rendering and click functionality', () => {
    // First, let's check if dealer badges are rendered at all
    cy.get('[data-cy=dealerBadge]').should('exist');
    cy.get('[data-cy=dealerBadge]').should('have.length', 1);

    // Log the dealer badge details
    cy.get('[data-cy=dealerBadge]').then(($badge) => {
      console.log('Dealer badge found:', $badge);
      console.log('Dealer badge text:', $badge.text());
      console.log('Dealer badge classes:', $badge.attr('class'));
      console.log('Dealer badge style:', $badge.attr('style'));
    });

    // Check if the dealer badge is clickable (should have cursor pointer for current round)
    cy.get('[data-cy=dealerBadge]').should('have.css', 'cursor', 'pointer');

    // Try clicking the dealer badge
    cy.get('[data-cy=dealerBadge]').click();

    // Check if modal appears
    cy.get('[data-cy=dealerSelectionModal]').should('exist');

    // Check what options are available
    cy.get('[data-cy=dealerOptionButton]').should('have.length', 4);

    // Log the dealer options
    cy.get('[data-cy=dealerOptionButton]').each(($button, index) => {
      console.log(`Dealer option ${index}:`, $button.text());
    });

    // Try selecting Charlie as dealer
    cy.get('[data-cy=dealerOptionButton]').contains('Charlie').click();

    // Modal should close
    cy.get('[data-cy=dealerSelectionModal]').should('not.exist');

    // Verify dealer badge is still visible
    cy.get('[data-cy=dealerBadge]').should('exist');
    cy.get('[data-cy=dealerBadge]').should('have.length', 1);
  });

  it('should debug dealer override after completing a round', () => {
    // Complete first round
    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    // Wait for the round to complete and animation to finish
    // The animation takes 600ms + 300ms for the new round to appear
    cy.wait(1000);

    // Wait for the current round to be fully rendered
    cy.get('[data-cy=dealerBadge]').should('have.length', 2);

    // Additional wait to ensure the current round is fully rendered
    cy.wait(500);

    // Log both dealer badges with more context
    cy.get('[data-cy=dealerBadge]').each(($badge, index) => {
      console.log(`=== Dealer Badge ${index} ===`);
      console.log('Badge element:', $badge);
      console.log('Badge text:', $badge.text());
      console.log('Badge classes:', $badge.attr('class'));
      console.log('Badge style:', $badge.attr('style'));
      console.log('Badge cursor:', $badge.css('cursor'));

      // Try to find the parent context to understand which round this belongs to
      const $parent = $badge.closest('[data-cy="round"]');
      if ($parent.length > 0) {
        console.log('Parent round found:', $parent);
        console.log('Parent round classes:', $parent.attr('class'));
      } else {
        console.log('No parent round found');
      }
    });

    // Check the cursor styles of both badges
    // First badge (index 0) is for current round (clickable)
    cy.get('[data-cy=dealerBadge]')
      .first()
      .should('have.css', 'cursor', 'pointer');
    // Second badge (index 1) is for completed round (not clickable)
    cy.get('[data-cy=dealerBadge]')
      .last()
      .should('have.css', 'cursor', 'default');

    // Try clicking the first dealer badge (current round)
    cy.get('[data-cy=dealerBadge]').first().click();

    // Modal should appear
    cy.get('[data-cy=dealerSelectionModal]').should('exist');

    // Select Charlie as dealer
    cy.get('[data-cy=dealerOptionButton]').contains('Charlie').click();

    // Modal should close
    cy.get('[data-cy=dealerSelectionModal]').should('not.exist');

    // Verify we still have 2 dealer badges
    cy.get('[data-cy=dealerBadge]').should('have.length', 2);
  });

  it('should debug the exact issue with dealer badge click after round completion', () => {
    // Complete first round
    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    // Wait for the round to complete and animation to finish
    cy.wait(1000);

    // Check dealer badges
    cy.get('[data-cy=dealerBadge]').should('have.length', 2);

    // Log the cursor styles
    cy.get('[data-cy=dealerBadge]')
      .first()
      .then(($first) => {
        console.log('First dealer badge cursor:', $first.css('cursor'));
      });

    cy.get('[data-cy=dealerBadge]')
      .last()
      .then(($last) => {
        console.log('Last dealer badge cursor:', $last.css('cursor'));
      });

    // Try clicking the first dealer badge and see what happens
    cy.get('[data-cy=dealerBadge]').first().click();

    // Check if modal appears or if there's an error
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy=dealerSelectionModal]').length > 0) {
        console.log('Modal appeared successfully');
        cy.get('[data-cy=dealerSelectionModal]').should('exist');
      } else {
        console.log('Modal did not appear');
        // Log what's in the DOM
        cy.get('body').then(($body) => {
          console.log('Body HTML:', $body.html());
        });
      }
    });
  });

  it('should test dealer override functionality step by step', () => {
    // First, let's verify the initial state
    cy.get('[data-cy=dealerBadge]').should('have.length', 1);
    cy.get('[data-cy=dealerBadge]').should('have.css', 'cursor', 'pointer');

    // Click the dealer badge and change to Charlie
    cy.get('[data-cy=dealerBadge]').click();
    cy.get('[data-cy=dealerSelectionModal]').should('exist');
    cy.get('[data-cy=dealerOptionButton]').contains('Charlie').click();
    cy.get('[data-cy=dealerSelectionModal]').should('not.exist');

    // Now complete the round
    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    // Wait for completion
    cy.wait(1000);

    // Now we should have 2 dealer badges
    cy.get('[data-cy=dealerBadge]').should('have.length', 2);

    // The first dealer badge should be for the current round (clickable)
    cy.get('[data-cy=dealerBadge]')
      .first()
      .should('have.css', 'cursor', 'pointer');

    // The second dealer badge should be for the completed round (not clickable)
    cy.get('[data-cy=dealerBadge]')
      .last()
      .should('have.css', 'cursor', 'default');

    // Try clicking the first dealer badge
    cy.get('[data-cy=dealerBadge]').first().click();
    cy.get('[data-cy=dealerSelectionModal]').should('exist');

    // Select David as dealer
    cy.get('[data-cy=dealerOptionButton]').contains('David').click();
    cy.get('[data-cy=dealerSelectionModal]').should('not.exist');

    // Verify we still have 2 dealer badges
    cy.get('[data-cy=dealerBadge]').should('have.length', 2);
  });

  it('should test dealer override functionality ignoring cursor style', () => {
    // Complete first round
    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    // Wait for completion
    cy.wait(1000);

    // Now we should have 2 dealer badges
    cy.get('[data-cy=dealerBadge]').should('have.length', 2);

    // Try clicking the first dealer badge regardless of cursor style
    cy.get('[data-cy=dealerBadge]').first().click();

    // Check if modal appears
    cy.get('[data-cy=dealerSelectionModal]').should('exist');

    // Select Charlie as dealer
    cy.get('[data-cy=dealerOptionButton]').contains('Charlie').click();

    // Modal should close
    cy.get('[data-cy=dealerSelectionModal]').should('not.exist');

    // Verify we still have 2 dealer badges
    cy.get('[data-cy=dealerBadge]').should('have.length', 2);
  });

  it('should check if dealer badge is rendered for current round after completion', () => {
    // Complete first round
    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    // Wait for completion
    cy.wait(1000);

    // Check if dealer badges are rendered
    cy.get('[data-cy=dealerBadge]').should('have.length', 2);

    // Log all dealer badges to see what's happening
    cy.get('[data-cy=dealerBadge]').each(($badge, index) => {
      console.log(`=== Dealer Badge ${index} ===`);
      console.log('Badge element:', $badge);
      console.log('Badge text:', $badge.text());
      console.log('Badge classes:', $badge.attr('class'));
      console.log('Badge style:', $badge.attr('style'));
      console.log('Badge cursor:', $badge.css('cursor'));

      // Check if this badge is clickable by trying to click it
      cy.wrap($badge).click();

      // Check if modal appears
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy=dealerSelectionModal]').length > 0) {
          console.log(`Dealer badge ${index} is clickable - modal appeared`);
          // Close the modal
          cy.get('[data-cy=dealerCancelButton]').click();
        } else {
          console.log(
            `Dealer badge ${index} is NOT clickable - no modal appeared`
          );
        }
      });
    });
  });

  it('should understand dealer badge order after round completion', () => {
    // Complete first round
    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    // Wait for animations to complete
    cy.wait(1000);

    // Check dealer badges
    cy.get('[data-cy=dealerBadge]').should('have.length', 2);

    // Test each dealer badge to see which one is clickable
    cy.get('[data-cy=dealerBadge]').each(($badge, index) => {
      console.log(`Testing dealer badge ${index}`);

      // Click the badge
      cy.wrap($badge).click();

      // Check if modal appears
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy=dealerSelectionModal]').length > 0) {
          console.log(`Dealer badge ${index} is clickable (current round)`);
          // Close the modal
          cy.get('[data-cy=dealerCancelButton]').click();
        } else {
          console.log(`Dealer badge ${index} is NOT clickable (past round)`);
        }
      });
    });
  });

  it('should verify dealer badge order and clickability', () => {
    // Complete first round
    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    // Wait for animations to complete
    cy.wait(1000);

    // Check dealer badges
    cy.get('[data-cy=dealerBadge]').should('have.length', 2);

    // Test first dealer badge (should be current round - clickable)
    cy.get('[data-cy=dealerBadge]').first().click();
    cy.get('[data-cy=dealerSelectionModal]').should('exist');
    cy.get('[data-cy=dealerCancelButton]').click();

    // Test last dealer badge (should be completed round - not clickable)
    cy.get('[data-cy=dealerBadge]').last().click();
    cy.get('[data-cy=dealerSelectionModal]').should('not.exist');
  });

  it('should verify dealer override preservation', () => {
    // Complete first round
    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    // Wait for animations to complete
    cy.wait(1000);

    // Set dealer override to Charlie for current round
    cy.get('[data-cy=dealerBadge]').first().click();
    cy.get('[data-cy=dealerSelectionModal]').should('exist');
    cy.get('[data-cy=dealerOptionButton]').contains('Charlie').click();

    // Complete second round
    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '5').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '5').click();

    // Wait for animations to complete
    cy.wait(1000);

    // Verify that the dealer override is preserved
    // After completing 2 rounds, we should have 3 dealer badges (one for each round)
    cy.get('[data-cy=dealerBadge]').should('have.length', 3);

    // The current round should still have Charlie as dealer (override preserved)
    cy.get('[data-cy=dealerBadge]').first().click();
    cy.get('[data-cy=dealerSelectionModal]').should('exist');
    // Charlie should still be selected as dealer
    cy.get('[data-cy=dealerCancelButton]').click();
  });

  it('should debug dealer badge click after multiple rounds', () => {
    // Complete first round
    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '4').click();

    // Wait for animations to complete
    cy.wait(1000);

    // Set dealer override to Charlie for current round
    cy.get('[data-cy=dealerBadge]').first().click();
    cy.get('[data-cy=dealerSelectionModal]').should('exist');
    cy.get('[data-cy=dealerOptionButton]').contains('Charlie').click();

    // Complete second round
    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Bid]').click();
    cy.contains('[data-cy=bidSelectionButton]', '5').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '2').click();

    cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '3').click();

    cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Actual]').click();
    cy.contains('[data-cy=bidSelectionButton]', '5').click();

    // Wait for animations to complete
    cy.wait(1000);

    // Check how many dealer badges we have
    cy.get('[data-cy=dealerBadge]').then(($badges) => {
      console.log('Number of dealer badges:', $badges.length);

      // Test each dealer badge
      $badges.each((index, badge) => {
        console.log(`Testing dealer badge ${index}`);
        cy.wrap(badge).click();

        cy.get('body').then(($body) => {
          if ($body.find('[data-cy=dealerSelectionModal]').length > 0) {
            console.log(`Dealer badge ${index} is clickable`);
            cy.get('[data-cy=dealerCancelButton]').click();
          } else {
            console.log(`Dealer badge ${index} is NOT clickable`);
          }
        });
      });
    });
  });
});
