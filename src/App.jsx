import { useEffect, useState } from 'react';
import Timer from './components/Timer';
import Stats from './components/Stats';
import History from './components/History';
import { getTodayKey } from './utils/date';

export default function App() {
	const [studyData, setStudyData] = useState({});

	useEffect(() => {
		const saved = JSON.parse(localStorage.getItem('studyData')) || {};
		setStudyData(saved);
	}, []);

	const handleSave = (seconds) => {
		if (seconds === 0) return;

		const today = getTodayKey();

		setStudyData((prev) => {
			const updated = {
				...prev,
				[today]: (prev[today] || 0) + seconds,
			};

			localStorage.setItem('studyData', JSON.stringify(updated));
			return updated;
		});
	};

	const handleDeleteDay = (date) => {
		setStudyData((prev) => {
			const updated = { ...prev };
			delete updated[date];
			localStorage.setItem('studyData', JSON.stringify(updated));
			return updated;
		});
	};

	const handleEditDay = (date, newSeconds) => {
		setStudyData((prev) => {
			const updated = {
				...prev,
				[date]: newSeconds,
			};
			localStorage.setItem('studyData', JSON.stringify(updated));
			return updated;
		});
	};

	const handleAddDay = (date, seconds) => {
		setStudyData((prev) => {
			const updated = {
				...prev,
				[date]: (prev[date] || 0) + seconds,
			};

			localStorage.setItem('studyData', JSON.stringify(updated));
			return updated;
		});
	};

	return (
		<div>
			<h1>Study Tracker</h1>

			<Timer onSave={handleSave} />
			<Stats data={studyData} />
			<History
				data={studyData}
				onDeleteDay={handleDeleteDay}
				onEditDay={handleEditDay}
				onAddDay={handleAddDay}
			/>
		</div>
	);
}
