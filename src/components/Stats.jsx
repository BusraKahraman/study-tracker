function formatTime(seconds) {
	const hrs = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;

	const pad = (n) => String(n).padStart(2, '0');

	return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}

export default function Stats({ data }) {
	const totalSeconds = Object.values(data).reduce((sum, s) => sum + s, 0);

	return (
		<div>
			<h2>Stats</h2>
			<p>Total: {formatTime(totalSeconds)}</p>
			<button
				onClick={() => {
					localStorage.removeItem('studyData');
					window.location.reload();
				}}
			>
				Clear Total
			</button>
		</div>
	);
}
