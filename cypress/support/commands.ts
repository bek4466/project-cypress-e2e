import users from '../fixtures/users.json';
import { LoginPage } from '../pages/LoginPage';

// User fixtures model reusable personas for authentication tests.
declare global {
  namespace Cypress {
    interface Chainable {
      loginAs(userKey: keyof typeof users): Chainable<void>;
    }
  }
}

Cypress.Commands.add('loginAs', userKey => {
  // Custom command wraps the common login setup while keeping tests readable.
  const login = new LoginPage();
  const user = users[userKey];
  login.visit();
  login.login(user.email, user.password);
  login.accountName().should('have.text', user.displayName);
});

export {};
