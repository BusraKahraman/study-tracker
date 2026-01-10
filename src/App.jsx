import Timer from './components/Timer';
import Stats from './components/Stats';
import History from './components/History';
import useStudyData from './hooks/useStudyData';
import { useEffect, useState } from 'react';

export default function App() {
	const { studyData, addDay, editDay, deleteDay } = useStudyData();
	const [activeTab, setActiveTab] = useState('timer');
	const [timerSeconds, setTimerSeconds] = useState(() => {
		const saved = localStorage.getItem('timerSeconds');
		return saved ? Number(saved) : 0;
	});

	const [isRunning, setIsRunning] = useState(false);
	const [startTimestamp, setStartTimestamp] = useState(null);
	const [baseSeconds, setBaseSeconds] = useState(0);

	useEffect(() => {
		localStorage.setItem('timerSeconds', timerSeconds);
	}, [timerSeconds]);

	return (
		<>
			<nav
				style={{
					display: 'flex',
					gap: '16px',
					padding: '12px 16px',
					borderBottom: '1px solid #ddd',
					marginBottom: '24px',
				}}
			>
				<button onClick={() => setActiveTab('timer')}>Timer</button>
				<button onClick={() => setActiveTab('stats')}>Stats</button>
				<button onClick={() => setActiveTab('history')}>History</button>
			</nav>

			{activeTab === 'timer' && (
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
				/>
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
		</>
	);
}
