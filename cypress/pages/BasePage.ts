export class BasePage {
  visit(path = '/'): void {
    cy.visit(path);
  }
}
