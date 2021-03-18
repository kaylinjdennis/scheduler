export function getAppointmentsForDay(state, day) {
	const correctDay = state.days.filter(currentDay => currentDay.name === day)[0];
	if (!correctDay) {
		return [];
	}
	let appointments = [];
	for (const appointment of correctDay.appointments) {
		appointments.push(state.appointments[appointment]);
	}
	return appointments;
}

export function getInterview(state, interview) {
	const interviewObj = interview;
	if (interviewObj) {
		interviewObj.interviewer = state.interviewers[interview.interviewer];
		return interviewObj;
	}
	return null;
};