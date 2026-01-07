import { useEffect, useState } from 'react';
import { formatTime } from '../utils/formatTime';

export default function Timer({ onSave }) {
	const [seconds, setSeconds] = useState(0);
	const [running, setRunning] = useState(false);

	useEffect(() => {
		if (!running) return;

		const interval = setInterval(() => {
			setSeconds((s) => s + 1);
		}, 1000);

		return () => clearInterval(interval);
	}, [running]);

	const stopAndSave = () => {
		setRunning(false);
		const savedSeconds = seconds;
		setSeconds(0);
		onSave(savedSeconds);
	};

	return (
		<div>
			<h2>{formatTime(seconds)}</h2>

			{!running ? (
				<button onClick={() => setRunning(true)}>Start</button>
			) : (
				<button onClick={() => setRunning(false)}>Pause</button>
			)}

			<button onClick={stopAndSave} disabled={seconds === 0}>
				Stop & Save
			</button>
		</div>
	);
}
