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
