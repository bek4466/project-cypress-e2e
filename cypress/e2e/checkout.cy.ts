import flowData from '../test-data/checkout.flows.json';
import { shouldBeVisible, shouldHaveText } from '../utils/assertions';
import { CartPage } from '../pages/CartPage';
import { CatalogPage } from '../pages/CatalogPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ReceiptPage } from '../pages/ReceiptPage';

describe('QA Cart checkout', () => {
  it('standard user can complete a data-driven checkout flow', () => {
    const flow = flowData.smokePurchase;
    const catalog = new CatalogPage();
    const cart = new CartPage();
    const checkout = new CheckoutPage();
    const receipt = new ReceiptPage();

    cy.loginAs('standardUser');

    catalog.filterBy(flow.searchTerm, flow.category);
    catalog.addProduct(flow.productName);
    shouldHaveText(cart.count(), flow.expected.cartCount);

    cart.openCart();
    shouldHaveText(cart.subtotal(), flow.expected.subtotal);
    cart.checkout();

    checkout.submitShipping(flow.shipping);
    shouldBeVisible(receipt.panel());
    shouldHaveText(receipt.customer(), flow.expected.receiptCustomer);
    shouldHaveText(receipt.total(), flow.expected.total);
    receipt.orderNumber().invoke('text').should('match', /^QA-/);
  });
});
