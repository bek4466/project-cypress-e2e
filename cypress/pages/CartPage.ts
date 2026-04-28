import selectors from '../selectors/shop.selectors.json';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  openCart(): void {
    cy.get(selectors.cart.open).click();
  }

  checkout(): void {
    cy.get(selectors.cart.checkout).click();
  }

  count() {
    return cy.get(selectors.cart.count);
  }

  subtotal() {
    return cy.get(selectors.cart.subtotal);
  }
}
