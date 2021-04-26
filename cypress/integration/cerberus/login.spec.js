describe('Log-in to cerberus UI', () => {
  beforeEach(() => {
    cy.login('cypressuser-cerberus@lodev.xyz');
  });

  it('Should Log-in Successfully into cerberus UI', () => {
    cy.url().should('include', '/tasks');

    cy.get('.govuk-heading-xl').should('contain.text', 'Task management');

    cy.contains('Issue a target').click();
    cy.url().should('include', '/issue-target');

    cy.contains('Tasks').click();
    cy.url().should('include', '/tasks');
  });

  after(() => {
    cy.contains('Sign out').click();
    cy.get('#kc-page-title').should('contain.text', 'Log In');
  });
});
