import { useState } from 'react';
import { formatTime, timeToSeconds, isValidTime } from '../utils/time';

const DEFAULT_VISIBLE_DAYS = 5;

export default function History({ data, onDeleteDay, onEditDay, onAddDay }) {
	const [showAll, setShowAll] = useState(false);
	const [editingDate, setEditingDate] = useState(null);
	const [editValue, setEditValue] = useState('');
	const [error, setError] = useState('');

	const [newDate, setNewDate] = useState('');
	const [newTime, setNewTime] = useState('00:00:00');

	const entries = Object.entries(data).sort(
		(a, b) => new Date(b[0]) - new Date(a[0])
	); // newest first

	const visibleEntries = showAll
		? entries
		: entries.slice(0, DEFAULT_VISIBLE_DAYS);

	const startEdit = (date, seconds) => {
		setEditingDate(date);
		setEditValue(formatTime(seconds));
		setError('');
	};

	const saveEdit = (date) => {
		if (!isValidTime(editValue)) {
			setError('Time must be in HH:MM:SS format');
			return;
		}

		onEditDay(date, timeToSeconds(editValue));
		setEditingDate(null);
	};

	const handleAddDay = () => {
		if (!newDate || !isValidTime(newTime)) {
			setError('Please select a valid date and time');
			return;
		}

		onAddDay(newDate, timeToSeconds(newTime));
		setNewDate('');
		setNewTime('00:00:00');
		setError('');
	};

	if (entries.length === 0) {
		return <p>No study history yet.</p>;
	}

	return (
		<div>
			<h2>History</h2>

			<div style={{ marginBottom: '12px' }}>
				<input
					type='date'
					value={newDate}
					onChange={(e) => setNewDate(e.target.value)}
				/>
				<input
					type='text'
					value={newTime}
					onChange={(e) => setNewTime(e.target.value)}
					placeholder='HH:MM:SS'
					style={{ marginLeft: '6px' }}
				/>
				<button onClick={handleAddDay} style={{ marginLeft: '6px' }}>
					Add
				</button>
			</div>

			{error && <p style={{ color: 'red' }}>{error}</p>}

			<ul style={{ listStyle: 'none', padding: 0 }}>
				{visibleEntries.map(([date, seconds]) => (
					<li
						key={date}
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							padding: '6px 0',
							borderBottom: '1px solid #ddd',
							gap: '8px',
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
