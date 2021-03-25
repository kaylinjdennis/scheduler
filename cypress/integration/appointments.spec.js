describe('Appointments', () => {
	beforeEach(() => {
		// Reset Database
		cy.request('GET', 'api/debug/reset');

		// Navigate to page and wait for info to load
		cy.visit('/');
		cy.contains('Monday');
	})

	it('should book an interview', () => {
		// Click add button
		cy.get('[alt=Add]').first().click();

		// Type name into input, select interviewer, and click save button
		cy.get('[data-testid=student-name-input]').type('Lydia Miller-Jones');
		cy.get('[alt="Sylvia Palmer"]').click();
		cy.contains('Save').click();

		// Check that given info is now shown
		cy.contains('.appointment__card--show', 'Lydia Miller-Jones');
		cy.contains('.appointment__card--show', 'Sylvia Palmer')
	});

	it('should edit an interview', () => {
		// Click edit button
		cy.get('[alt=Edit]').first().click({ force: true });

		// Change data currently in form and save
		cy.get('[data-testid=student-name-input]').clear().type('Lydia Miller-Jones');
		cy.get('[alt="Tori Malcolm"]').click();
		cy.contains('Save').click();

		// Check that given info is now shown
		cy.contains('.appointment__card--show', 'Lydia Miller-Jones');
		cy.contains('.appointment__card--show', 'Tori Malcolm')
	});

	it('should cancel an interview', () => {
		// Click delete button and confirm
		cy.get('[alt=Delete]').click({ force: true });
		cy.contains('Confirm').click();

		// Check that Deleting is shown and then removed
		cy.contains('Deleting');
		cy.contains('Deleting').should('not.exist');

		// Check that the deleted interview no longer exists
		cy.contains('.appointment__card--show', 'Archie Cohen').should('not.exist');
	});
});