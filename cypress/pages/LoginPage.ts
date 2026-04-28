import selectors from '../selectors/shop.selectors.json';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  login(email: string, password: string): void {
    // Credentials come from fixtures so the login flow stays data-driven.
    cy.get(selectors.login.email).clear().type(email);
    cy.get(selectors.login.password).clear().type(password, { log: false });
    cy.get(selectors.login.submit).click();
  }

  accountName() {
    // Exposes the post-login identity element for assertions.
    return cy.get(selectors.login.accountName);
  }
}
