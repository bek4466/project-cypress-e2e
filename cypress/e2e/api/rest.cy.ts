import users from '../../fixtures/users.json';

const apiBaseUrl = Cypress.env('apiBaseUrl');

describe('REST API contract checks', () => {
  it('health endpoint exposes operational metadata and correlation id', () => {
    cy.request(`${apiBaseUrl}/api/health`).then(response => {
      expect(response.status).to.eq(200);
      expect(response.headers['content-type']).to.contain('application/json');
      expect(response.headers['x-correlation-id']).to.not.be.empty;
      expect(response.body).to.include({ status: 'UP', service: 'qa-cart-api' });
      expect(response.body.version).to.match(/^\d+\.\d+\.\d+$/);
    });
  });

  it('user can authenticate, search inventory, and submit an order', () => {
    cy.request('POST', `${apiBaseUrl}/api/auth/login`, {
      email: users.standardUser.email,
      password: users.standardUser.password
    }).then(loginResponse => {
      expect(loginResponse.status).to.eq(200);
      expect(loginResponse.body.token).to.match(/^token-/);
      expect(loginResponse.body.user).to.include({
        email: users.standardUser.email,
        role: 'qa-admin'
      });

      cy.request(`${apiBaseUrl}/api/products?category=Accessories&inStock=true`).then(productsResponse => {
        expect(productsResponse.status).to.eq(200);
        expect(productsResponse.body.meta.count).to.be.greaterThan(0);
        const keyboard = productsResponse.body.data.find((product: { id: string }) => product.id === 'prd-100');
        expect(keyboard).to.include({ id: 'prd-100', name: 'Aurora Keyboard' });
      });

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/api/orders`,
        headers: { authorization: `Bearer ${loginResponse.body.token}` },
        body: { productId: 'prd-100', quantity: 1 }
      }).then(orderResponse => {
        expect(orderResponse.status).to.eq(201);
        expect(orderResponse.body).to.include({
          status: 'CONFIRMED',
          customerId: loginResponse.body.user.id,
          subtotal: 129,
          total: 139.64
        });
      });
    });
  });

  it('orders enforce auth and inventory business rules', () => {
    cy.request({
      method: 'POST',
      url: `${apiBaseUrl}/api/orders`,
      failOnStatusCode: false,
      body: { productId: 'prd-100', quantity: 1 }
    }).then(response => {
      expect(response.status).to.eq(401);
      expect(response.body.code).to.eq('UNAUTHORIZED');
    });

    cy.request('POST', `${apiBaseUrl}/api/auth/login`, {
      email: users.standardUser.email,
      password: users.standardUser.password
    }).then(loginResponse => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/api/orders`,
        failOnStatusCode: false,
        headers: { authorization: `Bearer ${loginResponse.body.token}` },
        body: { productId: 'prd-101', quantity: 1 }
      }).then(response => {
        expect(response.status).to.eq(409);
        expect(response.body).to.include({ code: 'INSUFFICIENT_INVENTORY', available: 0 });
      });
    });
  });
});
