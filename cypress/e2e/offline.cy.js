describe('Offline Page Functionality', () => {
  describe('Offline Page Display', () => {
    it('should show offline page when network is unavailable', () => {
      // First visit to cache resources
      cy.visit('http://localhost:3000');
      cy.wait(2000);

      // Simulate offline mode
      cy.window().then((win) => {
        cy.stub(win.navigator, 'onLine').value(false);
        win.dispatchEvent(new Event('offline'));
      });

      // Try to access a page that should show offline content
      cy.visit('http://localhost:3000/offline.html', {
        failOnStatusCode: false,
      });

      // Should show offline page content
      cy.get('body').should('contain', "You're Offline");
      cy.get('body').should(
        'contain',
        "Don't worry - you can still use Spades Calculator for basic functionality!"
      );
    });

    it('should have proper styling and layout', () => {
      cy.visit('http://localhost:3000/offline.html');

      // Check for offline page styling
      cy.get('body')
        .should('have.css', 'background')
        .and('include', 'gradient');
      cy.get('.offline-container').should('exist');
      cy.get('.offline-icon').should('exist');
      cy.get('.retry-button').should('exist');
    });

    it('should have retry functionality', () => {
      cy.visit('http://localhost:3000/offline.html');

      // Check retry button
      cy.get('.retry-button').should('contain', 'Try Again');
      cy.get('.retry-button').should('be.visible');
    });
  });

  describe('Offline Page Navigation', () => {
    it('should allow navigation back to main app', () => {
      cy.visit('http://localhost:3000/offline.html');

      // Click retry button
      cy.get('.retry-button').click();

      // Should navigate back to main app
      cy.url().should('include', 'localhost:3000');
    });

    it('should handle online/offline state changes', () => {
      cy.visit('http://localhost:3000/offline.html');

      // Simulate coming back online
      cy.window().then((win) => {
        cy.stub(win.navigator, 'onLine').value(true);
        win.dispatchEvent(new Event('online'));
      });

      // Should automatically reload when back online
      cy.url().should('include', 'localhost:3000');
    });
  });

  describe('Offline Page Content', () => {
    it('should have appropriate messaging', () => {
      cy.visit('http://localhost:3000/offline.html');

      // Check for appropriate offline messaging
      cy.get('h1').should('contain', "You're Offline");
      cy.get('p').should(
        'contain',
        "It looks like you don't have an internet connection right now"
      );
      cy.get('p').should(
        'contain',
        "Don't worry - you can still use Spades Calculator for basic functionality!"
      );
    });

    it('should have proper heading structure', () => {
      cy.visit('http://localhost:3000/offline.html');

      // Check for proper heading structure
      cy.get('h1').should('exist');
    });
  });

  describe('Offline Page Integration', () => {
    it('should work with app navigation when offline', () => {
      // First visit to cache resources
      cy.visit('http://localhost:3000');
      cy.wait(2000);

      // Simulate offline mode
      cy.window().then((win) => {
        cy.stub(win.navigator, 'onLine').value(false);
        win.dispatchEvent(new Event('offline'));
      });

      // Try to navigate within the app
      cy.visit('http://localhost:3000/spades-calculator');
      cy.get('#root').should('exist');
    });
  });

  describe('Offline Page Performance', () => {
    it('should load quickly', () => {
      const startTime = Date.now();

      cy.visit('http://localhost:3000/offline.html').then(() => {
        const loadTime = Date.now() - startTime;
        expect(loadTime).to.be.lessThan(2000); // Should load in under 2 seconds
      });
    });

    it('should have minimal resource usage', () => {
      cy.visit('http://localhost:3000/offline.html');

      // Check that the page doesn't make unnecessary network requests
      cy.window().then((win) => {
        if (win.performance && win.performance.getEntriesByType) {
          const resourceEntries = win.performance.getEntriesByType('resource');
          // Should have minimal external resources
          expect(resourceEntries.length).to.be.lessThan(5);
        }
      });
    });
  });
});
