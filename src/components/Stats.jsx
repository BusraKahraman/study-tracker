import React, { useMemo, useState } from 'react';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';
import { formatTime, formatTooltipTime, formatDateLabel } from '../utils/time';
import {
	isToday,
	isThisWeek,
	isThisMonth,
	isThisYear,
	sortDatesAsc,
} from '../utils/date';
import Heatmap from './Heatmap';

export default function Stats({ data, sessions }) {
	const [activeTab, setActiveTab] = useState('today');

	const entries = useMemo(() => {
		return sortDatesAsc(
			Object.entries(data).map(([date, daySessions]) => [
				date,
				Object.values(daySessions).reduce((a, b) => a + b, 0),
			])
		);
	}, [data]);

	const values = useMemo(() => {
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

		return { today, week, month, year };
	}, [entries]);

	const weeklyChartData = useMemo(() => {
		return entries
			.filter(([date]) => isThisWeek(date))
			.map(([date, seconds]) => ({
				label: formatDateLabel(date),
				hours: +(seconds / 3600).toFixed(2),
			}));
	}, [entries]);

	const monthlyChartData = useMemo(() => {
		return entries
			.filter(([date]) => isThisMonth(date))
			.map(([date, seconds]) => ({
				label: formatDateLabel(date),
				hours: +(seconds / 3600).toFixed(2),
			}));
	}, [entries]);

	const yearlyChartData = useMemo(() => {
		return Array.from({ length: 12 }, (_, month) => {
			const total = entries.reduce((sum, [date, seconds]) => {
				const d = new Date(date);
				return isThisYear(date) && d.getMonth() === month ? sum + seconds : sum;
			}, 0);

			return {
				label: new Date(0, month).toLocaleString('en', {
					month: 'short',
				}),
				hours: +(total / 3600).toFixed(2),
			};
		});
	}, [entries]);

	let chartData = [];
	if (activeTab === 'week') chartData = weeklyChartData;
	if (activeTab === 'month') chartData = monthlyChartData;
	if (activeTab === 'year') chartData = yearlyChartData;

	const datePredicates = {
		today: isToday,
		week: isThisWeek,
		month: isThisMonth,
		year: isThisYear,
	};

	const sessionTotals = useMemo(() => {
		const totals = {};
		const isInRange = datePredicates[activeTab];

		for (const [date, daySessions] of Object.entries(data)) {
			if (!isInRange(date)) continue;

			for (const [session, seconds] of Object.entries(daySessions)) {
				totals[session] = (totals[session] || 0) + seconds;
			}
		}

		return totals;
	}, [data, activeTab]);

	return (
		<div style={{ maxWidth: '900px', margin: '0 auto' }}>
			{/* Tabs */}
			<div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
				<button onClick={() => setActiveTab('today')}>Today</button>
				<button onClick={() => setActiveTab('week')}>Week</button>
				<button onClick={() => setActiveTab('month')}>Month</button>
				<button onClick={() => setActiveTab('year')}>Year</button>
			</div>

			{/* Total for active range */}
			<p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
				{formatTime(values[activeTab])}
			</p>

			{/* Chart */}
			{activeTab !== 'today' && chartData.length > 0 && (
				<div style={{ width: '100%', height: 250, marginTop: '20px' }}>
					<ResponsiveContainer width='100%' height={250}>
						<LineChart data={chartData}>
							<XAxis
								dataKey='label'
								interval={0}
								angle={-45}
								textAnchor='end'
								height={60}
							/>
							<YAxis domain={[0, 'auto']} tickFormatter={(v) => `${v}h`} />
							<Tooltip
								formatter={(v) => formatTooltipTime(v)}
								labelFormatter={(l) => `Date: ${l}`}
							/>
							<Line type='linear' dataKey='hours' dot={{ r: 3 }} />
						</LineChart>
					</ResponsiveContainer>
				</div>
			)}

			{/* Session breakdown */}
			<div style={{ marginTop: '32px' }}>
				<h3>By Session ({activeTab})</h3>

				{sessions
					.slice()
					.sort((a, b) => (sessionTotals[b] || 0) - (sessionTotals[a] || 0))
					.map((session) => {
						const totalSeconds = sessionTotals[session] || 0;
						if (totalSeconds === 0) return null;

						return (
							<div
								key={session}
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									padding: '6px 0',
									borderBottom: '1px solid #eee',
								}}
							>
								<span>{session}</span>
								<strong>{formatTime(totalSeconds)}</strong>
							</div>
						);
					})}
			</div>

			<Heatmap data={data} />
		</div>
	);
}
