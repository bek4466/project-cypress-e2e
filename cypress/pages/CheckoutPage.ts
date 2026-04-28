import selectors from '../selectors/shop.selectors.json';
import { BasePage } from './BasePage';

type Shipping = {
  name: string;
  address: string;
  city: string;
};

export class CheckoutPage extends BasePage {
  submitShipping(shipping: Shipping): void {
    cy.get(selectors.checkout.name).clear().type(shipping.name);
    cy.get(selectors.checkout.address).clear().type(shipping.address);
    cy.get(selectors.checkout.city).clear().type(shipping.city);
    cy.get(selectors.checkout.submit).click();
  }
}
