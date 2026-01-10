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
		localStorage.removeItem('startTimestamp');
		localStorage.setItem('baseSeconds', 0);
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
			<div
				style={{
					fontSize: '6rem',
					fontWeight: '600',
					textAlign: 'center',
					marginBottom: '24px',
				}}
			>
				{formatTime(seconds)}
			</div>

			<div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
				{!isRunning ? (
					<button onClick={start}>Start</button>
				) : (
					<button onClick={pause}>Pause</button>
				)}
				<button onClick={reset} disabled={seconds === 0}>
					Reset
				</button>
				<button onClick={save} disabled={seconds === 0}>
					Save
				</button>
			</div>
		</div>
	);
}
