const apiBaseUrl = Cypress.env('apiBaseUrl');

describe('GraphQL API contract checks', () => {
  it('products query supports category variables and typed response shape', () => {
    cy.request('POST', `${apiBaseUrl}/graphql`, {
      query: `query ProductsByCategory($category: String!) {
        products(category: $category) { id name category price inventory active }
      }`,
      variables: { category: 'Accessories' }
    }).then(response => {
      expect(response.status).to.eq(200);
      expect(response.body.errors).to.be.undefined;
      const keyboard = response.body.data.products.find((product: { id: string }) => product.id === 'prd-100');
      expect(keyboard).to.include({ id: 'prd-100', category: 'Accessories', active: true });
    });
  });

  it('createOrder mutation returns calculated totals and GraphQL domain errors', () => {
    const mutation = `mutation CreateOrder($productId: ID!, $quantity: Int!) {
      createOrder(productId: $productId, quantity: $quantity) { id status subtotal total }
    }`;

    cy.request('POST', `${apiBaseUrl}/graphql`, {
      query: mutation,
      variables: { productId: 'prd-100', quantity: 2 }
    }).then(response => {
      expect(response.status).to.eq(200);
      expect(response.body.data.createOrder).to.include({
        status: 'CONFIRMED',
        subtotal: 258,
        total: 279.29
      });
    });

    cy.request('POST', `${apiBaseUrl}/graphql`, {
      query: mutation,
      variables: { productId: 'missing-product', quantity: 1 }
    }).then(response => {
      expect(response.status).to.eq(200);
      expect(response.body.errors[0]).to.deep.include({
        message: 'Product not found'
      });
      expect(response.body.errors[0].extensions.code).to.eq('NOT_FOUND');
    });
  });
});
