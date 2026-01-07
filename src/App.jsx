import Timer from './components/Timer';

export default function App() {
	const handleSave = (seconds) => {
		console.log('Saved seconds: ', seconds);
	};

	return (
		<div>
			<h1>Study Tracker</h1>
			<Timer onSave={handleSave} />
		</div>
	);
}
