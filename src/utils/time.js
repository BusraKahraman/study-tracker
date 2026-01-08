export function formatTime(seconds) {
	const hrs = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;
	const pad = (n) => String(n).padStart(2, '0');

	return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}

export function timeToSeconds(value) {
	const [h, m, s] = value.split(':').map(Number);
	return h * 3600 + m * 60 + s;
}

export function isValidTime(value) {
	return /^(\d+):([0-5]\d):([0-5]\d)$/.test(value);
}
