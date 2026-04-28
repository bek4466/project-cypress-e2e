export function shouldHaveText(subject: Cypress.Chainable<JQuery<HTMLElement>>, expected: string): void {
  subject.should('have.text', expected);
}

export function shouldBeVisible(subject: Cypress.Chainable<JQuery<HTMLElement>>): void {
  subject.should('be.visible');
}
