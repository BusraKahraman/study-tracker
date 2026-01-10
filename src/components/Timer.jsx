import { useEffect } from 'react';
import { formatTime } from '../utils/time';
import { getTodayKey } from '../utils/date';

export default function Timer({
	seconds,
	setSeconds,
	isRunning,
	setIsRunning,
	onSave,
}) {
	const start = () => {
		if (isRunning) return;
		setIsRunning(true);
	};

	const pause = () => {
		setIsRunning(false);
	};

	const reset = () => {
		setIsRunning(false);
		setSeconds(0);
	};

	const save = () => {
		if (seconds === 0) return;
		onSave(getTodayKey(), seconds);
		reset();
	};

	useEffect(() => {
		if (!isRunning) return;

		const interval = setInterval(() => {
			setSeconds((prev) => prev + 1);
		}, 1000);

		return () => clearInterval(interval);
	}, [isRunning, setSeconds]);

	return (
		<div>
			<div style={{ fontSize: '2rem' }}>{formatTime(seconds)}</div>

			<div style={{ marginTop: '10px' }}>
				{!isRunning ? (
					<button style={{ marginRight: '6px' }} onClick={start}>
						Start
					</button>
				) : (
					<button style={{ marginRight: '6px' }} onClick={pause}>
						Pause
					</button>
				)}
				<button
					style={{ marginRight: '6px' }}
					onClick={reset}
					disabled={seconds === 0}
				>
					Reset
				</button>
				<button
					style={{ marginRight: '6px' }}
					onClick={save}
					disabled={seconds === 0}
				>
					Save
				</button>
			</div>
		</div>
	);
}
