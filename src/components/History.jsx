import { useState } from 'react';
import { formatTime } from '../utils/formatTime';
import { timeToSeconds } from '../utils/timeToSeconds';

const DEFAULT_VISIBLE_DAYS = 5;

export default function History({ data, onDeleteDay, onEditDay }) {
	const [showAll, setShowAll] = useState(false);
	const [editingDate, setEditingDate] = useState(null);
	const [editValue, setEditValue] = useState('');

	const entries = Object.entries(data).sort(
		(a, b) => new Date(b[0]) - new Date(a[0])
	); // newest first

	const visibleEntries = showAll
		? entries
		: entries.slice(0, DEFAULT_VISIBLE_DAYS);

	const startEdit = (date, seconds) => {
		setEditingDate(date);
		setEditValue(formatTime(seconds));
	};

	const saveEdit = (date) => {
		onEditDay(date, timeToSeconds(editValue));
		setEditingDate(null);
	};

	if (entries.length === 0) {
		return <p>No study history yet.</p>;
	}

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
						{editingDate === date ? (
							<>
								<input
									value={editValue}
									onChange={(e) => setEditValue(e.target.value)}
									placeholder='HH:MM:SS'
								/>
								<button onClick={() => saveEdit(date)}>Save</button>
								<button onClick={() => setEditingDate(null)}>Cancel</button>
							</>
						) : (
							<>
								<strong>{formatTime(seconds)}</strong>
								<button onClick={() => startEdit(date, seconds)}>Edit</button>
								<button onClick={() => onDeleteDay(date)}>Delete</button>
							</>
						)}
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
