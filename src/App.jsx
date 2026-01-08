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

	return (
		<div>
			<h1>Study Tracker</h1>

			<Timer onSave={handleSave} />
			<Stats data={studyData} />
			<History data={studyData} />
		</div>
	);
}
