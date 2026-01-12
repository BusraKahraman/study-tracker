import { useEffect, useState } from 'react';
import { formatTime } from '../utils/time';
import { getTodayKey } from '../utils/date';
import StreakFooter from './StreakFooter';
import { SYSTEM_SESSION } from '../constants/sessions';

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
	onAddSession,
	onDeleteSession,
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
		onSave(getTodayKey(), seconds, sessionType || SYSTEM_SESSION);
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

	useEffect(() => {
		if (!sessionType && sessions.length > 0) {
			setSessionType(sessions[0]);
		}
	}, [sessions, sessionType]);

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
					<div
						style={{
							display: 'flex',
							gap: '8px',
							marginBottom: '16px',
							justifyContent: 'center',
						}}
					>
						<div
							style={{
								display: 'flex',
								gap: '8px',
								marginBottom: '16px',
								justifyContent: 'center',
								flexWrap: 'wrap',
							}}
						>
							{sessions.map((s) => (
								<button
									key={s}
									onClick={() => setSessionType(s)}
									style={{
										padding: '6px 12px',
										borderRadius: '999px',
										border:
											sessionType === s
												? '2px solid #ececec'
												: '1px solid #000000',
										background: sessionType === s ? '#000000' : '#373535',
										fontWeight: sessionType === s ? '600' : '400',
										cursor: 'pointer',
									}}
								>
									{s}
								</button>
							))}

							<button onClick={() => setIsAddingSession(true)}>+ Add</button>
							<button
								onClick={() => onDeleteSession(sessionType)}
								disabled={!sessionType}
							>
								- Delete
							</button>
						</div>
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

			<p style={{ textAlign: 'center', opacity: 0.7 }}>
				Session: <strong>{sessionType || '—'}</strong>
			</p>

			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					gap: '12px',
					marginBottom: '24px',
				}}
			>
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
