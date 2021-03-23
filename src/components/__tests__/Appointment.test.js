import React from 'react';

import { render, cleanup } from '@testing-library/react';

import Appointment from 'components/Appointment';

afterEach(cleanup);

describe('Appointment', () => {
	it('renders without crashing', () => {
		render(<Appointment />);
	});
	it('renders without crashing when passed props', () => {
		const appointment = { id: 1, interview: {}, interviewers: {} };
		const interview = { student: 'Bob', interviewer: 1 };
		const interviewers = {};
		const bookInterview = () => { };
		const cancelInterview = () => { };
		render(
			<Appointment
				key={appointment.id}
				{...appointment}
				interview={interview}
				interviewers={interviewers}
				bookInterview={bookInterview}
				cancelInterview={cancelInterview}
			/>
		);
	});
})