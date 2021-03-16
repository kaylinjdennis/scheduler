import React from 'react';
import classNames from "classnames";

import 'components/Button.scss';
import { action } from '@storybook/addon-actions/dist/preview';

export default function Button(props) {
	const buttonClass = classNames('button', {
		'button--confirm': props.confirm,
		'button--danger': props.danger
	});
	return <button disabled={props.disabled} onClick={props.onClick} className={buttonClass}>{props.children}</button>;
}
