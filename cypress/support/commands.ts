// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
Cypress.Commands.overwrite('visit', (originalFn: any, url: any, options: any) => {
  return (originalFn as any)(url, options).then(() => {
    // Hide/remove CRA dev server overlay if it appears and blocks interactions
    cy.window({ log: false }).then((win) => {
      const { document } = win;
      // Inject CSS to keep overlay hidden
      const style = document.createElement('style');
      style.innerHTML = `#webpack-dev-server-client-overlay, #webpack-dev-server-client-overlay-div { display: none !important; visibility: hidden !important; }`;
      document.head.appendChild(style);

      // Repeatedly try removing it, in case it's inserted after load
      const removeOverlay = () => {
        const overlay = document.getElementById('webpack-dev-server-client-overlay');
        const overlayDiv = document.getElementById('webpack-dev-server-client-overlay-div');
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
        if (overlayDiv && overlayDiv.parentNode) overlayDiv.parentNode.removeChild(overlayDiv);
      };
      removeOverlay();
      win.setInterval(removeOverlay, 250);
    });
  });
});