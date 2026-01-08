import React from 'react';
import { formatTime } from '../utils/formatTime';
import { isToday, isThisWeek, isThisMonth, isThisYear } from '../utils/date';

export default function Stats({ data }) {
	const [activeTab, setActiveTab] = React.useState('today');

	let today = 0;
	let week = 0;
	let month = 0;
	let year = 0;

	Object.entries(data).forEach(([date, seconds]) => {
		if (isToday(date)) today += seconds;
		if (isThisWeek(date)) week += seconds;
		if (isThisMonth(date)) month += seconds;
		if (isThisYear(date)) year += seconds;
	});

	const values = {
		today,
		week,
		month,
		year,
	};

	return (
		<div>
			<h2>Stats</h2>
			{/* Tabs */}
			<div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
				<button onClick={() => setActiveTab('today')}>Today</button>
				<button onClick={() => setActiveTab('week')}>Week</button>
				<button onClick={() => setActiveTab('month')}>Month</button>
				<button onClick={() => setActiveTab('year')}>Year</button>
			</div>
			{/* Active tab value */}
			<p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
				{formatTime(values[activeTab])}
			</p>
		</div>
	);
}
