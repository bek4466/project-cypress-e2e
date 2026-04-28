export function shouldHaveText(subject: Cypress.Chainable<JQuery<HTMLElement>>, expected: string): void {
  // Shared assertion helper keeps page-object specs using the same language.
  subject.should('have.text', expected);
}

export function shouldBeVisible(subject: Cypress.Chainable<JQuery<HTMLElement>>): void {
  // Shared visibility helper makes workflow-state assertions explicit.
  subject.should('be.visible');
}
