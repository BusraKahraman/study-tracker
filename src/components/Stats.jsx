import { formatTime } from '../utils/formatTime';
import { isToday, isThisWeek, isThisMonth, isThisYear } from '../utils/date';

export default function Stats({ data }) {
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

	return (
		<div>
			<h2>Stats</h2>
			<p>Today: {formatTime(today)}</p>
			<p>This Week: {formatTime(week)}</p>
			<p>This Month: {formatTime(month)}</p>
			<p>This Year: {formatTime(year)}</p>
		</div>
	);
}
