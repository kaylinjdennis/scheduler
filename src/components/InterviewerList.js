import React from 'react';
import InterviewerListItem from './InterviewerListItem';
import 'components/InterviewerList.scss'

export default function InterviewList(props) {
	const interviewers = props.interviewers.map(interviewer => {
		return (
			<InterviewerListItem
				id={interviewer.id}
				name={interviewer.name}
				avatar={interviewer.avatar}
				selected={interviewer.id === props.interviewer}
				setInterviewer={props.setInterviewer}
			/>
		);
	});
	// return interviewers;
	return (
		<section className="interviewers">
			<h4 className="interviewers__header text--light">Interviewer</h4>
			<ul className="interviewers__list">
				{interviewers}
			</ul>
		</section>
	);

}