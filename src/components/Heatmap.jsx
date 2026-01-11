import { formatTime } from '../utils/time';

const LEVELS = [
	{ max: 0, color: '#ebedf0' },
	{ max: 1800, color: '#c6e48b' }, // < 30 min
	{ max: 3600, color: '#7bc96f' }, // < 1h
	{ max: 7200, color: '#239a3b' }, // < 2h
	{ max: Infinity, color: '#196127' },
];

function getColor(seconds) {
	return LEVELS.find((l) => seconds <= l.max).color;
}

export default function Heatmap({ data }) {
	const today = new Date();
	const year = today.getFullYear();
	const month = today.getMonth();

	const daysInMonth = new Date(year, month + 1, 0).getDate();

	const days = Array.from({ length: daysInMonth }, (_, i) => {
		const date = new Date(year, month, i + 1);
		const key = date.toISOString().slice(0, 10);
		return {
			key,
			seconds: data[key] || 0,
		};
	});

	return (
		<div style={{ marginTop: '24px' }}>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(7, 1fr)',
					gap: '6px',
					maxWidth: '280px',
				}}
			>
				{days.map((d) => (
					<div
						key={d.key}
						title={`${d.key} – ${formatTime(d.seconds)}`}
						style={{
							width: '36px',
							height: '36px',
							borderRadius: '6px',
							background: getColor(d.seconds),
							cursor: 'pointer',
						}}
					/>
				))}
			</div>
		</div>
	);
}
