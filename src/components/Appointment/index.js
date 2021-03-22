import React from 'react';

import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';

import useVisualMode from 'hooks/useVisualMode';

import 'components/Appointment/styles.scss';

const EMPTY = 'EMPTY';
const SHOW = 'SHOW';
const CREATE = 'CREATE';
const SAVING = 'SAVING';
const DELETING = 'DELETING';
const CONFIRM = 'CONFIRM';
const EDIT = 'EDIT';

export default function Appointment(props) {
	const { mode, transition, back } = useVisualMode(
		props.interview ? SHOW : EMPTY
	);

	const save = (name, interviewer) => {
		const interview = {
			student: name,
			interviewer
		};
		transition(SAVING);
		props
			.bookInterview(props.id, interview)
			.then(() => transition(SHOW));
	};

	const cancel = () => {
		transition(DELETING);
		props
			.cancelInterview(props.id)
			.then(() => transition(EMPTY))
	};

	return (
		<article className="appointment">
			<Header time={props.time} />
			{mode === EMPTY &&
				<Empty
					onAdd={() => {
						console.log("Clicked onAdd");
						transition(CREATE);
					}}
				/>
			}
			{mode === SHOW && (
				<Show
					student={props.interview.student}
					interviewer={props.interview.interviewer}
					onDelete={() => { transition(CONFIRM) }}
					onEdit={() => { transition(EDIT) }}
				/>
			)}
			{mode === CREATE && (
				<Form
					interviewers={props.interviewers}
					onCancel={() => { back() }}
					onSave={(name, interviewer) => { save(name, interviewer) }}
				/>
			)}
			{mode === SAVING && (
				<Status
					message={'Saving'}
				/>
			)}
			{ mode === DELETING && (
				<Status
					message={'Deleting'}
				/>
			)}
			{mode === CONFIRM && (
				<Confirm
					message={'Are you sure you would like to delete?'}
					onCancel={() => { back() }}
					onConfirm={() => { cancel() }}
				/>
			)}
			{mode === EDIT && (
				<Form
					name={props.interview.student}
					interviewer={props.interview.interviewer.id}
					interviewers={props.interviewers}
					onCancel={() => { back() }}
					onSave={(name, interviewer) => { save(name, interviewer) }}
				/>
			)}

		</article>);
}
