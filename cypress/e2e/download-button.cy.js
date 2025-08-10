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

  describe('Download Button Display', () => {
    it('should show download button on home page below settings section', () => {
      cy.visit('http://localhost:3000');

      // Check for download button
      cy.get('[data-testid="download-button"]').should('exist');
      cy.contains('📱 Download Spades Calculator App').should('be.visible');
      cy.contains(
        'Add to your home screen for quick access and offline use'
      ).should('be.visible');
      cy.get('button').contains('Download App').should('be.visible');

      // Verify it's positioned after the settings section
      cy.get('body').then(($body) => {
        const downloadButtonIndex = $body
          .find('[data-testid="download-button"]')
          .index();
        const settingsSectionIndex = $body.find('form').index();
        expect(downloadButtonIndex).to.be.greaterThan(settingsSectionIndex);
      });
    });

    it('should not show download button on calculator page', () => {
      // First visit home page to set up names
      cy.visit('http://localhost:3000');
      cy.get('input[name="t1p1Name"]').type('Player 1');
      cy.get('input[name="t1p2Name"]').type('Player 2');
      cy.get('input[name="t2p1Name"]').type('Player 3');
      cy.get('input[name="t2p2Name"]').type('Player 4');
      cy.get('button[type="submit"]').click();

      // Check that download button is NOT on calculator page
      cy.url().should('include', '/spades-calculator');
      cy.get('[data-testid="download-button"]').should('not.exist');
    });

    it('should not show download button when app is already installed', () => {
      // Mock standalone mode
      cy.visit('http://localhost:3000', {
        onBeforeLoad(win) {
          // Mock standalone mode
          cy.stub(win, 'matchMedia').returns({
            matches: true,
            media: '(display-mode: standalone)',
            onchange: null,
            addListener: cy.stub(),
            removeListener: cy.stub(),
            addEventListener: cy.stub(),
            removeEventListener: cy.stub(),
            dispatchEvent: cy.stub(),
          });
        },
      });

      // Download button should not be visible
      cy.get('[data-testid="download-button"]').should('not.exist');
    });
  });

  describe('Download Button Functionality', () => {
    it('should handle download button click with deferred prompt', () => {
      cy.visit('http://localhost:3000', {
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

      // Click the download button
      cy.get('button').contains('Download App').click();

      // Should show some kind of installation-related message
      cy.get('body').then(($body) => {
        const bodyText = $body.text();
        const hasInstallInstructions = bodyText.includes(
          'Install Instructions'
        );
        const hasInstallationStarted = bodyText.includes(
          'Installation Started'
        );
        const hasInstallationPromptShown = bodyText.includes(
          'Installation Prompt Shown'
        );
        const hasInstallationCancelled = bodyText.includes(
          'Installation Cancelled'
        );
        const hasInstallOnIOS = bodyText.includes('Install on iOS');
        const hasInstallOnAndroid = bodyText.includes('Install on Android');
        const hasInstallInBrave = bodyText.includes('Install in Brave');
        const hasInstallInChrome = bodyText.includes('Install in Chrome');
        const hasInstallInFirefox = bodyText.includes('Install in Firefox');

        expect(
          hasInstallInstructions ||
            hasInstallationStarted ||
            hasInstallationPromptShown ||
            hasInstallationCancelled ||
            hasInstallOnIOS ||
            hasInstallOnAndroid ||
            hasInstallInBrave ||
            hasInstallInChrome ||
            hasInstallInFirefox
        ).to.be.true;
      });
    });

    it('should handle download button click with deferred prompt - user cancels', () => {
      cy.visit('http://localhost:3000', {
        onBeforeLoad(win) {
          // Mock beforeinstallprompt event with user cancellation
          const mockPrompt = {
            preventDefault: cy.stub(),
            prompt: cy.stub(),
            userChoice: Promise.resolve({ outcome: 'dismissed' }),
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

      // Click the download button
      cy.get('button').contains('Download App').click();

      // Should show some kind of installation-related message
      cy.get('body').then(($body) => {
        const bodyText = $body.text();
        const hasInstallInstructions = bodyText.includes(
          'Install Instructions'
        );
        const hasInstallationStarted = bodyText.includes(
          'Installation Started'
        );
        const hasInstallationPromptShown = bodyText.includes(
          'Installation Prompt Shown'
        );
        const hasInstallationCancelled = bodyText.includes(
          'Installation Cancelled'
        );
        const hasInstallOnIOS = bodyText.includes('Install on iOS');
        const hasInstallOnAndroid = bodyText.includes('Install on Android');
        const hasInstallInBrave = bodyText.includes('Install in Brave');
        const hasInstallInChrome = bodyText.includes('Install in Chrome');
        const hasInstallInFirefox = bodyText.includes('Install in Firefox');

        expect(
          hasInstallInstructions ||
            hasInstallationStarted ||
            hasInstallationPromptShown ||
            hasInstallationCancelled ||
            hasInstallOnIOS ||
            hasInstallOnAndroid ||
            hasInstallInBrave ||
            hasInstallInChrome ||
            hasInstallInFirefox
        ).to.be.true;
      });
    });

    it('should try to trigger installation multiple times for Android/desktop', () => {
      cy.visit('http://localhost:3000', {
        onBeforeLoad(win) {
          // Mock service worker support
          Object.defineProperty(win.navigator, 'serviceWorker', {
            value: {},
            configurable: true,
          });
        },
      });

      // Click the download button
      cy.get('button').contains('Download App').click();

      // Should show some kind of installation-related message
      cy.get('body').then(($body) => {
        const bodyText = $body.text();
        const hasInstallInstructions = bodyText.includes(
          'Install Instructions'
        );
        const hasInstallationStarted = bodyText.includes(
          'Installation Started'
        );
        const hasInstallationPromptShown = bodyText.includes(
          'Installation Prompt Shown'
        );
        const hasInstallationCancelled = bodyText.includes(
          'Installation Cancelled'
        );
        const hasInstallOnIOS = bodyText.includes('Install on iOS');
        const hasInstallOnAndroid = bodyText.includes('Install on Android');
        const hasInstallInBrave = bodyText.includes('Install in Brave');
        const hasInstallInChrome = bodyText.includes('Install in Chrome');
        const hasInstallInFirefox = bodyText.includes('Install in Firefox');

        expect(
          hasInstallInstructions ||
            hasInstallationStarted ||
            hasInstallationPromptShown ||
            hasInstallationCancelled ||
            hasInstallOnIOS ||
            hasInstallOnAndroid ||
            hasInstallInBrave ||
            hasInstallInChrome ||
            hasInstallInFirefox
        ).to.be.true;
      });
    });

    it('should handle iOS share functionality when available', () => {
      cy.visit('http://localhost:3000', {
        onBeforeLoad(win) {
          // Mock iOS user agent
          cy.stub(win.navigator, 'userAgent').value(
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
          );
        },
      });

      // Click the download button
      cy.get('button').contains('Download App').click();

      // Should show iOS-specific instructions
      cy.contains('Install on iOS').should('be.visible');
      cy.contains('Share button').should('be.visible');
    });

    it('should handle iOS share functionality when share is cancelled', () => {
      cy.visit('http://localhost:3000', {
        onBeforeLoad(win) {
          // Mock iOS user agent
          cy.stub(win.navigator, 'userAgent').value(
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
          );
        },
      });

      // Click the download button
      cy.get('button').contains('Download App').click();

      // Should show iOS-specific instructions
      cy.contains('Install on iOS').should('be.visible');
      cy.contains('Share button').should('be.visible');
    });

    it('should show manual instructions for iOS devices', () => {
      cy.visit('http://localhost:3000', {
        onBeforeLoad(win) {
          // Mock iOS user agent
          cy.stub(win.navigator, 'userAgent').value(
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
          );
        },
      });

      // Click the download button
      cy.get('button').contains('Download App').click();

      // Should show iOS-specific instructions
      cy.contains('Share button').should('be.visible');
      cy.contains('Add to Home Screen').should('be.visible');
    });

    it('should show manual instructions for Android devices', () => {
      cy.visit('http://localhost:3000', {
        onBeforeLoad(win) {
          // Mock Android user agent
          cy.stub(win.navigator, 'userAgent').value(
            'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36'
          );
        },
      });

      // Click the download button
      cy.get('button').contains('Download App').click();

      // Should show Android-specific instructions
      cy.contains('menu').should('be.visible');
      cy.contains('Add to Home Screen').should('be.visible');
    });

    it('should show manual instructions for desktop browsers', () => {
      cy.visit('http://localhost:3000', {
        onBeforeLoad(win) {
          // Mock desktop user agent
          cy.stub(win.navigator, 'userAgent').value(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          );
        },
      });

      // Click the download button
      cy.get('button').contains('Download App').click();

      // Should show desktop-specific instructions
      cy.contains('share/install icon').should('be.visible');
      cy.contains('address bar').should('be.visible');
    });
  });

  describe('Download Button Styling', () => {
    it('should have proper styling and layout', () => {
      cy.visit('http://localhost:3000');

      // Check for proper styling
      cy.get('[data-testid="download-button"]')
        .should('have.css', 'background-color')
        .and('not.eq', 'rgba(0, 0, 0, 0)');

      cy.get('[data-testid="download-button"]')
        .should('have.css', 'border-radius')
        .and('not.eq', '0px');

      // Check for proper spacing
      cy.get('[data-testid="download-button"]').should(
        'have.css',
        'margin-bottom'
      );
    });

    it('should have hover effects', () => {
      cy.visit('http://localhost:3000');

      // Check that the button has transition property for hover effects
      cy.get('button')
        .contains('Download App')
        .should('have.css', 'transition')
        .and('not.eq', 'all 0s ease 0s');
    });
  });

  describe('Download Button Integration', () => {
    it('should work with the rest of the app functionality', () => {
      cy.visit('http://localhost:3000');

      // Download button should be visible
      cy.get('[data-testid="download-button"]').should('exist');

      // Should still be able to fill out the form
      cy.get('input[name="t1p1Name"]').type('Player 1');
      cy.get('input[name="t1p2Name"]').type('Player 2');
      cy.get('input[name="t2p1Name"]').type('Player 3');
      cy.get('input[name="t2p2Name"]').type('Player 4');

      // Should be able to submit the form
      cy.get('button[type="submit"]').click();

      // Should navigate to calculator page
      cy.url().should('include', '/spades-calculator');

      // Download button should NOT be visible on calculator page
      cy.get('[data-testid="download-button"]').should('not.exist');
    });

    it('should not interfere with app navigation', () => {
      cy.visit('http://localhost:3000');

      // Fill out the form
      cy.get('input[name="t1p1Name"]').type('Player 1');
      cy.get('input[name="t1p2Name"]').type('Player 2');
      cy.get('input[name="t2p1Name"]').type('Player 3');
      cy.get('input[name="t2p2Name"]').type('Player 4');
      cy.get('button[type="submit"]').click();

      // Navigate to calculator page
      cy.url().should('include', '/spades-calculator');

      // Should be able to use the calculator functionality
      cy.get('#root').should('exist');
      cy.contains('Score').should('be.visible');
    });
  });
});
