describe('Download Button Functionality', () => {
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

  describe('Download Button Installation Flow', () => {
    it('should handle download button click with deferred prompt', () => {
      cy.visit('/', {
        onBeforeLoad(win) {
          // Mock beforeinstallprompt event
          const mockPrompt = {
            preventDefault: cy.stub(),
            prompt: cy.stub(),
            userChoice: Promise.resolve({ outcome: 'accepted' }),
          };

          cy.stub(win, 'addEventListener').callsFake((event, handler) => {
            if (event === 'beforeinstallprompt') {
              // Simulate the event being fired
              setTimeout(() => {
                handler(mockPrompt);
              }, 100);
            }
          });
        },
      });

      // Click the download button (now in menu)
      cy.get('button[aria-label="Open Menu"]').click();
      cy.contains('Offline Download').click();

      // Should show some kind of installation-related message
      cy.contains(/Install Instructions|Installation Started|Installation Prompt Shown|Installation Cancelled|Install on iOS|Install on Android|Install in Brave|Install in Chrome|Install in Firefox/i).should('be.visible');
    });

    it('should handle iOS share functionality when available', () => {
      cy.visit('/', {
        onBeforeLoad(win) {
          // Mock iOS share functionality
          Object.defineProperty(win.navigator, 'share', {
            value: cy.stub().resolves(),
            configurable: true,
          });
          cy.stub(win.navigator, 'userAgent').value(
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
          );
        },
      });

      // Click the download button (now in menu)
      cy.get('button[aria-label="Open Menu"]').click();
      cy.contains('Offline Download').click();

      // Should show iOS-specific instructions
      cy.contains('Share button').should('be.visible');
      cy.contains('Add to Home Screen').should('be.visible');
    });

    it('should handle Android installation flow', () => {
      cy.visit('/', {
        onBeforeLoad(win) {
          // Mock Android user agent
          cy.stub(win.navigator, 'userAgent').value(
            'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36'
          );
        },
      });

      // Click the download button (now in menu)
      cy.get('button[aria-label="Open Menu"]').click();
      cy.contains('Offline Download').click();

      // Should show Android-specific instructions
      cy.contains('menu').should('be.visible');
      cy.contains('Add to Home Screen').should('be.visible');
    });
  });
});
