import React from 'react';
import axios from 'axios';

import { render, cleanup, waitForElement, fireEvent, getByText, getAllByTestId, getByAltText, getByPlaceholderText, waitForElementToBeRemoved, queryByText, queryByAltText, getByDisplayValue } from '@testing-library/react';

import Application from 'components/Application';

afterEach(cleanup);

describe('Application', () => {
	it('defaults to Monday and changes the schedule when a new day is selected', async () => {
		const { getByText } = render(<Application />);
		await waitForElement(() => getByText('Monday'))
		fireEvent.click(getByText('Tuesday'))
		expect(getByText('Leopold Silvers')).toBeInTheDocument()
	});

	it('loads data, books an interview and reduces the spots remaining for the first day by 1', async () => {
		// Render the Application
		const { container } = render(<Application />);

		// Wait for Data to load
		await waitForElement(() => getByText(container, 'Archie Cohen'));

		// Click add button of first empty interview, add form data, and click save button
		const appointment = getAllByTestId(container, 'appointment')[0];
		fireEvent.click(getByAltText(appointment, 'Add'));
		fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
			target: { value: 'Lydia Miller-Jones' }
		});
		fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));
		fireEvent.click(getByText(appointment, 'Save'));

		// Check that 'Saving' is displayed
		expect(getByText(appointment, 'Saving')).toBeInTheDocument();

		// Wait for 'Saving' to be removed
		await waitForElementToBeRemoved(() => getByText(appointment, 'Saving'));

		// Check that spots has been correctly updated
		const day = getAllByTestId(container, 'day').find(day =>
			queryByText(day, 'Monday')
		);
		expect(getByText(day, 'no spots remaining')).toBeInTheDocument();
	});

	it('loads data, cancels an interview and increases the spots remaining for Monday by 1', async () => {
		// 1. Render the Application.
		const { container } = render(<Application />);

		// 2. Wait until the text "Archie Cohen" is displayed.
		await waitForElement(() => getByText(container, 'Archie Cohen'));

		// 3. Click the delete image on the first booked appointment.
		const appointment = getAllByTestId(container, 'appointment').find(
			appointment => queryByText(appointment, 'Archie Cohen')
		);
		fireEvent.click(queryByAltText(appointment, 'Delete'));

		// 4. Check that confirmation message is shown.
		expect(getByText(appointment, 'Are you sure you would like to delete?')).toBeInTheDocument();

		// 5. Click 'Confirm' on the confirmation.
		fireEvent.click(queryByText(appointment, 'Confirm'));

		// 6. Check that element with the text 'Deleting' is displayed.
		expect(getByText(appointment, 'Deleting')).toBeInTheDocument();

		// 7. Wait until 'Deleting' is no longer on the page.
		await waitForElementToBeRemoved(() => getByText(appointment, 'Deleting'));

		// 8. Check that the DayListItem with the text 'Monday' also has the text '2 spots remaining'.
		const day = getAllByTestId(container, 'day').find(day =>
			queryByText(day, 'Monday'))
		expect(getByText(day, '2 spots remaining')).toBeInTheDocument();
	});

	it('loads data, edits an interview and keeps the spots remaining for Monday the same', async () => {
		// 1. Render the Application.
		const { container } = render(<Application />);

		// 2. Wait until the text 'Archie Cohen' is displayed.
		await waitForElement(() => getByText(container, 'Archie Cohen'));

		// 3. Click the edit image on the first booked appointment.
		const appointment = getAllByTestId(container, 'appointment').find(
			appointment => queryByText(appointment, 'Archie Cohen')
		);
		fireEvent.click(queryByAltText(appointment, 'Edit'));

		// 4. Check that the form is shown with proper information.
		expect(getByDisplayValue(appointment, 'Archie Cohen')).toBeInTheDocument();
		expect(getByText(appointment, 'Interviewer')).toBeInTheDocument();
		expect(getByText(appointment, 'Tori Malcolm')).toBeInTheDocument();

		// 5. Change the student name
		fireEvent.change(getByDisplayValue(appointment, 'Archie Cohen'), {
			target: { value: 'Lydia Miller-Jones' }
		});

		// 6. Check that new student name is shown.
		expect(getByDisplayValue(appointment, 'Lydia Miller-Jones')).toBeInTheDocument();

		// 7. Change interviewer (click on a different interviewer)
		fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));
		expect(getByText(appointment, 'Sylvia Palmer')).toBeInTheDocument();

		// 8. Click 'Save' on form
		fireEvent.click(getByText(appointment, 'Save'));

		// 9. Check that element with the text saving is displayed.
		expect(getByText(appointment, 'Saving')).toBeInTheDocument();

		// 10. Wait until 'Saving' is no longer on the page.
		await waitForElementToBeRemoved(() => getByText(appointment, 'Saving'));

		// 11. Check that name and interviewer have been changed
		expect(getByText(appointment, 'Lydia Miller-Jones')).toBeInTheDocument();
		expect(getByText(appointment, 'Sylvia Palmer')).toBeInTheDocument();

		// 12. Check that the DayListItem with the text 'Monday' also has the text '1 spot remaining'.
		const day = getAllByTestId(container, 'day').find(day =>
			queryByText(day, 'Monday'))
		expect(getByText(day, '1 spot remaining')).toBeInTheDocument();
	})

	it('shows the save error when failing to save an appointment', async () => {
		axios.put.mockRejectedValueOnce('/api/appointments/1');

		// Render Application
		const { container } = render(<Application />);

		// Wait for appointment info to load
		await waitForElement(() => getByText(container, 'Archie Cohen'));

		// Click on the first appointment's add button
		const appointment = getAllByTestId(container, 'appointment')[0];
		fireEvent.click(getByAltText(appointment, 'Add'));

		// Enter Data into form
		fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
			target: { value: 'Lydia Miller-Jones' }
		});
		fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));

		// Click 'Save' button, check that 'Saving' is on the page and wait until it is removed
		fireEvent.click(getByText(appointment, 'Save'));
		expect(getByText(appointment, 'Saving')).toBeInTheDocument();
		await waitForElementToBeRemoved(() => getByText(appointment, 'Saving'));

		// Check that 'Could not save appointment' is now shown
		expect(getByText(container, 'Could not save appointment'));
	});

	it('shows the delete error when failing to delete an appointment', async () => {
		axios.delete.mockRejectedValueOnce();

		// Render Application
		const { container } = render(<Application />);

		// Wait for appointment info to load
		await waitForElement(() => getByText(container, 'Archie Cohen'));

		// Click on the first booked appointment's delete button
		const appointment = getAllByTestId(container, 'appointment')[1];
		fireEvent.click(getByAltText(appointment, 'Delete'));

		// Check that confirm page is shown and click 'Confirm'
		expect(getByText(appointment, 'Are you sure you would like to delete?')).toBeInTheDocument();
		fireEvent.click(queryByText(appointment, 'Confirm'));

		// Check that 'Deleting' is on the page and wait until it is removed
		expect(getByText(appointment, 'Deleting')).toBeInTheDocument();
		await waitForElementToBeRemoved(() => getByText(appointment, 'Deleting'));

		// Check that 'Could not cancel appointment' is now shown
		expect(getByText(container, 'Could not cancel appoimtment.'));
	});
});