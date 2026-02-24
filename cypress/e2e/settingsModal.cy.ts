describe('Settings Modal Overlay Bug', () => {
  beforeEach(() => {
    cy.visit('/spades-calculator');
  });

  // Chakra dialog backdrop selector - portalled to body
  const backdropSelector = '[data-scope="dialog"][data-part="backdrop"]';

  const checkSingleBackdrop = () => {
    // The backdrop is rendered in a portal
    cy.get(backdropSelector).should('have.length', 1);
  };

  it('should not show double overlays when opening More Info from Settings', () => {
    // 1. Open Hamburger Menu
    cy.get('button[aria-label="Open Menu"]').click();

    // Wait for menu to appear (it's conditionally rendered)
    cy.contains('Settings').should('be.visible');

    // 2. Open Settings Modal
    cy.contains('Settings').click();

    // Wait for modal dialog to be fully rendered
    cy.get('[role="dialog"]').should('be.visible');
    cy.contains('Select your preferred scoring rules').should('be.visible');

    // 3. Verify only one backdrop exists (backdrop is portalled to body)
    checkSingleBackdrop();

    // 4. Click Question Mark (More Info) to switch to Score Settings view
    cy.get('[data-testid="score-help-button"]').should('be.visible').click({ force: true });

    // 5. Verify Score Settings view is now showing (same modal, different content)
    cy.contains('Score Settings').should('be.visible');

    // 6. BUG CHECK: Verify we still only have ONE backdrop
    // The architecture swaps content within the same modal, so backdrop count should stay at 1
    checkSingleBackdrop();

    // 7. Verify modal content is above backdrop (z-index check)
    cy.get(backdropSelector).then($backdrop => {
      cy.get('[role="dialog"]').then($modal => {
        const backdropZ = parseInt($backdrop.css('z-index'));
        const modalZ = parseInt($modal.css('z-index'));
        (expect(modalZ) as any).to.be.gt(backdropZ);
      });
    });
  });
});
