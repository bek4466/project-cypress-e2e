import selectors from '../selectors/shop.selectors.json';

describe('Smoke checks', () => {
  it('application shell and API health are available', () => {
    // This smoke test stays shallow so it can fail fast when an environment is down.
    cy.visit('/');
    cy.get(selectors.login.email).should('be.visible');
    cy.get(selectors.login.submit).should('be.enabled');

    cy.request(`${Cypress.env('apiBaseUrl')}/api/health`).then(response => {
      expect(response.status).to.eq(200);
      expect(response.body.status).to.eq('UP');
    });
  });
});
