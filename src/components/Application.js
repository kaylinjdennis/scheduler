import React, { useState, useEffect } from 'react';
import axios from 'axios';

import 'components/Application.scss';
import DayList from './DayList';
import Appointment from 'components/Appointment/index';
import { getAppointmentsForDay } from 'helpers/selectors';

export default function Application(props) {
	const [state, setState] = useState({
		day: 'Monday',
		days: [],
		appointments: {},
		interviewers: {}
	});

	const setDay = day => setState({ ...state, day });

	const dailyAppointments = getAppointmentsForDay(state, state.day);

	useEffect(() => {
		Promise.all([
			axios.get('/api/days'),
			axios.get('/api/appointments'),
			axios.get('/api/interviewers')
		]).then((all) => {
			setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
		});
	}, [state.days]);

	const appointmentComponents = dailyAppointments.map((appointment) => {
		const interview = getInterview(state, appointment.interview);
		return (
			<Appointment
				key={appointment.id}
				{...appointment}
			/>
		)
	});

	return (
		<main className='layout'>
			<section className='sidebar'>
				<img
					className='sidebar--centered'
					src='images/logo.png'
					alt='Interview Scheduler'
				/>
				<hr className='sidebar__separator sidebar--centered' />
				<nav className='sidebar__menu'>
					<DayList
						days={state.days}
						day={state.day}
						setDay={setDay}
					/>
				</nav>
				<img
					className='sidebar__lhl sidebar--centered'
					src='images/lhl.png'
					alt='Lighthouse Labs'
				/>
			</section>
			<section className='schedule'>
				{appointmentComponents}
				<Appointment key="last" time="6pm" />
			</section>
		</main>
	);
}
