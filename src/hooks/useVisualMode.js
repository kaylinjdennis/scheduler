import { useState } from 'react';

export default function useVisualMode(initial) {
	const [mode, setMode] = useState(initial);
	const [history, setHistory] = useState([initial]);

	const back = () => {
		const newHistory = history;
		if (history.length > 1) {
			newHistory.pop();
			const newMode = newHistory[newHistory.length - 1];
			setMode(newMode);
			setHistory(newHistory);
		}
	};

	const transition = (newMode, replace = false) => {
		if (replace) {
			const newHistory = history;
			newHistory.pop();
			setHistory([...newHistory, newMode])
		} else {
			setHistory(prev => [...prev, newMode])
		}
		setMode(newMode);
	};

	return { mode, transition, back };
};