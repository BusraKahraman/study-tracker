import { useState } from 'react';
import { formatTime } from '../utils/formatTime';

const DEFAULT_VISIBLE_DAYS = 5;

export default function History({ data }) {
	const [showAll, setShowAll] = useState(false);

	const entries = Object.entries(data).sort(
		(a, b) => new Date(b[0]) - new Date(a[0])
	); // newest first

	if (entries.length === 0) {
		return <p>No study history yet.</p>;
	}

	const visibleEntries = showAll
		? entries
		: entries.slice(0, DEFAULT_VISIBLE_DAYS);

	return (
		<div>
			<h2>History</h2>
			<ul style={{ listStyle: 'none', padding: 0 }}>
				{visibleEntries.map(([date, seconds]) => (
					<li
						key={date}
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							padding: '6px 0',
							borderBottom: '1px solid #ddd',
						}}
					>
						<span>{date}</span>
						<strong>{formatTime(seconds)}</strong>
					</li>
				))}
			</ul>
			{entries.length > DEFAULT_VISIBLE_DAYS && (
				<button
					onClick={() => setShowAll((prev) => !prev)}
					style={{ marginTop: '8px' }}
				>
					{showAll ? 'Show less' : 'Show more'}
				</button>
			)}
		</div>
	);
}
