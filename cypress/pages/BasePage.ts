export class BasePage {
  visit(path = '/'): void {
    // Centralized navigation keeps specs focused on business behavior.
    cy.visit(path);
  }
}
