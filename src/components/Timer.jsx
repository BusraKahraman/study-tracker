import { useEffect } from 'react';
import { formatTime } from '../utils/time';
import { getTodayKey } from '../utils/date';

export default function Timer({
	seconds,
	setSeconds,
	isRunning,
	setIsRunning,
	startTimestamp,
	setStartTimestamp,
	baseSeconds,
	setBaseSeconds,
	onSave,
}) {
	const start = () => {
		if (isRunning) return;

		setBaseSeconds(seconds);
		setStartTimestamp(Date.now());
		setIsRunning(true);
	};

	const pause = () => {
		if (!isRunning) return;

		const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);

		setSeconds(baseSeconds + elapsed);
		setStartTimestamp(null);
		setIsRunning(false);
	};

	const reset = () => {
		setIsRunning(false);
		setSeconds(0);
		setStartTimestamp(null);
	};

	const save = () => {
		if (seconds === 0) return;
		onSave(getTodayKey(), seconds);
		reset();
	};

	useEffect(() => {
		if (!isRunning || !startTimestamp) return;

		const interval = setInterval(() => {
			const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
			setSeconds(baseSeconds + elapsed);
		}, 1000);

		return () => clearInterval(interval);
	}, [isRunning, startTimestamp, baseSeconds]);

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
