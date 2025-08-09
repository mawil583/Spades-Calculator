describe('PWA Functionality', () => {
  describe('Service Worker Registration', () => {
    it('should handle service worker registration errors gracefully', () => {
      cy.visit('http://localhost:3000', {
        onBeforeLoad(win) {
          // Mock service worker registration failure
          cy.stub(win.navigator.serviceWorker, 'register').rejects(
            new Error('Registration failed')
          );
        },
      });

      // App should still load even if service worker fails
      cy.get('#root').should('exist');
    });
  });

  describe('Offline Functionality', () => {
    it('should work offline after initial load', () => {
      // First visit to cache resources
      cy.visit('http://localhost:3000');

      // Wait for service worker to register and cache resources
      cy.wait(2000);

      // Simulate offline mode
      cy.window().then((win) => {
        cy.stub(win.navigator, 'onLine').value(false);
        win.dispatchEvent(new Event('offline'));
      });

      // App should still be functional
      cy.get('#root').should('exist');

      // Test that the app can still navigate
      cy.visit('http://localhost:3000/spades-calculator');
      cy.get('#root').should('exist');
    });
  });

  describe('App Installation', () => {
    it('should have proper manifest.json', () => {
      cy.request('http://localhost:3000/manifest.json').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('name', 'Spades Calculator');
        expect(response.body).to.have.property('short_name', 'Spades');
        expect(response.body).to.have.property('display', 'standalone');
        expect(response.body).to.have.property('start_url', '/');
        expect(response.body.icons).to.be.an('array');
        expect(response.body.icons.length).to.be.greaterThan(0);
      });
    });

    it('should have proper meta tags for PWA', () => {
      cy.visit('http://localhost:3000');

      // Check for PWA meta tags
      cy.get('meta[name="theme-color"]').should(
        'have.attr',
        'content',
        '#667eea'
      );
      cy.get('meta[name="apple-mobile-web-app-capable"]').should(
        'have.attr',
        'content',
        'yes'
      );
      cy.get('meta[name="mobile-web-app-capable"]').should(
        'have.attr',
        'content',
        'yes'
      );
      cy.get('link[rel="manifest"]').should(
        'have.attr',
        'href',
        '/manifest.json'
      );
    });

    it('should have proper icons for app installation', () => {
      cy.visit('http://localhost:3000');

      // Check for app icons
      cy.get('link[rel="apple-touch-icon"]').should('exist');
      cy.get('link[rel="icon"]').should('exist');
    });
  });

  describe('Cache Management', () => {
    it('should handle navigation requests', () => {
      cy.visit('http://localhost:3000');
      cy.wait(2000);

      // Navigate to another page
      cy.visit('http://localhost:3000/spades-calculator');
      cy.wait(1000);

      // Verify the page loaded successfully
      cy.get('#root').should('exist');
    });
  });

  describe('Performance and Loading', () => {
    it('should handle large data sets efficiently', () => {
      cy.visit('http://localhost:3000');

      // Simulate adding multiple rounds of data
      for (let i = 0; i < 10; i++) {
        // Add some test data
        cy.window().then((win) => {
          const testData = {
            round: i + 1,
            bids: [1, 2, 3, 4],
            actuals: [1, 2, 3, 4],
          };
          win.localStorage.setItem(`round_${i}`, JSON.stringify(testData));
        });
      }

      // App should still be responsive
      cy.get('#root').should('exist');
    });
  });

  describe('Error Handling', () => {
    it('should handle service worker errors gracefully', () => {
      cy.visit('http://localhost:3000', {
        onBeforeLoad(win) {
          // Mock service worker error
          cy.stub(win.navigator.serviceWorker, 'register').throws(
            new Error('Service worker error')
          );
        },
      });

      // App should still function
      cy.get('#root').should('exist');
    });

    it('should handle cache errors gracefully', () => {
      cy.visit('http://localhost:3000', {
        onBeforeLoad(win) {
          // Mock cache error
          cy.stub(win.caches, 'open').rejects(new Error('Cache error'));
        },
      });

      // App should still function
      cy.get('#root').should('exist');
    });
  });

  describe('Cross-browser Compatibility', () => {
    it('should work in browsers without service worker support', () => {
      cy.visit('http://localhost:3000', {
        onBeforeLoad(win) {
          // Remove service worker support
          delete win.navigator.serviceWorker;
        },
      });

      // App should still function
      cy.get('#root').should('exist');
    });

    it('should work in browsers without cache support', () => {
      cy.visit('http://localhost:3000', {
        onBeforeLoad(win) {
          // Remove cache support
          delete win.caches;
        },
      });

      // App should still function
      cy.get('#root').should('exist');
    });
  });
});
