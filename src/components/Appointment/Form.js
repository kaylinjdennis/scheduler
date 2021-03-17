import React, { useState } from 'react';

import InterviewerList from 'components/InterviewerList';
import Button from 'components/Button';

export default function Form(props) {
	const [name, setName] = useState(props.name || '');
	const [interviewer, setInterviewer] = useState(props.interviewer || null);

	const reset = () => {
		setName('');
		setInterviewer(null);
	};

	const cancel = () => {
		reset();
		props.onCancel();
	};


	return (
		<main className="appointment__card appointment__card--create">
			<section className="appointment__card-left">
				<form autoComplete="off">
					<input
						className="appointment__create-input text--semi-bold"
						name="name"
						type="text"
						placeholder="Enter Student Name"
						value={name}
						onChange={(event) => setName(event.target.value)}
					/>
				</form>
				<InterviewerList interviewers={props.interviewers} interviewer={interviewer} setInterviewer={setInterviewer} onClick={props.setInterviewer} onSubmit={event => event.preventDefault()} />
			</section>
			<section className="appointment__card-right">
				<section className="appointment__actions">
					<Button danger onClick={cancel}>Cancel</Button>
					<Button confirm onClick={props.onSave}>Save</Button>
				</section>
			</section>
		</main>

	);
}