import selectors from '../selectors/shop.selectors.json';
import { BasePage } from './BasePage';

export class ReceiptPage extends BasePage {
  panel() {
    // Receipt visibility is the completion signal for the checkout flow.
    return cy.get(selectors.receipt.panel);
  }

  customer() {
    // Confirms form data was carried through to the receipt.
    return cy.get(selectors.receipt.customer);
  }

  total() {
    // Confirms the order total calculation displayed to the user.
    return cy.get(selectors.receipt.total);
  }

  orderNumber() {
    // Confirms the application generated a receipt identifier.
    return cy.get(selectors.receipt.orderNumber);
  }
}
