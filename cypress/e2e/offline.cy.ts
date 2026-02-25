describe('Offline Page Functionality', () => {
  beforeEach(() => {
    // Clear any existing service workers and caches
    cy.window().then((win) => {
      if (win.navigator.serviceWorker) {
        win.navigator.serviceWorker
          .getRegistrations()
          .then((registrations) => {
            registrations.forEach((registration) => {
              registration.unregister();
            });
          })
          .catch(() => {
            // Ignore errors if service worker is not available
          });
      }
      if (win.caches) {
        win.caches
          .keys()
          .then((cacheNames) => {
            cacheNames.forEach((cacheName) => {
              win.caches.delete(cacheName);
            });
          })
          .catch(() => {
            // Ignore errors if caches are not available
          });
      }
    });
  });

  // KEEPING: Essential offline functionality that requires browser environment
  describe('Offline Page Browser Integration', () => {
    it('should show offline page when network is unavailable', () => {
      // First visit to cache resources
      cy.visit('/');
      cy.wait(2000);

      // Simulate offline mode
      cy.window().then((win) => {
        cy.stub(win.navigator, 'onLine').value(false);
        win.dispatchEvent(new Event('offline'));
      });

      // Try to access a page that should show offline content
      cy.visit('/offline.html', {
        failOnStatusCode: false,
      });

      // Should show offline page content
      cy.get('body').should('contain', "You're Offline");
      cy.get('body').should(
        'contain',
        "Don't worry - you can still use Spades Calculator for basic functionality!"
      );
    });

    it('should handle online/offline state changes', () => {
      cy.visit('/offline.html');

      // Simulate coming back online
      cy.window().then((win) => {
        cy.stub(win.navigator, 'onLine').value(true);
        win.dispatchEvent(new Event('online'));
      });

      // Should automatically reload when back online
      cy.url().should('include', 'localhost:5173');
    });
  });

  // KEEPING: Cross-browser offline functionality
  describe('Offline Page Navigation', () => {
    it('should allow navigation back to main app', () => {
      cy.visit('/offline.html');

      // Click retry button
      cy.get('.retry-button').click();

      // Should navigate back to main app
      cy.url().should('include', 'localhost:5173');
    });

    it('should work with app navigation when offline', () => {
      // First visit to cache resources
      cy.visit('/');
      cy.wait(2000);

      // Simulate offline mode
      cy.window().then((win) => {
        cy.stub(win.navigator, 'onLine').value(false);
        win.dispatchEvent(new Event('offline'));
      });

      // Try to navigate within the app
      cy.visit('/spades-calculator');
      cy.get('#root').should('exist');
    });
  });

  // KEEPING: Performance testing that requires browser environment
  describe('Offline Page Performance', () => {
    it('should load quickly', () => {
      const startTime = Date.now();

      cy.visit('/offline.html').then(() => {
        const loadTime = Date.now() - startTime;
        (expect(loadTime) as any).to.be.lessThan(2000); // Should load in under 2 seconds
      });
    });

    it('should have minimal resource usage', () => {
      cy.visit('/offline.html');

      // Check that the page doesn't make unnecessary network requests
      cy.window().then((win) => {
        if (win.performance && win.performance.getEntriesByType) {
          const resourceEntries = win.performance.getEntriesByType('resource');
          // Should have minimal external resources
          (expect(resourceEntries.length) as any).to.be.lessThan(5);
        }
      });
    });
  });

  // REMOVED: All display logic tests (already covered by unit tests)
  // REMOVED: Styling tests (already covered by unit tests)
  // REMOVED: Content tests (already covered by unit tests)
  // REMOVED: Retry functionality tests (already covered by unit tests)
  // REMOVED: Heading structure tests (already covered by unit tests)
});
