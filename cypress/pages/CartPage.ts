import selectors from '../selectors/shop.selectors.json';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  openCart(): void {
    // Opens the cart drawer so line-item and subtotal checks are visible.
    cy.get(selectors.cart.open).click();
  }

  checkout(): void {
    // Moves the user from cart review to checkout entry.
    cy.get(selectors.cart.checkout).click();
  }

  count() {
    // Returns the cart badge used to validate quantity.
    return cy.get(selectors.cart.count);
  }

  subtotal() {
    // Returns the subtotal element used for price validation.
    return cy.get(selectors.cart.subtotal);
  }
}
