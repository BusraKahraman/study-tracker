import Timer from './components/Timer';
import Stats from './components/Stats';
import History from './components/History';
import useStudyData from './hooks/useStudyData';
import { useEffect, useState } from 'react';
import { getStreakInfo } from './utils/date';
import useSessions from './hooks/useSessions';

export default function App() {
	const { studyData, addDay, editDay, deleteDay, deleteSessionAndMigrate } =
		useStudyData();
	const [activeTab, setActiveTab] = useState('timer');
	const [timerSeconds, setTimerSeconds] = useState(() => {
		const saved = localStorage.getItem('timerSeconds');
		return saved ? Number(saved) : 0;
	});

	const [isRunning, setIsRunning] = useState(() => {
		const saved = localStorage.getItem('isRunning');
		return saved === 'true';
	});

	const [startTimestamp, setStartTimestamp] = useState(() => {
		const saved = localStorage.getItem('startTimestamp');
		return saved ? Number(saved) : null;
	});

	const [baseSeconds, setBaseSeconds] = useState(() => {
		const saved = localStorage.getItem('baseSeconds');
		return saved ? Number(saved) : 0;
	});

	const [currentDay, setCurrentDay] = useState(() => {
		return (
			localStorage.getItem('currentDay') ||
			new Date().toISOString().slice(0, 10)
		);
	});

	const { addSession, deleteSession, visibleSessions } = useSessions();

	const streaks = getStreakInfo(
		Object.entries(studyData).map(([date, sessions]) => [
			date,
			Object.values(sessions).reduce((a, b) => a + b, 0),
		])
	);

	const handleDeleteSession = (session) => {
		deleteSessionAndMigrate(session);
		deleteSession(session);
	};

	useEffect(() => {
		localStorage.setItem('timerSeconds', timerSeconds);
	}, [timerSeconds]);

	useEffect(() => {
		localStorage.setItem('baseSeconds', baseSeconds);
	}, [baseSeconds]);

	useEffect(() => {
		if (startTimestamp) {
			localStorage.setItem('startTimestamp', startTimestamp);
		} else {
			localStorage.removeItem('startTimestamp');
		}
	}, [startTimestamp]);

	useEffect(() => {
		localStorage.setItem('isRunning', isRunning);
	}, [isRunning]);

	useEffect(() => {
		localStorage.setItem('currentDay', currentDay);
	}, [currentDay]);

	useEffect(() => {
		if (!isRunning || !startTimestamp) return;

		const interval = setInterval(() => {
			const today = new Date().toISOString().slice(0, 10);

			if (today !== currentDay) {
				const now = Date.now();
				const elapsed = baseSeconds + Math.floor((now - startTimestamp) / 1000);

				// save yesterday
				addDay(currentDay, elapsed, 'auto');

				// reset for today
				setBaseSeconds(0);
				setTimerSeconds(0);
				setStartTimestamp(now);
				setCurrentDay(today);
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [isRunning, startTimestamp, baseSeconds, currentDay, addDay]);

	return (
		<div
			style={{
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<nav
				style={{
					display: 'flex',
					gap: '16px',
					padding: '12px 16px',
					borderBottom: '1px solid #ddd',
					position: 'sticky',
					top: 0,
					zIndex: 10,
				}}
			>
				<button onClick={() => setActiveTab('timer')}>Timer</button>
				<button onClick={() => setActiveTab('stats')}>Stats</button>
				<button onClick={() => setActiveTab('history')}>History</button>
			</nav>

			<div
				style={{
					flex: 1,
					padding: '24px',
					boxSizing: 'border-box',
					display: 'flex',
				}}
			>
				{activeTab === 'timer' && (
					<div
						style={{
							flex: 1,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Timer
							seconds={timerSeconds}
							setSeconds={setTimerSeconds}
							baseSeconds={baseSeconds}
							setBaseSeconds={setBaseSeconds}
							isRunning={isRunning}
							setIsRunning={setIsRunning}
							startTimestamp={startTimestamp}
							setStartTimestamp={setStartTimestamp}
							onSave={addDay}
							streaks={streaks}
							sessions={visibleSessions}
							onAddSession={addSession}
							onDeleteSession={handleDeleteSession}
						/>
					</div>
				)}

				{activeTab === 'stats' && <Stats data={studyData} />}

				{activeTab === 'history' && (
					<History
						data={studyData}
						onAddDay={addDay}
						onEditDay={editDay}
						onDeleteDay={deleteDay}
					/>
				)}
			</div>
		</div>
	);
}
