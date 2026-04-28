import selectors from '../selectors/shop.selectors.json';
import { BasePage } from './BasePage';

export class ReceiptPage extends BasePage {
  panel() {
    return cy.get(selectors.receipt.panel);
  }

  customer() {
    return cy.get(selectors.receipt.customer);
  }

  total() {
    return cy.get(selectors.receipt.total);
  }

  orderNumber() {
    return cy.get(selectors.receipt.orderNumber);
  }
}
