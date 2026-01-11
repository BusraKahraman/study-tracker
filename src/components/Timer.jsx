import { useEffect, useState } from 'react';
import { formatTime } from '../utils/time';
import { getTodayKey } from '../utils/date';
import StreakFooter from './StreakFooter';

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
	streaks,
	sessions,
}) {
	const [sessionType, setSessionType] = useState(sessions[0] || '');
	const [isAddingSession, setIsAddingSession] = useState(false);
	const [newSession, setNewSession] = useState('');

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
		if (seconds === 0 || !sessionType) return;
		onSave(getTodayKey(), seconds, sessionType);
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
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				minHeight: '360px',
			}}
		>
			<div style={{ marginBottom: '16px' }}>
				{!isAddingSession ? (
					<div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
						<select
							value={sessionType}
							onChange={(e) => setSessionType(e.target.value)}
						>
							{sessions.map((s) => (
								<option key={s} value={s}>
									{s}
								</option>
							))}
						</select>

						<button onClick={() => setIsAddingSession(true)}>+ Add</button>
					</div>
				) : (
					<div style={{ display: 'flex', gap: '8px' }}>
						<input
							value={newSession}
							onChange={(e) => setNewSession(e.target.value)}
							placeholder='Session name'
						/>
						<button
							onClick={() => {
								const name = newSession.trim().toLowerCase();
								if (!name) return;
								onAddSession(name);
								setSessionType(name);
								setNewSession('');
								setIsAddingSession(false);
							}}
						>
							Save
						</button>
						<button onClick={() => setIsAddingSession(false)}>Cancel</button>
					</div>
				)}
			</div>

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
			<StreakFooter streaks={streaks} />
		</div>
	);
}
