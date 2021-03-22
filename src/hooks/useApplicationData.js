import { useState, useEffect } from 'react';
import axios from 'axios';

import 'components/Application.scss';

export default function useApplicationData() {
	const [state, setState] = useState({
		day: 'Monday',
		days: [],
		appointments: {},
		interviewers: {}
	});

	const setDay = day => setState({ ...state, day });

	const updateSpots = (dayName, days, appointments) => {
		const day = days.find((day) => day.name === dayName);
		let spots = 0;
		for (const id of day.appointments) {
			const appointment = appointments[id];
			if (!appointment.interview) {
				spots++;
			}
		}
		const newArray = days.map(item => {
			if (item.name === dayName) {
				return { ...item, spots }
			}
			return item;
		});
		return newArray;
	};

	useEffect(() => {
		Promise.all([
			axios.get('/api/days'),
			axios.get('/api/appointments'),
			axios.get('/api/interviewers')
		]).then((all) => {
			setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
		});
	}, []);

	const bookInterview = (id, interview) => {
		const appointment = {
			...state.appointments[id],
			interview: { ...interview }
		};
		const appointments = {
			...state.appointments,
			[id]: appointment
		};
		return axios.put(`/api/appointments/${id}`, appointment)
			.then(
				() => {
					const days = updateSpots(state.day, state.days, appointments);
					setState({
						...state,
						appointments,
						days
					});
				}
			);
	};

	const cancelInterview = (id) => {
		const appointment = {
			...state.appointments[id],
			interview: null
		};
		const appointments = {
			...state.appointments,
			[id]: appointment
		};
		return (axios.delete(`/api/appointments/${id}`)
			.then(
				() => {
					const days = updateSpots(state.day, state.days, appointments);
					setState({
						...state,
						appointments,
						days
					});
				}
			)
		);
	};

	return { state, setDay, bookInterview, cancelInterview };
}