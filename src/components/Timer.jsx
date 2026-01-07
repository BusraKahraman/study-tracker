import { useEffect, useState } from 'react';

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
		onSave(seconds);
		setSeconds(0);
	};

	return (
		<div>
			<h2>
				{Math.floor(seconds / 60)}m {seconds % 60}s
			</h2>

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
