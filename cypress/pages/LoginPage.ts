import selectors from '../selectors/shop.selectors.json';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  login(email: string, password: string): void {
    cy.get(selectors.login.email).clear().type(email);
    cy.get(selectors.login.password).clear().type(password, { log: false });
    cy.get(selectors.login.submit).click();
  }

  accountName() {
    return cy.get(selectors.login.accountName);
  }
}
