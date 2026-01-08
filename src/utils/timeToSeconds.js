export function timeToSeconds(value) {
	const [h, m, s] = value.split(':').map(Number);
	return h * 3600 + m * 60 + s;
}
