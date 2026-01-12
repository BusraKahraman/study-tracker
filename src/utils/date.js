export function getTodayKey() {
	return new Date().toISOString().slice(0, 10);
}

export function isToday(dateStr) {
	return dateStr === getTodayKey();
}

export function isThisWeek(dateStr) {
	const date = new Date(dateStr);
	const now = new Date();

	const startOfWeek = new Date(now);
	startOfWeek.setDate(now.getDate() - now.getDay());
	startOfWeek.setHours(0, 0, 0, 0);

	return date >= startOfWeek;
}

export function isThisMonth(dateStr) {
	const date = new Date(dateStr);
	const now = new Date();

	return (
		date.getMonth() === now.getMonth() &&
		date.getFullYear() === now.getFullYear()
	);
}

export function isThisYear(dateStr) {
	const date = new Date(dateStr);
	const now = new Date();

	return date.getFullYear() === now.getFullYear();
}

export function sortDatesDesc(entries) {
	return [...entries].sort((a, b) => new Date(b[0]) - new Date(a[0]));
}

export function sortDatesAsc(entries = []) {
	if (!Array.isArray(entries)) return [];
	return [...entries].sort((a, b) => new Date(a[0]) - new Date(b[0]));
}

export function getStreakInfo(entries) {
	if (!Array.isArray(entries) || entries.length === 0) {
		return { current: 0, longest: 0 };
	}

	// keep only days with study time
	const days = entries
		.filter(([, seconds]) => typeof seconds === 'number' && seconds > 0)
		.map(([date]) => date)
		.sort(); // YYYY-MM-DD sorts naturally

	if (days.length === 0) {
		return { current: 0, longest: 0 };
	}

	// ----- longest streak -----
	let longest = 1;
	let temp = 1;

	for (let i = 1; i < days.length; i++) {
		const prev = new Date(days[i - 1]);
		const curr = new Date(days[i]);

		const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

		if (diff === 1) {
			temp++;
			longest = Math.max(longest, temp);
		} else {
			temp = 1;
		}
	}

	// ----- current streak -----
	let current = 0;
	let cursor = getTodayKey(); // <-- string, not Date

	const daySet = new Set(days);

	while (daySet.has(cursor)) {
		current++;

		const d = new Date(cursor);
		d.setDate(d.getDate() - 1);
		cursor = d.toISOString().slice(0, 10);
	}

	return { current, longest };
}
