import Timer from './components/Timer';
import { getTodayKey } from './utils/date';

export default function App() {
	const handleSave = (seconds) => {
		const today = getTodayKey();
		const data = JSON.parse(localStorage.getItem('studyData')) || {};

		data[today] = (data[today] || 0) + seconds;

		localStorage.setItem('studyData', JSON.stringify(data));
	};

	return (
		<div>
			<h1>Study Tracker</h1>
			<Timer onSave={handleSave} />
		</div>
	);
}
