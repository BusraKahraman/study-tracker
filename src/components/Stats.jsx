import React from 'react';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';
import { formatTime } from '../utils/time';
import { isToday, isThisWeek, isThisMonth, isThisYear } from '../utils/date';

export default function Stats({ data }) {
	const [activeTab, setActiveTab] = React.useState('today');

	const entries = Object.entries(data);

	let today = 0;
	let week = 0;
	let month = 0;
	let year = 0;

	entries.forEach(([date, seconds]) => {
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

	const weeklyChartData = entries
		.filter(([date]) => isThisWeek(date))
		.map(([date, seconds]) => ({
			label: date,
			hours: +(seconds / 3600).toFixed(2),
		}));

	const monthlyChartData = entries
		.filter(([date]) => isThisMonth(date))
		.map(([date, seconds]) => ({
			label: date,
			hours: +(seconds / 3600).toFixed(2),
		}));

	const yearlyChartData = Array.from({ length: 12 }, (_, month) => {
		const total = entries.reduce((sum, [date, seconds]) => {
			const d = new Date(date);
			return isThisYear(date) && d.getMonth() === month ? sum + seconds : sum;
		}, 0);

		return {
			label: new Date(0, month).toLocaleString('en', { month: 'short' }),
			hours: +(total / 3600).toFixed(2),
		};
	});

	let chartData = [];

	if (activeTab === 'week') chartData = weeklyChartData;
	if (activeTab === 'month') chartData = monthlyChartData;
	if (activeTab === 'year') chartData = yearlyChartData;

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
			{activeTab !== 'today' && chartData.length > 0 && (
				<div style={{ width: '100%', height: 250, marginTop: '20px' }}>
					<ResponsiveContainer>
						<LineChart data={chartData}>
							<XAxis dataKey='label' />
							<YAxis />
							<Tooltip />
							<Line type='monotone' dataKey='hours' />
						</LineChart>
					</ResponsiveContainer>
				</div>
			)}
		</div>
	);
}
