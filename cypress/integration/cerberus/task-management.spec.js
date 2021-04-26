/// <reference types="Cypress"/>
/// <reference path="../support/index.d.ts" />

describe('Render tasks from Camunda and manage them on task management Page', () => {
  const MAX_TASK_PER_PAGE = 10;

  before(() => {
    cy.login(Cypress.env('userName'));
    cy.postTasks();
  });

  beforeEach(() => {
    cy.login(Cypress.env('userName'));
    cy.navigation('Tasks');
  });

  it('Should render all the tabs on task management page', () => {
    const taskNavigationItems = [
      'New',
      'In progress',
      'Complete',
    ];

    cy.get('.govuk-tabs__list li a').each((navigationItem, index) => {
      cy.wrap(navigationItem).click()
        .should('contain.text', taskNavigationItems[index]).and('be.visible');
    });
  });

  it('Should hide first and prev buttons on first page', () => {
    cy.get('.pagination--list a').then(($items) => {
      const texts = Array.from($items, (el) => el.innerText);
      expect(texts).not.to.contain(['First', 'Previous']);
    });

    cy.get('.pagination--summary').should('contain.text', `Showing 1 - ${MAX_TASK_PER_PAGE}`);
  });

  it('Should hide last and next buttons on last page', () => {
    cy.get('.pagination--list a').last().click();

    cy.get('.pagination--list a').then(($items) => {
      const texts = Array.from($items, (el) => el.innerText);
      expect(texts).not.to.contain(['Next', 'Last']);
    });
  });

  it('Should maintain the page links count', () => {
    cy.get('.task-list--item').should('have.length', MAX_TASK_PER_PAGE);

    cy.get('a[data-test="page-number"]').each((item) => {
      cy.wrap(item).click();
      cy.get('.task-list--item').its('length').should('be.lte', MAX_TASK_PER_PAGE);
    });
  });

  it('Should verify refresh task list page', () => {
    cy.intercept('POST', '/camunda/variable-instance?deserializeValues=false').as('tasks');
    cy.clock();

    cy.wait('@tasks').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });

    cy.get('a[href="/tasks?page=2"]').eq(0).click();

    cy.tick(65000);

    cy.wait('@tasks').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });

    cy.url().should('contain', 'page=2');
  });

  it('Should Unclaim & claim a task Successfully from task management page', () => {
    cy.intercept('POST', '/camunda/task/*/claim').as('claim');
    cy.intercept('POST', '/camunda/task/*/unclaim').as('unclaim');

    cy.get('.task-list--item').eq(0).within(() => {
      cy.get('.govuk-grid-row').eq(0).within(() => {
        cy.get('a').invoke('attr', 'href').as('taskLink');
        cy.contains('Claim').click();
      });
    });

    cy.wait('@claim').then(({ response }) => {
      expect(response.statusCode).to.equal(204);
    });

    cy.wait(2000);

    cy.get('a[href="#in-progress"]').click();

    cy.get('@taskLink').then(($value) => {
      cy.get(`.govuk-grid-row a[href="${$value}"]`)
        .parentsUntil('.task-list--item').within(() => {
          cy.get('button.link-button')
            .should('have.text', 'Unclaim')
            .click();
        });
    });

    cy.wait('@unclaim').then(({ response }) => {
      expect(response.statusCode).to.equal(204);
    });

    cy.wait(2000);
  });

  after(() => {
    cy.contains('Sign out').click();
    cy.get('#kc-page-title').should('contain.text', 'Log In');
  });
});
