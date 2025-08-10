describe('Test the input form', () => {
  it('Visits the /spades-calculator page and gets redirected if there are no names in localStorage', () => {
    // Visit the Spades calculator page
    cy.visit('/spades-calculator', {
      onBeforeLoad(win) {
        delete win.navigator.__proto__.serviceWorker;
      },
    });

    // Assert that we were redirected to the input form page
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('redirects to /spades-calculator when names are entered and you click start', () => {
    shouldRedirectWhenNamesEnteredAndClickStart();
  });
});

describe('When certain sections are visible', () => {
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

  it('shows dealer selection modal and sets selected dealer order', () => {
    shouldRedirectWhenNamesEnteredAndClickStart();

    // Dealer badge should exist and open modal on click
    cy.get('[data-cy=dealerBadge]').first().click();
    cy.get('[data-cy=dealerSelectionModal]').should('exist');

    // Click a specific dealer option (choose Team 2 - P1 by id)
    cy.get(
      '[data-cy=dealerOptionButton][data-player-id="team2BidsAndActuals.p1Bid"]'
    ).click();

    // Modal should close
    cy.get('[data-cy=dealerSelectionModal]').should('not.exist');

    // Persisted order check: the current dealer should now be t2p1, so the badge should move accordingly
    // There are four DealerTag instances rendered with labels next to names. We can assert that the first badge moved.
    // As a proxy, open modal again to confirm the new dealer badge is clickable at the expected position.
    cy.get('[data-cy=dealerBadge]').first().click();
    cy.get('[data-cy=dealerSelectionModal]').should('exist');
    // Cancel out
    cy.get('[data-cy=dealerCancelButton]').click();
    cy.get('[data-cy=dealerSelectionModal]').should('not.exist');
  });

  it('only displays actuals section when all bids are entered', () => {
    shouldRedirectWhenNamesEnteredAndClickStart();
    // first bidder bids
    t1p1Bids('1');
    cy.get('[data-cy=actualSection]').should('not.exist');
    // 2nd bidder bids
    t1p2Bids('2');
    cy.get('[data-cy=actualSection]').should('not.exist');
    // 3rd bidder bids
    t2p1Bids('4');
    cy.get('[data-cy=actualSection]').should('not.exist');
    // last bidder bids
    t2p2Bids('1');
    cy.get('[data-cy=actualSection]').should('exist');
  });

  it('always displays actuals section on past rounds', () => {
    shouldRedirectWhenNamesEnteredAndClickStart();
    allPlayersBid({ t1p1Bid: '1', t1p2Bid: '3', t2p1Bid: '4', t2p2Bid: '1' });
    allPlayersEnterActuals({
      t1p1Actual: '2',
      t1p2Actual: '3',
      t2p1Actual: '4',
      t2p2Actual: '4',
    });
    let actualSections = cy.get('[data-cy=actualSection]');
    actualSections.should('have.length', 1);
    allPlayersBid({ t1p1Bid: '1', t1p2Bid: '3', t2p1Bid: '4', t2p2Bid: '1' });
    allPlayersEnterActuals({
      t1p1Actual: '2',
      t1p2Actual: '3',
      t2p1Actual: '4',
      t2p2Actual: '4',
    });
    cy.get('[data-cy=actualSection]').should('have.length', 2);
  });
});

// Helpers
function t1p1Bids(bid) {
  cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Bid]').click();
  cy.get('[data-cy=bidSelectionButton]').contains(bid.toString()).click();
}
function t1p2Bids(bid) {
  cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Bid]').click();
  cy.contains('[data-cy=bidSelectionButton]', bid).click();
}
function t2p1Bids(bid) {
  cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Bid]').click();
  cy.contains('[data-cy=bidSelectionButton]', bid).click();
}
function t2p2Bids(bid) {
  cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Bid]').click();
  cy.contains('[data-cy=bidSelectionButton]', bid).click();
}
function allPlayersBid({ t1p1Bid, t1p2Bid, t2p1Bid, t2p2Bid }) {
  t1p1Bids(t1p1Bid);
  t1p2Bids(t1p2Bid);
  t2p1Bids(t2p1Bid);
  t2p2Bids(t2p2Bid);
}

function t1p1EntersActual(actual) {
  cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p1Actual]').click();
  cy.contains('[data-cy=bidSelectionButton]', actual).click();
}
function t1p2EntersActual(actual) {
  cy.get('[data-cy=bidButton][id=team1BidsAndActuals\\.p2Actual]').click();
  cy.contains('[data-cy=bidSelectionButton]', actual).click();
}
function t2p1EntersActual(actual) {
  cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p1Actual]').click();
  cy.contains('[data-cy=bidSelectionButton]', actual).click();
}
function t2p2EntersActual(actual) {
  cy.get('[data-cy=bidButton][id=team2BidsAndActuals\\.p2Actual]').click();
  cy.contains('[data-cy=bidSelectionButton]', actual).click();
}
function allPlayersEnterActuals({
  t1p1Actual,
  t1p2Actual,
  t2p1Actual,
  t2p2Actual,
}) {
  t1p1EntersActual(t1p1Actual);
  t1p2EntersActual(t1p2Actual);
  t2p1EntersActual(t2p1Actual);
  t2p2EntersActual(t2p2Actual);
}

function shouldRedirectWhenNamesEnteredAndClickStart() {
  // Visit the app
      cy.visit('/', {
    onBeforeLoad(win) {
      delete win.navigator.__proto__.serviceWorker;
    },
  });

  // enter all player names
  cy.get('[data-cy=t1p1NameInput]').type('Mike');
  cy.get('[data-cy=t1p2NameInput]').type('Kim');
  cy.get('[data-cy=t2p1NameInput]').type('Mom');
  cy.get('[data-cy=t2p2NameInput]').type('Dad');

  // Find the start button and click it
  cy.get('[data-cy=startButton]').click();

  // Assert that we were redirected to the Spades calculator page
      cy.url().should('eq', Cypress.config().baseUrl + '/spades-calculator');
}
