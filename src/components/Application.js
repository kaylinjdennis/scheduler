import React, { useState, useEffect } from 'react';
import axios from 'axios';

import 'components/Application.scss';
import DayList from './DayList';
import Appointment from 'components/Appointment/index';

export default function Application(props) {
	const [state, setState] = useState({
		day: 'Monday',
		days: [],
		appointments: []
	});

	const setDay = day => setState({ ...state, day });
	const setDays = days => setState(prev => ({ ...prev, days }));

	useEffect(() => {
		axios.get('/api/days')
			.then(response => {
				setDays([...response.data]);
				console.log(response.data);
			})
	}, []);

	console.log('state.appointments', state.appointments)
	const appointmentComponents = state.appointments.map((appointment) => {
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
