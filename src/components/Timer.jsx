import { useEffect, useState, useRef } from 'react';
import { formatTime } from '../utils/time';
import { getTodayKey } from '../utils/date';

export default function Timer({ onSave }) {
	const [isRunning, setIsRunning] = useState(false);
	const [elapsedSeconds, setElapsedSeconds] = useState(0);
	const startTimeRef = useRef(null);
	const intervalRef = useRef(null);

	const start = () => {
		if (isRunning) return;

		startTimeRef.current = Date.now() - elapsedSeconds * 1000;
		setIsRunning(true);
	};

	const pause = () => {
		setIsRunning(false);
	};

	const reset = () => {
		setIsRunning(false);
		setElapsedSeconds(0);
		startTimeRef.current = null;
	};

	const save = () => {
		if (elapsedSeconds === 0) return;
		onSave(getTodayKey(), elapsedSeconds);
		reset();
	};

	useEffect(() => {
		if (!isRunning) {
			clearInterval(intervalRef.current);
			return;
		}

		intervalRef.current = setInterval(() => {
			const seconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
			setElapsedSeconds(seconds);
		}, 1000);

		return () => clearInterval(intervalRef.current);
	}, [isRunning]);

	return (
		<div>
			<h2>Timer</h2>

			<div style={{ fontSize: '2rem' }}>{formatTime(elapsedSeconds)}</div>

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
					disabled={elapsedSeconds === 0}
				>
					Reset
				</button>
				<button
					style={{ marginRight: '6px' }}
					onClick={save}
					disabled={elapsedSeconds === 0}
				>
					Save
				</button>
			</div>
		</div>
	);
}
