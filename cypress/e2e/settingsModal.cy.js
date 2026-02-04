describe('Settings Modal Overlay Bug', () => {
  beforeEach(() => {
    cy.visit('/spades-calculator');
  });

  const checkOverlay = (modalSelector) => {
    // Assert only one overlay exists
    cy.get('[data-testid="modal-backdrop"]').should('have.length', 1);
  };

  it('should not show double overlays when opening More Info from Settings', () => {
    // 1. Open Hamburger Menu
    cy.get('button[aria-label="Open Menu"]').click();

    // 2. Open Settings Modal
    cy.contains('Settings').should('be.visible').click();
    cy.contains('Select your preferred scoring rules').should('be.visible');

    // 3. Verify only one backdrop
    checkOverlay('[role="dialog"]');

    // 4. Click Question Mark (More Info)
    // We use the data-testid added to the icon
    cy.get('[data-testid="score-help-button"]').click();

    // 5. Verify Score Settings Modal is visible
    cy.contains('Score Settings').should('be.visible');

    // 6. BUG CHECK: Verify we still only have ONE backdrop
    // If the bug exists, this might find 2 backdrops (one for each modal)
    // or checks z-index issues. The user described "blurry overlay where I can't actually view".
    // Usually caused by backdrop on top of content or multiple backdrops.
    cy.get('[data-testid="modal-backdrop"]').should('have.length', 1);

    // 7. Verify we can see content clearly (z-index check)
    cy.get('[data-testid="modal-backdrop"]').then($backdrop => {
        cy.contains('Score Settings').closest('[role="dialog"]').then($modal => {
            const backdropZ = parseInt($backdrop.css('z-index'));
            const modalZ = parseInt($modal.css('z-index'));
            expect(modalZ).to.be.gt(backdropZ);
        });
    });
  });
});
