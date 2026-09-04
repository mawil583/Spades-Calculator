// End-to-end coverage for the score-limit feature's REAL wiring: these flows
// run the actual reducer, localStorage, hooks and routing together — the
// mocked-context unit/integration tests can't catch wiring bugs there.
// Prompt branches, validation and viewer rendering are covered by unit tests
// and deliberately not repeated here.
describe('Score Limit End-to-End', () => {
  const names = {
    t1p1Name: 'Kim',
    t1p2Name: 'Clare',
    t2p1Name: 'Meredith',
    t2p2Name: 'Michael',
    team1Name: 'Team 1',
    team2Name: 'Team 2',
  };

  const seedBoard = (extraStorage: Record<string, string> = {}) => {
    cy.visit('/spades-calculator', {
      onBeforeLoad(win) {
        win.localStorage.clear();
        win.localStorage.setItem('names', JSON.stringify(names));
        win.localStorage.setItem(
          'nilScoringRule',
          JSON.stringify('takesBags'),
        );
        Object.entries(extraStorage).forEach(([key, value]) => {
          win.localStorage.setItem(key, value);
        });
      },
    });
  };

  const startGameWithLimitFromHome = (limit: string) => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });
    ['t1p1Name', 't1p2Name', 't2p1Name', 't2p2Name'].forEach((id, i) => {
      cy.get(`[data-cy="${id}Input"]`).type(`Player ${i + 1}`);
    });
    cy.get('[data-cy="startButton"]').click();
    cy.contains('button', 'Yes').click();
    cy.get('[data-testid="score-limit-input"]').type(limit);
    cy.get('[data-testid="setScoreLimitButton"]').click();
    cy.url().should('include', '/spades-calculator');
  };

  // Plays one round where Team 1 makes all 13 tricks. Bids are equal on every
  // seat (12 total, order-independent — the default Table UI lays the bid
  // buttons out per seat, and the exact bid split doesn't matter: making all
  // 13 scores 130+ for Team 1 no matter who bid what), so this clears any
  // limit at or below 130.
  const playTeam1WinningRound = () => {
    for (let i = 0; i < 4; i++) {
      cy.get('[data-cy="bidButton"]').eq(0).click();
      cy.get('[data-cy="bidSelectionButton"]').contains('3').click();
    }

    cy.get('[data-cy="team1TotalMade"]').click();
    cy.get('[data-cy="bidSelectionModal"]').should('be.visible');
    cy.get('[data-cy="actualSelectionButton"]').contains('13').click();

    cy.get('[data-cy="team2TotalMade"]').click();
    cy.get('[data-cy="bidSelectionModal"]').should('be.visible');
    cy.get('[data-cy="actualSelectionButton"]').contains('0').click();
  };

  it('announces the winner, and New Game resets the board and wipes the limit', () => {
    startGameWithLimitFromHome('30');

    playTeam1WinningRound();

    cy.contains('Game Over').should('be.visible');
    cy.contains('Team 1 wins!').should('be.visible');

    cy.contains('button', 'New Game').click();
    cy.contains(
      'Do you want to set a score limit for this game?',
    ).should('be.visible');
    cy.contains('button', 'No').click();

    // Board is back to a fresh game: no winner modal, round history empty
    // (Round 2 must NOT exist), and the limit is back to infinity.
    cy.contains('Game Over').should('not.exist');
    cy.contains('Round 2').should('not.exist');
    cy.contains('Round 1').should('be.visible');
    cy.get('[data-testid="score-limit-display"]').should('contain', '∞');
  });

  it('persists the score limit across a reload and does not re-announce after continuing with a higher limit', () => {
    seedBoard({ scoreLimit: JSON.stringify(30) });

    cy.get('[data-testid="score-limit-display"]').should(
      'contain',
      'Score limit: 30',
    );

    // Reload: the limit survives (localStorage wiring end-to-end).
    cy.reload();
    cy.get('[data-testid="score-limit-display"]').should(
      'contain',
      'Score limit: 30',
    );

    playTeam1WinningRound();
    cy.contains('Team 1 wins!').should('be.visible');

    // Continue with a replacement limit above the winner's 130.
    cy.contains('button', 'Continue').click();
    cy.contains('button', 'Yes').click();
    cy.get('[data-testid="score-limit-input"]').type('200');
    cy.get('[data-testid="setScoreLimitButton"]').click();

    cy.contains('Game Over').should('not.exist');

    // Reload again: the replacement limit persists and the game stays quiet.
    cy.reload();
    cy.get('[data-testid="score-limit-display"]').should(
      'contain',
      'Score limit: 200',
    );
    cy.contains('Game Over').should('not.exist');
  });
});
