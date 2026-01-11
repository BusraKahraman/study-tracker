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
	if (!entries.length) {
		return { current: 0, longest: 0 };
	}

	const dates = entries
		.map(([date]) => new Date(date))
		.map((d) => {
			d.setHours(0, 0, 0, 0);
			return d;
		})
		.sort((a, b) => a - b);

	let longest = 1;
	let temp = 1;

	for (let i = 1; i < dates.length; i++) {
		const diff = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);

		if (diff === 1) {
			temp++;
			longest = Math.max(longest, temp);
		} else {
			temp = 1;
		}
	}

	let current = 0;
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	for (let i = dates.length - 1; i >= 0; i--) {
		const diff = (today - dates[i]) / (1000 * 60 * 60 * 24);

		if (diff === current) {
			current++;
		} else {
			break;
		}
	}

	return { current, longest };
}
