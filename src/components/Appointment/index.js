import React from 'react';

import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';

import useVisualMode from 'hooks/useVisualMode';

import 'components/Appointment/styles.scss';

const EMPTY = 'EMPTY';
const SHOW = 'SHOW';
const CREATE = 'CREATE';

export default function Appointment(props) {
	const { mode, transition, back } = useVisualMode(
		props.interview ? SHOW : EMPTY
	);

	const save = (name, interviewer) => {
		const interview = {
			student: name,
			interviewer
		};
		props.bookInterview(props.id, interview);
		transition(SHOW);
	};

	return (
		<article className="appointment">
			<Header time={props.time} />
			{mode === EMPTY &&
				<Empty
					onAdd={() => {
						// console.log("Clicked onAdd");
						transition(CREATE);
					}}
				/>
			}
			{mode === SHOW && (
				<Show
					student={props.interview.student}
					interviewer={props.interview.interviewer}
				/>
			)}
			{mode === CREATE && (
				<Form
					interviewers={props.interviewers}
					onCancel={() => { back() }}
					onSave={(name, interviewer) => { save(name, interviewer) }}
				/>
			)}
		</article>);
}
