describe('Render tasks from Camunda and manage them on task details Page', () => {
  before(() => {
    cy.login(Cypress.env('userName'));
    cy.postTasks();
  });

  beforeEach(() => {
    cy.login(Cypress.env('userName'));
  });

  it('Should navigate to task details page', () => {
    cy.get('.task-heading a').eq(1).invoke('text').then((text) => {
      cy.contains(text).click();
      cy.get('.govuk-caption-xl').should('have.text', text);
    });
  });

  it('Should add notes for the selected tasks', () => {
    const taskNotes = 'Add notes for testing & check it stored';
    cy.intercept('POST', '/camunda/message').as('notes');
    cy.intercept('GET', '/camunda/task/*').as('tasksDetails');

    cy.getUnassignedTasks().then((tasks) => {
      const taskId = tasks.map(((item) => item.id));
      expect(taskId.length).to.not.equal(0);
      cy.visit(`/tasks/${taskId[0]}`);
      cy.wait('@tasksDetails').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
    });

    cy.get('.govuk-heading-xl').should('have.text', 'Task details');

    cy.wait(2000);

    cy.get('button.link-button').should('be.visible').and('have.text', 'Claim').click();

    cy.get('.formio-component-note textarea')
      .should('be.visible')
      .type(taskNotes, { force: true });

    cy.get('.formio-component-submit button').click('top');

    cy.wait('@notes').then(({ response }) => {
      expect(response.statusCode).to.equal(204);
    });

    cy.get('button.link-button').should('be.visible').and('have.text', 'Unclaim').click();

    cy.wait(2000);
  });

  it('Should hide Notes Textarea for the tasks assigned to others', () => {
    cy.intercept('GET', '/camunda/task/*').as('tasksDetails');

    cy.getTasksAssignedToOtherUsers().then((tasks) => {
      const taskId = tasks.map(((item) => item.id));
      expect(taskId.length).to.not.equal(0);
      cy.visit(`/tasks/${taskId[0]}`);
      cy.wait('@tasksDetails').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
    });

    cy.get('.govuk-heading-xl').should('have.text', 'Task details');

    cy.get('.formio-component-note textarea').should('not.exist');
  });

  it('Should Claim a task Successfully from task details page', () => {
    cy.intercept('GET', '/camunda/task/*').as('tasksDetails');
    cy.intercept('POST', '/camunda/task/*/claim').as('claim');

    cy.getUnassignedTasks().then((tasks) => {
      const taskId = tasks.map(((item) => item.id));
      expect(taskId.length).to.not.equal(0);
      cy.visit(`/tasks/${taskId[0]}`);
      cy.wait('@tasksDetails').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
    });

    cy.wait(2000);

    cy.get('p.govuk-body').eq(0).should('contain.text', 'Unassigned');

    cy.get('button.link-button').should('be.visible').and('have.text', 'Claim').click();

    cy.wait('@claim').then(({ response }) => {
      expect(response.statusCode).to.equal(204);
    });

    cy.wait(2000);
  });

  it('Should Unclaim a task Successfully from task details page', () => {
    cy.intercept('GET', '/camunda/task/*').as('tasksDetails');
    cy.intercept('POST', '/camunda/task/*/unclaim').as('unclaim');

    cy.get('a[href="#in-progress"]').click();

    cy.waitForTaskManagementPageToLoad();

    cy.getTasksAssignedToMe().then((tasks) => {
      const taskId = tasks.map(((item) => item.id));
      expect(taskId.length).to.not.equal(0);
      cy.visit(`/tasks/${taskId[0]}`);
      cy.wait('@tasksDetails').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
    });

    cy.wait(2000);

    cy.get('button.link-button').should('be.visible').and('have.text', 'Unclaim').click();

    cy.wait('@unclaim').then(({ response }) => {
      expect(response.statusCode).to.equal(204);
    });

    cy.wait(2000);
  });

  it('Should complete assessment of a task with a reason as take no further action', () => {
    cy.intercept('GET', '/camunda/task/*').as('tasksDetails');

    cy.getUnassignedTasks().then((tasks) => {
      const taskId = tasks.map(((item) => item.id));
      expect(taskId.length).to.not.equal(0);
      cy.visit(`/tasks/${taskId[0]}`);
      cy.wait('@tasksDetails').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
    });

    cy.wait(2000);

    cy.get('button.link-button').should('be.visible').and('have.text', 'Claim').click();

    cy.contains('Assessment complete').click();

    cy.selectCheckBox('reason', 'No further action');

    cy.clickNext();

    cy.selectCheckBox('nfaReason', 'Vessel arrived');

    cy.clickNext();

    cy.typeValueInTextArea('addANote', 'This is for testing');

    cy.clickSubmit();

    cy.verifySuccessfulSubmissionHeader('Task has been completed');
  });

  after(() => {
    cy.contains('Sign out').click();
    cy.get('#kc-page-title').should('contain.text', 'Log In');
  });
});
