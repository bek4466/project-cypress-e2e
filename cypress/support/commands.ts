import users from '../fixtures/users.json';
import { LoginPage } from '../pages/LoginPage';

declare global {
  namespace Cypress {
    interface Chainable {
      loginAs(userKey: keyof typeof users): Chainable<void>;
    }
  }
}

Cypress.Commands.add('loginAs', userKey => {
  const login = new LoginPage();
  const user = users[userKey];
  login.visit();
  login.login(user.email, user.password);
  login.accountName().should('have.text', user.displayName);
});

export {};
